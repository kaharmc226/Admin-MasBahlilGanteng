import React, { useState } from 'react';
import { AlertCircle, Image, Plus, Trash2, Upload, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import api from '../../api';

const parseTakaran = (t) => {
  if (!t) return { berat: '', satuan: 'gram' };
  const str = t.replace('~', '').trim();
  const num = parseFloat(str);
  const letters = str.replace(/[0-9.]/g, '').trim().toLowerCase();
  
  let satuan = 'gram';
  if (['kg', 'kilogram'].includes(letters)) satuan = 'kilogram';
  else if (['l', 'liter'].includes(letters)) satuan = 'liter';
  else if (['ml', 'mililiter'].includes(letters)) satuan = 'ml';
  else if (['pcs', 'buah'].includes(letters)) satuan = 'pcs';
  
  return { berat: isNaN(num) ? '' : num, satuan };
};

const nutrientLabels = {
  energi: 'Energi',
  protein: 'Protein',
  lemak: 'Lemak',
  karbohidrat: 'Karbo',
  serat: 'Serat',
  natrium: 'Natrium'
};

const parseNutrient = (value) => {
  const parsed = parseFloat(String(value ?? '').replace(',', '.').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const buildInitialBahan = (editData, nutritionItems) => {
  if (!editData?.bahan?.length) return [{ id_nutrition: '', jumlah: '' }];
  return editData.bahan.map((b) => {
    const parsed = parseTakaran(b.takaran);
    const matched = nutritionItems.find(item => item.id === b.id_nutrition || item.nama?.toLowerCase() === b.nama?.toLowerCase());
    return {
      id_nutrition: b.id_nutrition || matched?.id || '',
      jumlah: b.jumlah || parsed.berat || ''
    };
  });
};

export const AddMenuForm = ({ isOpen, onClose, onSave, editData, nutritionItems = [], onRequestIngredient }) => {
  const [formData, setFormData] = useState({
    nama: editData?.nama_menu || '',
    tanggal: editData?.date || new Date().toISOString().split('T')[0],
    foto_url: editData?.foto_url || '',
    foto_data_url: '',
    foto_file_name: '',
    bahan: buildInitialBahan(editData, nutritionItems)
  });
  const [requestForm, setRequestForm] = useState({ nama: '', kategori: 'lauk_sayur', catatan: '' });

  const photoPreview = formData.foto_data_url || api.assetUrl(formData.foto_url);
  const activeIngredients = nutritionItems.filter(item => item.status !== 'retired');
  const selectedIds = new Set(formData.bahan.map(b => String(b.id_nutrition)).filter(Boolean));
  const nutritionTotals = formData.bahan.reduce((totals, b) => {
    const item = activeIngredients.find(ingredient => String(ingredient.id) === String(b.id_nutrition));
    const jumlah = parseNutrient(b.jumlah);
    if (!item || !jumlah) return totals;
    const factor = jumlah / 100;
    return {
      energi: totals.energi + parseNutrient(item.energi) * factor,
      protein: totals.protein + parseNutrient(item.protein) * factor,
      lemak: totals.lemak + parseNutrient(item.lemak) * factor,
      karbohidrat: totals.karbohidrat + parseNutrient(item.karbohidrat) * factor,
      serat: totals.serat + parseNutrient(item.serat) * factor,
      natrium: totals.natrium + parseNutrient(item.natrium) * factor
    };
  }, { energi: 0, protein: 0, lemak: 0, karbohidrat: 0, serat: 0, natrium: 0 });

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto maksimal 5MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        foto_data_url: reader.result,
        foto_file_name: file.name
      }));
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setFormData(prev => ({
      ...prev,
      foto_url: '',
      foto_data_url: '',
      foto_file_name: ''
    }));
  };

  const addBahan = () => {
    setFormData({ ...formData, bahan: [...formData.bahan, { id_nutrition: '', jumlah: '' }] });
  };

  const updateBahan = (index, field, value) => {
    const newBahan = [...formData.bahan];
    newBahan[index][field] = value;
    setFormData({ ...formData, bahan: newBahan });
  };

  const removeBahan = (index) => {
    const newBahan = formData.bahan.filter((_, i) => i !== index);
    setFormData({ ...formData, bahan: newBahan });
  };

  const handleSubmit = () => {
    if (!formData.nama || formData.bahan.some(b => !b.id_nutrition || !b.jumlah)) {
      alert("Mohon lengkapi nama menu dan pilih semua bahan dari database nutrisi!");
      return;
    }

    const newEntry = {
      id: editData?.id || Date.now(),
      nama_menu: formData.nama,
      date: formData.tanggal,
      foto_url: formData.foto_url,
      foto_data_url: formData.foto_data_url,
      foto_file_name: formData.foto_file_name,
      bahan: formData.bahan.map(b => {
        const item = activeIngredients.find(ingredient => String(ingredient.id) === String(b.id_nutrition));
        return {
          id_nutrition: item.id,
          nama: item.nama,
          jumlah: parseFloat(b.jumlah),
          satuan: 'gram',
          takaran: `~${b.jumlah} g`
        };
      }),
      status_validasi: editData?.status_validasi || 'pending'
    };

    onSave(newEntry);
    alert(editData ? "✅ Perubahan Menu Berhasil Disimpan!" : "✅ Menu Berhasil Diajukan ke Ahli Gizi untuk Verifikasi!");
    onClose();
  };

  const handleRequestIngredient = async () => {
    if (!requestForm.nama.trim()) {
      alert('Nama bahan yang diminta wajib diisi.');
      return;
    }
    await onRequestIngredient?.(requestForm);
    setRequestForm({ nama: '', kategori: 'lauk_sayur', catatan: '' });
    alert('Permintaan bahan dikirim ke Ahli Gizi.');
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={editData ? 'Edit Resep Menu' : 'Input Menu Baru'}
      subtitle="Silakan masukkan rincian komposisi menu gizi secara mendetail."
      type="slide"
      width="576px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '8px' }}>
        {/* Menu Name & Date Section */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          padding: '20px', 
          background: '#f8fafc', 
          borderRadius: '16px', 
          border: '1px solid var(--border, #e2e8f0)' 
        }}>
          <Input 
            label="NAMA MENU UTAMA"
            placeholder="Misal: Nasi Ayam Madu Sehat"
            value={formData.nama}
            onChange={(e) => setFormData({...formData, nama: e.target.value})}
          />
          <Input 
            label="TANGGAL PENYAJIAN TARGET"
            type="date"
            value={formData.tanggal}
            onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
          />
        </div>

        {/* Photo Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '160px 1fr',
          gap: '16px',
          alignItems: 'stretch',
          padding: '20px',
          background: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid var(--border, #e2e8f0)'
        }}>
          <div style={{
            minHeight: '120px',
            borderRadius: '14px',
            border: '1.5px dashed #cbd5e1',
            background: 'white',
            overflow: 'hidden',
            display: 'grid',
            placeItems: 'center'
          }}>
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview menu"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Image size={34} color="#94a3b8" />
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: '900', color: '#64748b', letterSpacing: '0.08em' }}>
                FOTO MENU
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', fontWeight: '650', color: '#475569', lineHeight: '1.45' }}>
                Opsional. Foto ini akan terlihat oleh Ahli Gizi saat validasi.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <label style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'var(--primary, #10b981)',
                color: 'white',
                fontSize: '0.82rem',
                fontWeight: '850',
                cursor: 'pointer'
              }}>
                <Upload size={16} />
                Pilih Foto
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </label>
              {photoPreview && (
                <button
                  type="button"
                  onClick={clearPhoto}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: '850',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                  Hapus
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bahan Section */}
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px' 
          }}>
            <h3 style={{ fontWeight: '950', fontSize: '1.1rem', color: 'var(--text-main, #0f172a)', margin: 0 }}>
              Komposisi Bahan per Porsi
            </h3>
            <Button variant="secondary" size="sm" icon={Plus} onClick={addBahan}>
              Tambah Bahan
            </Button>
          </div>
          <p style={{ margin: '-8px 0 14px', color: '#64748b', fontSize: '0.85rem', fontWeight: '650', lineHeight: '1.45' }}>
            Pilih bahan yang sudah disetujui Ahli Gizi. Jumlah selalu dihitung dalam gram untuk satu porsi siswa.
          </p>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            maxHeight: '400px', 
            overflowY: 'auto', 
            paddingRight: '8px' 
          }}>
            {formData.bahan.map((b, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                gap: '12px', 
                alignItems: 'flex-start', 
                background: 'white', 
                padding: '16px', 
                borderRadius: '16px', 
                border: '1px solid var(--border, #e2e8f0)', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)' 
              }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 120px', 
                  gap: '12px', 
                  flex: 1 
                }}>
                  <Select
                    label="BAHAN TERVERIFIKASI"
                    options={[
                      { value: '', label: 'Pilih bahan...' },
                      ...activeIngredients.map(item => ({
                        value: item.id,
                        label: `${item.nama} (${item.kategori})`,
                        disabled: selectedIds.has(String(item.id)) && String(item.id) !== String(b.id_nutrition)
                      }))
                    ]}
                    value={b.id_nutrition}
                    onChange={(e) => updateBahan(i, 'id_nutrition', e.target.value)}
                  />
                  <Input 
                    label="GRAM/PORSI"
                    type="number"
                    step="any"
                    placeholder="100"
                    value={b.jumlah}
                    onChange={(e) => updateBahan(i, 'jumlah', e.target.value)}
                  />
                </div>
                {formData.bahan.length > 1 && (
                  <button 
                    onClick={() => removeBahan(i)}
                    style={{
                      marginTop: '28px',
                      padding: '10px',
                      borderRadius: '12px',
                      background: '#fef2f2',
                      color: '#ef4444',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      transition: 'background 0.2s',
                    }}
                    title="Hapus Bahan"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '18px', padding: '16px', borderRadius: '16px', border: '1px solid #dbeafe', background: '#eff6ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#1d4ed8', fontWeight: '900' }}>
              <AlertCircle size={18} />
              Bahan belum ada?
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '10px', marginBottom: '10px' }}>
              <Input
                placeholder="Contoh: Daun kelor"
                value={requestForm.nama}
                onChange={(e) => setRequestForm({ ...requestForm, nama: e.target.value })}
              />
              <Select
                options={[
                  { value: 'makanan_pokok', label: 'Pokok' },
                  { value: 'lauk_sayur', label: 'Lauk/Sayur' },
                  { value: 'buah', label: 'Buah' },
                  { value: 'lainnya', label: 'Lainnya' }
                ]}
                value={requestForm.kategori}
                onChange={(e) => setRequestForm({ ...requestForm, kategori: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Catatan opsional untuk Ahli Gizi..."
              value={requestForm.catatan}
              onChange={(e) => setRequestForm({ ...requestForm, catatan: e.target.value })}
              style={{ width: '100%', minHeight: '70px', padding: '12px', borderRadius: '12px', border: '1.5px solid #bfdbfe', resize: 'vertical', fontFamily: 'inherit', fontWeight: '650', boxSizing: 'border-box' }}
            />
            <button
              type="button"
              onClick={handleRequestIngredient}
              style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '10px', border: 'none', background: '#2563eb', color: 'white', fontWeight: '850', cursor: 'pointer' }}
            >
              Kirim Permintaan Bahan
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px', padding: '18px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 12px', fontWeight: '950', color: '#0f172a' }}>Estimasi Gizi per Porsi</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {Object.entries(nutritionTotals).map(([key, value]) => (
            <div key={key} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.72rem', fontWeight: '900', textTransform: 'uppercase' }}>{nutrientLabels[key]}</p>
              <p style={{ margin: '4px 0 0', color: '#0f172a', fontWeight: '950', fontSize: '1rem' }}>
                {key === 'energi' || key === 'natrium' ? Math.round(value) : value.toFixed(1)}
                <span style={{ marginLeft: '4px', color: '#94a3b8', fontSize: '0.72rem' }}>{key === 'energi' ? 'kkal' : key === 'natrium' ? 'mg' : 'g'}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <Button 
          variant="primary" 
          size="lg" 
          style={{ width: '100%', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)' }}
          onClick={handleSubmit}
        >
          {editData ? 'Simpan Perubahan Resep' : 'Selesaikan & Ajukan ke Ahli Gizi'}
        </Button>
      </div>
    </Modal>
  );
};
