import React from 'react';
import { ShieldCheck, ChevronRight, LayoutDashboard, Database, Download } from 'lucide-react';
import SisterLogo from './SisterLogo';

const LandingPage = ({ setGuestView }) => {
  return (
    <div className="landing-page animate-fade-in" style={{ background: '#ac1234' }}>
      {/* Marquee Section */}
      <div style={{ padding: '40px 0', overflow: 'hidden', background: '#ac1234' }}>
        <div className="animate-marquee">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, padding: '0 20px', textTransform: 'uppercase' }}>
              <span style={{ color: 'white' }}>SISTER</span>{' '}
              <span className="text-outline">STIE PANCASETIA</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero / About Section */}
      <section id="about" style={{ padding: '60px 8%', background: '#ac1234', color: 'white' }}>
        <div className="container mx-auto" style={{ display: 'flex', flexDirection: 'column', lgDirection: 'row', alignItems: 'center', gap: '60px' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, tracking: '2px', textTransform: 'uppercase', marginBottom: '10px', display: 'block', opacity: 0.9 }}>
              Selamat Datang di SISTER
            </span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '30px' }}>
              Pusat Integrasi Data <br />Sumberdaya Terintegrasi.
            </h1>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '40px', opacity: 0.9, textAlign: 'justify' }}>
              SISTER STIE Pancasetia adalah solusi digital modern untuk mempermudah pemantauan data dosen, BKD, dan publikasi ilmiah secara real-time. Kami mentransformasi sistem pengelolaan data menjadi lebih transparan, cepat, dan efisien.
            </p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <button onClick={() => setGuestView('login')} className="btn-search" style={{ background: 'white', color: '#ac1234', padding: '18px 45px', fontSize: '1.1rem', borderRadius: '18px', fontWeight: 800 }}>
                Mulai Akses
              </button>
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: 'white', fontWeight: 700, padding: '0 20px', cursor: 'pointer' }}
              >
                Lihat Fitur <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              width: '100%', 
              height: '100%', 
              background: 'white', 
              opacity: 0.1, 
              borderRadius: '50%', 
              filter: 'blur(100px)',
              zIndex: 0
            }}></div>
            <SisterLogo style={{ width: 'clamp(200px, 30vw, 400px)', height: 'auto', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2)) brightness(1.2)' }} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '100px 8%', background: 'white' }}>
        <h2 className="section-title" style={{ color: '#ac1234', marginBottom: '60px' }}>Kenapa Harus SISTER?</h2>
        <div className="feature-grid">
          {[
            { icon: <LayoutDashboard size={28} />, title: 'Dashboard Terpadu', desc: 'Satu pintu untuk semua data kepegawaian, akademik, dan jabatan fungsional dosen.' },
            { icon: <Database size={28} />, title: 'Sinkronisasi Real-time', desc: 'Data diambil langsung dari server pusat SISTER Kemdikbudristek secara akurat.' },
            { icon: <Download size={28} />, title: 'Ekspor Laporan Cepat', desc: 'Konversi data riwayat dosen ke format Excel yang rapi siap cetak hanya dengan satu klik.' }
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{ border: '1px solid #f1f5f9' }}>
              <div className="feature-icon" style={{ background: '#fff1f2', color: '#ac1234' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '16px', color: '#1e293b' }}>{f.title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Guide */}
      <section id="guide" className="guide-section" style={{ background: '#f8fafc' }}>
        <h2 className="section-title" style={{ color: '#ac1234' }}>3 Langkah Penggunaan</h2>
        <div className="guide-container">
          {[
            { n: '1', t: 'Login Kredensial', d: 'Gunakan Username, Password, dan ID Pengguna SISTER resmi institusi Pancasetia.' },
            { n: '2', t: 'Cari Nama Dosen', d: 'Masukkan nama lengkap dosen untuk menarik seluruh data akademiknya.' },
            { n: '3', t: 'Kelola & Export', d: 'Tinjau setiap kategori data dan klik tombol Export jika butuh laporan Excel.' }
          ].map((s, i) => (
            <div key={i} className="guide-step">
              <div className="step-number" style={{ background: '#ac1234' }}>{s.n}</div>
              <div>
                <h4 style={{ fontWeight: 800, marginBottom: '12px', fontSize: '1.25rem', color: '#1e293b' }}>{s.t}</h4>
                <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.5 }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
