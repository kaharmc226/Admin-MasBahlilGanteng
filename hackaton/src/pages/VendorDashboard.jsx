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

const Header = ({ title }) => (
  <div className="card dashboard-card-vibrant" style={{ 
    marginBottom: "3.5rem", 
    padding: '1.5rem 2.5rem',
    borderRadius: '35px',
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
      borderRadius: '20px', 
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
      padding: '3rem',
      borderRadius: '40px',
      marginBottom: '3rem',
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
    marginTop: '5rem', 
    padding: '2rem 3rem', 
    borderRadius: '35px',
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

const PdfModal = ({ doc, onClose }) => {
  if (!doc) return null;

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

const VisualAuditModal = ({ menu, onClose }) => {
  if (!menu) return null;

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
        padding: '2rem',
        overflowY: 'auto'
      }}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 30 }} 
        animate={{ scale: 1, y: 0 }}
        style={{ 
          background: 'white', 
          borderRadius: '45px', 
          width: '100%', 
          maxWidth: '900px', 
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

        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
           <h2 style={{ fontSize: '2.4rem', fontWeight: '950', color: '#1e293b', marginBottom: '10px', letterSpacing: '-1px' }}>Informasi Nilai Gizi</h2>
           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontWeight: '900', fontSize: '1.4rem', color: '#475569' }}>Menu MBG</span>
              <div style={{ background: '#E11D48', color: 'white', padding: '8px 25px', borderRadius: '12px', fontWeight: '950', fontSize: '1.4rem' }}>Makanan Bergizi Gratis</div>
           </div>
        </div>

        {/* Tray Visual Section */}
        <div style={{ position: 'relative', height: '380px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '3rem' }}>
           {/* Annotations Left */}
           <div style={{ position: 'absolute', left: '0', top: '10%', zIndex: 10 }}>
              {[{n: 'Tahu Goreng', t: '~30 g'}, {n: 'Nasi Putih', t: '~100 g'}, {n: 'Chicken Wings', t: '~48 g'}].map((b, i) => (
                <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'right', marginBottom: '35px', position: 'relative' }}>
                   <p style={{ fontWeight: '950', color: '#dc2626', fontSize: '1.2rem', margin: 0, lineHeight: '1.1' }}>{b.n}</p>
                   <p style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.1rem', margin: 0 }}>{b.t}</p>
                   <div style={{ width: '40px', height: '3px', background: '#334155', position: 'relative', marginTop: '8px', marginLeft: 'auto', opacity: 0.6 }}>
                      <div style={{ position: 'absolute', left: '100%', top: '-5px', borderLeft: '12px solid #334155', borderTop: '6px solid transparent', borderBottom: '6px solid transparent' }}></div>
                   </div>
                </motion.div>
              ))}
           </div>

           {/* Main Tray Image Container */}
           <div style={{ position: 'relative', width: '380px', height: '320px', display: 'grid', placeItems: 'center' }}>
              <div style={{ width: '100%', height: '100%', border: '12px solid #cbd5e1', borderRadius: '45px', background: '#f1f5f9', overflow: 'hidden', boxShadow: '0 40px 80px -15px rgba(0,0,0,0.3)', position: 'relative' }}>
                 <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600" alt="Menu Tray" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
           </div>

           {/* Annotations Right */}
           <div style={{ position: 'absolute', right: '0', top: '15%', zIndex: 10 }}>
              {[{n: 'Pisang', t: '~50 g'}, {n: 'Tumis Buncis+Jagung', t: '~50 g'}].map((b, i) => (
                <motion.div key={i} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: (i+3) * 0.1 }} style={{ textAlign: 'left', marginBottom: '40px' }}>
                   <p style={{ fontWeight: '950', color: '#dc2626', fontSize: '1.2rem', margin: 0, lineHeight: '1.1' }}>{b.n}</p>
                   <p style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.1rem', margin: 0 }}>{b.t}</p>
                   <div style={{ width: '40px', height: '3px', background: '#334155', position: 'relative', marginTop: '8px', opacity: 0.6 }}>
                      <div style={{ position: 'absolute', right: '100%', top: '-5px', borderRight: '12px solid #334155', borderTop: '6px solid transparent', borderBottom: '6px solid transparent' }}></div>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>

        <div style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', marginBottom: '3.5rem', fontWeight: '750', lineHeight: '1.6' }}>
           Menu MBG SD GIT Manumuti, Kabupaten Kupang, NTT<br/>
           <span style={{ fontWeight: '600', opacity: 0.8 }}>Sumber: traksi.go.id • Verifikasi Audit Ahli Gizi</span>
        </div>

        {/* Bottom Grid: Notes & Table Side-by-side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2.5rem', alignItems: 'start' }}>
           {/* Notes Box */}
           <div style={{ border: '3px solid #ef4444', borderRadius: '30px', padding: '2rem', background: '#fffafa', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-15px', left: '25px', background: '#ef4444', color: 'white', padding: '4px 15px', borderRadius: '10px', fontWeight: '950', fontSize: '0.8rem' }}>REKOMENDASI AUDIT</div>
              <p style={{ fontWeight: '950', color: '#ef4444', fontSize: '1.3rem', marginBottom: '15px' }}>*Catatan Ahli Gizi</p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#334155', fontWeight: '800', fontSize: '1rem', lineHeight: '1.8' }}>
                 <li>Kandungan gizi menu ini <span style={{color: '#dc2626'}}>cukup</span> untuk memenuhi makan siang anak, namun porsi <span style={{color: '#dc2626'}}>serat</span> perlu ditambah.</li>
                 <li>Pengolahan disarankan beralih ke <span style={{color: '#dc2626'}}>kukus/tumis</span> untuk mengurangi lemak jenuh.</li>
                 {menu.notes?.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
           </div>

           {/* Nutrition Table Box */}
           <div style={{ border: '3px solid #1e293b', borderRadius: '30px', overflow: 'hidden', background: 'white', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
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

        <div style={{ marginTop: '3.5rem', display: 'flex', gap: '1.5rem' }}>
           <button 
             onClick={onClose}
             style={{ flex: 1, padding: '1.2rem', borderRadius: '50px', border: '2px solid #e2e8f0', background: 'white', fontWeight: '900', color: '#64748b', cursor: 'pointer' }}
           >
             Tutup Laporan
           </button>
           <button 
             onClick={() => { alert("Menuju halaman edit resep..."); onClose(); }}
             style={{ flex: 2, padding: '1.2rem', borderRadius: '50px', border: 'none', background: '#dc2626', fontWeight: '950', color: 'white', cursor: 'pointer', boxShadow: '0 10px 25px rgba(220, 38, 38, 0.2)' }}
           >
             Revisi Sekarang
           </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const AddDapurForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    lokasi: '',
    kapasitas: '',
    alamat: ''
  })

  const handleSubmit = () => {
    if (!formData.lokasi || !formData.kapasitas) {
      alert("Mohon isi nama lokasi dan kapasitas!");
      return;
    }
    
    onSave({
      id: Date.now(),
      lokasi: formData.lokasi,
      kapasitas_produksi: parseInt(formData.kapasitas),
      alamat: formData.alamat
    })
    
    alert("🚀 Data Dapur Berhasil Dikirim ke Badan Gizi Nasional untuk Verifikasi!");
    onClose()
  }

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      style={{ overflow: 'hidden', marginBottom: '2rem' }}
    >
      <div 
        style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', width: '100%', border: '1.5px solid var(--border)' }}
      >
        <div className="flex justify-between" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontWeight: '950', fontSize: '1.8rem' }}>Registrasi Dapur Baru</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
           <div>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>NAMA LOKASI DAPUR</label>
              <input 
                type="text" 
                value={formData.lokasi}
                onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
                placeholder="Contoh: Dapur Jakarta Selatan" 
                style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} 
              />
           </div>
           <div>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>KAPASITAS PRODUKSI (PORSI/HARI)</label>
              <input 
                type="number" 
                value={formData.kapasitas}
                onChange={(e) => setFormData({...formData, kapasitas: e.target.value})}
                placeholder="Contoh: 5000" 
                style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} 
              />
           </div>
           <div>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>ALAMAT LENGKAP UNIT</label>
              <textarea 
                value={formData.alamat}
                onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                placeholder="Masukkan alamat lengkap operasional dapur..." 
                style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700', minHeight: '100px', fontFamily: 'inherit' }} 
              />
           </div>
           <button 
             onClick={handleSubmit}
             className="btn-primary" 
             style={{ width: '100%', padding: '1.2rem', borderRadius: '50px', border: 'none', color: 'white', fontWeight: '900', fontSize: '1.1rem', marginTop: '1rem', cursor: 'pointer' }}
           >
             Daftarkan Dapur Sekarang
           </button>
        </div>
      </div>
    </motion.div>
  )
}

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
}

