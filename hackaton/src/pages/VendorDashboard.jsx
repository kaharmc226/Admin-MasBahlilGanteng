import React, { useState } from "react"
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
  Apple
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { mockData } from "../data/mockData"
import Sidebar from "../components/Sidebar"

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
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'grid', placeItems: 'center', backdropFilter: 'blur(10px)' }}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        style={{ background: 'white', padding: '3rem', borderRadius: '40px', width: '100%', maxWidth: '500px', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}
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
      </motion.div>
    </motion.div>
  )
}

const AddMenuForm = ({ onClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    nama: editData?.nama_menu || '',
    tanggal: editData?.date || new Date().toISOString().split('T')[0],
    bahan: editData?.bahan.map(b => ({ nama: b.nama, berat: b.takaran.replace('~', '').replace(' g', '') })) || [{ nama: '', berat: '' }]
  })

  const addBahan = () => {
    setFormData({ ...formData, bahan: [...formData.bahan, { nama: '', berat: '' }] })
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
      bahan: formData.bahan.map(b => ({ nama: b.nama, takaran: `~${b.berat} g` })),
      nilai_gizi: editData?.nilai_gizi || { energi: '--- kkal', protein: '-- g' },
      status_validasi: editData?.status_validasi || 'pending'
    }

    onSave(newEntry)
    alert(editData ? "✅ Perubahan Menu Berhasil Disimpan!" : "✅ Menu Berhasil Diajukan ke Ahli Gizi untuk Verifikasi!");
    onClose()
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'grid', placeItems: 'center', backdropFilter: 'blur(15px)', overflowY: 'auto', padding: '2rem' }}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
        style={{ background: 'white', padding: '3rem', borderRadius: '40px', width: '100%', maxWidth: '650px', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}
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
                    type="text" 
                    placeholder="Berat (Gram)"
                    value={b.berat}
                    onChange={(e) => updateBahan(i, 'berat', e.target.value)}
                    style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '2px solid #f8fafc', background: '#f8fafc', fontWeight: '700' }}
                  />
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
      </motion.div>
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
  
  // Persistence Logic: Load from LocalStorage or Fallback to Mock
  const [dapurs, setDapurs] = useState(() => {
    try {
      const saved = localStorage.getItem('traksi_dapur_ledger');
      return saved ? JSON.parse(saved) : mockData.dapurs;
    } catch (e) {
      return mockData.dapurs;
    }
  })

  const [menus, setMenus] = useState(() => {
    try {
      const saved = localStorage.getItem('traksi_menu_ledger');
      return saved ? JSON.parse(saved) : mockData.menus;
    } catch (e) {
      return mockData.menus;
    }
  })

  const handleAddDapur = (newDapur) => {
    const ledgerEntry = { 
      ...newDapur, 
      id: Date.now(),
      hash: '0x' + Math.random().toString(16).slice(2, 12).toUpperCase(),
      timestamp: new Date().toLocaleString()
    };
    const updatedLedger = [...dapurs, ledgerEntry];
    setDapurs(updatedLedger);
    localStorage.setItem('traksi_dapur_ledger', JSON.stringify(updatedLedger));
  }

  const handleDeleteDapur = (id) => {
    if (confirm("⚠️ Apakah Anda yakin ingin menghapus operasional dapur ini dari Ledger? Tindakan ini akan dicatat dalam histori sistem.")) {
      const updatedLedger = dapurs.filter(d => d.id !== id);
      setDapurs(updatedLedger);
      localStorage.setItem('traksi_dapur_ledger', JSON.stringify(updatedLedger));
    }
  }

  const [activeHub, setActiveHub] = useState({
    name: 'Kendari',
    url: "https://maps.google.com/maps?q=Kendari&output=embed"
  })

  const handleAddMenu = (newMenu) => {
    let updatedLedger;
    if (editingMenu) {
      updatedLedger = menus.map(m => m.id === newMenu.id ? newMenu : m);
    } else {
      updatedLedger = [...menus, newMenu];
    }
    setMenus(updatedLedger);
    localStorage.setItem('traksi_menu_ledger', JSON.stringify(updatedLedger));
    setEditingMenu(null);
  }

  const path = location.pathname.replace(/\/$/, '')
  const isMain = path === '/vendor'
  const isDoc = path === '/vendor/dokumen'
  const isDapur = path === '/vendor/dapur'
  const isMenu = path === '/vendor/menu'
  const isProduksi = path === '/vendor/produksi'
  const isDistribusi = path === '/vendor/distribusi'
  
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
    if (isDoc) return (
      <div className="grid" style={{ gap: '2rem' }}>
        <Header title="Dokumen & Izin Usaha" />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[
            { title: 'NIB (Nomor Induk Berusaha)', status: 'Verified', date: '12 Jan 2026', icon: <FileText color="var(--primary)" /> },
            { title: 'Sertifikat Halal', status: 'Verified', date: '05 Feb 2026', icon: <ShieldCheck color="var(--secondary)" /> },
            { title: 'Izin Edar P-IRT', status: 'Pending', date: '20 Mar 2026', icon: <Clock color="var(--banana)" /> },
            { title: 'Sertifikat Higiene Sanitasi', status: 'Verified', date: '10 Feb 2026', icon: <ClipboardCheck color="var(--primary)" /> }
          ].map((doc, i) => (
            <div key={i} className="card dashboard-card-vibrant" style={{ padding: '2rem', borderRadius: '24px' }}>
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
    )

    if (isDapur) return (
      <div className="grid" style={{ gap: '2rem' }}>
        <Header title="Manajemen Dapur Satuan" />
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
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: D-00{d.id.toString().slice(-3)} | Kapasitas: {d.kapasitas_produksi} Porsi/Hari</p>
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
      </div>
    )

    if (isMenu) return (
      <div className="grid" style={{ gap: '2rem' }}>
        <Header title="Katalog Menu Gizi" />
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
      const validatedMenus = menus.filter(m => m.status_validasi !== 'pending');
      const hasMenus = menus.length > 0;
      
      const prepVal = hasMenus ? (validatedMenus.length > 0 ? Math.min(100, 40 + (validatedMenus.length * 15)) : 20) : 0;
      const cookVal = validatedMenus.length > 0 ? Math.min(100, 10 + (validatedMenus.length * 20)) : 0;
      const packVal = validatedMenus.length > 0 ? Math.min(100, 5 + (validatedMenus.length * 15)) : 0;

      return (
        <div className="grid" style={{ gap: '2rem' }}>
          <Header title="Monitoring Produksi Real-time" />
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
            <h3 style={{ fontWeight: '950', marginBottom: '2rem' }}>Antrian Produksi Dapur Jak-Tim</h3>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.8rem' }}>
               <thead>
                 <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '900' }}>
                   <th>MENU</th>
                   <th>TARGET SEKOLAH</th>
                   <th>ESTIMASI SELESAI</th>
                   <th>STATUS</th>
                 </tr>
               </thead>
               <tbody>
                 {menus.map((m, i) => (
                   <tr key={i} style={{ background: 'var(--bg)' }}>
                     <td style={{ padding: '1.5rem', fontWeight: '900', borderRadius: '15px 0 0 15px' }}>{m.nama_menu}</td>
                     <td style={{ padding: '1.5rem', fontWeight: '700' }}>SDN 06 Baru</td> 
                     <td style={{ padding: '1.5rem', fontWeight: '700', color: m.status_validasi === 'pending' ? 'var(--text-muted)' : 'var(--text-main)' }}>
                       {m.status_validasi === 'pending' ? 'Menunggu Validasi' : '10:30 WIB'}
                     </td>
                     <td style={{ padding: '1.5rem', borderRadius: '0 15px 15px 0' }}>
                       <span className="badge" style={{ 
                         background: m.status_validasi === 'pending' ? 'var(--banana-light)' : 'var(--primary-light)', 
                         color: m.status_validasi === 'pending' ? 'var(--banana)' : 'var(--primary)', 
                         fontWeight: '900' 
                       }}>
                         {m.status_validasi === 'pending' ? 'MENUNGGU VALIDASI' : 'SIAP PRODUKSI'}
                       </span>
                     </td>
                   </tr>
                 ))}
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
           
           {menus.filter(m => m.status_validasi !== 'pending').map((_, i) => (
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
                  ARMADA #{String(i + 1).padStart(2, '0')}
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
          {menus.length === 0 ? (
            <div className="card dashboard-card-vibrant" style={{ padding: '3rem', gridColumn: 'span 2', textAlign: 'center' }}>
              <p style={{ fontWeight: '800', color: 'var(--text-muted)' }}>Belum ada data pengiriman. Silakan input menu terlebih dahulu.</p>
            </div>
          ) : (
            menus.map((m, i) => {
              const isPending = m.status_validasi === 'pending';
              return (
                <div key={i} className="card dashboard-card-vibrant" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                   <div className="flex justify-between" style={{ marginBottom: '1.5rem' }}>
                     <p style={{ fontWeight: '950', color: 'var(--primary)', fontSize: '0.9rem' }}>ARMADA #{String(i + 1).padStart(2, '0')}</p>
                     <span className="badge" style={{ 
                       background: isPending ? 'var(--banana-light)' : 'var(--primary-light)', 
                       color: isPending ? 'var(--banana)' : 'var(--primary)', 
                       fontWeight: '900' 
                     }}>
                       {isPending ? 'MENUNGGU VALIDASI' : 'DALAM PERJALANAN'}
                     </span>
                   </div>
                   <h4 style={{ fontSize: '1.4rem', fontWeight: '950', marginBottom: '8px' }}>Tujuan: SDN 06 Baru</h4>
                   <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: '600' }}>
                     Driver: {isPending ? 'Belum Ditugaskan' : (i % 2 === 0 ? 'Andi Rahmadi' : 'Budi Santoso')}
                   </p>
                   <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                     <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '15px', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800' }}>ETA</p>
                        <p style={{ fontWeight: '950', fontSize: '1.1rem' }}>{isPending ? '--:--' : (10 + i) + ':45'}</p>
                     </div>
                     <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '15px', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800' }}>JARAK</p>
                        <p style={{ fontWeight: '950', fontSize: '1.1rem' }}>{isPending ? '0 km' : (2.5 + i * 1.2).toFixed(1) + ' km'}</p>
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
    <div className="layout-wrapper premium-mesh mesh-vendor" style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Fixed Layout with Explicit Sidebar Separation */}
      <div style={{ width: '280px', flexShrink: 0 }}>
        <Sidebar user={user} onLogout={onLogout} />
      </div>
      
      {/* Decorative Food Elements - Fixed and more diverse */}
      <FoodItem3D top="5%" left="320px" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200" size={180} delay={0} rotate={15} />
      <FoodItem3D bottom="10%" right="5%" src="https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?auto=format&fit=crop&q=80&w=150" size={150} delay={2} rotate={-20} />
      <FoodItem3D top="45%" right="2%" src="https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=180" size={170} delay={4} rotate={45} />
      <FoodItem3D bottom="25%" left="350px" src="https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&q=80&w=150" size={140} delay={1} rotate={-10} />
      <FoodItem3D top="65%" left="420px" src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=160" size={160} delay={3} rotate={30} />
      <FoodItem3D top="2%" right="20%" src="https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&q=80&w=140" size={130} delay={5} rotate={-5} />
      <FoodItem3D bottom="5%" right="30%" src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=130" size={120} delay={6} rotate={10} />

      {/* Enhanced Multi-color Background Orbs */}
      <FloatingShape initial={{ top: '5%', right: '10%' }} animate={{ y: [0, 100, 0], x: [0, 50, 0] }} duration={25} color="rgba(59, 130, 246, 0.2)" size="700px" />
      <FloatingShape initial={{ bottom: '5%', left: '300px' }} animate={{ y: [0, -120, 0], scale: [1, 1.2, 1] }} duration={22} color="rgba(249, 115, 22, 0.15)" size="600px" />
      <FloatingShape initial={{ top: '40%', left: '50%' }} animate={{ opacity: [0.1, 0.2, 0.1], x: [-50, 50, -50] }} duration={30} color="rgba(234, 179, 8, 0.15)" size="500px" />

      <div className="main-content" style={{ 
        flex: 1, 
        padding: "3.5rem", 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        zIndex: 1,
        overflowX: 'hidden',
        background: 'transparent'
      }}>
        {/* Decorative Grid Overlay for texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0 }}></div>

        <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname} 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              <Motif icon={Apple} top="15%" right="5%" color="var(--primary)" />
              <Motif icon={UtensilsCrossed} bottom="20%" right="10%" color="var(--secondary)" />
              <Motif icon={Package} top="40%" left="5%" color="var(--primary)" />

              {isMain ? (
                <>
                  <Header title="OPERATIONAL CENTER" />
                  <WelcomeBanner name="Vendor Jakarta Timur" />

                  <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "2.5rem", marginBottom: "4rem" }}>
                     {stats.map((stat, i) => (
                       <motion.div 
                        key={i} 
                        whileHover={{ y: -10, boxShadow: '0 30px 60px rgba(6, 78, 59, 0.12)' }}
                        className="card dashboard-card-vibrant" 
                        style={{ 
                          padding: "3rem 2.5rem", 
                          borderRadius: "40px", 
                          display: "flex", 
                          flexDirection: 'column',
                          gap: "25px",
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid white',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                       >
                         {/* Subtle card icon bg */}
                         <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.03, transform: 'rotate(-20deg)' }}>
                            {stat.icon}
                         </div>

                         <div style={{ background: `${stat.color}15`, padding: "1.4rem", borderRadius: "24px", color: stat.color, width: 'fit-content' }}>
                           {stat.icon}
                         </div>
                         <div>
                           <p style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: "800", marginBottom: "6px", textTransform: 'uppercase', letterSpacing: '2px' }}>{stat.title}</p>
                           <h3 style={{ fontSize: "2.8rem", fontWeight: "950", color: 'var(--text-main)', letterSpacing: '-2px' }}>{stat.value}</h3>
                         </div>
                         <div style={{ marginTop: '5px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                               <span style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>Kapasitas Produksi</span>
                               <span style={{ fontSize: '0.75rem', fontWeight: '900', color: stat.color }}>82%</span>
                            </div>
                            <div style={{ height: '6px', width: '100%', background: 'var(--bg)', borderRadius: '10px' }}>
                               <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} transition={{ duration: 1.5, delay: 0.5 }} style={{ height: '100%', background: stat.color, borderRadius: '10px' }}></motion.div>
                            </div>
                         </div>
                       </motion.div>
                     ))}
                  </div>

                  <div className="card dashboard-card-vibrant" style={{ 
                    padding: "4rem", 
                    borderRadius: "50px", 
                    background: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 50px 100px rgba(6, 78, 59, 0.08)',
                    border: '1px solid white'
                  }}>
                    <div className="flex justify-between" style={{ marginBottom: "3.5rem" }}>
                      <div className="flex" style={{ gap: "25px" }}>
                        <div style={{ width: '60px', height: '60px', background: 'var(--primary-light)', borderRadius: '20px', display: 'grid', placeItems: 'center', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.1)' }}>
                          <Activity color="var(--primary)" size={32} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: "1.8rem", fontWeight: "950", letterSpacing: '-1px' }}>Feed Logistik Terkini</h3>
                          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: '700' }}>Pemantauan distribusi armada gizi nasional secara real-time</p>
                        </div>
                      </div>
                      <button style={{ background: 'var(--bg)', border: 'none', padding: '1rem 2rem', borderRadius: '16px', fontWeight: '900', color: 'var(--primary)', cursor: 'pointer', transition: '0.3s' }}>Audit Seluruh Log</button>
                    </div>
                    
                    <div className="grid" style={{ gap: "1.8rem" }}>
                      {prodList.map((item, i) => {
                        const allPending = menus.every(m => m.status_validasi === 'pending');
                        const displayStatus = allPending ? "MENUNGGU VALIDASI" : item.status;
                        
                        return (
                          <motion.div 
                            key={i} 
                            whileHover={{ x: 15, background: 'var(--primary-light)', borderColor: 'var(--primary)' }}
                            style={{ 
                              padding: "2rem", 
                              borderRadius: "32px", 
                              border: "2px solid var(--border)", 
                              display: "flex", 
                              justifyContent: "space-between", 
                              alignItems: "center", 
                              background: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <div className="flex" style={{ gap: "30px" }}>
                              <div style={{ background: "var(--bg)", width: "75px", height: "75px", borderRadius: "24px", display: "grid", placeItems: "center", color: "var(--primary)", boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
                                <Truck size={32} />
                              </div>
                              <div>
                                <h4 style={{ fontSize: "1.4rem", fontWeight: "950", marginBottom: "8px", color: 'var(--text-main)' }}>{item.school}</h4>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                  <p style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: "700" }}>{item.menuName}</p>
                                  <div style={{ width: '6px', height: '6px', background: 'var(--border)', borderRadius: '50%' }}></div>
                                  <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '900', letterSpacing: '1px' }}>ID-{8900 + i}</p>
                                </div>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <span className="badge" style={{ 
                                background: displayStatus === "SELESAI" ? "var(--primary)" : displayStatus === "MENUNGGU VALIDASI" ? "var(--banana)" : "var(--primary)", 
                                color: 'white',
                                padding: "12px 24px",
                                borderRadius: "200px",
                                fontWeight: "950",
                                fontSize: "0.8rem",
                                boxShadow: `0 10px 20px ${displayStatus === "SELESAI" ? 'rgba(16, 185, 129, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`
                              }}>
                                {displayStatus}
                              </span>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '900' }}>{item.date}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <Footer />
      </div>

      <AnimatePresence>
        {activeDoc && (
          <PdfModal doc={activeDoc} onClose={() => setActiveDoc(null)} />
        )}
        {showAddForm && (
          <AddDapurForm onClose={() => setShowAddForm(false)} onSave={handleAddDapur} />
        )}
        {showMenuForm && (
          <AddMenuForm 
            onClose={() => { setShowMenuForm(false); setEditingMenu(null); }} 
            onSave={handleAddMenu} 
            editData={editingMenu}
          />
        )}
        {selectedAuditMenu && <VisualAuditModal menu={selectedAuditMenu} onClose={() => setSelectedAuditMenu(null)} />}
      </AnimatePresence>
    </div>
  )
}

export default VendorDashboard