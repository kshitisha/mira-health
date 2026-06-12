from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from database import get_db, init_db
from models import Patient
from schemas import PatientCreate, PatientUpdate, PatientResponse
from ai_service import generate_health_prediction

app = FastAPI(
    title="MIRA — Medical Intelligence Robotic Automation",
    description="Health prediction API powered by AI/ML. Analyses blood test results to generate intelligent health risk assessments.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your Vercel URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


#health Check 

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "service": "MIRA API", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}


#create

@app.post("/patients", response_model=PatientResponse, status_code=status.HTTP_201_CREATED, tags=["Patients"])
def create_patient(payload: PatientCreate, db: Session = Depends(get_db)):
    """Create a new patient record and auto-generate AI health remarks."""

    # Check for duplicate email
    existing = db.query(Patient).filter(Patient.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A patient with email '{payload.email}' already exists.",
        )

    #calculate age from dob
    today = date.today()
    dob = payload.date_of_birth
    age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

    #calling Groq AI for health prediction
    try:
        remarks = generate_health_prediction(
            full_name=payload.full_name,
            age=age,
            glucose=payload.glucose,
            haemoglobin=payload.haemoglobin,
            cholesterol=payload.cholesterol,
        )
    except Exception as e:
        remarks = f"AI analysis unavailable: {str(e)}"

    patient = Patient(
        full_name=payload.full_name,
        date_of_birth=payload.date_of_birth,
        email=payload.email,
        glucose=payload.glucose,
        haemoglobin=payload.haemoglobin,
        cholesterol=payload.cholesterol,
        remarks=remarks,
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


#read all

@app.get("/patients", response_model=List[PatientResponse], tags=["Patients"])
def get_all_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve all patient records."""
    patients = db.query(Patient).offset(skip).limit(limit).all()
    return patients


#read one

@app.get("/patients/{patient_id}", response_model=PatientResponse, tags=["Patients"])
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    """Retrieve a single patient by ID."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient with ID {patient_id} not found.")
    return patient


#update

@app.put("/patients/{patient_id}", response_model=PatientResponse, tags=["Patients"])
def update_patient(patient_id: int, payload: PatientUpdate, db: Session = Depends(get_db)):
    """Update patient details. If blood values change, AI remarks are regenerated."""

    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient with ID {patient_id} not found.")

    #this is for email uniqueness
    if payload.email and payload.email != patient.email:
        conflict = db.query(Patient).filter(Patient.email == payload.email).first()
        if conflict:
            raise HTTPException(status_code=409, detail=f"Email '{payload.email}' is already in use.")

    blood_values_changed = any([
        payload.glucose is not None and payload.glucose != patient.glucose,
        payload.haemoglobin is not None and payload.haemoglobin != patient.haemoglobin,
        payload.cholesterol is not None and payload.cholesterol != patient.cholesterol,
    ])

    #applying updates
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)

    #regenerating AI remarks if blood values changed
    if blood_values_changed:
        today = date.today()
        dob = patient.date_of_birth
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        try:
            patient.remarks = generate_health_prediction(
                full_name=patient.full_name,
                age=age,
                glucose=patient.glucose,
                haemoglobin=patient.haemoglobin,
                cholesterol=patient.cholesterol,
            )
        except Exception as e:
            patient.remarks = f"AI re-analysis unavailable: {str(e)}"

    db.commit()
    db.refresh(patient)
    return patient


#deleting

@app.delete("/patients/{patient_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Patients"])
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    """Permanently delete a patient record."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient with ID {patient_id} not found.")
    db.delete(patient)
    db.commit()
    return None


#regenerating remarks

@app.post("/patients/{patient_id}/regenerate-remarks", response_model=PatientResponse, tags=["AI"])
def regenerate_remarks(patient_id: int, db: Session = Depends(get_db)):
    """Manually trigger AI remark regeneration for a patient."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient with ID {patient_id} not found.")

    today = date.today()
    dob = patient.date_of_birth
    age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

    try:
        patient.remarks = generate_health_prediction(
            full_name=patient.full_name,
            age=age,
            glucose=patient.glucose,
            haemoglobin=patient.haemoglobin,
            cholesterol=patient.cholesterol,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

    db.commit()
    db.refresh(patient)
    return patient