const AddMenuForm = ({ onClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    nama: editData?.nama_menu || '',
    tanggal: editData?.date || new Date().toISOString().split('T')[0],
    bahan: editData?.bahan.map(b => ({ nama: b.nama, ...parseTakaran(b.takaran) })) || [{ nama: '', berat: '', satuan: 'gram' }]
  })

  const addBahan = () => {
    setFormData({ ...formData, bahan: [...formData.bahan, { nama: '', berat: '', satuan: 'gram' }] })
  }

  const updateBahan = (index, field, value) => {
    const newBahan = [...formData.bahan]
    newBahan[index][field] = value
    setFormData({ ...formData, bahan: newBahan })
  }

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
        return { nama: b.nama, takaran: `~${b.berat} ${displaySatuan}` }
      }),
      nilai_gizi: editData?.nilai_gizi || { energi: '--- kkal', protein: '-- g' },
      status_validasi: editData?.status_validasi || 'pending'
    }

    onSave(newEntry)
    alert(editData ? "✅ Perubahan Menu Berhasil Disimpan!" : "✅ Menu Berhasil Diajukan ke Ahli Gizi untuk Verifikasi!");
    onClose()
  }

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      style={{ overflow: 'hidden', marginBottom: '2rem' }}
    >
      <div 
        style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', width: '100%', border: '1.5px solid var(--border)' }}
      >
        <div className="flex justify-between" style={{ marginBottom: '2.5rem' }}>
          <div>
            <h2 style={{ fontWeight: '950', fontSize: '2rem', marginBottom: '5px' }}>Input Menu Baru</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Silakan masukkan rincian komposisi menu gizi.</p>
          </div>
          <button onClick={onClose} style={{ background: '#f8fafc', border: 'none', cursor: 'pointer', width: '45px', height: '45px', borderRadius: '50%', display: 'grid', placeItems: 'center' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'grid', gap: '2rem' }}>
          <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>NAMA MENU</label>
              <input 
                type="text" 
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                placeholder="Misal: Nasi Ayam Madu Sehat" 
                style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #f1f5f9', fontWeight: '700', fontSize: '1rem' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>TANGGAL PENYAJIAN</label>
              <input 
                type="date" 
                value={formData.tanggal}
                onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #f1f5f9', fontWeight: '700', fontSize: '1rem' }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between" style={{ marginBottom: '1rem', alignItems: 'center' }}>
              <label style={{ fontWeight: '800', fontSize: '0.8rem', color: 'var(--text-muted)' }}>KOMPOSISI BAHAN & BERAT</label>
              <button 
                onClick={addBahan}
                style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', padding: '6px 15px', borderRadius: '50px', fontWeight: '900', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                + Tambah Bahan
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: '10px', maxHieght: '300px', overflowY: 'auto', paddingRight: '5px' }}>
              {formData.bahan.map((b, i) => (
                <div key={i} className="flex gap-2" style={{ gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Nama Bahan (Nasi, Ayam, dll)"
                    value={b.nama}
                    onChange={(e) => updateBahan(i, 'nama', e.target.value)}
                    style={{ flex: 2, padding: '1rem', borderRadius: '12px', border: '2px solid #f8fafc', background: '#f8fafc', fontWeight: '700' }}
                  />
                  <input 
                    type="number" 
                    step="any"
                    placeholder="Jumlah"
                    value={b.berat}
                    onChange={(e) => updateBahan(i, 'berat', e.target.value)}
                    style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '2px solid #f8fafc', background: '#f8fafc', fontWeight: '700' }}
                  />
                  <select 
                    value={b.satuan}
                    onChange={(e) => updateBahan(i, 'satuan', e.target.value)}
                    style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '2px solid #f8fafc', background: '#f8fafc', fontWeight: '700', cursor: 'pointer' }}
                  >
                    <option value="gram">Gram (g)</option>
                    <option value="kilogram">Kilogram (kg)</option>
                    <option value="ml">Mililiter (ml)</option>
                    <option value="liter">Liter (L)</option>
                    <option value="pcs">Pcs / Buah</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            className="btn-primary" 
            style={{ width: '100%', padding: '1.4rem', borderRadius: '50px', border: 'none', color: 'white', fontWeight: '900', fontSize: '1.1rem', marginTop: '1rem', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            Selesaikan & Ajukan ke Ahli Gizi
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const AddTicketForm = ({ onClose, onSave, dapurs, menus, sekolah }) => {
  const validMenus = menus.filter(m => m.status_validasi !== 'pending')
  const [formData, setFormData] = useState({
    id_dapur: dapurs[0]?.id_dapur || dapurs[0]?.id || '',
    id_menu: validMenus[0]?.id_menu || '',
    id_sekolah: sekolah[0]?.id_sekolah || '',
    jumlah_porsi: ''
  })

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
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', width: '500px', maxWidth: '90%' }}>
        <div className="flex justify-between" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: '950', fontSize: '1.5rem' }}>Buat Tiket Produksi Baru</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        
        <div style={{ display: 'grid', gap: '1.2rem' }}>
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
              {sekolah.map(s => <option key={s.id_sekolah} value={s.id_sekolah}>{s.nama_sekolah}</option>)}
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

        <button 
          onClick={handleSubmit}
          className="btn-primary" 
          style={{ width: '100%', padding: '1.2rem', borderRadius: '50px', border: 'none', color: 'white', fontWeight: '900', fontSize: '1.1rem', marginTop: '2rem', cursor: 'pointer' }}
        >
          Terbitkan Tiket
        </button>
      </div>
    </motion.div>
  )
}

