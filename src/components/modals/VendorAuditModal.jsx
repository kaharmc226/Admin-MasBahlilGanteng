import React from 'react'
import { motion } from 'framer-motion'
import { 
  Building, 
  ChefHat, 
  FileText, 
  ShieldCheck, 
  MapPin, 
  Download, 
  AlertTriangle, 
  X 
} from 'lucide-react'
import api from '../../api'
import { formatShortDate, getFileLabel } from '../../utils/dashboardHelpers'

const vendorDocumentStatusMeta = {
  valid: { label: 'Valid', background: '#dcfce7', color: '#166534', description: 'Dokumen sudah lolos verifikasi dan bisa dipakai untuk operasional.' },
  pending_review: { label: 'Perlu Review', background: '#fef3c7', color: '#92400e', description: 'Dokumen menunggu peninjauan atau revisi dari reviewer pemerintah.' },
  expired: { label: 'Expired', background: '#fee2e2', color: '#b91c1c', description: 'Masa berlaku dokumen habis atau dokumen tidak lagi bisa digunakan.' },
}

const vendorDocumentTypeLabel = {
  izin_usaha: 'Izin Usaha', 
  sertifikat_halal: 'Sertifikat Halal', 
  sertifikat_laik_hygiene: 'Sertifikat Laik Hygiene',
  npwp: 'NPWP', 
  siup: 'SIUP', 
  lainnya: 'Dokumen Lainnya',
}

const dapurStatusMeta = {
  approved: {
    label: 'APPROVED',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
  },
  pending: {
    label: 'PENDING',
    background: '#fef3c7',
    color: '#d97706',
  },
  rejected: {
    label: 'REJECTED',
    background: '#fee2e2',
    color: '#b91c1c',
  },
}

