import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Utensils, 
  BarChart, 
  ArrowRight,
  TrendingDown,
  Timer,
  Fingerprint,
  Zap,
  Globe,
  PieChart as PieChartIcon,
  ShieldAlert,
  Phone,
  CheckCircle,
  Database,
  Lock,
  Apple,
  Carrot,
  HandPlatter,
  Leaf
} from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'

const LandingPage = () => {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const item = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  }

  // Decorative Food Elements
  const FoodMotif = ({ style, delay, children }) => (
    <motion.div
      initial={{ y: 0, rotate: 0 }}
      animate={{ 
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0],
      }}
      transition={{ 
        duration: 8, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: delay 
      }}
      style={{ 
        position: 'absolute', 
        opacity: 0.1,
        zIndex: 1,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
        ...style 
      }}
    >
      {children}
    </motion.div>
  )

  return (
    <div className="premium-mesh" style={{ minHeight: '100vh', color: 'var(--text-main)', overflowX: 'hidden', position: 'relative' }}>
      
      {/* Decorative Ornaments */}
      <FoodMotif style={{ top: '15%', left: '10%' }} delay={0}><Apple size={120} color="var(--primary)" /></FoodMotif>
      <FoodMotif style={{ top: '65%', right: '15%' }} delay={1}><Carrot size={140} color="var(--carrot)" /></FoodMotif>
      <FoodMotif style={{ bottom: '10%', left: '5%' }} delay={2}><Leaf size={100} color="var(--secondary)" /></FoodMotif>
      <FoodMotif style={{ top: '40%', right: '5%' }} delay={0.5}><HandPlatter size={110} color="var(--banana)" /></FoodMotif>

      {/* Optimized Static Glows */}
      <div style={{ position: 'absolute', top: '5%', left: '10%', width: '400px', height: '400px', background: 'var(--primary)', opacity: 0.05, borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: '500px', height: '500px', background: 'var(--carrot)', opacity: 0.05, borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />

      {/* Navbar - Reduced blur for performance */}
      <nav style={{ padding: '1.25rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border)' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-1.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '12px', display: 'grid', placeItems: 'center', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)' }}>
              <Zap size={22} fill="white" color="white"/>
            </div>
            <span style={{ color: 'var(--text-main)' }}>TRA</span><span style={{ color: 'var(--primary)' }}>KSI</span>
          </h1>
        </motion.div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          {['Fitur', 'Solusi', 'Keamanan', 'Kontak'].map((link) => (
            <motion.a 
              key={link} 
              href={`#${link.toLowerCase()}`} 
              whileHover={{ color: 'var(--primary)', y: -2 }}
              style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: '700', fontSize: '1rem', transition: 'color 0.2s', cursor: 'pointer', position: 'relative', zIndex: 100 }}
            >
              {link}
            </motion.a>
          ))}
          <Link to="/registrasi-vendor" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '800', border: '2px solid var(--primary)', padding: '0.8rem 1.5rem', borderRadius: '50px' }}>Registrasi Vendor</Link>
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '0.9rem 2.5rem', borderRadius: '50px', background: 'linear-gradient(to right, var(--primary), var(--secondary))', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)', cursor: 'pointer', position: 'relative', zIndex: 100, color: 'white', border: 'none' }}>Login Portal</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 10, padding: '6rem 3rem 8rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <motion.div style={{ opacity, scale }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: '2.5rem' }}
            >
              <span style={{ background: 'var(--banana-light)', color: 'var(--banana)', border: '1.5px solid var(--banana)', padding: '0.8rem 1.8rem', borderRadius: '100px', fontWeight: '900', fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                ⭐ GIZI NASIONAL UNTUK SEMUA
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: '5.5rem', lineHeight: '0.95', fontWeight: '950', letterSpacing: '-4px', marginBottom: '2.5rem', color: 'var(--text-main)' }}
            >
              CERDASKAN <br />
              <span style={{ background: 'linear-gradient(to right, var(--primary), var(--carrot))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MASA DEPAN</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ fontSize: '1.5rem', color: 'var(--text-muted)', maxWidth: '650px', marginBottom: '4rem', lineHeight: '1.6', fontWeight: '500' }}
            >
              Platform monitoring gizi revolusioner yang menghubungkan dapur sehat dengan ribuan sekolah melalui transparansi Blockchain (Hyperledger Fabric/Ethereum Layer 2).
            </motion.p>            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 100 }}
            >
              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', fontSize: '1.2rem', padding: '1.5rem 4rem', borderRadius: '60px', display: 'flex', alignItems: 'center', gap: '12px', color: 'white', background: 'linear-gradient(to right, var(--primary), var(--secondary))', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)', border: 'none', fontWeight: '900' }}>
                  Akses Dashboard <ArrowRight size={24} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                 <Link to="/registrasi-vendor" className="btn-outline" style={{ textDecoration: 'none', display: 'block', borderColor: 'var(--primary)', color: 'var(--primary)', background: 'white', fontSize: '1.2rem', padding: '1.4rem 4rem', borderRadius: '60px', boxShadow: '0 10px 20px rgba(0,0,0,0.03)', fontWeight: '800' }}>
                   Daftar Vendor
                 </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{ position: 'relative' }}
          >
            <div style={{ position: 'relative' }}>
              <div style={{ 
                position: 'relative', 
                borderRadius: '50px', 
                overflow: 'hidden', 
                boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
                background: 'white',
                padding: '2rem',
                border: '10px solid white',
                willChange: 'transform'
              }}>
                <img 
                  src="/mbg_cartoon.png" 
                  alt="MBG Healthy Food Illustration" 
                  style={{ width: '100%', height: 'auto', borderRadius: '30px' }}
                />
              </div>

              {/* Floating Cards (Moved outside overflow:hidden) */}
              <div className="animate-pulse-glow" style={{ position: 'absolute', bottom: '2rem', right: '1rem', background: 'white', padding: '1.5rem', borderRadius: '25px', display: 'flex', alignItems: 'center', gap: '15px', zIndex: 20, boxShadow: '0 15px 30px rgba(16, 185, 129, 0.15)' }}>
                 <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '12px' }}><CheckCircle color="var(--primary)" /></div>
                 <div>
                    <p style={{ fontWeight: '900', fontSize: '1.1rem' }}>Data Immutable</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Via Smart Contract</p>
                 </div>
              </div>

              <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.8, type: 'spring' }}
                  style={{ position: 'absolute', top: '10%', left: '-4rem', background: 'white', padding: '1.2rem 2rem', borderRadius: '30px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', display: 'flex', gap: '15px', alignItems: 'center', zIndex: 20 }}>
                 <div style={{ background: 'var(--carrot)', padding: '14px', borderRadius: '18px' }}><TrendingDown color="white" /></div>
                 <div>
                   <p style={{ fontWeight: '950', fontSize: '1.4rem', color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap' }}>Stunting -15%</p>
                   <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', margin: 0 }}>Target Gizi Nasional</p>
                 </div>
              </motion.div>
            </div>
            
            {/* Optimized decorative spheres */}
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity }} style={{ position: 'absolute', top: '-30px', left: '-30px', width: '80px', height: '80px', background: 'var(--banana)', borderRadius: '50%', filter: 'blur(15px)', opacity: 0.2, transform: 'translateZ(0)' }} />
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity, delay: 1 }} style={{ position: 'absolute', bottom: '-40px', left: '20%', width: '120px', height: '120px', background: 'var(--carrot)', borderRadius: '50%', filter: 'blur(20px)', opacity: 0.15, transform: 'translateZ(0)' }} />
          </motion.div>
        </div>
      </section>

      {/* Marquee Partner/Sponsor Area */}
      <section style={{ padding: '2rem 0', background: 'white', position: 'relative', zIndex: 10, borderBottom: '1px solid var(--border)' }}>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: '800', marginBottom: '1rem', letterSpacing: '1px' }}>TERINTEGRASI DENGAN INFRASTRUKTUR NASIONAL</p>
        <div className="marquee-container">
          <div className="marquee-content">
            {['KEMENTERIAN KESEHATAN', 'BADAN GIZI NASIONAL', 'HYPERLEDGER FABRIC', 'BPOM RI', 'SATGAS MBG NASIONAL', 'DAPUR SEHAT INDONESIA', 'KEMENTERIAN PENDIDIKAN'].map((text, i) => (
              <span key={i} style={{ fontSize: '1.2rem', fontWeight: '950', color: 'var(--text-main)', opacity: 0.4, padding: '0 2rem' }}>{text}</span>
            ))}
            {['KEMENTERIAN KESEHATAN', 'BADAN GIZI NASIONAL', 'HYPERLEDGER FABRIC', 'BPOM RI', 'SATGAS MBG NASIONAL', 'DAPUR SEHAT INDONESIA', 'KEMENTERIAN PENDIDIKAN'].map((text, i) => (
              <span key={`clone-${i}`} style={{ fontSize: '1.2rem', fontWeight: '950', color: 'var(--text-main)', opacity: 0.4, padding: '0 2rem' }}>{text}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section id="fitur" style={{ padding: '8rem 3rem', background: 'white', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            className="grid" 
            style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { icon: <Apple size={32} color="var(--primary)" />, title: "Audit Nutrisi", bg: 'var(--primary-light)' },
              { icon: <Carrot size={32} color="var(--carrot)" />, title: "Logistik Segar", bg: 'var(--carrot-light)' },
              { icon: <HandPlatter size={32} color="var(--banana)" />, title: "Siap Saji", bg: 'var(--banana-light)' },
              { icon: <ShieldAlert size={32} color="var(--error)" />, title: "Keamanan Gizi", bg: '#fee2e2' }
            ].map((f, i) => (
              <motion.div key={i} variants={item} className="card" style={{ textAlign: 'center', padding: '2.5rem', borderRadius: '35px', border: '1px solid var(--border)' }}>
                <div style={{ background: f.bg, width: '70px', height: '70px', borderRadius: '22px', display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 15px rgba(0,0,0,0.03)' }}>
                  {f.icon}
                </div>
                <h4 style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--text-main)' }}>{f.title}</h4>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Detailed Content Sections */}
      <section id="solusi" style={{ padding: '10rem 3rem', background: 'var(--bg)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '4.5rem', fontWeight: '950', color: 'var(--text-main)', letterSpacing: '-3px', marginBottom: '1.5rem' }}>Solusi Gizi Nasional</h2>
            <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', fontWeight: '500', maxWidth: '800px', margin: '0 auto' }}>Infrastruktur digital untuk menjamin ketahanan pangan dan gizi masa depan bangsa.</p>
          </div>
          
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card" style={{ padding: '3.5rem', borderRadius: '40px' }}>
              <div style={{ background: 'var(--secondary)', width: '80px', height: '80px', borderRadius: '24px', display: 'grid', placeItems: 'center', boxShadow: '0 10px 25px rgba(34, 197, 94, 0.2)', marginBottom: '2rem' }}><Database color="white" size={36} /></div>
              <h4 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1.5rem' }}>Registrasi & Validasi</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.7', fontWeight: '500' }}>Sistem verifikasi otomatis izin usaha, sertifikasi dapur, dan pemetaan lokasi dapur ke sekolah tujuan secara presisi.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, delay: 0.1 }} className="card" style={{ padding: '3.5rem', borderRadius: '40px' }}>
              <div style={{ background: 'var(--carrot)', width: '80px', height: '80px', borderRadius: '24px', display: 'grid', placeItems: 'center', boxShadow: '0 10px 25px rgba(249, 115, 22, 0.2)', marginBottom: '2rem' }}><Timer color="white" size={36} /></div>
              <h4 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1.5rem' }}>Produksi & Distribusi</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.7', fontWeight: '500' }}>Update status real-time dari proses memasak hingga konfirmasi penerimaan oleh pihak sekolah sesuai kebutuhan porsi harian.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Keamanan Section */}
      <section id="keamanan" className="premium-dark" style={{ padding: '10rem 3rem', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '6rem', alignItems: 'center' }}>
            <motion.div 
              initial={{ x: -50, opacity: 0 }} 
              whileInView={{ x: 0, opacity: 1 }} 
              viewport={{ once: true }}
              style={{ position: 'relative' }}
            >
              <div style={{ position: 'absolute', top: '-40px', left: '-40px', opacity: 0.1 }}><ShieldAlert size={200} color="var(--primary)" /></div>
              <h2 style={{ fontSize: '4rem', fontWeight: '950', color: '#fff', marginBottom: '2.5rem', letterSpacing: '-2px' }}>Keamanan Gizi & Transparansi</h2>
              <p style={{ fontSize: '1.3rem', color: '#a7f3d0', marginBottom: '3rem', lineHeight: '1.7', fontWeight: '500' }}>
                Menggunakan <strong>Blockchain (Hyperledger Fabric/Ethereum Layer 2)</strong> dengan sifat <em>immutable</em> untuk memastikan tidak ada manipulasi data pengiriman atau markup anggaran. Sistem didukung <strong>End-to-End Encryption (AES-256)</strong>, <strong>MFA</strong>, dan <strong>RBAC</strong> yang ketat agar privasi vendor dan pemerintah terjamin.
              </p>
              <div style={{ display: 'flex', gap: '2rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(16, 185, 129, 0.2)', padding: '1rem 2rem', borderRadius: '15px' }}>
                    <CheckCircle color="var(--primary)" />
                    <span style={{ fontWeight: '800', color: 'var(--primary)' }}>Data Terenkripsi</span>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(234, 179, 8, 0.2)', padding: '1rem 2rem', borderRadius: '15px' }}>
                    <Lock color="var(--banana)" />
                    <span style={{ fontWeight: '800', color: 'var(--banana)' }}>Audit Real-time</span>
                 </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              whileInView={{ scale: 1, opacity: 1 }} 
              viewport={{ once: true }}
              style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', padding: '4rem', borderRadius: '50px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 40px 100px rgba(0,0,0,0.2)' }}
            >
               <h3 style={{ fontSize: '2.2rem', fontWeight: '950', marginBottom: '1.5rem', color: 'var(--primary)', letterSpacing: '-1px' }}>Skalabilitas Microservices</h3>
               <p style={{ fontSize: '1.2rem', color: '#a7f3d0', marginBottom: '3rem', lineHeight: '1.7', fontWeight: '500' }}>
                 Arsitektur sistem dibangun atas <strong>Microservices dengan Docker & Kubernetes</strong>, memastikan layanan tetap stabil dan lancar dalam melayani ribuan dapur dan jutaan siswa di seluruh Nusantara secara serentak.
               </p>
               <div style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.95)', borderRadius: '30px', border: '2px dashed var(--primary)' }}>
                  <p style={{ fontWeight: '950', color: 'var(--primary)', fontSize: '1.3rem', marginBottom: '10px' }}>Infrastruktur Tangguh</p>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: '600' }}>Sistem siap menghandle pencatatan <span style={{ color: 'var(--secondary)', fontWeight: '900' }}>Jutaan Transaksi Serentak</span>.</p>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" style={{ padding: '8rem 3rem 4rem', background: 'var(--primary-light)', borderTop: '1px solid var(--border)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6rem' }}>
            <div style={{ maxWidth: '500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                <div style={{ width: '45px', height: '45px', background: 'var(--primary)', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                  <Zap size={24} fill="white" color="white"/>
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '950', color: 'var(--text-main)', letterSpacing: '-2px' }}>TRAKSI</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3.5rem', lineHeight: '1.7', fontWeight: '500' }}>Pengawasan distribusi gizi nasional dengan teknologi mutakhir. Memastikan masa depan bangsa dimulai dari makanan berkualitas.</p>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--bg)', borderRadius: '18px', display: 'grid', placeItems: 'center', border: '1px solid var(--border)' }}><Phone size={24} color="var(--primary)" /></div>
                <div style={{ width: '60px', height: '60px', background: 'var(--bg)', borderRadius: '18px', display: 'grid', placeItems: 'center', border: '1px solid var(--border)' }}><Globe size={24} color="var(--primary)" /></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-main)', marginBottom: '2.5rem', fontSize: '1.3rem', fontWeight: '900' }}>Platform</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.4rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                  <li style={{ cursor: 'pointer' }}>E-Dapur Vendor</li>
                  <li style={{ cursor: 'pointer' }}>Portal Sekolah</li>
                  <li style={{ cursor: 'pointer' }}>Audit Ahli Gizi</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-main)', marginBottom: '2.5rem', fontSize: '1.3rem', fontWeight: '900' }}>Dukungan</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.4rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                  <li style={{ cursor: 'pointer' }}>Bantuan Teknis</li>
                  <li style={{ cursor: 'pointer' }}>Keamanan Data</li>
                  <li style={{ cursor: 'pointer' }}>Hubungi Kami</li>
                </ul>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '4rem', fontSize: '1.1rem', fontWeight: '700' }}>
            &copy; 2026 TRAKSI TEAM UHO • Inisiatif Nutrisi Digital Nasional. 🚀
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