const VendorDashboard = ({ user, onLogout }) => {
  const location = useLocation()
  const [showAddForm, setShowAddForm] = useState(false)
  const [showMenuForm, setShowMenuForm] = useState(false)
  const [editingMenu, setEditingMenu] = useState(null)
  const [activeDoc, setActiveDoc] = useState(null)
  const [selectedAuditMenu, setSelectedAuditMenu] = useState(null)
  const [selectedDapurForStok, setSelectedDapurForStok] = useState(null)
  
  // API-driven state
  const [dapurs, setDapurs] = useState([])
  const [menus, setMenus] = useState([])
  const [dokumen, setDokumen] = useState([])
  const [produksi, setProduksi] = useState([])
  const [distribusi, setDistribusi] = useState([])
  const [stokData, setStokData] = useState([])
  const [sekolah, setSekolah] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [d, m, dok, prod, dist, sek] = await Promise.all([
          api.getDapur(),
          api.getMenus(),
          api.getDokumen(1),
          api.getProduksi(),
          api.getDistribusi(),
          api.getSekolah()
        ])
        setDapurs(d)
        setMenus(m)
        setDokumen(dok)
        setProduksi(prod)
        setDistribusi(dist)
        setSekolah(sek)
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedDapurForStok) {
      api.getStok(selectedDapurForStok).then(setStokData).catch(console.error)
    }
  }, [selectedDapurForStok])

  const handleAddDapur = async (newDapur) => {
    try {
      const created = await api.createDapur({ id_vendor: 1, lokasi: newDapur.lokasi, kapasitas_produksi: newDapur.kapasitas_produksi || newDapur.kapasitas_production })
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
      if (editingMenu) {
        await api.updateMenu(newMenu.id || newMenu.id_menu, {
          nama_menu: newMenu.nama_menu,
          bahan: newMenu.bahan,
          nilai_gizi: newMenu.nilai_gizi,
          tanggal: newMenu.date || newMenu.tanggal
        })
      } else {
        await api.createMenu({
          id_vendor: 1,
          nama_menu: newMenu.nama_menu,
          bahan: newMenu.bahan,
          nilai_gizi: newMenu.nilai_gizi || {},
          tanggal: newMenu.date || newMenu.tanggal || new Date().toISOString().split('T')[0]
        })
      }
      // Re-fetch menus directly from DB to sync everything including default DB values
      api.getMenus().then(setMenus).catch(console.error)
      setEditingMenu(null)
    } catch (err) { console.error(err) }
  }

  const handleAddStok = async (e) => {
    e.preventDefault()
    const form = e.target
    const data = {
      id_dapur: selectedDapurForStok,
      nama_bahan: form.nama_bahan.value,
      jumlah: parseFloat(form.jumlah.value),
      satuan: form.satuan.value
    }
    try {
      const created = await api.createStok(data)
      setStokData(prev => [...prev, created])
      form.reset()
    } catch (err) { console.error(err) }
  }

  const handleUpdateStok = async (id_stok, newJumlah) => {
    try {
      await api.updateStok(id_stok, { jumlah: parseFloat(newJumlah) })
      setStokData(prev => prev.map(s => s.id_stok === id_stok ? { ...s, jumlah: parseFloat(newJumlah) } : s))
    } catch (err) { console.error(err) }
  }

  const handleDeleteStok = async (id_stok) => {
    if (confirm("Hapus item stok ini?")) {
      try {
        await api.deleteStok(id_stok)
        setStokData(prev => prev.filter(s => s.id_stok !== id_stok))
      } catch (err) { console.error(err) }
    }
  }

  const [showTicketForm, setShowTicketForm] = useState(false)

  const handleCreateProduksiTicket = async (data) => {
    try {
      await api.createProduksi({ ...data, status: 'pending' })
      api.getProduksi().then(setProduksi).catch(console.error)
      api.getDistribusi().then(setDistribusi).catch(console.error)
    } catch (err) { alert(`❌ Gagal membuat tiket:\n${err.message}`) }
  }

  const handleUpdateProduksiStatus = async (id_produksi, status) => {
    try {
      await api.updateProduksi(id_produksi, { status })
      alert(status === 'persiapan' ? '✅ Status dipindah ke Persiapan. Stok bahan baku telah otomatis dipotong!' : '✅ Status dipindah ke Selesai & Dikirim!')
      api.getProduksi().then(setProduksi).catch(console.error)
      if (status === 'selesai') {
        api.getDistribusi().then(setDistribusi).catch(console.error)
      }
      // Refresh stok silently
      if (selectedDapurForStok) api.getStok(selectedDapurForStok).then(setStokData).catch(console.error)
    } catch (err) {
      alert(`❌ Gagal memproses:\n${err.message}`)
    }
  }

  const path = location.pathname.replace(/\/$/, '')
  const isMain = path === '/vendor'
  const isInformasi = path === '/vendor/informasi'
  const isMenu = path === '/vendor/menu'
  const isProduksi = path === '/vendor/produksi'
  const isDistribusi = path === '/vendor/distribusi'
  const isStok = path === '/vendor/stok'
  
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
      <div className="grid" style={{ gap: '2rem' }}>
        <Header title="Informasi & Dokumen Vendor" />
        
        {/* Section: Daftar Dapur */}
        <AnimatePresence>
          {showAddForm && (
            <AddDapurForm onClose={() => setShowAddForm(false)} onSave={handleAddDapur} />
          )}
        </AnimatePresence>
        <div className="card dashboard-card-vibrant" style={{ padding: '2.5rem', borderRadius: '32px' }}>
          <div className="flex justify-between" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: '950' }}>Daftar Dapur Terdaftar</h3>
            <button 
              onClick={() => setShowAddForm(true)}
              className="btn-primary" 
              style={{ padding: '0.8rem 1.5rem', borderRadius: '50px', border: 'none', color: 'white', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Plus size={18} /> Tambah Dapur
            </button>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {dapurs.map((d, i) => (
              <div key={i} style={{ padding: '1.5rem', background: 'var(--bg)', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
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
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
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
        <div className="card dashboard-card-vibrant" style={{ padding: '2.5rem', borderRadius: '32px' }}>
          <h3 style={{ fontWeight: '950', marginBottom: '2rem' }}>Dokumen & Izin Usaha</h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { title: 'NIB (Nomor Induk Berusaha)', status: 'Verified', date: '12 Jan 2026', icon: <FileText color="var(--primary)" /> },
              { title: 'Sertifikat Halal', status: 'Verified', date: '05 Feb 2026', icon: <ShieldCheck color="var(--secondary)" /> },
              { title: 'Izin Edar P-IRT', status: 'Pending', date: '20 Mar 2026', icon: <Clock color="var(--banana)" /> },
              { title: 'Sertifikat Higiene Sanitasi', status: 'Verified', date: '10 Feb 2026', icon: <ClipboardCheck color="var(--primary)" /> }
            ].map((doc, i) => (
              <div key={i} className="card" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)', background: 'white' }}>
                <div style={{ background: 'var(--bg)', width: '50px', height: '50px', borderRadius: '15px', display: 'grid', placeItems: 'center', marginBottom: '1.5rem' }}>{doc.icon}</div>
                <h4 style={{ fontWeight: '900', marginBottom: '0.5rem' }}>{doc.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Diunggah: {doc.date}</p>
                <div className="flex justify-between" style={{ alignItems: 'center' }}>
                  <span className="badge" style={{ background: doc.status === 'Verified' ? 'var(--primary-light)' : 'var(--banana-light)', color: doc.status === 'Verified' ? 'var(--primary)' : 'var(--banana)', fontWeight: '900' }}>{doc.status}</span>
                  <button 
                    onClick={() => setActiveDoc(doc)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )

    if (isStok) return (
      <div className="grid" style={{ gap: '2rem' }}>
        <Header title="Manajemen Stok & Gudang" />
        <div className="card dashboard-card-vibrant" style={{ padding: '2.5rem', borderRadius: '32px' }}>
           <div style={{ marginBottom: '2rem' }}>
             <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px', color: 'var(--text-muted)' }}>Pilih Dapur Operasional</label>
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
             <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
               <div>
                 <h3 style={{ fontWeight: '950', marginBottom: '1.5rem' }}>Stok Terkini</h3>
                 <div style={{ display: 'grid', gap: '1rem', maxHeight: '550px', overflowY: 'auto', paddingRight: '10px' }}>
                   {stokData.length === 0 ? <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Stok kosong.</p> : stokData.map((s, i) => (
                     <div key={i} style={{ padding: '1.5rem', background: 'var(--bg)', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)' }}>
                       <div>
                         <h4 style={{ fontWeight: '900', fontSize: '1.1rem' }}>{s.nama_bahan}</h4>
                         <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>Update: {new Date(s.last_updated).toLocaleString('id-ID')}</p>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                         <input 
                           type="number" 
                           step="any"
                           defaultValue={s.jumlah}
                           onBlur={(e) => handleUpdateStok(s.id_stok, e.target.value)}
                           style={{ width: '80px', padding: '10px', borderRadius: '10px', border: '1.5px solid var(--border)', textAlign: 'center', fontWeight: '800' }}
                         />
                         <span style={{ fontWeight: '800', color: 'var(--text-muted)' }}>{s.satuan}</span>
                         <button onClick={() => handleDeleteStok(s.id_stok)} style={{ background: '#fff5f5', color: '#ff4d4d', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}><Trash2 size={18} /></button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
               
               <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '24px', border: '1.5px dashed var(--border)', height: 'fit-content', position: 'sticky', top: '2rem' }}>
                 <h4 style={{ fontWeight: '900', marginBottom: '1.5rem' }}>Tambah Item Baru</h4>
                 <form onSubmit={handleAddStok} style={{ display: 'grid', gap: '1rem' }}>
                   <input required name="nama_bahan" placeholder="Nama Bahan (Cth: Beras)" style={{ padding: '1rem', borderRadius: '12px', border: '1.5px solid var(--border)' }} />
                   <div style={{ display: 'flex', gap: '10px' }}>
                     <input required type="number" step="0.1" name="jumlah" placeholder="Kuantitas" style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1.5px solid var(--border)' }} />
                     <input required name="satuan" placeholder="Satuan (kg)" style={{ width: '100px', padding: '1rem', borderRadius: '12px', border: '1.5px solid var(--border)' }} />
                   </div>
                   <button type="submit" className="btn-primary" style={{ padding: '1.2rem', borderRadius: '50px', border: 'none', color: 'white', fontWeight: '900', marginTop: '10px', cursor: 'pointer' }}>Tambahkan Item</button>
                 </form>
               </div>
             </div>
           ) : (
             <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
               <Archive size={64} style={{ marginBottom: '1rem' }} />
               <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>Pilih dapur terlebih dahulu untuk melihat stok.</p>
             </div>
           )}
        </div>
      </div>
    )

    if (isMenu) return (
      <div className="grid" style={{ gap: '2rem' }}>
        <Header title="Katalog Menu Gizi" />
        <AnimatePresence>
          {showMenuForm && (
            <AddMenuForm
              onClose={() => { setShowMenuForm(false); setEditingMenu(null); }}
              onSave={handleAddMenu}
              editData={editingMenu}
            />
          )}
        </AnimatePresence>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card dashboard-card-vibrant" style={{ padding: '2.5rem', borderRadius: '32px' }}>
              <h3 style={{ fontWeight: '950', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Clock color="var(--banana)" /> Menu Menunggu Validasi
              </h3>
              {menus.filter(m => m.status_validasi === 'pending').map((m, i) => (
                <div key={i} className="card" style={{ padding: '1.5rem', borderRadius: '20px', marginBottom: '1rem', border: '1.5px solid var(--border)', background: 'white' }}>
                   <div className="flex justify-between" style={{ marginBottom: '10px' }}>
                      <h4 style={{ fontWeight: '900', fontSize: '1.1rem' }}>{m.nama_menu}</h4>
                      <span className="badge" style={{ background: 'var(--banana-light)', color: 'var(--banana)', fontWeight: '900' }}>PENDING</span>
                   </div>
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
                      {m.bahan.slice(0, 3).map((b, bi) => <span key={bi} style={{ fontSize: '0.7rem', background: 'var(--bg)', padding: '4px 10px', borderRadius: '50px', fontWeight: '700' }}>{b.nama}</span>)}
                      {m.bahan.length > 3 && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{m.bahan.length - 3} lainnya</span>}
                   </div>
                   <div className="flex justify-end" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', fontSize: '0.85rem' }}>
                      <button 
                        onClick={() => { setEditingMenu(m); setShowMenuForm(true); }}
                        style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: '800', cursor: 'pointer' }}
                      >
                        Edit Resep
                      </button>
                   </div>
                </div>
              ))}
              {menus.filter(m => m.status_validasi === 'pending').length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700', padding: '2rem' }}>Antrian bersih.</p>
              )}
            </div>

            <div className="card dashboard-card-vibrant" style={{ padding: '2.5rem', borderRadius: '32px', border: '2px solid #fee2e2' }}>
              <h3 style={{ fontWeight: '950', marginBottom: '2.5rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <AlertCircle color="#dc2626" /> Menu Butuh Revisi
              </h3>
              {menus.filter(m => m.status_validasi === 'rejected').map((m, i) => (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  key={i} 
                  className="card" 
                  style={{ padding: '1.5rem', borderRadius: '20px', marginBottom: '1rem', border: '2px solid #fecaca', background: '#fffafa', cursor: 'pointer' }}
                  onClick={() => setSelectedAuditMenu(m)}
                >
                   <div className="flex justify-between" style={{ marginBottom: '10px' }}>
                      <h4 style={{ fontWeight: '950', fontSize: '1.2rem', color: '#991b1b' }}>{m.nama_menu}</h4>
                      <span className="badge" style={{ background: '#fee2e2', color: '#dc2626', fontWeight: '900', border: '1px solid #fecaca' }}>REVISI</span>
                   </div>
                   <p style={{ fontSize: '0.85rem', color: '#7f1d1d', fontWeight: '700', marginBottom: '1.5rem' }}>Klik untuk melihat catatan audit Ahli Gizi</p>
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
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <CheckCircle2 color="var(--primary)" size={40} style={{ margin: '0 auto 15px', opacity: 0.5 }} />
                  <p style={{ color: 'var(--text-muted)', fontWeight: '700' }}>Tidak ada menu yang butuh revisi saat ini.</p>
                </div>
              )}
            </div>
          </div>
          <div style={{ 
            padding: '3.5rem 3rem', 
            borderRadius: '40px', 
            background: 'linear-gradient(145deg, #10b981 0%, #059669 100%)', 
            color: 'white', 
            boxShadow: '0 30px 60px -15px rgba(16, 185, 129, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Background Decorative Element */}
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', opacity: 0.1, transform: 'rotate(15deg)' }}>
               <UtensilsCrossed size={250} />
            </div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ fontWeight: '950', fontSize: '2rem', marginBottom: '1rem', letterSpacing: '-0.8px', color: 'white' }}>Ajukan Menu Baru</h3>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.6', opacity: 0.95, marginBottom: '3rem', color: 'white' }}>
                Wujudkan standar gizi nasional. Ajukan komposisi menu Anda untuk divalidasi oleh Ahli Gizi Pemerintah.
              </p>
              
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                 <div style={{ 
                   background: 'rgba(255,255,255,0.15)', 
                   backdropFilter: 'blur(10px)',
                   padding: '1.5rem', 
                   borderRadius: '24px',
                   display: 'flex',
                   gap: '15px',
                   alignItems: 'center',
                   border: '1px solid rgba(255,255,255,0.2)'
                 }}>
                    <div style={{ background: 'white', color: '#10b981', width: '45px', height: '45px', borderRadius: '15px', display: 'grid', placeItems: 'center', fontWeight: '950', fontSize: '1.2rem', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>1</div>
                    <div>
                      <p style={{ fontWeight: '900', fontSize: '1rem', color: 'white' }}>Input Bahan Baku</p>
                      <p style={{ fontSize: '0.8rem', opacity: 0.9, color: 'white' }}>Masukkan rincian gramasi setiap komponen menu.</p>
                    </div>
                 </div>
                 
                 <div style={{ 
                   background: 'rgba(255,255,255,0.15)', 
                   backdropFilter: 'blur(10px)',
                   padding: '1.5rem', 
                   borderRadius: '24px',
                   display: 'flex',
                   gap: '15px',
                   alignItems: 'center',
                   border: '1px solid rgba(255,255,255,0.2)'
                 }}>
                    <div style={{ background: 'white', color: '#10b981', width: '45px', height: '45px', borderRadius: '15px', display: 'grid', placeItems: 'center', fontWeight: '950', fontSize: '1.2rem', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>2</div>
                    <div>
                      <p style={{ fontWeight: '900', fontSize: '1rem', color: 'white' }}>Validasi Ahli Gizi</p>
                      <p style={{ fontSize: '0.8rem', opacity: 0.9, color: 'white' }}>Tim ahli melakukan pengecekan standar kecukupan gizi.</p>
                    </div>
                 </div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowMenuForm(true)}
              style={{ 
                background: 'white', 
                color: '#064e3b', 
                border: 'none', 
                padding: '1.5rem', 
                borderRadius: '50px', 
                fontWeight: '950', 
                fontSize: '1.15rem', 
                marginTop: '4rem', 
                cursor: 'pointer',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                position: 'relative',
                zIndex: 1,
                width: '100%'
              }}
            >
                   Mulai Input Menu Sekarang
            </motion.button>
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
        <div className="grid" style={{ gap: '2rem' }}>
          <Header title="Sistem Tiket & Monitoring Produksi" />
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
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
             {[
               { title: 'Persiapan Bahan', val: `${prepVal}%`, icon: <Package color="var(--primary)" />, color: 'var(--primary)' },
               { title: 'Proses Pemasakan', val: `${cookVal}%`, icon: <UtensilsCrossed color="var(--secondary)" />, color: 'var(--secondary)' },
               { title: 'Packaging', val: `${packVal}%`, icon: <Zap color="var(--banana)" />, color: 'var(--banana)' }
             ].map((p, i) => (
               <div key={i} className="card dashboard-card-vibrant" style={{ padding: '2rem', borderRadius: '28px' }}>
                  <div className="flex justify-between" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ background: `${p.color}15`, padding: '12px', borderRadius: '12px' }}>{p.icon}</div>
                    <span style={{ fontWeight: '950', color: p.color, fontSize: '1.2rem' }}>{p.val}</span>
                  </div>
                  <h4 style={{ fontWeight: '900', marginBottom: '15px' }}>{p.title}</h4>
                  <div style={{ height: '8px', background: 'var(--bg)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: p.val, height: '100%', background: p.color, transition: 'width 1s ease-in-out' }} />
                  </div>
               </div>
             ))}
          </div>
          <div className="card dashboard-card-vibrant" style={{ padding: '2.5rem', borderRadius: '32px' }}>
            <div className="flex justify-between" style={{ marginBottom: '2rem', alignItems: 'center' }}>
              <h3 style={{ fontWeight: '950' }}>Tiket Antrian Produksi Teraktif</h3>
              <button 
                onClick={() => setShowTicketForm(true)}
                className="btn-primary" 
                style={{ padding: '0.8rem 1.5rem', borderRadius: '50px', border: 'none', color: 'white', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
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
                 {produksi.map((p, i) => (
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
                           style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '50px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16,185,129,0.2)' }}
                         >
                           Mulai Proses (Potong Stok)
                         </button>
                       )}
                       {p.status === 'persiapan' && (
                         <button 
                           onClick={() => handleUpdateProduksiStatus(p.id_produksi, 'selesai')}
                           style={{ background: 'var(--banana)', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '50px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 10px rgba(245,158,11,0.2)' }}
                         >
                           Selesai & Serahkan Kurir
                         </button>
                       )}
                     </td>
                   </tr>
                 ))}
                 {produksi.length === 0 && (
                   <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700' }}>Belum ada tiket produksi.</td></tr>
                 )}
               </tbody>
            </table>
          </div>
        </div>
      )
    }

    if (isDistribusi) return (
      <div className="grid" style={{ gap: '2rem' }}>
        <Header title="Logistik & Pelacakan Armada" />
        
        {/* Hub Command Control */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.7)', padding: '12px 30px', borderRadius: '50px', border: '1px solid white', backdropFilter: 'blur(10px)', marginBottom: '-12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
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
                     borderRadius: '50px',
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
                 borderRadius: '30px',
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

        <div className="card dashboard-card-vibrant" style={{ padding: '0', borderRadius: '40px', overflow: 'hidden', height: '450px', background: '#e5e7eb', border: 'none', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
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

           <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(255,255,255,0.95)', border: '1px solid var(--border)', padding: '15px 25px', borderRadius: '20px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '100%', background: 'var(--primary)', borderRadius: '10px' }}></div>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: '950', color: 'var(--text-main)' }}>Peta Distribusi {activeHub.name}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>GPS Status: <span style={{ color: 'var(--primary)' }}>● ONLINE</span></p>
                </div>
              </div>
           </div>
        </div>
        
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {distribusi.length === 0 ? (
            <div className="card dashboard-card-vibrant" style={{ padding: '3rem', gridColumn: 'span 2', textAlign: 'center' }}>
              <p style={{ fontWeight: '800', color: 'var(--text-muted)' }}>Belum ada data distribusi atau pengiriman armada.</p>
            </div>
          ) : (
            distribusi.map((d, i) => {
              const isScheduled = d.status === 'DIJADWALKAN';
              const isDelivered = d.status === 'TIBA';
              return (
                <div key={i} className="card dashboard-card-vibrant" style={{ padding: '2.5rem', borderRadius: '32px', opacity: isDelivered ? 0.7 : 1 }}>
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
                   <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: '600' }}>
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
          <ShieldCheck size={80} color="var(--border)" style={{ marginBottom: '2rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: '950', color: 'var(--text-muted)', letterSpacing: '-1px' }}>Silakan Pilih Menu di Sidebar</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: '600', marginTop: '10px' }}>Pilih kategori untuk memantau data operasional Anda</p>
        </motion.div>
      </div>
    )
  }

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      {isMain ? (
        <>
          <WelcomeBanner name="Vendor Jakarta Timur" />

          <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
            {stats.map((stat, i) => (
              <div
                key={i}
                className="card dashboard-card-vibrant"
                style={{
                  padding: "2rem",
                  borderRadius: "20px",
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
            padding: "2rem",
            borderRadius: "20px",
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
              {prodList.map((item, i) => {
                const allPending = menus.every(m => m.status_validasi === 'pending');
                const displayStatus = allPending ? "MENUNGGU VALIDASI" : item.status;
                
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
                        <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "2px" }}>{item.school}</h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "500" }}>{item.menuName}</p>
                      </div>
                    </div>
                    <span className="badge" style={{
                      background: displayStatus === "SELESAI" ? "var(--role-primary)" : displayStatus === "MENUNGGU VALIDASI" ? "var(--banana)" : "var(--role-primary)",
                      color: 'white',
                      padding: "6px 14px",
                      borderRadius: "50px",
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
        {selectedAuditMenu && <VisualAuditModal menu={selectedAuditMenu} onClose={() => setSelectedAuditMenu(null)} />}
      </AnimatePresence>
    </DashboardLayout>
  )
}

export default VendorDashboard