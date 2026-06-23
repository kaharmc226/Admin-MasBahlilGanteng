import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import api from '../../api'

export const VisualAuditModal = ({ menu, onClose, onRevise, onEditRecipe }) => {
  if (!menu) return null;

  const bahan = Array.isArray(menu.bahan) ? menu.bahan : []
  const photoUrl = api.assetUrl(menu.foto_url)
  const vendorNotes = Array.isArray(menu.notes) ? menu.notes : []
  const latestRejectedLog = menu.latestRejectedLog
  const latestValidationLog = menu.latestValidationLog
  const latestApprovedLog = menu.latestApprovedLog
  const isApproved = menu.status_validasi === 'approved'
  const isRejected = menu.status_validasi === 'rejected'
  const statusMeta = isApproved
    ? { label: 'Menu Disahkan', background: 'var(--primary-light)', color: 'var(--primary)', border: '1.5px solid var(--primary)' }
    : isRejected
      ? { label: 'Butuh Revisi', background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fca5a5' }
      : { label: 'Menunggu Validasi', background: 'var(--banana-light)', color: 'var(--banana)', border: '1.5px solid var(--banana)' }
  const validationTimeLabel = latestRejectedLog?.created_at
    ? new Date(latestRejectedLog.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null
  const approvalTimeLabel = latestApprovedLog?.created_at
    ? new Date(latestApprovedLog.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null
  const latestReviewTimeLabel = latestValidationLog?.created_at
    ? new Date(latestValidationLog.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null
  const nutritionRows = [
    { label: 'Energi', value: menu.nilai_gizi?.energi || '-' },
    { label: 'Protein', value: menu.nilai_gizi?.protein || '-' },
    { label: 'Lemak', value: menu.nilai_gizi?.lemak || '-' },
    { label: 'Karbohidrat', value: menu.nilai_gizi?.karbohidrat || '-' },
    { label: 'Serat', value: menu.nilai_gizi?.serat || '-' },
    { label: 'Natrium', value: menu.nilai_gizi?.natrium || '-' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.95)',
        zIndex: 10000,
        display: 'grid',
        placeItems: 'center',
        backdropFilter: 'blur(15px)',
        padding: '1rem',
        overflowY: 'auto'
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          background: 'white',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '1120px',
          padding: '2rem',
          position: 'relative',
          boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '24px', right: '24px', background: '#f1f5f9', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
        >
          <X size={24} color="#64748b" />
        </button>

        <div style={{ marginBottom: '1.4rem', paddingRight: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {isApproved ? 'Detail Menu Disetujui' : isRejected ? 'Laporan Revisi Vendor' : 'Detail Audit Menu'}
              </p>
              <h2 style={{ fontSize: '2.1rem', fontWeight: '950', color: '#0f172a', margin: '0.35rem 0 0', letterSpacing: '-0.04em' }}>{menu.nama_menu}</h2>
              <p style={{ margin: '0.45rem 0 0', color: '#64748b', fontWeight: '700', fontSize: '0.92rem' }}>
                {menu.nama_vendor || 'Vendor terdaftar'} - {menu.tanggal || menu.date || '-'}
              </p>
            </div>
            <div style={{ padding: '0.7rem 1rem', borderRadius: '999px', background: statusMeta.background, color: statusMeta.color, border: statusMeta.border, fontWeight: '900', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              {statusMeta.label}
            </div>
          </div>
        </div>

        <div className="vendor-audit-modal-layout">
          <div className="vendor-audit-media-column">
            <div style={{ minHeight: '430px', height: '100%', borderRadius: '24px', border: '1.5px solid #dbe5f0', background: '#f8fafc', overflow: 'hidden', boxShadow: '0 24px 50px -24px rgba(15, 23, 42, 0.45)' }}>
              {photoUrl ? (
                <img src={photoUrl} alt={`Foto ${menu.nama_menu}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', minHeight: '430px', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '2rem', color: '#64748b', fontWeight: '850', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                  Vendor belum mengunggah foto menu.
                </div>
              )}
            </div>
            <div style={{ padding: '1.1rem', borderRadius: '18px', border: '1.5px solid #e2e8f0', background: 'white' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Catatan Vendor</p>
              {vendorNotes.length > 0 ? (
                <ul style={{ margin: '0.65rem 0 0', paddingLeft: '1.15rem', color: '#334155', fontWeight: '750', fontSize: '0.9rem', lineHeight: '1.7' }}>
                  {vendorNotes.map((note, index) => <li key={index}>{note}</li>)}
                </ul>
              ) : (
                <p style={{ margin: '0.6rem 0 0', color: '#64748b', fontWeight: '700', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Belum ada catatan dari vendor.
                </p>
              )}
            </div>
            <div style={{ padding: '0.95rem 1rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <p style={{ margin: 0, color: '#64748b', fontWeight: '800', fontSize: '0.82rem', lineHeight: '1.5' }}>
                Sumber laporan: unggahan vendor TRAKSI dan hasil validasi Ahli Gizi terbaru.
              </p>
            </div>
          </div>

          <div className="vendor-audit-sidebar">
            <div style={{ padding: '1rem 1.1rem', borderRadius: '18px', border: '1.5px solid #e2e8f0', background: 'white' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status Review</p>
              <p style={{ margin: '0.35rem 0 0', fontSize: '1.05rem', fontWeight: '900', color: '#0f172a' }}>
                {latestReviewTimeLabel ? `Review terakhir ${latestReviewTimeLabel}` : 'Belum ada histori review'}
              </p>
            </div>

            <div style={{
              padding: '1.1rem',
              borderRadius: '18px',
              border: isApproved ? '1.5px solid #bbf7d0' : '1.5px solid #fecaca',
              background: isApproved ? '#f0fdf4' : '#fff7f7'
            }}>
              <p style={{
                margin: 0,
                fontSize: '0.75rem',
                fontWeight: '900',
                color: isApproved ? '#15803d' : '#b91c1c',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {isApproved ? 'Status Persetujuan Ahli Gizi' : 'Revisi Terakhir Ahli Gizi'}
              </p>
              <p style={{
                margin: '0.55rem 0 0',
                fontSize: '0.95rem',
                fontWeight: '800',
                color: isApproved ? '#166534' : '#7f1d1d',
                lineHeight: '1.7'
              }}>
                {isApproved
                  ? latestApprovedLog?.catatan || 'Menu ini sudah lolos validasi dan siap digunakan untuk operasional produksi.'
                  : latestRejectedLog?.catatan || 'Belum ada pesan revisi dari Ahli Gizi untuk menu ini.'}
              </p>
              {isApproved && approvalTimeLabel && (
                <p style={{ margin: '0.7rem 0 0', fontSize: '0.76rem', color: '#15803d', fontWeight: '700' }}>
                  Disahkan: {approvalTimeLabel}
                </p>
              )}
              {!isApproved && validationTimeLabel && (
                <p style={{ margin: '0.7rem 0 0', fontSize: '0.76rem', color: '#b91c1c', fontWeight: '700' }}>
                  Dikirim: {validationTimeLabel}
                </p>
              )}
            </div>

            <div style={{ padding: '1.1rem', borderRadius: '18px', border: '1.5px solid #dbe5f0', background: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ringkasan Nilai Gizi</p>
              <div className="vendor-audit-nutrition-grid" style={{ marginTop: '0.2rem' }}>
                {nutritionRows.map((row) => (
                  <div key={row.label} style={{ padding: '0.85rem 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <span style={{ color: '#64748b', fontWeight: '800', fontSize: '0.88rem' }}>{row.label}</span>
                    <span style={{ color: '#0f172a', fontWeight: '900', fontSize: '0.92rem', textAlign: 'right' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '1.1rem', borderRadius: '18px', border: '1.5px solid #dbe5f0', background: 'white', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bahan Menu</p>
              <div style={{ display: 'grid', gap: '0.7rem', marginTop: '0.75rem', overflowY: 'auto', paddingRight: '0.25rem' }}>
                {bahan.length > 0 ? bahan.map((item, index) => (
                  <div key={`${item.nama}-${index}`} style={{ padding: '0.8rem 0.9rem', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', gap: '0.8rem', alignItems: 'center' }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: '900', color: '#0f172a', fontSize: '0.9rem', lineHeight: '1.35' }}>{item.nama}</p>
                      <p style={{ margin: '0.2rem 0 0', fontWeight: '700', color: '#64748b', fontSize: '0.8rem' }}>{item.takaran || '-'}</p>
                    </div>
                    <span style={{ flexShrink: 0, padding: '4px 8px', borderRadius: '999px', background: item.id_nutrition ? '#dcfce7' : '#ffedd5', color: item.id_nutrition ? '#15803d' : '#c2410c', fontWeight: '900', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                      {item.id_nutrition ? 'DB Match' : 'Cek DB'}
                    </span>
                  </div>
                )) : (
                  <p style={{ margin: 0, color: '#64748b', fontWeight: '700', fontSize: '0.9rem' }}>Belum ada daftar bahan.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={onClose}
            style={{ flex: '1 1 220px', padding: '1rem 1.2rem', borderRadius: '18px', border: '2px solid #e2e8f0', background: 'white', fontWeight: '900', color: '#64748b', cursor: 'pointer' }}
          >
            Tutup Laporan
          </button>
          {isRejected ? (
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); setTimeout(() => onRevise(menu), 50); }}
              style={{ flex: '1 1 280px', padding: '1rem 1.2rem', borderRadius: '18px', border: 'none', background: '#dc2626', fontWeight: '950', color: 'white', cursor: 'pointer', boxShadow: '0 10px 25px rgba(220, 38, 38, 0.2)' }}
            >
              Revisi Sekarang
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); setTimeout(() => onEditRecipe(menu), 50); }}
              style={{ flex: '1 1 280px', padding: '1rem 1.2rem', borderRadius: '18px', border: 'none', background: isApproved ? '#16a34a' : 'var(--primary)', fontWeight: '950', color: 'white', cursor: 'pointer', boxShadow: isApproved ? '0 10px 25px rgba(22, 163, 74, 0.2)' : '0 10px 25px rgba(14, 165, 233, 0.2)' }}
            >
              {isApproved ? 'Edit Resep Menu' : 'Perbarui Menu'}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default VisualAuditModal
