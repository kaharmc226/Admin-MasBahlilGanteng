import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ZoomOut, ZoomIn, Printer, Download } from 'lucide-react'
import api from '../../api'

const getDocumentAsset = (title = '') => {
  if (title.includes('NIB')) return '/nib_mockup.png'
  if (title.includes('Halal')) return '/halal_mockup.png'
  if (title.includes('P-IRT')) return '/pirt_mockup.png'
  return '/higiene_mockup.png'
}

export const PdfModal = ({ doc, onClose }) => {
  if (!doc) return null;
  const assetPath = api.assetUrl(doc.file_path) || getDocumentAsset(doc.title)
  const isPdf = assetPath?.toLowerCase().includes('.pdf')

  const handleDownload = () => {
    if (doc.file_path) {
      window.open(assetPath, '_blank')
      return
    }
    const link = document.createElement('a')
    link.href = assetPath
    link.download = `${(doc.title || 'dokumen').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    if (doc.file_path) {
      window.open(assetPath, '_blank')
      return
    }
    const printWindow = window.open('', '_blank', 'width=1000,height=800')
    if (!printWindow) return
    printWindow.document.write(`
      <html>
        <head><title>${doc.title}</title></head>
        <body style="margin:0;display:flex;justify-content:center;align-items:flex-start;background:#111;">
          <img src="${assetPath}" style="max-width:100%;height:auto;" />
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: 'rgba(15, 23, 42, 0.9)', 
        zIndex: 10000, 
        display: 'flex', 
        flexDirection: 'column', 
        backdropFilter: 'blur(20px)' 
      }}
    >
      <div style={{ 
        background: '#0f172a', 
        color: 'white', 
        padding: '1.2rem 2.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              border: '1px solid rgba(255,255,255,0.2)', 
              color: 'white', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              fontWeight: '800',
              padding: '10px 20px',
              borderRadius: '12px',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={20} /> Kembali
          </button>
          <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
          <div>
            <p style={{ fontWeight: '800', fontSize: '1.1rem', letterSpacing: '0.5px', marginBottom: '2px' }}>{doc.title}</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>DOC-VERIFIED-V4 • {doc.date}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
             <button style={{ background: 'none', border: 'none', color: 'white', padding: '10px', cursor: 'pointer', opacity: 0.8 }}><ZoomOut size={20} /></button>
             <div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', fontWeight: '800', fontSize: '1rem', color: '#38bdf8' }}>100%</div>
             <button style={{ background: 'none', border: 'none', color: 'white', padding: '10px', cursor: 'pointer', opacity: 0.8 }}><ZoomIn size={20} /></button>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
             <button onClick={handlePrint} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', width: '45px', height: '45px', borderRadius: '12px', display: 'grid', placeItems: 'center' }} title="Cetak"><Printer size={22} /></button>
             <button onClick={handleDownload} style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '0 25px', borderRadius: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', height: '45px', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)' }}>
               <Download size={20} /> Download PDF
             </button>
          </div>
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '4rem 1rem', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        background: '#0f172a'
      }}>
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{ 
            width: '100%', 
            maxWidth: '1000px',
            background: 'white', 
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)', 
            borderRadius: '4px', 
            position: 'relative',
            marginBottom: '4rem'
          }}
        >
          {doc.file_path && isPdf ? (
            <iframe src={assetPath} title={doc.title} style={{ width: '100%', height: '80vh', border: 'none', display: 'block' }} />
          ) : doc.file_path ? (
            <img src={assetPath} style={{ width: '100%', height: 'auto', display: 'block' }} alt={doc.title} />
          ) : doc.title.includes('NIB') ? (
            <img src="/nib_mockup.png" style={{ width: '100%', height: 'auto', display: 'block' }} alt="NIB Photo" />
          ) : doc.title.includes('Halal') ? (
            <img src="/halal_mockup.png" style={{ width: '100%', height: 'auto', display: 'block' }} alt="Halal" />
          ) : doc.title.includes('P-IRT') ? (
            <img src="/pirt_mockup.png" style={{ width: '100%', height: 'auto', display: 'block' }} alt="P-IRT" />
          ) : (
            <img src="/higiene_mockup.png" style={{ width: '100%', height: 'auto', display: 'block' }} alt="Higiene" />
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default PdfModal
