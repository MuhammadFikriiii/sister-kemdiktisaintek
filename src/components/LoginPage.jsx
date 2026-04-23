import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import SisterLogo from './SisterLogo';

const LoginPage = ({ loginData, setLoginData, handleLogin, loading, error, setError }) => {
  return (
    <div className="auth-view-container" style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      background: 'linear-gradient(135deg, #ac1234 0%, #6d0b21 100%)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: 'calc(100vh - 80px)' // Adjust based on navbar height
    }}>
      {/* Decorative Background Elements */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '50%', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 1 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '30%', height: '40%', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 1 }}></div>

      <div className="login-box-sister" style={{
        background: 'white',
        padding: 'clamp(25px, 8%, 50px)',
        borderRadius: '32px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 10,
        animation: 'scaleIn 0.3s ease-out'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{ background: '#fff1f2', padding: '16px', borderRadius: '24px', display: 'inline-block', marginBottom: '24px' }}>
            <img src="/icon2.png" alt="Icon" style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 1.8rem)', fontWeight: 900, color: '#ac1234', letterSpacing: '-1.2px' }}>SISTER LOGIN</h2>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1.5px solid #fee2e2', color: '#b91c1c', padding: '14px', borderRadius: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', fontWeight: 700 }}>
            <AlertCircle size={18} />
            <span style={{ flex: 1 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '0.7rem', color: '#ac1234', letterSpacing: '0.5px', marginBottom: '8px', textTransform: 'uppercase' }}>Username</label>
            <input
              type="text"
              value={loginData.username}
              onChange={e => { setLoginData({ ...loginData, username: e.target.value }); setError(null); }}
              style={{ width: '100%', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '14px', padding: '14px 18px', fontWeight: 700, fontSize: '1rem', outline: 'none' }}
              placeholder="Username SISTER"
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '0.7rem', color: '#ac1234', letterSpacing: '0.5px', marginBottom: '8px', textTransform: 'uppercase' }}>Password</label>
            <input
              type="password"
              value={loginData.password}
              onChange={e => { setLoginData({ ...loginData, password: e.target.value }); setError(null); }}
              style={{ width: '100%', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '14px', padding: '14px 18px', fontWeight: 700, fontSize: '1rem', outline: 'none' }}
              placeholder="••••••••"
              required
            />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '0.7rem', color: '#ac1234', letterSpacing: '0.5px', marginBottom: '8px', textTransform: 'uppercase' }}>ID Pengguna (UUID)</label>
            <input
              type="text"
              value={loginData.id_pengguna}
              onChange={e => { setLoginData({ ...loginData, id_pengguna: e.target.value }); setError(null); }}
              style={{ width: '100%', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '14px', padding: '14px 18px', fontWeight: 700, fontSize: '0.85rem', outline: 'none' }}
              placeholder="Contoh: a1b2c3d4-..."
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-search" style={{ width: '100%', padding: '18px', borderRadius: '16px', fontSize: '1rem', fontWeight: 800, letterSpacing: '1px', background: loading ? '#94a3b8' : '#ac1234', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            {loading ? <><Loader2 className="animate-spin" size={20} /> MEMVERIFIKASI...</> : "MASUK SEKARANG"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
