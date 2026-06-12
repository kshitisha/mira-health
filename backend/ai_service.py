import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_health_prediction(
    full_name: str,
    age: int,
    glucose: float,
    haemoglobin: float,
    cholesterol: float,
) -> str:
    """
    Uses Groq (LLaMA 3) to analyse blood test values and generate a
    clinical health-risk assessment for the Remarks field.
    """

    prompt = f"""You are MIRA, a Medical Intelligence AI assistant trained on clinical guidelines.
Analyse the following patient blood test results and provide a concise, professional health risk assessment.

Patient Information:
- Name: {full_name}
- Age: {age} years
- Glucose: {glucose} mg/dL  (Normal fasting: 70–99 mg/dL)
- Haemoglobin: {haemoglobin} g/dL  (Normal: Men 13.5–17.5, Women 12.0–15.5 g/dL)
- Cholesterol: {cholesterol} mg/dL  (Desirable: <200, Borderline: 200–239, High: ≥240 mg/dL)

Instructions:
1. Identify whether each value is Normal, Borderline, or Abnormal.
2. Flag any possible health conditions or risks (e.g. pre-diabetes, anaemia, hypercholesterolaemia).
3. Give 2–3 specific, actionable lifestyle or medical recommendations.
4. Keep the tone professional, empathetic, and suitable for a clinical summary.
5. Format: 3 short paragraphs — Risk Summary | Key Findings | Recommendations.
6. Do NOT include disclaimers like "consult a doctor" as separate sentences — weave them naturally.
7. Max 120 words total. Be concise and data-driven.

Respond only with the health assessment text, no headers or bullet points."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are MIRA, a clinical AI assistant. Provide accurate, concise health risk assessments based on blood test values. Always be professional and data-driven.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
        max_tokens=250,
    )

    return response.choices[0].message.content.strip()
