import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const AddDapurForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    lokasi: '',
    kapasitas: '',
    alamat: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.lokasi || !formData.kapasitas) {
      alert('Mohon isi nama lokasi dan kapasitas!');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        id: Date.now(),
        lokasi: formData.lokasi,
        kapasitas_produksi: parseInt(formData.kapasitas, 10),
        alamat: formData.alamat
      });
      alert('Pengajuan dapur berhasil dikirim ke Pemerintah dan menunggu verifikasi.');
      onClose();
    } catch (err) {
      alert(err.message || 'Gagal mengirim pengajuan dapur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrasi Dapur"
      subtitle="Daftarkan unit dapur produksi baru untuk diverifikasi Pemerintah sebelum operasional."
      type="slide"
      width="448px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '8px' }}>
        <Input
          label="NAMA LOKASI DAPUR"
          placeholder="Contoh: Dapur Mandonga Kendari"
          value={formData.lokasi}
          onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
        />

        <Input
          label="KAPASITAS PRODUKSI (PORSI/HARI)"
          type="number"
          placeholder="Contoh: 5000"
          value={formData.kapasitas}
          onChange={(e) => setFormData({ ...formData, kapasitas: e.target.value })}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{
            fontSize: '0.8rem',
            fontWeight: '800',
            color: 'var(--text-muted, #64748b)',
            letterSpacing: '0.5px',
          }}>ALAMAT LENGKAP UNIT</label>
          <textarea
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '2px solid var(--border, #e2e8f0)',
              background: 'var(--bg, #f8fafc)',
              color: 'var(--text-main, #0f172a)',
              fontWeight: '600',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s',
              minHeight: '120px',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
            placeholder="Masukkan alamat lengkap operasional dapur..."
            value={formData.alamat}
            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
            onFocus={(e) => { e.target.style.borderColor = 'var(--primary, #10b981)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border, #e2e8f0)'; }}
          />
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <Button
          variant="primary"
          size="lg"
          style={{ width: '100%', opacity: isSubmitting ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Mengirim...' : 'Daftarkan Dapur Sekarang'}
        </Button>
      </div>
    </Modal>
  );
};