export const VendorAuditModal = ({ 
  vendor, 
  docs, 
  dapurs, 
  onClose, 
  onReviewDocument, 
  onApproveDapur,
  onRejectDapur,
  onSuspendVendor, 
  onReinstateVendor 
}) => {
  if (!vendor) return null

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'grid', placeItems: 'center', padding: '1rem', overflowY: 'auto' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        style={{ width: '100%', maxWidth: '820px', background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 30px 80px rgba(0,0,0,0.2)', margin: 'auto' }}
        onClick={(e) => e.stopPropagation()}
        className="government-audit-modal"
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--bg)', display: 'grid', placeItems: 'center', border: '1px solid var(--border)' }}>
              <Building size={32} color="var(--primary)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h2 style={{ fontWeight: '950', fontSize: '1.8rem', letterSpacing: '-0.5px' }}>{vendor.nama_vendor}</h2>
                <span className="badge" style={{ 
                  background: vendor.status_verifikasi === 'approved' ? 'var(--primary-light)' : '#fee2e2',
                  color: vendor.status_verifikasi === 'approved' ? 'var(--primary)' : '#b91c1c',
                  fontWeight: '900', fontSize: '0.75rem'
                }}>
                  {vendor.status_verifikasi.toUpperCase()}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} /> {vendor.region} • <FileText size={16} /> Izin: {vendor.izin_usaha}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '12px' }}><ChefHat color="var(--primary)" size={20} /></div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>DAPUR AKTIF</p>
              <h3 style={{ fontWeight: '950', fontSize: '1.5rem', lineHeight: 1 }}>{dapurs.filter((d) => d.status_verifikasi === 'approved').length}</h3>
            </div>
          </div>
          <div style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '12px' }}><FileText color="#d97706" size={20} /></div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>TOTAL DOKUMEN</p>
              <h3 style={{ fontWeight: '950', fontSize: '1.5rem', lineHeight: 1 }}>{docs.length}</h3>
            </div>
          </div>
          <div style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: '12px' }}><ShieldCheck color="#166534" size={20} /></div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>DOKUMEN VALID</p>
              <h3 style={{ fontWeight: '950', fontSize: '1.5rem', lineHeight: 1 }}>{docs.filter(d => d.status === 'valid').length}</h3>
            </div>
          </div>
        </div>

        {/* Content Tabs area */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
          
          {/* Left Col: Dokumen Legalitas */}
          <div>
            <h3 style={{ fontWeight: '900', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--primary)" /> Dokumen Legalitas & Sertifikasi
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {docs.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                  <FileText size={32} color="#cbd5e1" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Belum ada dokumen yang diunggah.</p>
                </div>
              ) : docs.map((doc) => {
                const meta = vendorDocumentStatusMeta[doc.status || 'pending_review'] || vendorDocumentStatusMeta.pending_review
                
                return (
                  <div key={doc.id_dokumen} className="government-doc-card" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg)', display: 'grid', placeItems: 'center', fontWeight: '900', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {getFileLabel(doc.file_path)}
                        </div>
                        <div>
                          <p style={{ fontWeight: '900', fontSize: '1.05rem', marginBottom: '0.2rem' }}>{vendorDocumentTypeLabel[doc.jenis] || doc.jenis}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                            Diunggah {formatShortDate(doc.tanggal_unggah)}
                          </p>
                        </div>
                      </div>
                      <span style={{ 
                        background: meta.background, color: meta.color, 
                        padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '900', whiteSpace: 'nowrap'
                      }}>
                        {meta.label}
                      </span>
                    </div>

                    <div style={{ background: 'var(--bg)', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '600', lineHeight: 1.5 }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Catatan Review:</span>
                        {doc.review_note || <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Belum ada catatan review.</span>}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                      {doc.file_path ? (
                        <button 
                          onClick={() => window.open(api.assetUrl(doc.file_path), '_blank')}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', flex: 1, justifyContent: 'center' }}
                        >
                          <Download size={16} /> Buka File
                        </button>
                      ) : (
                        <div style={{ flex: 1 }}></div>
                      )}
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => onReviewDocument(doc, 'valid')} 
                          style={{ border: 'none', borderRadius: '8px', padding: '0.5rem 0.75rem', background: doc.status === 'valid' ? '#166534' : '#f1f5f9', color: doc.status === 'valid' ? 'white' : 'var(--text-muted)', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
                          title="Tandai Valid"
                        >Valid</button>
                        <button 
                          onClick={() => onReviewDocument(doc, 'pending_review')} 
                          style={{ border: 'none', borderRadius: '8px', padding: '0.5rem 0.75rem', background: doc.status === 'pending_review' ? '#92400e' : '#f1f5f9', color: doc.status === 'pending_review' ? 'white' : 'var(--text-muted)', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
                          title="Minta Revisi"
                        >Revisi</button>
                        <button 
                          onClick={() => onReviewDocument(doc, 'expired')} 
                          style={{ border: 'none', borderRadius: '8px', padding: '0.5rem 0.75rem', background: doc.status === 'expired' ? '#b91c1c' : '#f1f5f9', color: doc.status === 'expired' ? 'white' : 'var(--text-muted)', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
                          title="Tandai Expired"
                        >Expired</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Col: Dapur Operasional */}
          <div>
            <h3 style={{ fontWeight: '900', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ChefHat size={18} color="var(--primary)" /> Dapur Operasional
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {dapurs.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--bg)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                  <p style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>Belum ada dapur yang didaftarkan.</p>
                </div>
              ) : dapurs.map((d) => {
                const status = d.status_verifikasi || 'pending'
                const statusMeta = dapurStatusMeta[status] || dapurStatusMeta.pending

                return (
                  <div key={d.id_dapur} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.75rem' }}>
                      <p style={{ fontWeight: '900', fontSize: '1rem' }}>{d.lokasi}</p>
                      <span style={{ 
                        background: statusMeta.background, 
                        color: statusMeta.color,
                        padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '900'
                      }}>
                        {statusMeta.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                      <div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800' }}>KAPASITAS</p>
                        <p style={{ fontWeight: '700', fontSize: '0.85rem' }}>{d.kapasitas_produksi} porsi/hari</p>
                      </div>
                    </div>
                    {d.review_note && (
                      <div style={{ background: 'white', padding: '0.75rem', borderRadius: '10px', marginTop: '0.75rem', border: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', marginBottom: '0.2rem' }}>CATATAN REVIEW</p>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: '600', lineHeight: 1.5 }}>{d.review_note}</p>
                      </div>
                    )}
                    {(d.reviewed_at || d.reviewed_by_name) && (
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', marginTop: '0.7rem' }}>
                        Ditinjau {d.reviewed_at ? formatShortDate(d.reviewed_at) : '-'}{d.reviewed_by_name ? ` oleh ${d.reviewed_by_name}` : ''}
                      </p>
                    )}
                    {status !== 'approved' && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.85rem' }}>
                        <button
                          onClick={() => onApproveDapur(d)}
                          style={{ border: 'none', borderRadius: '8px', padding: '0.55rem 0.8rem', background: 'var(--primary)', color: 'white', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          Sahkan
                        </button>
                        <button
                          onClick={() => onRejectDapur(d)}
                          style={{ border: 'none', borderRadius: '8px', padding: '0.55rem 0.8rem', background: '#fee2e2', color: '#b91c1c', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          Tolak / Revisi
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Tindakan Administratif</h4>
              {vendor.status_verifikasi === 'suspended' ? (
                <button 
                  onClick={() => onReinstateVendor(vendor)} 
                  style={{ width: '100%', border: 'none', borderRadius: '12px', padding: '1rem', background: 'var(--primary)', color: 'white', fontWeight: '900', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}
                >
                  <ShieldCheck size={18} /> Pulihkan Status Vendor
                </button>
              ) : (
                <button 
                  onClick={() => onSuspendVendor(vendor)} 
                  style={{ width: '100%', border: 'none', borderRadius: '12px', padding: '1rem', background: '#fee2e2', color: '#b91c1c', fontWeight: '900', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}
                >
                  <AlertTriangle size={18} /> Suspend Operasional Vendor
                </button>
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}

export default VendorAuditModal
