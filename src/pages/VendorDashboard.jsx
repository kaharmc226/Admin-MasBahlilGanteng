import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { 
  Plus, 
  X, 
  Truck, 
  Package, 
  FileText, 
  CheckCircle,
  CheckCircle2,
  LayoutDashboard,
  Store,
  UtensilsCrossed,
  Clock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  Activity,
  ChevronRight,
  ClipboardCheck,
  Zap,
  HardDrive,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  Search,
  ArrowLeft,
  Trash2,
  Apple,
  Archive
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../api"
import DashboardLayout from "../components/DashboardLayout"
import { AddDapurForm } from "../components/forms/AddDapurForm"
import { AddMenuForm } from "../components/forms/AddMenuForm"

const Header = ({ title }) => (
  <div className="card dashboard-card-vibrant" style={{ 
    marginBottom: '1.5rem', 
    padding: '1rem 1.5rem',
    borderRadius: '16px',
    background: 'white',
    border: '1px solid white',
    boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    position: 'relative',
    zIndex: 10
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ width: '55px', height: '55px', background: 'var(--primary-light)', borderRadius: '18px', display: 'grid', placeItems: 'center', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.1)' }}>
        <LayoutDashboard color="var(--primary)" size={28} />
      </div>
      <div>
        <h1 style={{ fontSize: "2.1rem", fontWeight: "950", letterSpacing: "-1.5px", color: 'var(--text-main)', lineHeight: '1.2' }}>{title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
          <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Operational Center • Live Monitoring</p>
        </div>
      </div>
    </div>
    
    <div style={{ 
      padding: '0.6rem 1.4rem', 
      borderRadius: '8px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '15px',
      background: 'var(--bg)',
      border: '1px solid var(--border)'
    }}>
       <div style={{ textAlign: 'right', borderRight: '1.5px solid var(--border)', paddingRight: '15px' }}>
          <p style={{ fontWeight: '950', fontSize: '1rem', color: 'var(--text-main)', margin: 0 }}>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '900', margin: 0 }}>{new Date().toLocaleDateString('id-ID', { weekday: 'long' }).toUpperCase()}</p>
       </div>
       <div className="flex" style={{ gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '38px', height: '38px', background: 'white', borderRadius: '12px', display: 'grid', placeItems: 'center', boxShadow: '0 5px 10px rgba(0,0,0,0.05)' }}>
              <Activity size={18} color="var(--primary)" />
            </div>
            <motion.div 
               animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
               transition={{ duration: 2, repeat: Infinity }}
               style={{ position: 'absolute', inset: 0, background: 'var(--primary)', borderRadius: '12px', zIndex: -1 }}
            />
          </div>
          <div>
            <p style={{ fontSize: '0.6rem', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '1px' }}>SISTEM STATUS</p>
            <p style={{ fontSize: '0.8rem', fontWeight: '950', color: 'var(--primary)' }}>SINKRON</p>
          </div>
       </div>
    </div>
  </div>
)

const WelcomeBanner = ({ name }) => (
  <motion.div 
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    style={{ 
      background: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)',
      padding: '1.5rem',
      borderRadius: '16px',
      marginBottom: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      color: 'white',
      boxShadow: '0 30px 60px -15px rgba(6, 78, 59, 0.4)'
    }}
  >
    <div style={{ position: 'relative', zIndex: 2 }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '950', color: 'white', marginBottom: '10px' }}>Halo Selamat Siang, {name}! 👋</h2>
      <p style={{ fontSize: '1.1rem', fontWeight: '600', opacity: 0.9, maxWidth: '600px', lineHeight: '1.6' }}>Semoga hari ini penuh produktivitas. Dapur Anda sedang memantau 2 batch produksi gizi nasional.</p>
      
      <div style={{ display: 'flex', gap: '15px', marginTop: '2.5rem' }}>
        <button style={{ background: 'white', color: 'var(--text-main)', padding: '0.8rem 1.8rem', border: 'none', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Jelajahi Laporan <ChevronRight size={20} />
        </button>
        <button style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.8rem 1.8rem', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
          Update Stok Bahan
        </button>
      </div>
    </div>

    {/* Decorative Elements inside banner */}
    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '250px', height: '250px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }}></div>
    <div style={{ position: 'absolute', bottom: '-20px', right: '50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', pointerEvents: 'none' }}></div>
    <UtensilsCrossed style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%) rotate(15deg)', opacity: 0.1, color: 'white' }} size={200} />
  </motion.div>
)

const Footer = () => (
  <div className="card dashboard-card-vibrant" style={{ 
    marginTop: '2rem', 
    padding: '1.5rem', 
    borderRadius: '16px',
    background: 'white',
    border: '1px solid white',
    boxShadow: '0 -10px 40px rgba(0,0,0,0.02)',
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    position: 'relative',
    zIndex: 2
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ background: 'var(--primary)', color: 'white', width: '45px', height: '45px', borderRadius: '14px', display: 'grid', placeItems: 'center', fontWeight: '950', fontSize: '1.2rem', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}>T</div>
      <div>
        <h4 style={{ fontWeight: '950', fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '2px', letterSpacing: '-0.5px' }}>TRAKSI National Ecosystem</h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>Platform Transparansi & Gizi Nasional • Versi 4.2.0-Production</p>
      </div>
    </div>
    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
       <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '900', marginBottom: '8px', letterSpacing: '1px' }}>KONEKSI ENKRIPSI</p>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
             {[1,2,3,4,5,6].map(i => <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} style={{ width: '12px', height: '6px', background: 'var(--primary)', borderRadius: '10px' }}></motion.div>)}
          </div>
       </div>
       <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ width: '45px', height: '45px', background: 'var(--bg)', border: 'none', borderRadius: '14px', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}><MessageSquare size={20} /></button>
          <button style={{ width: '45px', height: '45px', background: 'var(--bg)', border: 'none', borderRadius: '14px', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}><ShieldCheck size={20} /></button>
       </div>
    </div>
  </div>
)

const FloatingShape = ({ initial, animate, duration, color, size }) => (
  <motion.div 
    initial={initial}
    animate={animate}
    transition={{ duration, repeat: Infinity, ease: "linear" }}
    style={{ 
      position: 'absolute', 
      width: size, 
      height: size, 
      borderRadius: '50%', 
      background: color, 
      filter: 'blur(100px)', 
      opacity: 0.25,
      zIndex: 0,
      pointerEvents: 'none'
    }}
  />
)

const FoodItem3D = ({ src, top, left, right, bottom, size = 120, delay = 0, rotate = 0 }) => (
  <motion.div
    initial={{ y: 0, opacity: 0, scale: 0.5, rotate }}
    animate={{ 
      y: [0, -40, 0],
      rotate: [rotate, rotate + 15, rotate - 15, rotate],
      opacity: 0.25,
      scale: 1
    }}
    transition={{ 
      duration: 5 + Math.random() * 3, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay 
    }}
    style={{
      position: 'fixed',
      top, left, right, bottom,
      width: size,
      height: size,
      zIndex: 0,
      pointerEvents: 'none',
      filter: 'blur(1px) drop-shadow(0 25px 50px rgba(0,0,0,0.15))'
    }}
  >
    <img src={src} alt="food decoration" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '4px solid white', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }} />
  </motion.div>
)

const Motif = ({ icon: Icon, top, right, bottom, left, color }) => (
  <div style={{ position: "absolute", top, right, bottom, left, opacity: 0.05, pointerEvents: "none", zIndex: 0 }}>
    <Icon size={120} color={color} />
  </div>
)

const getDocumentAsset = (title = '') => {
  if (title.includes('NIB')) return '/nib_mockup.png'
  if (title.includes('Halal')) return '/halal_mockup.png'
  if (title.includes('P-IRT')) return '/pirt_mockup.png'
  return '/higiene_mockup.png'
}

