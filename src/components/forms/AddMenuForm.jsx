import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';

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

export const AddMenuForm = ({ isOpen, onClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    nama: editData?.nama_menu || '',
    tanggal: editData?.date || new Date().toISOString().split('T')[0],
    bahan: editData?.bahan?.map(b => ({ nama: b.nama, ...parseTakaran(b.takaran) })) || [{ nama: '', berat: '', satuan: 'gram' }]
  });

  const addBahan = () => {
    setFormData({ ...formData, bahan: [...formData.bahan, { nama: '', berat: '', satuan: 'gram' }] });
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
    if (!formData.nama || formData.bahan.some(b => !b.nama || !b.berat)) {
      alert("Mohon lengkapi nama menu dan semua rincian bahan!");
      return;
    }

    const newEntry = {
      id: editData?.id || Date.now(),
      nama_menu: formData.nama,
      date: formData.tanggal,
      bahan: formData.bahan.map(b => {
        let displaySatuan = b.satuan;
        if (b.satuan === 'gram') displaySatuan = 'g';
        if (b.satuan === 'kilogram') displaySatuan = 'kg';
        if (b.satuan === 'liter') displaySatuan = 'L';
        return { nama: b.nama, takaran: `~${b.berat} ${displaySatuan}` };
      }),
      nilai_gizi: editData?.nilai_gizi || { energi: '--- kkal', protein: '-- g' },
      status_validasi: editData?.status_validasi || 'pending'
    };

    onSave(newEntry);
    alert(editData ? "✅ Perubahan Menu Berhasil Disimpan!" : "✅ Menu Berhasil Diajukan ke Ahli Gizi untuk Verifikasi!");
    onClose();
  };

  const satuanOptions = [
    { value: 'gram', label: 'Gram (g)' },
    { value: 'kilogram', label: 'Kg' },
    { value: 'ml', label: 'ml' },
    { value: 'liter', label: 'L' },
    { value: 'pcs', label: 'pcs' }
  ];

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

        {/* Bahan Section */}
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px' 
          }}>
            <h3 style={{ fontWeight: '950', fontSize: '1.1rem', color: 'var(--text-main, #0f172a)', margin: 0 }}>
              Komposisi Bahan & Gramasi
            </h3>
            <Button variant="secondary" size="sm" icon={Plus} onClick={addBahan}>
              Tambah Bahan
            </Button>
          </div>
          
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
                  gridTemplateColumns: '1fr 100px 100px', 
                  gap: '12px', 
                  flex: 1 
                }}>
                  <Input 
                    label="NAMA BAHAN"
                    placeholder="Cth: Daging Ayam"
                    value={b.nama}
                    onChange={(e) => updateBahan(i, 'nama', e.target.value)}
                  />
                  <Input 
                    label="JUMLAH"
                    type="number"
                    step="any"
                    placeholder="100"
                    value={b.berat}
                    onChange={(e) => updateBahan(i, 'berat', e.target.value)}
                  />
                  <Select 
                    label="SATUAN"
                    options={satuanOptions}
                    value={b.satuan}
                    onChange={(e) => updateBahan(i, 'satuan', e.target.value)}
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
