from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
from datetime import date, datetime
from typing import Optional


class PatientBase(BaseModel):
    full_name: str
    date_of_birth: date
    email: EmailStr
    glucose: float
    haemoglobin: float
    cholesterol: float

    @field_validator("full_name")
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Full name cannot be empty")
        if len(v) < 2:
            raise ValueError("Full name must be at least 2 characters")
        return v

    @field_validator("date_of_birth")
    @classmethod
    def dob_cannot_be_future(cls, v: date) -> date:
        if v >= date.today():
            raise ValueError("Date of birth cannot be a future date")
        return v

    @field_validator("glucose")
    @classmethod
    def glucose_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Glucose must be a positive number")
        if v > 600:
            raise ValueError("Glucose value seems unrealistic (max 600 mg/dL)")
        return round(v, 2)

    @field_validator("haemoglobin")
    @classmethod
    def haemoglobin_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Haemoglobin must be a positive number")
        if v > 25:
            raise ValueError("Haemoglobin value seems unrealistic (max 25 g/dL)")
        return round(v, 2)

    @field_validator("cholesterol")
    @classmethod
    def cholesterol_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Cholesterol must be a positive number")
        if v > 700:
            raise ValueError("Cholesterol value seems unrealistic (max 700 mg/dL)")
        return round(v, 2)


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: Optional[EmailStr] = None
    glucose: Optional[float] = None
    haemoglobin: Optional[float] = None
    cholesterol: Optional[float] = None

    @field_validator("full_name")
    @classmethod
    def name_must_not_be_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if not v or len(v) < 2:
                raise ValueError("Full name must be at least 2 characters")
        return v

    @field_validator("date_of_birth")
    @classmethod
    def dob_cannot_be_future(cls, v: Optional[date]) -> Optional[date]:
        if v is not None and v >= date.today():
            raise ValueError("Date of birth cannot be a future date")
        return v

    @field_validator("glucose")
    @classmethod
    def glucose_range(cls, v: Optional[float]) -> Optional[float]:
        if v is not None:
            if v <= 0 or v > 600:
                raise ValueError("Glucose must be between 0 and 600 mg/dL")
            return round(v, 2)
        return v

    @field_validator("haemoglobin")
    @classmethod
    def haemoglobin_range(cls, v: Optional[float]) -> Optional[float]:
        if v is not None:
            if v <= 0 or v > 25:
                raise ValueError("Haemoglobin must be between 0 and 25 g/dL")
            return round(v, 2)
        return v

    @field_validator("cholesterol")
    @classmethod
    def cholesterol_range(cls, v: Optional[float]) -> Optional[float]:
        if v is not None:
            if v <= 0 or v > 700:
                raise ValueError("Cholesterol must be between 0 and 700 mg/dL")
            return round(v, 2)
        return v


class PatientResponse(PatientBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    remarks: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class PredictionRequest(BaseModel):
    glucose: float
    haemoglobin: float
    cholesterol: float
    age: int