const PdfModal = ({ doc, onClose }) => {
  if (!doc) return null;
  const assetPath = getDocumentAsset(doc.title)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = assetPath
    link.download = `${(doc.title || 'dokumen').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
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
             <button onClick={() => alert("🖨️ Mengirim ke Antrian Print...")} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', width: '45px', height: '45px', borderRadius: '12px', display: 'grid', placeItems: 'center' }} title="Cetak"><Printer size={22} /></button>
             <button onClick={() => alert("📥 Mengunduh Salinan PDF Resmi...")} style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '0 25px', borderRadius: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', height: '45px', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)' }}>
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
          {doc.title.includes('NIB') ? (
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

const VisualAuditModal = ({ menu, onClose, onRevise }) => {
  if (!menu) return null;

  const bahan = Array.isArray(menu.bahan) ? menu.bahan : []
  const leftBahan = bahan.slice(0, 3)
  const rightBahan = bahan.slice(3, 5)
  const photoUrl = api.assetUrl(menu.foto_url)

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
          maxWidth: '700px', 
          padding: '4rem', 
          position: 'relative',
          boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '30px', right: '30px', background: '#f1f5f9', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
        >
          <X size={24} color="#64748b" />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
           <h2 style={{ fontSize: '2.4rem', fontWeight: '950', color: '#1e293b', marginBottom: '10px', letterSpacing: '-1px' }}>Informasi Nilai Gizi</h2>
           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontWeight: '900', fontSize: '1.4rem', color: '#475569' }}>Menu MBG</span>
              <div style={{ background: '#E11D48', color: 'white', padding: '8px 25px', borderRadius: '12px', fontWeight: '950', fontSize: '1.4rem' }}>Makanan Bergizi Gratis</div>
           </div>
        </div>

        {/* Tray Visual Section */}
        <div style={{ position: 'relative', height: '380px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem' }}>
           {/* Annotations Left */}
           <div style={{ position: 'absolute', left: '0', top: '10%', zIndex: 10 }}>
              {leftBahan.map((b, i) => (
                <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'right', marginBottom: '35px', position: 'relative' }}>
                   <p style={{ fontWeight: '950', color: '#dc2626', fontSize: '1.2rem', margin: 0, lineHeight: '1.1' }}>{b.nama}</p>
                   <p style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.1rem', margin: 0 }}>{b.takaran}</p>
                   <div style={{ width: '40px', height: '3px', background: '#334155', position: 'relative', marginTop: '8px', marginLeft: 'auto', opacity: 0.6 }}>
                      <div style={{ position: 'absolute', left: '100%', top: '-5px', borderLeft: '12px solid #334155', borderTop: '6px solid transparent', borderBottom: '6px solid transparent' }}></div>
                   </div>
                </motion.div>
              ))}
           </div>

           {/* Main Tray Image Container */}
           <div style={{ position: 'relative', width: '380px', height: '320px', display: 'grid', placeItems: 'center' }}>
              <div style={{ width: '100%', height: '100%', border: '12px solid #cbd5e1', borderRadius: '16px', background: '#f1f5f9', overflow: 'hidden', boxShadow: '0 40px 80px -15px rgba(0,0,0,0.3)', position: 'relative' }}>
                 {photoUrl ? (
                   <img src={photoUrl} alt={`Foto ${menu.nama_menu}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 ) : (
                   <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '1.5rem', color: '#64748b', fontWeight: '850', background: '#f8fafc' }}>
                     Belum ada foto menu
                   </div>
                 )}
              </div>
           </div>

           {/* Annotations Right */}
           <div style={{ position: 'absolute', right: '0', top: '15%', zIndex: 10 }}>
              {rightBahan.map((b, i) => (
                <motion.div key={i} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: (i+3) * 0.1 }} style={{ textAlign: 'left', marginBottom: '40px' }}>
                   <p style={{ fontWeight: '950', color: '#dc2626', fontSize: '1.2rem', margin: 0, lineHeight: '1.1' }}>{b.nama}</p>
                   <p style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.1rem', margin: 0 }}>{b.takaran}</p>
                   <div style={{ width: '40px', height: '3px', background: '#334155', position: 'relative', marginTop: '8px', opacity: 0.6 }}>
                      <div style={{ position: 'absolute', right: '100%', top: '-5px', borderRight: '12px solid #334155', borderTop: '6px solid transparent', borderBottom: '6px solid transparent' }}></div>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>

        <div style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', marginBottom: '1.5rem', fontWeight: '750', lineHeight: '1.6' }}>
           Menu MBG SD GIT Manumuti, Kabupaten Kupang, NTT<br/>
           <span style={{ fontWeight: '600', opacity: 0.8 }}>Sumber: traksi.go.id • Verifikasi Audit Ahli Gizi</span>
        </div>

        {/* Bottom Grid: Notes & Table Side-by-side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2.5rem', alignItems: 'start' }}>
           {/* Notes Box */}
           <div style={{ border: '3px solid #ef4444', borderRadius: '12px', padding: '1rem', background: '#fffafa', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-15px', left: '25px', background: '#ef4444', color: 'white', padding: '4px 15px', borderRadius: '10px', fontWeight: '950', fontSize: '0.8rem' }}>REKOMENDASI AUDIT</div>
              <p style={{ fontWeight: '950', color: '#ef4444', fontSize: '1.3rem', marginBottom: '15px' }}>*Catatan Ahli Gizi</p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#334155', fontWeight: '800', fontSize: '1rem', lineHeight: '1.8' }}>
                 <li>Kandungan gizi menu ini <span style={{color: '#dc2626'}}>cukup</span> untuk memenuhi makan siang anak, namun porsi <span style={{color: '#dc2626'}}>serat</span> perlu ditambah.</li>
                 <li>Pengolahan disarankan beralih ke <span style={{color: '#dc2626'}}>kukus/tumis</span> untuk mengurangi lemak jenuh.</li>
                 {menu.notes?.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
           </div>

           {/* Nutrition Table Box */}
           <div style={{ border: '3px solid #1e293b', borderRadius: '12px', overflow: 'hidden', background: 'white', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                 <tbody>
                    {[
                      { l: 'Energi', v: '503 kkal' },
                      { l: 'Protein', v: '15.9 g' },
                      { l: 'Lemak', v: '21.3 g' },
                      { l: 'Karbohidrat', v: '61.4 g' },
                      { l: 'Serat', v: '3.6 g' },
                      { l: 'Natrium', v: '558 mg' }
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: i === 5 ? 'none' : '1px solid #e2e8f0' }}>
                         <td style={{ padding: '12px 20px', fontWeight: '850', color: '#64748b', fontSize: '1rem' }}>{row.l}</td>
                         <td style={{ padding: '12px 20px', fontWeight: '950', color: '#1e293b', textAlign: 'right', fontSize: '1.1rem' }}>{row.v}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        <div style={{ marginTop: '3.5rem', display: 'flex', gap: '1rem' }}>
           <button 
             onClick={onClose}
             style={{ flex: 1, padding: '1.2rem', borderRadius: '24px', border: '2px solid #e2e8f0', background: 'white', fontWeight: '900', color: '#64748b', cursor: 'pointer' }}
           >
             Tutup Laporan
           </button>
           <button 
             onClick={() => { onRevise(menu); onClose(); }}
             style={{ flex: 2, padding: '1.2rem', borderRadius: '24px', border: 'none', background: '#dc2626', fontWeight: '950', color: 'white', cursor: 'pointer', boxShadow: '0 10px 25px rgba(220, 38, 38, 0.2)' }}
           >
             Revisi Sekarang
           </button>
        </div>
      </motion.div>
    </motion.div>
  )
}


const AddTicketForm = ({ onClose, onSave, dapurs, menus, sekolah }) => {
  const validMenus = menus.filter(m => m.status_validasi === 'approved')
  const [formData, setFormData] = useState({
    id_dapur: dapurs[0]?.id_dapur || dapurs[0]?.id || '',
    id_menu: validMenus[0]?.id_menu || '',
    id_sekolah: sekolah[0]?.id_sekolah || '',
    jumlah_porsi: ''
  })
  const availableSekolah = sekolah.filter((s) => {
    if (!formData.id_dapur) return false
    return (s.id_dapur || '').toString() === formData.id_dapur.toString()
  })

  useEffect(() => {
    if (availableSekolah.length === 0) {
      setFormData((prev) => ({ ...prev, id_sekolah: '' }))
      return
    }
    const stillValid = availableSekolah.some((s) => s.id_sekolah.toString() === (formData.id_sekolah || '').toString())
    if (!stillValid) {
      setFormData((prev) => ({ ...prev, id_sekolah: availableSekolah[0].id_sekolah }))
    }
  }, [formData.id_dapur, availableSekolah, formData.id_sekolah])

  const handleSubmit = () => {
    if (!formData.id_dapur || !formData.id_menu || !formData.id_sekolah || !formData.jumlah_porsi) {
      alert("Lengkapi semua data tiket produksi.")
      return
    }
    onSave({
      ...formData,
      jumlah_porsi: parseInt(formData.jumlah_porsi)
    })
    alert("✅ Tiket Produksi berhasil dibuat dan masuk antrian Pending!")
    onClose()
  }

  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: 'rgba(15, 23, 42, 0.4)', 
        backdropFilter: 'blur(8px)', 
        zIndex: 9999, 
        display: 'flex', 
        justifyContent: 'flex-end' 
      }}
      onClick={onClose}
    >
      <motion.div 
        initial={{ x: '100%' }} 
        animate={{ x: 0 }} 
        exit={{ x: '100%' }} 
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          height: '100%', 
          background: 'white', 
          boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', 
          padding: '1.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex justify-between" style={{ marginBottom: '1.5rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontWeight: '950', fontSize: '1.8rem', color: '#0f172a', letterSpacing: '-0.5px' }}>Buat Tiket Produksi</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginTop: '4px' }}>Buat tiket antrian produksi baru.</p>
            </div>
            <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
              <X size={20} color="#64748b" />
            </button>
          </div>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>DAPUR OPERASIONAL</label>
              <select 
                value={formData.id_dapur} 
                onChange={e => setFormData({...formData, id_dapur: e.target.value})}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid var(--border)', fontWeight: '700' }}
              >
                <option value="" disabled>Pilih Dapur</option>
                {dapurs.map(d => <option key={d.id_dapur || d.id} value={d.id_dapur || d.id}>{d.lokasi}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>PILIH MENU (APPROVED)</label>
              <select 
                value={formData.id_menu} 
                onChange={e => setFormData({...formData, id_menu: e.target.value})}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid var(--border)', fontWeight: '700' }}
              >
                <option value="" disabled>Pilih Menu</option>
                {validMenus.map(m => <option key={m.id_menu} value={m.id_menu}>{m.nama_menu}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>TARGET SEKOLAH (DISTRIBUSI)</label>
              <select 
                value={formData.id_sekolah} 
                onChange={e => setFormData({...formData, id_sekolah: e.target.value})}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid var(--border)', fontWeight: '700' }}
              >
                <option value="" disabled>Pilih Sekolah</option>
                {availableSekolah.map(s => <option key={s.id_sekolah} value={s.id_sekolah}>{s.nama_sekolah}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>JUMLAH PORSI</label>
              <input 
                type="number" 
                placeholder="Misal: 500"
                value={formData.jumlah_porsi}
                onChange={e => setFormData({...formData, jumlah_porsi: e.target.value})}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid var(--border)', fontWeight: '700' }}
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="btn-primary" 
          style={{ width: '100%', padding: '1.2rem', borderRadius: '24px', border: 'none', color: 'white', fontWeight: '900', fontSize: '1.1rem', marginTop: '2rem', cursor: 'pointer' }}
        >
          Terbitkan Tiket
        </button>
      </motion.div>
    </div>
  )
}

const VendorDashboard = ({ user, onLogout, onSwitchRole }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const path = location.pathname.replace(/\/$/, '')
  const isMain = path === '/vendor'
  const isInformasi = path === '/vendor/informasi'
  const isMenu = path === '/vendor/menu'
  const isProduksi = path === '/vendor/produksi'
  const isDistribusi = path === '/vendor/distribusi'
  const isStok = path === '/vendor/stok'
  const [showAddForm, setShowAddForm] = useState(false)
  const [showMenuForm, setShowMenuForm] = useState(false)
  const [editingMenu, setEditingMenu] = useState(null)
  const [activeDoc, setActiveDoc] = useState(null)
  const [selectedAuditMenu, setSelectedAuditMenu] = useState(null)
  const [selectedDapurForStok, setSelectedDapurForStok] = useState(() => localStorage.getItem('selectedDapurForStok') || null)
  const [currentVendor, setCurrentVendor] = useState(null)
  
  // Stock history and alert states
  const [stokHistory, setStokHistory] = useState([])
  const [prodError, setProdError] = useState(null)
  const [statusFilter, setStatusFilter] = useState(null) // 'persiapan' | 'memasak' | 'siap_kirim' | null
  const [stokFilter, setStokFilter] = useState(null) // 'all' | 'kritis' | 'ledger' | null
  
  // API-driven state
  const [dapurs, setDapurs] = useState([])
  const [menus, setMenus] = useState([])
  const [dokumen, setDokumen] = useState([])
  const [produksi, setProduksi] = useState([])
  const [distribusi, setDistribusi] = useState([])
  const [stokData, setStokData] = useState([])
  const [sekolah, setSekolah] = useState([])
  const [mappingData, setMappingData] = useState([])
  const [nutritionItems, setNutritionItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendor, d, m, prod, dist, sek, mappings, nutrition] = await Promise.all([
          api.getVendorByUser(user.id_user),
          api.getDapur(),
          api.getMenus(),
          api.getProduksi(),
          api.getDistribusi(),
          api.getSekolah(),
          api.getMapping(),
          api.getNutrition()
        ])
        const vendorDapurs = d.filter(item => item.id_vendor === vendor.id_vendor)
        const vendorDapurIds = new Set(vendorDapurs.map(item => item.id_dapur))
        const vendorMenus = m.filter(item => item.id_vendor === vendor.id_vendor)
        const vendorProduksi = prod.filter(item => vendorDapurIds.has(item.id_dapur))
        const vendorProduksiIds = new Set(vendorProduksi.map(item => item.id_produksi))
        const vendorDistribusi = dist.filter(item => vendorProduksiIds.has(item.id_produksi))
        const vendorMappings = mappings.filter(item => vendorDapurIds.has(item.id_dapur))
        const mappedSekolahIds = new Set(vendorMappings.map(item => item.id_sekolah))
        const vendorSekolah = sek
          .filter(item => mappedSekolahIds.has(item.id_sekolah))
          .map(item => {
            const mapping = vendorMappings.find((entry) => entry.id_sekolah === item.id_sekolah)
            return { ...item, id_dapur: mapping?.id_dapur ?? null }
          })
        const dok = await api.getDokumen(vendor.id_vendor)

        setCurrentVendor(vendor)
        setDapurs(vendorDapurs)
        setMenus(vendorMenus)
        setDokumen(dok)
        setProduksi(vendorProduksi)
        setDistribusi(vendorDistribusi)
        setSekolah(vendorSekolah)
        setMappingData(vendorMappings)
        setNutritionItems(Array.isArray(nutrition) ? nutrition.filter(item => item.status !== 'retired') : [])
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setCurrentVendor(null)
        setDapurs([])
        setMenus([])
        setDokumen([])
        setProduksi([])
        setDistribusi([])
        setSekolah([])
        setMappingData([])
        setNutritionItems([])
      } finally {
        setLoading(false)
      }
    }
    if (user?.id_user) {
      fetchData()
    }
  }, [user?.id_user])

  useEffect(() => {
    if (dapurs.length > 0 && !selectedDapurForStok) {
      const saved = localStorage.getItem('selectedDapurForStok')
      if (saved && dapurs.some(d => (d.id_dapur || d.id || '').toString() === saved.toString())) {
        setSelectedDapurForStok(saved)
      } else {
        const firstId = dapurs[0].id_dapur || dapurs[0].id
        setSelectedDapurForStok(firstId.toString())
        localStorage.setItem('selectedDapurForStok', firstId.toString())
      }
    }
  }, [dapurs, selectedDapurForStok])

  useEffect(() => {
    if (selectedDapurForStok) {
      api.getStok(selectedDapurForStok).then(setStokData).catch(console.error)
      api.getStokHistory(selectedDapurForStok).then(setStokHistory).catch(console.error)
    }
  }, [selectedDapurForStok])

  const [formBahan, setFormBahan] = useState('')
  const [formSatuan, setFormSatuan] = useState('kg')
  const [showSuggestions, setShowSuggestions] = useState(false)
  useEffect(() => {
    if (isStok) {
      const rep = localStorage.getItem('replenishBahan')
      if (rep) {
        setFormBahan(rep)
        localStorage.removeItem('replenishBahan')
        const existing = stokData.find(s => s.nama_bahan.toLowerCase() === rep.toLowerCase())
        if (existing) {
          setFormSatuan(existing.satuan)
        }
      }
    }
  }, [isStok, stokData])

  const handleBahanChange = (val) => {
    setFormBahan(val)
    const lowerVal = val.toLowerCase()
    const literKeywords = ['minyak', 'air', 'kecap', 'susu', 'kaldu', 'jus', 'sirup', 'santan', 'saus', 'cuka']
    const kgKeywords = ['beras', 'daging', 'ayam', 'ikan', 'tahu', 'tempe', 'wortel', 'cabai', 'cabe', 'bawang', 'garam', 'gula', 'tepung', 'kentang', 'sayur', 'kol', 'bayam', 'kangkung', 'tomat', 'terigu', 'maizena', 'merica', 'ketumbar', 'bumbu']
    const butirKeywords = ['telur', 'telur ayam', 'telur puyuh', 'telur bebek']
    const packKeywords = ['masako', 'royco', 'penyedap', 'ragi', 'mentega', 'keju']

    if (literKeywords.some(kw => lowerVal.includes(kw))) {
      setFormSatuan('liter')
    } else if (kgKeywords.some(kw => lowerVal.includes(kw))) {
      setFormSatuan('kg')
    } else if (butirKeywords.some(kw => lowerVal.includes(kw))) {
      setFormSatuan('butir')
    } else if (packKeywords.some(kw => lowerVal.includes(kw))) {
      setFormSatuan('pack')
    }
  }

  const handleAddDapur = async (newDapur) => {
    try {
      if (!currentVendor) throw new Error('Vendor tidak ditemukan untuk user yang sedang login.')
      const created = await api.createDapur({ id_vendor: currentVendor.id_vendor, lokasi: newDapur.lokasi, kapasitas_produksi: newDapur.kapasitas_produksi || newDapur.kapasitas_production })
      setDapurs(prev => [...prev, { ...created, id: created.id_dapur }])
    } catch (err) { console.error(err) }
  }

  const handleDeleteDapur = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus dapur ini?")) {
      try {
        await api.deleteDapur(id)
        setDapurs(prev => prev.filter(d => (d.id_dapur || d.id) !== id))
      } catch (err) { console.error(err) }
    }
  }

  const [activeHub, setActiveHub] = useState({
    name: 'Kendari',
    url: "https://maps.google.com/maps?q=Kendari&output=embed"
  })

  const handleAddMenu = async (newMenu) => {
    try {
      let fotoUrl = newMenu.foto_url || null
      if (newMenu.foto_data_url) {
        const uploaded = await api.uploadMenuPhoto({
          imageData: newMenu.foto_data_url,
          fileName: newMenu.foto_file_name || newMenu.nama_menu
        })
        fotoUrl = uploaded.foto_url
      }

      if (editingMenu) {
        await api.updateMenu(newMenu.id || newMenu.id_menu, {
          nama_menu: newMenu.nama_menu,
          bahan: newMenu.bahan,
          foto_url: fotoUrl,
          tanggal: newMenu.date || newMenu.tanggal
        })
      } else {
        if (!currentVendor) throw new Error('Vendor tidak ditemukan untuk user yang sedang login.')
        await api.createMenu({
          id_vendor: currentVendor.id_vendor,
          nama_menu: newMenu.nama_menu,
          bahan: newMenu.bahan,
          foto_url: fotoUrl,
          tanggal: newMenu.date || newMenu.tanggal || new Date().toISOString().split('T')[0]
        })
      }
      api.getMenus().then(allMenus => {
        setMenus(allMenus.filter(item => item.id_vendor === currentVendor?.id_vendor))
      }).catch(console.error)
      setEditingMenu(null)
    } catch (err) { console.error(err) }
  }

  const handleRequestIngredient = async (requestData) => {
    if (!currentVendor) throw new Error('Vendor tidak ditemukan untuk user yang sedang login.')
    await api.createNutritionRequest({
      id_vendor: currentVendor.id_vendor,
      requested_by: user.id_user,
      ...requestData
    })
  }

  const handleAddStok = async (e) => {
    e.preventDefault()
    const form = e.target
    const data = {
      id_dapur: selectedDapurForStok,
      nama_bahan: formBahan,
      jumlah: parseFloat(form.jumlah.value),
      satuan: formSatuan
    }
    try {
      const created = await api.createStok(data)
      api.getStok(selectedDapurForStok).then(setStokData).catch(console.error)
      api.getStokHistory(selectedDapurForStok).then(setStokHistory).catch(console.error)
      form.reset()
      setFormBahan('')
      setFormSatuan('kg')
    } catch (err) { console.error(err) }
  }

  const handleUpdateStok = async (id_stok, newJumlah) => {
    try {
      await api.updateStok(id_stok, { jumlah: parseFloat(newJumlah) })
      setStokData(prev => prev.map(s => s.id_stok === id_stok ? { ...s, jumlah: parseFloat(newJumlah) } : s))
      api.getStokHistory(selectedDapurForStok).then(setStokHistory).catch(console.error)
    } catch (err) { console.error(err) }
  }

  const handleDeleteStok = async (id_stok) => {
    if (confirm("Hapus item stok ini?")) {
      try {
        await api.deleteStok(id_stok)
        setStokData(prev => prev.filter(s => s.id_stok !== id_stok))
        api.getStokHistory(selectedDapurForStok).then(setStokHistory).catch(console.error)
      } catch (err) { console.error(err) }
    }
  }

  const [showTicketForm, setShowTicketForm] = useState(false)

  const handleCreateProduksiTicket = async (data) => {
    try {
      await api.createProduksi({ ...data, status: 'pending' })
      const dapurIds = new Set(dapurs.map(item => item.id_dapur || item.id))
      api.getProduksi().then(rows => {
        const filteredProduksi = rows.filter(item => dapurIds.has(item.id_dapur))
        setProduksi(filteredProduksi)
        const produksiIds = new Set(filteredProduksi.map(item => item.id_produksi))
        api.getDistribusi().then(distRows => {
          setDistribusi(distRows.filter(item => produksiIds.has(item.id_produksi)))
        }).catch(console.error)
      }).catch(console.error)
    } catch (err) { alert(`❌ Gagal membuat tiket:\n${err.message}`) }
  }

  const handleUpdateProduksiStatus = async (id_produksi, status) => {
    try {
      setProdError(null)
      await api.updateProduksi(id_produksi, { status })
      alert(status === 'persiapan' ? '✅ Status dipindah ke Persiapan. Stok bahan baku telah otomatis dipotong!' : '✅ Status dipindah ke Selesai & Dikirim!')
      const dapurIds = new Set(dapurs.map(item => item.id_dapur || item.id))
      api.getProduksi().then(rows => {
        const filteredProduksi = rows.filter(item => dapurIds.has(item.id_dapur))
        setProduksi(filteredProduksi)
        const produksiIds = new Set(filteredProduksi.map(item => item.id_produksi))
        if (status === 'selesai') {
          api.getDistribusi().then(distRows => {
            setDistribusi(distRows.filter(item => produksiIds.has(item.id_produksi)))
          }).catch(console.error)
        }
      }).catch(console.error)
      // Refresh stok silently
      if (selectedDapurForStok) {
        api.getStok(selectedDapurForStok).then(setStokData).catch(console.error)
        api.getStokHistory(selectedDapurForStok).then(setStokHistory).catch(console.error)
      }
    } catch (err) {
      const p = produksi.find(item => item.id_produksi === id_produksi)
      const dapurId = p ? p.id_dapur : selectedDapurForStok
      
      let bahanName = ''
      const matchStok = err.message.match(/Stok\s+([A-Za-z0-9\s\-_]+)\s+(kurang|tidak mencukupi)/i)
      const matchRegister = err.message.match(/Bahan\s+([A-Za-z0-9\s\-_]+)\s+belum terdaftar/i)
      if (matchStok) {
        bahanName = matchStok[1].trim()
      } else if (matchRegister) {
        bahanName = matchRegister[1].trim()
      }

      setProdError({
        message: err.message,
        dapurId,
        bahanName
      })
    }
  }

  const handleReviseMenu = (menu) => {
    setEditingMenu(menu)
    setShowMenuForm(true)
    navigate('/vendor/menu')
  }


  
  const stats = [
    { title: "Dashboard", value: "MBG Centre", icon: <LayoutDashboard />, color: "var(--primary)" },
    { title: "Dapur Operasional", value: dapurs.length.toString(), icon: <Store />, color: "var(--secondary)" },
    { title: "Varian Menu Gizi", value: menus.length.toString(), icon: <UtensilsCrossed />, color: "var(--banana)" }
  ]

  const prodList = [
    { school: "SDN 01 Menteng", menuName: "Nasi Ayam Bakar", status: "DISTRIBUSI", date: "14 Mar 2026" },
    { school: "SMPN 02 Jakarta", menuName: "Nasi Goreng Sehat", status: "PRODUKSI", date: "14 Mar 2026" },
    { school: "SDN 03 Tebet", menuName: "Soto Ayam", status: "SELESAI", date: "13 Mar 2026" }
  ]

  const renderContent = () => {
    if (isInformasi) return (
      <div className="grid" style={{ gap: '1rem' }}>
        <Header title="Informasi & Dokumen Vendor" />
        
        {/* Section: Daftar Dapur */}
        <AnimatePresence>
          {showAddForm && (
            <AddDapurForm isOpen={true} onClose={() => setShowAddForm(false)} onSave={handleAddDapur} />
          )}
        </AnimatePresence>
        <div className="card dashboard-card-vibrant" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div className="flex justify-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: '950' }}>Daftar Dapur Terdaftar</h3>
            <button 
              onClick={() => setShowAddForm(true)}
              className="btn-primary" 
              style={{ padding: '0.8rem 1.5rem', borderRadius: '24px', border: 'none', color: 'white', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Plus size={18} /> Tambah Dapur
            </button>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {dapurs.map((d, i) => (
              <div key={i} style={{ padding: '1.5rem', background: 'var(--bg)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ background: 'white', padding: '12px', borderRadius: '15px' }}><Store color="var(--primary)" size={24} /></div>
                  <div>
                    <h4 style={{ fontWeight: '900' }}>Dapur {d.lokasi}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: D-00{(d.id_dapur || d.id || 0).toString().slice(-3)} | Kapasitas: {d.kapasitas_produksi} Porsi/Hari</p>
                    {d.hash && (
                      <p style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '800', fontFamily: 'monospace', marginTop: '4px' }}>
                        🔗 LEDGER HASH: {d.hash}
                      </p>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '900', marginBottom: '5px', display: 'inline-block' }}>AKTIF</span>
                    <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)' }}>• Monitoring Live</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteDapur(d.id)}
                    style={{ background: '#fff5f5', color: '#ff4d4d', border: '1px solid #ffe3e3', padding: '12px', borderRadius: '15px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                    title="Hapus / Non-aktifkan Dapur"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Dokumen Izin Usaha */}
        <div className="card dashboard-card-vibrant" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h3 style={{ fontWeight: '950', marginBottom: '1rem' }}>Dokumen & Izin Usaha</h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {(dokumen.length > 0 ? dokumen : [
              { nama_dokumen: 'NIB (Nomor Induk Berusaha)', status: 'valid', created_at: '2026-01-12', jenis: 'izin_usaha' },
              { nama_dokumen: 'Sertifikat Halal', status: 'valid', created_at: '2026-02-05', jenis: 'sertifikat_halal' },
              { nama_dokumen: 'Izin Edar P-IRT', status: 'pending', created_at: '2026-03-20', jenis: 'izin_edar' },
              { nama_dokumen: 'Sertifikat Higiene Sanitasi', status: 'valid', created_at: '2026-02-10', jenis: 'sertifikat_laik_hygiene' }
            ]).map((doc, i) => {
              const docIcon = doc.jenis === 'sertifikat_halal' ? <ShieldCheck color="var(--secondary)" /> : 
                              doc.jenis === 'sertifikat_laik_hygiene' ? <ClipboardCheck color="var(--primary)" /> : 
                              doc.status === 'pending' ? <Clock color="var(--banana)" /> : <FileText color="var(--primary)" />;
              const displayStatus = doc.status === 'valid' || doc.status === 'approved' ? 'Verified' : doc.status === 'pending' ? 'Pending' : 'Expired';
              const displayDate = doc.tanggal_berlaku ? new Date(doc.tanggal_berlaku).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date(doc.created_at || '2026-01-01').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
              
              return (
                <div key={i} className="card" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'white' }}>
                  <div style={{ background: 'var(--bg)', width: '50px', height: '50px', borderRadius: '15px', display: 'grid', placeItems: 'center', marginBottom: '1.5rem' }}>{docIcon}</div>
                  <h4 style={{ fontWeight: '900', marginBottom: '0.5rem' }}>{doc.nama_dokumen}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Diunggah: {displayDate}</p>
                  <div className="flex justify-between" style={{ alignItems: 'center' }}>
                    <span className="badge" style={{ background: displayStatus === 'Verified' ? 'var(--primary-light)' : 'var(--banana-light)', color: displayStatus === 'Verified' ? 'var(--primary)' : 'var(--banana)', fontWeight: '900' }}>{displayStatus}</span>
                    <button 
                      onClick={() => setActiveDoc({ ...doc, title: doc.nama_dokumen, date: displayDate, status: displayStatus })}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )

    if (isStok) return (
      <div className="grid" style={{ gap: '1.5rem' }}>
        <Header title="Manajemen Stok & Gudang" />
        
        <div className="card dashboard-card-vibrant" style={{ padding: '1.5rem', borderRadius: '16px' }}>
           <div style={{ marginBottom: '1.5rem' }}>
             <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px', color: 'var(--text-muted)' }}>PILIH DAPUR OPERASIONAL</label>
             <select 
               value={selectedDapurForStok || ''} 
               onChange={(e) => setSelectedDapurForStok(e.target.value)}
               style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid var(--border)', fontWeight: '700', fontSize: '1.1rem' }}
             >
               <option value="" disabled>-- Pilih Dapur --</option>
               {dapurs.map(d => <option key={d.id_dapur || d.id} value={d.id_dapur || d.id}>Dapur {d.lokasi}</option>)}
             </select>
           </div>
           
           {selectedDapurForStok ? (
             <div style={{ display: 'grid', gap: '1.5rem' }}>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {[
                    {
                      status: 'all',
                      title: 'Total Kategori Bahan',
                      val: stokData.length,
                      unit: 'Item',
                      desc: 'Bahan baku aktif terdaftar',
                      icon: <Archive color="var(--primary)" />,
                      color: 'var(--primary)',
                      bgDefault: 'var(--bg)'
                    },
                    {
                      status: 'kritis',
                      title: 'Bahan Kritis & Habis',
                      val: stokData.filter(s => s.jumlah <= 0 || s.jumlah < 5).length,
                      unit: 'Item',
                      desc: stokData.some(s => s.jumlah <= 0 || s.jumlah < 5) ? 'Segera lakukan replenishment!' : 'Semua stok dalam batas aman',
                      icon: <AlertCircle color="#dc2626" />,
                      color: '#dc2626',
                      bgDefault: stokData.some(s => s.jumlah <= 0 || s.jumlah < 5) ? '#fff5f5' : 'var(--bg)',
                      borderDefault: stokData.some(s => s.jumlah <= 0 || s.jumlah < 5) ? '1px solid #fee2e2' : '1px solid var(--border)'
                    },
                    {
                      status: 'ledger',
                      title: 'Total Ledger Mutasi',
                      val: stokHistory.length,
                      unit: 'Log',
                      desc: 'Mutasi stok terverifikasi sistem',
                      icon: <Activity color="#3b82f6" />,
                      color: '#3b82f6',
                      bgDefault: 'var(--bg)'
                    }
                  ].map((card, idx) => {
                    const isActive = stokFilter === card.status;
                    return (
                      <div
                        key={idx}
                        className="card dashboard-card-vibrant"
                        style={{
                          padding: '1.25rem',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          background: isActive ? 'white' : card.bgDefault,
                          border: isActive ? `3px solid ${card.color}` : (card.borderDefault || '1.5px solid transparent'),
                          boxShadow: isActive ? `0 10px 25px ${card.color}25` : 'none',
                          transform: isActive ? 'scale(1.02)' : 'none',
                          transition: 'all 0.25s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                        onClick={() => {
                          if (stokFilter === card.status) {
                            setStokFilter(null);
                          } else {
                            setStokFilter(card.status);
                            if (card.status === 'ledger') {
                              const ledgerEl = document.getElementById('ledger-section');
                              if (ledgerEl) {
                                ledgerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }
                          }
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ background: `${card.color}15`, padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {card.icon}
                          </div>
                          {isActive && (
                            <span style={{ fontSize: '0.65rem', color: card.color, background: `${card.color}15`, padding: '2px 8px', borderRadius: '12px', fontWeight: '900' }}>
                              Fokus Aktif
                            </span>
                          )}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                            {card.title}
                          </p>
                          <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: isActive ? card.color : 'var(--text-main)' }}>
                            {card.val} <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>{card.unit}</span>
                          </h3>
                          <p style={{ fontSize: '0.75rem', color: (card.status === 'kritis' && stokData.some(s => s.jumlah <= 0 || s.jumlah < 5)) ? '#b91c1c' : 'var(--text-muted)', fontWeight: '600', marginTop: '4px' }}>
                            {card.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

               {/* Stock & Replenishment Form Section */}
               <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
                 <div>
                   <h3 style={{ fontWeight: '950', marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <Package size={20} color="var(--primary)" />
                     Stok Terkini
                   </h3>
                   <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '450px', overflowY: 'auto', paddingRight: '10px' }}>
                     {(() => {
                       const displayedStok = stokData.filter(s => {
                         if (stokFilter === 'kritis') {
                           return s.jumlah <= 0 || s.jumlah < 5;
                         }
                         return true;
                       });
                       
                       if (displayedStok.length === 0) {
                         return (
                           <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                             <Archive size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                             <p style={{ color: 'var(--text-muted)', fontWeight: '700' }}>
                               {stokFilter === 'kritis' ? 'Tidak ada bahan dalam kondisi kritis.' : 'Stok kosong.'}
                             </p>
                           </div>
                         );
                       }
                       
                       return displayedStok.map((s, i) => {
                         const isCritical = s.jumlah <= 0 || s.jumlah < 5;
                         return (
                           <div key={i} style={{ 
                             padding: '1.25rem', 
                             background: isCritical ? '#fffcfc' : 'var(--bg)', 
                             borderRadius: '12px', 
                             display: 'flex', 
                             justifyContent: 'space-between', 
                             alignItems: 'center', 
                             border: isCritical ? '1.5px solid #fca5a5' : '1px solid var(--border)',
                             boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
                           }}>
                             <div>
                               <h4 style={{ fontWeight: '900', fontSize: '1.05rem', color: isCritical ? '#991b1b' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 {s.nama_bahan}
                                 {isCritical && <span style={{ fontSize: '0.65rem', background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontWeight: '800' }}>KRITIS</span>}
                               </h4>
                               <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>Update: {new Date(s.last_updated).toLocaleString('id-ID')}</p>
                             </div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                               <input 
                                 type="number" 
                                 step="any"
                                 defaultValue={s.jumlah}
                                 onBlur={(e) => handleUpdateStok(s.id_stok, e.target.value)}
                                 style={{ width: '80px', padding: '10px', borderRadius: '10px', border: '1.5px solid var(--border)', textAlign: 'center', fontWeight: '800' }}
                               />
                               <span style={{ fontWeight: '800', color: 'var(--text-muted)', minWidth: '30px' }}>{s.satuan}</span>
                               <button onClick={() => handleDeleteStok(s.id_stok)} style={{ background: '#fff5f5', color: '#ff4d4d', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}><Trash2 size={18} /></button>
                             </div>
                           </div>
                         );
                       });
                     })()}
                   </div>
                 </div>
                 
                 {/* Replenishment Form Box */}
                 <div style={{ 
                   background: '#ffffff', 
                   padding: '1.5rem', 
                   borderRadius: '16px', 
                   border: formBahan ? '2px solid var(--primary)' : '1px solid var(--border)', 
                   boxShadow: formBahan ? '0 10px 30px rgba(16,185,129,0.08)' : 'var(--shadow)',
                   position: 'relative'
                 }}>
                   {formBahan && (
                     <span className="badge animate-pulse-glow" style={{ 
                       position: 'absolute', 
                       top: '-12px', 
                       right: '20px', 
                       background: 'var(--primary)', 
                       color: 'white', 
                       fontWeight: '900',
                       fontSize: '0.65rem',
                       padding: '4px 12px',
                       borderRadius: '20px'
                     }}>
                       📍 QUICK ACTION REPLENISHMENT
                     </span>
                   )}
                   <h4 style={{ fontWeight: '950', marginBottom: '1rem', fontSize: '1.1rem' }}>Tambah Item Baru</h4>
                   <form onSubmit={handleAddStok} style={{ display: 'grid', gap: '1rem' }}>
                      <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '5px' }}>NAMA BAHAN BAKU</label>
                        <input 
                          required 
                          name="nama_bahan" 
                          value={formBahan}
                          onChange={e => handleBahanChange(e.target.value)}
                          onFocus={() => setShowSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                          placeholder="Nama Bahan (Cth: Beras)" 
                          style={{ 
                            width: '100%',
                            padding: '1rem', 
                            borderRadius: '12px', 
                            border: formBahan ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                            fontWeight: '700',
                            outline: 'none',
                            background: formBahan ? 'var(--primary-light)' : 'white'
                          }} 
                        />
                        {(() => {
                          const suggestions = formBahan.trim() ? stokData.filter(s => 
                            s.nama_bahan.toLowerCase().includes(formBahan.toLowerCase()) &&
                            s.nama_bahan.toLowerCase() !== formBahan.toLowerCase()
                          ).slice(0, 3) : [];
                          const existingItem = stokData.find(s => s.nama_bahan.toLowerCase() === formBahan.trim().toLowerCase());

                          return (
                            <>
                              {showSuggestions && suggestions.length > 0 && (
                                <div style={{ 
                                  position: 'absolute',
                                  top: '100%',
                                  left: 0,
                                  right: 0,
                                  marginTop: '5px', 
                                  background: '#ffffff', 
                                  border: '1.5px solid var(--border)', 
                                  borderRadius: '12px', 
                                  padding: '8px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '4px',
                                  zIndex: 100,
                                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                }}>
                                  <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', paddingLeft: '8px', marginBottom: '2px' }}>BAHAN SERUPA DITEMUKAN:</p>
                                  {suggestions.map((s, idx) => (
                                    <div 
                                      key={idx} 
                                      onClick={() => {
                                        setFormBahan(s.nama_bahan);
                                        setFormSatuan(s.satuan);
                                      }}
                                      style={{ 
                                        padding: '8px 12px', 
                                        borderRadius: '8px', 
                                        background: 'var(--bg)', 
                                        border: '1px solid #e2e8f0',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                      }}
                                    >
                                      <span style={{ fontWeight: '750', fontSize: '0.85rem' }}>{s.nama_bahan}</span>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '800', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>autofill ({s.satuan})</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {existingItem && (
                                <div style={{ 
                                  marginTop: '8px', 
                                  background: 'var(--primary-light)', 
                                  border: '1.5px solid var(--primary)', 
                                  borderRadius: '10px', 
                                  padding: '8px 12px',
                                  fontSize: '0.75rem',
                                  fontWeight: '750',
                                  color: 'var(--primary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}>
                                  <CheckCircle2 size={16} /> Bahan ini sudah terdaftar. Input baru akan ditambahkan ke stok {existingItem.nama_bahan} saat ini.
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '5px' }}>KUANTITAS</label>
                          <input required type="number" step="0.01" name="jumlah" placeholder="0.00" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1.5px solid var(--border)', fontWeight: '700' }} />
                        </div>
                        <div style={{ width: '120px' }}>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '5px' }}>SATUAN</label>
                          <select 
                            value={formSatuan} 
                            onChange={e => setFormSatuan(e.target.value)}
                            style={{ 
                              width: '100%', 
                              padding: '1rem', 
                              borderRadius: '12px', 
                              border: '1.5px solid var(--border)', 
                              fontWeight: '750',
                              background: 'white',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="kg">kg (Kilo)</option>
                            <option value="liter">liter (Ltr)</option>
                            <option value="pcs">pcs (Biji)</option>
                            <option value="pack">pack (Bks)</option>
                            <option value="butir">butir</option>
                            <option value="ikat">ikat</option>
                            <option value="gram">gram</option>
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="btn-primary" style={{ padding: '1.2rem', borderRadius: '24px', border: 'none', color: 'white', fontWeight: '900', marginTop: '10px', cursor: 'pointer' }}>Tambahkan Item</button>
                    </form>
                 </div>
               </div>

               {/* Digital Banking Statement Ledger */}
               <div id="ledger-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                 <h3 style={{ fontWeight: '950', marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <Activity size={20} color="#3b82f6" />
                   Riwayat Transaksi Stok (Ledger)
                 </h3>
                 <div style={{ 
                   background: 'white', 
                   border: stokFilter === 'ledger' ? '3px solid #3b82f6' : '1px solid var(--border)', 
                   borderRadius: '16px', 
                   overflow: 'hidden', 
                   boxShadow: stokFilter === 'ledger' ? '0 10px 30px rgba(59, 130, 246, 0.15)' : '0 4px 20px rgba(0,0,0,0.02)',
                   transition: 'all 0.3s ease'
                 }}>
                   <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                     <thead>
                       <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                         <th style={{ padding: '1.25rem' }}>TANGGAL & WAKTU</th>
                         <th style={{ padding: '1.25rem' }}>BAHAN BAKU</th>
                         <th style={{ padding: '1.25rem' }}>TIPE MUTASI</th>
                         <th style={{ padding: '1.25rem', textAlign: 'right' }}>JUMLAH</th>
                         <th style={{ padding: '1.25rem' }}>TRANSAKSI / KETERANGAN</th>
                         <th style={{ padding: '1.25rem', textAlign: 'center' }}>MUTASI LOG</th>
                       </tr>
                     </thead>
                     <tbody>
                       {stokHistory.map((h, idx) => {
                         const isCredit = h.tipe === 'CREDIT'
                         const isDebit = h.tipe === 'DEBIT'
                         return (
                           <tr key={idx} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                             <td style={{ padding: '1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                               {new Date(h.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                             </td>
                             <td style={{ padding: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                               {h.nama_bahan}
                             </td>
                             <td style={{ padding: '1.25rem' }}>
                               <span className="badge" style={{ 
                                 background: h.tipe === 'CREDIT' ? '#dcfce7' : h.tipe === 'DEBIT' ? '#fee2e2' : '#f1f5f9',
                                 color: h.tipe === 'CREDIT' ? '#15803d' : h.tipe === 'DEBIT' ? '#b91c1c' : '#475569',
                                 fontWeight: '900',
                                 fontSize: '0.7rem'
                               }}>
                                 {h.tipe}
                               </span>
                             </td>
                             <td style={{ 
                               padding: '1.25rem', 
                               textAlign: 'right', 
                               fontWeight: '900', 
                               color: h.tipe === 'CREDIT' ? '#16a34a' : h.tipe === 'DEBIT' ? '#dc2626' : 'var(--text-main)' 
                             }}>
                               {h.tipe === 'CREDIT' ? '+' : h.tipe === 'DEBIT' ? '-' : ''} {parseFloat(h.jumlah)} {h.satuan}
                             </td>
                             <td style={{ padding: '1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                               {h.keterangan}
                             </td>
                             <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                               <span style={{ 
                                 fontSize: '0.65rem', 
                                 background: 'var(--primary-light)', 
                                 color: 'var(--primary)', 
                                 fontWeight: '800', 
                                 padding: '4px 10px', 
                                 borderRadius: '24px', 
                                 fontFamily: 'monospace' 
                               }}>
                                 #LEDGER-{h.id_log}
                               </span>
                             </td>
                           </tr>
                         )
                       })}
                       {stokHistory.length === 0 && (
                         <tr>
                           <td colSpan="6" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700' }}>
                             Belum ada mutasi transaksi stok tercatat.
                           </td>
                         </tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>

             </div>
           ) : (
             <div style={{ textAlign: 'center', padding: '3rem 1.5rem', opacity: 0.5 }}>
               <Archive size={64} style={{ marginBottom: '1rem' }} />
               <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>Pilih dapur terlebih dahulu untuk melihat stok.</p>
             </div>
           )}
        </div>
      </div>
    )

    if (isMenu) return (
      <div className="grid" style={{ gap: '1.5rem' }}>
        <Header title="Katalog Menu Gizi" />
        <AnimatePresence>
          {showMenuForm && (
            <AddMenuForm
              isOpen={true}
              onClose={() => { setShowMenuForm(false); setEditingMenu(null); }}
              onSave={handleAddMenu}
              editData={editingMenu}
              nutritionItems={nutritionItems}
              onRequestIngredient={handleRequestIngredient}
            />
          )}
        </AnimatePresence>

        {/* 1. Ajukan Menu Baru (Full Width CTA Banner) */}
        <div style={{ 
          padding: '2rem 2.5rem', 
          borderRadius: '20px', 
          background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', 
          color: 'white', 
          boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.4)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid rgba(255,255,255,0.2)',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          {/* Background Decorative Element */}
          <div style={{ position: 'absolute', top: '-60px', right: '5%', opacity: 0.08, transform: 'rotate(15deg)' }}>
             <UtensilsCrossed size={300} />
          </div>
          
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
            <h3 style={{ fontWeight: '950', fontSize: '2.2rem', marginBottom: '0.8rem', letterSpacing: '-0.5px', color: 'white' }}>Ajukan Menu Baru</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', opacity: 0.9, margin: 0, color: 'white' }}>
              Wujudkan standar gizi nasional. Ajukan komposisi menu Anda untuk divalidasi oleh Ahli Gizi Pemerintah.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMenuForm(true)}
              style={{ 
                background: 'white', 
                color: '#064e3b', 
                border: 'none', 
                padding: '1.2rem 2.5rem', 
                borderRadius: '16px', 
                fontWeight: '950', 
                fontSize: '1.1rem', 
                cursor: 'pointer',
                boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Plus size={24} color="#10b981" /> Input Menu Sekarang
            </motion.button>
          </div>
        </div>

        {/* 2. Grid Status (Pending & Revisi) */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          
          {/* Pending Section */}
          <div className="card dashboard-card-vibrant" style={{ padding: '1.5rem', borderRadius: '16px', background: 'white' }}>
            <h3 style={{ fontWeight: '950', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.3rem' }}>
              <div style={{ background: 'var(--banana-light)', padding: '10px', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                <Clock color="var(--banana)" size={22} />
              </div>
              Menunggu Validasi
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {menus.filter(m => m.status_validasi === 'pending').map((m, i) => (
                <div key={i} className="card" style={{ padding: '1.5rem', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#f8fafc' }}>
                   <div className="flex justify-between" style={{ marginBottom: '12px', alignItems: 'flex-start' }}>
                      <h4 style={{ fontWeight: '950', fontSize: '1.15rem', color: 'var(--text-main)' }}>{m.nama_menu}</h4>
                      <span className="badge" style={{ background: 'var(--banana-light)', color: 'var(--banana)', fontWeight: '900', padding: '6px 12px', borderRadius: '8px' }}>PENDING</span>
                   </div>
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
                      {m.bahan.slice(0, 4).map((b, bi) => <span key={bi} style={{ fontSize: '0.75rem', background: 'white', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '24px', fontWeight: '800', color: '#64748b' }}>{b.nama}</span>)}
                      {m.bahan.length > 4 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', padding: '6px' }}>+{m.bahan.length - 4} lainnya</span>}
                   </div>
                   <div className="flex justify-end" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                      <button 
                        onClick={() => { setEditingMenu(m); setShowMenuForm(true); }}
                        style={{ color: 'var(--primary)', background: 'var(--primary-light)', padding: '8px 16px', borderRadius: '10px', border: 'none', fontWeight: '900', cursor: 'pointer', transition: '0.2s' }}
                        onMouseOver={(e)=>e.currentTarget.style.filter='brightness(0.95)'} onMouseOut={(e)=>e.currentTarget.style.filter='none'}
                      >
                        Edit Resep
                      </button>
                   </div>
                </div>
              ))}
              {menus.filter(m => m.status_validasi === 'pending').length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <CheckCircle color="#94a3b8" size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                  <p style={{ color: '#64748b', fontWeight: '700' }}>Antrian bersih, tidak ada menu pending.</p>
                </div>
              )}
            </div>
          </div>

          {/* Revisi Section */}
          <div className="card dashboard-card-vibrant" style={{ padding: '1.5rem', borderRadius: '16px', background: 'white', border: '2px solid #fee2e2' }}>
            <h3 style={{ fontWeight: '950', marginBottom: '1.5rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.3rem' }}>
              <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                <AlertCircle color="#dc2626" size={22} />
              </div>
              Butuh Revisi
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {menus.filter(m => m.status_validasi === 'rejected').map((m, i) => (
                <motion.div 
                  whileHover={{ scale: 1.01, translateY: -2 }}
                  key={i} 
                  className="card" 
                  style={{ padding: '1.5rem', borderRadius: '12px', border: '1.5px solid #fecaca', background: '#fffafa', cursor: 'pointer', boxShadow: '0 4px 6px rgba(220, 38, 38, 0.05)' }}
                  onClick={() => setSelectedAuditMenu(m)}
                >
                   <div className="flex justify-between" style={{ marginBottom: '8px', alignItems: 'flex-start' }}>
                      <h4 style={{ fontWeight: '950', fontSize: '1.15rem', color: '#991b1b' }}>{m.nama_menu}</h4>
                      <span className="badge" style={{ background: '#fee2e2', color: '#dc2626', fontWeight: '900', padding: '6px 12px', borderRadius: '8px', border: '1px solid #fca5a5' }}>REVISI</span>
                   </div>
                   <p style={{ fontSize: '0.9rem', color: '#7f1d1d', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                     <Search size={14} /> Klik untuk melihat catatan audit Ahli Gizi
                   </p>
                   <div className="flex justify-between" style={{ borderTop: '1px solid #fecaca', paddingTop: '1rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#b91c1c', fontWeight: '800' }}>Terdeteksi: {m.date}</span>
                      <button 
                        style={{ color: '#dc2626', background: 'none', border: 'none', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        Lihat Laporan <ChevronRight size={16} />
                      </button>
                   </div>
                </motion.div>
              ))}
              {menus.filter(m => m.status_validasi === 'rejected').length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <CheckCircle2 color="#10b981" size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                  <p style={{ color: '#64748b', fontWeight: '700' }}>Hebat! Tidak ada menu yang butuh revisi saat ini.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    )

    if (isProduksi) {
      const activeProduksi = produksi.filter(p => p.status !== 'selesai')
      const totalTickets = activeProduksi.length || 1
      const prepCount = activeProduksi.filter(p => p.status === 'persiapan').length
      
      const prepVal = Math.min(100, Math.round((prepCount / totalTickets) * 100));
      const cookVal = prepCount > 0 ? 50 : 0;
      const packVal = 0;

      return (
        <div className="grid" style={{ gap: '1rem' }}>
          <Header title="Sistem Tiket & Monitoring Produksi" />
          
          {prodError && (
            <div style={{
              background: '#fef2f2',
              border: '2px solid #fecaca',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.05)',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#fee2e2', padding: '10px', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                  <AlertCircle color="#dc2626" size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '950', color: '#991b1b', fontSize: '1.1rem' }}>Kegagalan Alokasi Bahan Baku</h4>
                  <p style={{ color: '#7f1d1d', fontWeight: '700', fontSize: '0.9rem', marginTop: '2px' }}>{prodError.message}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {prodError.bahanName && (
                  <button
                    onClick={() => {
                      localStorage.setItem('selectedDapurForStok', prodError.dapurId)
                      localStorage.setItem('replenishBahan', prodError.bahanName)
                      setSelectedDapurForStok(prodError.dapurId.toString())
                      setProdError(null)
                      navigate('/vendor/stok')
                    }}
                    style={{
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '12px',
                      fontWeight: '950',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(220,38,38,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Plus size={16} /> Tambah Stok {prodError.bahanName}
                  </button>
                )}
                <button
                  onClick={() => setProdError(null)}
                  style={{
                    background: 'white',
                    color: '#64748b',
                    border: '1.5px solid #e2e8f0',
                    padding: '10px 15px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          )}

          <AnimatePresence>
            {showTicketForm && (
              <AddTicketForm 
                onClose={() => setShowTicketForm(false)} 
                onSave={handleCreateProduksiTicket} 
                dapurs={dapurs} 
                menus={menus} 
                sekolah={sekolah} 
              />
            )}
          </AnimatePresence>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
             {[
               { title: 'Persiapan Bahan', val: `${prepVal}%`, count: activeProduksi.filter(x => x.status === 'persiapan' || x.status === 'pending').length, status: 'persiapan', icon: <Package color="var(--primary)" />, color: 'var(--primary)' },
               { title: 'Proses Pemasakan', val: `${cookVal}%`, count: activeProduksi.filter(x => x.status === 'memasak').length, status: 'memasak', icon: <UtensilsCrossed color="var(--secondary)" />, color: 'var(--secondary)' },
               { title: 'Packaging', val: `${packVal}%`, count: activeProduksi.filter(x => x.status === 'siap_kirim').length, status: 'siap_kirim', icon: <Zap color="var(--banana)" />, color: 'var(--banana)' }
             ].map((p, i) => {
               const isActive = statusFilter === p.status;
               return (
                 <div 
                   key={i} 
                   className="card dashboard-card-vibrant" 
                   style={{ 
                     padding: '1.25rem', 
                     borderRadius: '16px',
                     cursor: 'pointer',
                     border: isActive ? `3px solid ${p.color}` : '1.5px solid transparent',
                     boxShadow: isActive ? `0 10px 25px ${p.color}25` : 'none',
                     transform: isActive ? 'scale(1.02)' : 'none',
                     transition: 'all 0.25s ease',
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'space-between'
                   }}
                   onClick={() => {
                     if (statusFilter === p.status) {
                       setStatusFilter(null);
                     } else {
                       setStatusFilter(p.status);
                     }
                   }}
                 >
                   <div>
                     <div className="flex justify-between" style={{ marginBottom: '1.2rem', alignItems: 'center' }}>
                       <div style={{ background: `${p.color}15`, padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         {p.icon}
                       </div>
                       <span style={{ fontWeight: '950', color: p.color, fontSize: '1.2rem' }}>{p.val}</span>
                     </div>
                     <h4 style={{ fontWeight: '900', marginBottom: '12px' }}>{p.title}</h4>
                     <div style={{ height: '8px', background: 'var(--bg)', borderRadius: '10px', overflow: 'hidden' }}>
                       <div style={{ width: p.val, height: '100%', background: p.color, transition: 'width 1s ease-in-out' }} />
                     </div>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', alignItems: 'center' }}>
                     <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800' }}>
                       {p.count} Tiket Aktif
                     </span>
                     {isActive && (
                       <span style={{ fontSize: '0.7rem', color: p.color, background: `${p.color}15`, padding: '2px 8px', borderRadius: '12px', fontWeight: '900' }}>
                         Fokus Aktif
                       </span>
                     )}
                   </div>
                 </div>
               );
             })}
          </div>
          <div className="card dashboard-card-vibrant" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <div className="flex justify-between" style={{ marginBottom: '1rem', alignItems: 'center' }}>
              <h3 style={{ fontWeight: '950' }}>Tiket Antrian Produksi Teraktif</h3>
              <button 
                onClick={() => setShowTicketForm(true)}
                className="btn-primary" 
                style={{ padding: '0.8rem 1.5rem', borderRadius: '24px', border: 'none', color: 'white', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} /> Buat Tiket Produksi Baru
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.8rem' }}>
               <thead>
                 <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '900' }}>
                   <th>TICKET ID</th>
                   <th>MENU & PORSI</th>
                   <th>DAPUR & TARGET</th>
                   <th>STATUS</th>
                   <th>AKSI (TICKET STAGE)</th>
                 </tr>
               </thead>
               <tbody>
                  {produksi
                    .filter(p => {
                      if (!statusFilter) return true;
                      if (statusFilter === 'persiapan') {
                        return p.status === 'persiapan' || p.status === 'pending';
                      }
                      return p.status === statusFilter;
                    })
                    .map((p, i) => (
                   <tr key={i} style={{ background: 'var(--bg)', opacity: p.status === 'selesai' ? 0.6 : 1 }}>
                     <td style={{ padding: '1.5rem', fontWeight: '900', borderRadius: '15px 0 0 15px', color: 'var(--primary)' }}>#PRD-{p.id_produksi}</td>
                     <td style={{ padding: '1.5rem' }}>
                       <p style={{ fontWeight: '900', margin: 0 }}>{p.nama_menu}</p>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', margin: 0 }}>{p.jumlah_porsi} Porsi</p>
                     </td>
                     <td style={{ padding: '1.5rem' }}>
                       <p style={{ fontWeight: '800', margin: 0, fontSize: '0.9rem' }}>{p.dapur_lokasi}</p>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', margin: 0 }}>➡ {p.target_sekolah || 'Tidak ditentukan'}</p>
                     </td>
                     <td style={{ padding: '1.5rem' }}>
                       {p.status === 'pending' && <span className="badge" style={{ background: 'var(--banana-light)', color: 'var(--banana)', fontWeight: '900' }}>PENDING</span>}
                       {p.status === 'persiapan' && <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '900' }}>PROSES MASAK</span>}
                       {p.status === 'selesai' && <span className="badge" style={{ background: '#e2e8f0', color: '#64748b', fontWeight: '900' }}>SELESAI KELUAR</span>}
                     </td>
                     <td style={{ padding: '1.5rem', borderRadius: '0 15px 15px 0' }}>
                       {p.status === 'pending' && (
                         <button 
                           onClick={() => handleUpdateProduksiStatus(p.id_produksi, 'persiapan')}
                           style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '24px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16,185,129,0.2)' }}
                         >
                           Mulai Proses (Potong Stok)
                         </button>
                       )}
                       {p.status === 'persiapan' && (
                         <button 
                           onClick={() => handleUpdateProduksiStatus(p.id_produksi, 'selesai')}
                           style={{ background: 'var(--banana)', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '24px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 10px rgba(245,158,11,0.2)' }}
                         >
                           Selesai & Serahkan Kurir
                         </button>
                       )}
                     </td>
                   </tr>
                 ))}
                 {produksi.length === 0 && (
                   <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700' }}>Belum ada tiket produksi.</td></tr>
                 )}
               </tbody>
            </table>
          </div>
        </div>
      )
    }

    if (isDistribusi) return (
      <div className="grid" style={{ gap: '1rem' }}>
        <Header title="Logistik & Pelacakan Armada" />
        
        {/* Hub Command Control */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.7)', padding: '12px 30px', borderRadius: '24px', border: '1px solid white', backdropFilter: 'blur(10px)', marginBottom: '-12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
           <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
             <MapPin color="var(--primary)" size={18} />
             <span style={{ fontWeight: '950', fontSize: '0.85rem', color: 'var(--text-muted)' }}>QUICK JUMP:</span>
             <div style={{ display: 'flex', gap: '8px' }}>
               {['Jakarta', 'Kendari', 'Makassar', 'Surabaya'].map(city => (
                 <button 
                   key={city}
                   onClick={() => setActiveHub({ name: city, url: `https://maps.google.com/maps?q=${city}&output=embed` })}
                   style={{
                     padding: '8px 18px',
                     borderRadius: '24px',
                     border: activeHub.name === city ? 'none' : '1px solid var(--border)',
                     background: activeHub.name === city ? 'var(--primary)' : 'white',
                     color: activeHub.name === city ? 'white' : 'var(--text-main)',
                     fontWeight: '800',
                     fontSize: '0.75rem',
                     cursor: 'pointer',
                     transition: '0.3s'
                   }}
                 >{city}</button>
               ))}
             </div>
           </div>
           
           <div style={{ position: 'relative' }}>
             <Search size={16} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
             <input 
               type="text" 
               placeholder="Ketik lokasi tujuan lainnya..." 
               onKeyDown={(e) => {
                 if (e.key === 'Enter' && e.target.value) {
                   const val = e.target.value;
                   setActiveHub({ name: val, url: `https://maps.google.com/maps?q=${val}&output=embed` });
                   e.target.value = '';
                 }
               }}
               style={{
                 padding: '10px 20px 10px 40px',
                 borderRadius: '12px',
                 border: '1px solid var(--border)',
                 background: 'white',
                 fontWeight: '800',
                 fontSize: '0.8rem',
                 width: '240px',
                 outline: 'none',
                 boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
               }}
             />
           </div>
        </div>

        <div className="card dashboard-card-vibrant" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden', height: '450px', background: '#e5e7eb', border: 'none', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
           <iframe 
             key={activeHub.url}
             title="Distribution Map"
             src={activeHub.url} 
             width="100%" 
             height="100%" 
             style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1) brightness(1.05)' }} 
             allowFullScreen="" 
             loading="lazy"
           ></iframe>

           <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle at center, transparent 40%, rgba(6, 78, 59, 0.05) 100%)' }}></div>
           
           {distribusi.filter(d => d.status !== 'TIBA').map((d, i) => (
             <motion.div 
               key={i}
               initial={{ x: 100 + (i * 50), y: 150 + (i * 30) }}
               animate={{ 
                 x: [100 + (i * 50), 120 + (i * 50), 110 + (i * 50), 130 + (i * 50)],
                 y: [150 + (i * 30), 140 + (i * 30), 160 + (i * 30), 150 + (i * 30)] 
               }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               style={{ position: 'absolute', top: 0, left: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
             >
                <div style={{ background: 'var(--primary)', color: 'white', padding: '6px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '900', marginBottom: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', border: '2px solid white' }}>
                  {d.kode_transaksi}
                </div>
                <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 15px var(--primary)' }}></div>
                <div style={{ width: '30px', height: '30px', position: 'absolute', background: 'var(--primary)', opacity: 0.2, borderRadius: '50%', animation: 'pulse 2s infinite', top: '21px' }}></div>
             </motion.div>
           ))}

           <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(255,255,255,0.95)', border: '1px solid var(--border)', padding: '15px 25px', borderRadius: '8px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '100%', background: 'var(--primary)', borderRadius: '10px' }}></div>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: '950', color: 'var(--text-main)' }}>Peta Distribusi {activeHub.name}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>GPS Status: <span style={{ color: 'var(--primary)' }}>● ONLINE</span></p>
                </div>
              </div>
           </div>
        </div>
        
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {distribusi.length === 0 ? (
            <div className="card dashboard-card-vibrant" style={{ padding: '1.5rem', gridColumn: 'span 2', textAlign: 'center' }}>
              <p style={{ fontWeight: '800', color: 'var(--text-muted)' }}>Belum ada data distribusi atau pengiriman armada.</p>
            </div>
          ) : (
            distribusi.map((d, i) => {
              const isScheduled = d.status === 'DIJADWALKAN';
              const isDelivered = d.status === 'TIBA';
              return (
                <div key={i} className="card dashboard-card-vibrant" style={{ padding: '1.5rem', borderRadius: '16px', opacity: isDelivered ? 0.7 : 1 }}>
                   <div className="flex justify-between" style={{ marginBottom: '1.5rem' }}>
                     <p style={{ fontWeight: '950', color: 'var(--primary)', fontSize: '0.9rem' }}>TX KODE: {d.kode_transaksi}</p>
                     <span className="badge" style={{ 
                       background: isScheduled ? 'var(--banana-light)' : (isDelivered ? '#e2e8f0' : 'var(--primary-light)'), 
                       color: isScheduled ? 'var(--banana)' : (isDelivered ? '#64748b' : 'var(--primary)'), 
                       fontWeight: '900' 
                     }}>
                       {d.status}
                     </span>
                   </div>
                   <h4 style={{ fontSize: '1.4rem', fontWeight: '950', marginBottom: '8px' }}>{d.nama_sekolah}</h4>
                   <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: '600' }}>
                     Menu: {d.nama_menu} ({d.jumlah_porsi} Porsi)
                   </p>
                   <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                     <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '15px', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800' }}>WAKTU KIRIM</p>
                        <p style={{ fontWeight: '950', fontSize: '1.1rem' }}>{d.waktu_kirim ? new Date(d.waktu_kirim).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</p>
                     </div>
                     <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '15px', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800' }}>LEDGER HASH</p>
                        <p style={{ fontWeight: '950', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.blockchain_hash ? d.blockchain_hash.substring(0, 10) + '...' : 'PENDING'}</p>
                     </div>
                   </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    )
    
    return (
      <div style={{ textAlign: 'center', padding: '5rem', display: 'grid', placeItems: 'center', flex: 1 }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <ShieldCheck size={80} color="var(--border)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: '950', color: 'var(--text-muted)', letterSpacing: '-1px' }}>Silakan Pilih Menu di Sidebar</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: '600', marginTop: '10px' }}>Pilih kategori untuk memantau data operasional Anda</p>
        </motion.div>
      </div>
    )
  }

  return (
    <DashboardLayout user={user} onLogout={onLogout} onSwitchRole={onSwitchRole}>
      {isMain ? (
        <>
          <WelcomeBanner name="Vendor Jakarta Timur" />

          <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: '1rem', marginBottom: '1rem' }}>
            {stats.map((stat, i) => (
              <div
                key={i}
                className="card dashboard-card-vibrant"
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  display: "flex",
                  flexDirection: 'column',
                  gap: "16px",
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ background: `${stat.color}15`, padding: "1rem", borderRadius: "14px", color: stat.color, width: 'fit-content' }}>
                  {stat.icon}
                </div>
                <div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "700", marginBottom: "4px", textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.title}</p>
                  <h3 style={{ fontSize: "2rem", fontWeight: "900", color: 'var(--text-main)', letterSpacing: '-1px' }}>{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="card dashboard-card-vibrant" style={{
            padding: '1rem',
            borderRadius: '8px',
          }}>
            <div className="flex justify-between" style={{ marginBottom: "1.5rem" }}>
              <div className="flex" style={{ gap: "15px" }}>
                <div style={{ width: '44px', height: '44px', background: 'var(--role-light)', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                  <Activity color="var(--role-primary)" size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "800", letterSpacing: '-0.5px' }}>Feed Logistik Terkini</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Pemantauan distribusi armada gizi</p>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(distribusi.length > 0 ? distribusi.slice(0, 3) : prodList).map((item, i) => {
                const schoolName = item.nama_sekolah || item.school;
                const menuName = item.nama_menu || item.menuName;
                const statusName = item.status;
                const allPending = menus.every(m => m.status_validasi === 'pending');
                const displayStatus = allPending ? "MENUNGGU VALIDASI" : statusName;
                
                return (
                  <div
                    key={i}
                    style={{
                      padding: "1.25rem",
                      borderRadius: "14px",
                      border: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: 'var(--bg)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div className="flex" style={{ gap: "15px" }}>
                      <div style={{ background: 'white', width: "44px", height: "44px", borderRadius: "12px", display: "grid", placeItems: "center", color: "var(--role-primary)" }}>
                        <Truck size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "2px" }}>{schoolName}</h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "500" }}>{menuName}</p>
                      </div>
                    </div>
                    <span className="badge" style={{
                      background: displayStatus === "SELESAI" || displayStatus === "TIBA" ? "var(--role-primary)" : displayStatus === "MENUNGGU VALIDASI" ? "var(--banana)" : "var(--role-primary)",
                      color: 'white',
                      padding: "6px 14px",
                      borderRadius: '24px',
                      fontWeight: "700",
                      fontSize: "0.7rem"
                    }}>
                      {displayStatus}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : renderContent()}

      <AnimatePresence>
        {activeDoc && (
          <PdfModal doc={activeDoc} onClose={() => setActiveDoc(null)} />
        )}
        {selectedAuditMenu && <VisualAuditModal menu={selectedAuditMenu} onClose={() => setSelectedAuditMenu(null)} onRevise={handleReviseMenu} />}
      </AnimatePresence>
    </DashboardLayout>
  )
}

export default VendorDashboard
