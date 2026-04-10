import React from 'react';
import { ShieldCheck, ChevronRight, LayoutDashboard, Database, Download } from 'lucide-react';
import SisterLogo from './SisterLogo';

const LandingPage = ({ setGuestView }) => {
  return (
    <div className="landing-page animate-fade-in">
      {/* Hero */}
      <section id="about" className="hero-section">
        <div className="hero-content">
          <div className="status-badge" style={{ background: '#eff6ff', color: '#2563eb', border: 'none', marginBottom: '10px', marginTop: '10px' }}>
            <ShieldCheck size={16} style={{ marginRight: '8px' }} /> UNIVERSAL SUPPORT UNTUK SELURUH KAMPUS
          </div>
          <h1>Integrasi Data SISTER<br />Paling Ringan & Cepat.</h1>
          <p>
            Platform khusus untuk memonitor data dosen, BKD, dan publikasi ilmiah dengan antarmuka modern yang mendukung semua institusi pendidikan tinggi.
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <button onClick={() => setGuestView('login')} className="btn-search" style={{ padding: '18px 45px', fontSize: '1.1rem', borderRadius: '18px' }}>Mulai Akses</button>
            <button onClick={() => document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: '#1e293b', fontWeight: 700, padding: '0 20px', cursor: 'pointer' }}>
              Panduan Pakai <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-bg"></div>
          <SisterLogo style={{ width: '300px', height: '300px', position: 'relative', zIndex: 2 }} />
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '0px 8%', background: '#f8fafc' }}>
        <h2 className="section-title" style={{ marginTop: '40px' }}>Kenapa Harus SISTER?</h2>
        <div className="feature-grid">
          {[
            { icon: <LayoutDashboard size={28} />, title: 'Universal Campus', desc: 'Didesain untuk bisa digunakan oleh seluruh perguruan tinggi di Indonesia tanpa kecuali.' },
            { icon: <Database size={28} />, title: 'Terintegrasi Penuh', desc: 'Menampilkan data Kepegawaian, Jafung, BKD, hingga Publikasi secara real-time dari server pusat.' },
            { icon: <Download size={28} />, title: 'Ekspor Data Cepat', desc: 'Mengubah data historis dosen menjadi file Excel yang tertata rapi dalam hitungan detik.' }
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '16px' }}>{f.title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Guide */}
      <section id="guide" className="guide-section">
        <h2 className="section-title">3 Langkah Penggunaan</h2>
        <div className="guide-container">
          {[
            { n: '1', t: 'Login Kredensial', d: 'Gunakan Username, Password, dan ID Pengguna SISTER resmi institusi Anda.' },
            { n: '2', t: 'Cari Nama Dosen', d: 'Masukkan nama lengkap dosen untuk menarik seluruh data akademiknya.' },
            { n: '3', t: 'Kelola & Export', d: 'Tinjau setiap kategori data dan klik tombol Export jika butuh laporan Excel.' }
          ].map((s, i) => (
            <div key={i} className="guide-step">
              <div className="step-number">{s.n}</div>
              <div>
                <h4 style={{ fontWeight: 800, marginBottom: '12px', fontSize: '1.25rem' }}>{s.t}</h4>
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
