import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

# 1. Dataset Latih (Simulasi Dataset Gizi Nasional)
# Semakin banyak data di sini, AI akan semakin pintar mengenali komposisi
data = [
    ["Beras putih, Ayam, Tempe, Sayur Bayam", 650, 28, 18],
    ["Nasi, Daging Sapi, Wortel, Telur", 580, 32, 22],
    ["Roti gandum, Telur rebus, Susu, Pisang", 450, 20, 12],
    ["Oatmeal, Susu, Kacang almond, Madu", 400, 15, 10],
    ["Ikan kembung, Nasi merah, Kangkung, Tahu", 520, 25, 15],
    ["Ayam bakar, Sambal, Lalapan, Nasi kuning", 680, 30, 20],
    ["Bubur beras, Daging ayam cincang, Kuah kuning", 350, 18, 8],
    ["Pasta gandum, Saus tomat, Daging giling", 550, 22, 14],
    ["Ubi rebus, Kacang hijau, Gula aren, Santan", 480, 10, 15],
    ["Nasi uduk, Telur dadar, Bihun, Sambal goreng", 700, 18, 25],
    ["Sop buntut, Nasi, Emping, Jeruk nipis", 750, 35, 30],
    ["Salad buah, Yogurt, Keju, Granola", 320, 8, 10]
]

# Tambahkan lebih banyak data dummy agar model lebih stabil
data = data * 20 # Duplikasi data untuk simulasi training yang lebih banyak

df = pd.DataFrame(data, columns=['komposisi', 'calories', 'protein', 'fat'])

# 2. Vektorisasi Teks (Mengubah Kata menjadi Nilai Numerik)
# Menggunakan TF-IDF untuk memahami bobot kata kunci bahan makanan
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df['komposisi'])

# 3. Training Forest (Target: Calories, Protein, Fat)
y = df[['calories', 'protein', 'fat']]

# Menggunakan Random Forest Regressor (Kumpulan Decision Trees)
# n_estimators=100 berarti kita menggunakan 100 pohon keputusan yang bekerja bersama-sama
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# 4. Simpan Model agar bisa digunakan oleh API
if not os.path.exists('model_assets'):
    os.makedirs('model_assets')

joblib.dump(model, 'model_assets/nutrition_rf_model.pkl')
joblib.dump(vectorizer, 'model_assets/vectorizer.pkl')

print("✅ Model AI (Random Forest) Berhasil Dilatih & Disimpan!")
print("--- Metrics ---")
print(f"Jumlah Pohon (Trees): {len(model.estimators_)}")
print(f"Fitur Teks Terdeteksi: {len(vectorizer.get_feature_names_out())}")
