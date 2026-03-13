from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os

# Inisialisasi FastAPI
app = FastAPI(title="TRAKSI AI Audit Engine")

# Izinkan Frontend React untuk memanggil API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model AI yang sudah dilatih tadi
try:
    model = joblib.load('model_assets/nutrition_rf_model.pkl')
    vectorizer = joblib.load('model_assets/vectorizer.pkl')
    model_status = "Ready"
except:
    model_status = "Model Not Found - Please run train_model.py first"

class MenuInput(BaseModel):
    komposisi: str

@app.get("/")
def home():
    return {"status": "AI Server Online", "model": model_status}

@app.post("/audit")
def audit_menu(data: MenuInput):
    if model_status != "Ready":
        return {"error": "AI Model belum siap."}
    
    # 1. Ubah teks input menjadi vektor numerik
    input_vector = vectorizer.transform([data.komposisi])
    
    # 2. Lakukan Prediksi dengan Random Forest
    prediction = model.predict(input_vector)[0]
    
    # 3. Kembalikan hasil audit ke Frontend
    return {
        "calories": round(prediction[0], 2),
        "protein": round(prediction[1], 2),
        "fat": round(prediction[2], 2),
        "algorithm": "Random Forest Regressor",
        "scanned_ingredients": data.komposisi
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
