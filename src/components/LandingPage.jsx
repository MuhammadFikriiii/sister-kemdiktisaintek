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
            <p style={{ fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '40px', opacity: 0.9, textAlign: 'justify' }}>
              SISTER STIE Pancasetia adalah solusi digital modern untuk mempermudah pemantauan data dosen, BKD, dan publikasi ilmiah secara real-time. Kami mentransformasi sistem pengelolaan data menjadi lebih transparan, cepat, dan efisien.
            </p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <button onClick={() => setGuestView('login')} className="btn-search" style={{ background: 'white', color: '#ac1234', padding: '18px 45px', fontSize: '1.1rem', borderRadius: '18px', fontWeight: 800 }}>
                Mulai Akses
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 8%', background: '#f8fafc' }}>
        <h2 className="section-title" style={{ color: '#ac1234', marginBottom: '50px', textAlign: 'center', fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 900 }}>Kenapa Harus SISTER?</h2>
        <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto', padding: '0' }}>
          {[
            { icon: <LayoutDashboard size={32} />, title: 'Dashboard Terpadu', desc: 'Satu pintu untuk semua data kepegawaian, akademik, dan jabatan fungsional dosen.' },
            { icon: <Database size={32} />, title: 'Sinkronisasi Real-time', desc: 'Data diambil langsung dari server pusat SISTER Kemdikbudristek secara akurat.' },
            { icon: <Download size={32} />, title: 'Ekspor Laporan Cepat', desc: 'Konversi data riwayat dosen ke format Excel yang rapi siap cetak hanya dengan satu klik.' }
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{ background: 'white', padding: '40px 30px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div className="feature-icon" style={{ background: '#fff1f2', color: '#ac1234', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', color: '#1e293b' }}>{f.title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '1.05rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Guide */}
      <section id="guide" className="guide-section" style={{ background: '#ac1234', padding: '80px 8%' }}>
        <h2 className="section-title" style={{ color: 'white', textAlign: 'center', marginBottom: '40px', fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 900 }}>3 Langkah Penggunaan</h2>
        <div className="guide-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { n: '1', t: 'Login Kredensial', d: 'Gunakan Username, Password, dan ID Pengguna SISTER resmi institusi Pancasetia.' },
            { n: '2', t: 'Cari Nama Dosen', d: 'Masukkan nama lengkap dosen untuk menarik seluruh data akademiknya.' },
            { n: '3', t: 'Kelola & Export', d: 'Tinjau setiap kategori data dan klik tombol Export jika butuh laporan Excel.' }
          ].map((s, i) => (
            <div key={i} className="guide-step" style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div className="step-number" style={{ background: '#ac1234', color: 'white', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 900, fontSize: '1.5rem', marginBottom: '20px' }}>{s.n}</div>
              <div>
                <h4 style={{ fontWeight: 800, marginBottom: '12px', fontSize: '1.25rem', color: '#1e293b' }}>{s.t}</h4>
                <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.5 }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
