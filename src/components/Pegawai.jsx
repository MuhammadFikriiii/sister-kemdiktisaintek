import React, { useState, useEffect } from 'react';
import { getPegawai, createPegawai } from '../services/api';
import { Loader2, Plus, Users, AlertCircle } from 'lucide-react';

const Pegawai = () => {
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nip: '',
    nama_pegawai: '',
    gelar: '',
    nomor_ktp: '',
    email: '',
    agama: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: 'LAKI-LAKI',
    tahun_masuk: '',
    alamat: '',
    nomor_telepon: ''
  });
  const [fotoFile, setFotoFile] = useState(null);

  useEffect(() => {
    fetchPegawai();
  }, []);

  const fetchPegawai = async () => {
    setLoading(true);
    try {
      const response = await getPegawai();
      if (response && response.data) {
        setPegawaiList(response.data);
      }
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data pegawai. Pastikan database dan tabel pegawai sudah ada.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFotoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (fotoFile) {
        data.append('foto', fotoFile);
      }

      await createPegawai(data);
      
      // Reset form and fetch updated list
      setFormData({
        nip: '',
        nama_pegawai: '',
        gelar: '',
        nomor_ktp: '',
        email: '',
        agama: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: 'LAKI-LAKI',
        tahun_masuk: '',
        alamat: '',
        nomor_telepon: ''
      });
      setFotoFile(null);
      setShowForm(false);
      fetchPegawai();
      
      alert('Data pegawai berhasil ditambahkan!');
    } catch (err) {
      console.error(err);
      setError('Gagal menyimpan data pegawai. Periksa koneksi dan format isian.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="detail-page" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="banner-red" style={{ background: 'linear-gradient(135deg, #005596 0%, #1e3a8a 100%)' }}>
        <Users size={48} />
        <div className="banner-text">
          <h1>Data Pegawai STIE Pancasetia</h1>
          <p style={{ opacity: 0.9, fontSize: '1rem', fontWeight: 600 }}>Kelola data pegawai secara mandiri.</p>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={22} />
            DAFTAR PEGAWAI
          </div>
          <button className="btn-search" onClick={() => setShowForm(!showForm)} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            {showForm ? 'BATAL' : <><Plus size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }}/> TAMBAH DATA</>}
          </button>
        </div>

        <div className="profile-card-body">
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '16px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {showForm && (
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Formulir Tambah Pegawai</h3>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Foto Profil</label>
                  <input type="file" name="foto" accept="image/*" onChange={handleFileChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>NIP *</label>
                  <input type="text" name="nip" value={formData.nip} onChange={handleInputChange} required style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }} placeholder="Masukkan NIP" />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Nama Pegawai *</label>
                  <input type="text" name="nama_pegawai" value={formData.nama_pegawai} onChange={handleInputChange} required style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }} placeholder="Nama Lengkap" />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Gelar</label>
                  <input type="text" name="gelar" value={formData.gelar} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }} placeholder="Contoh: S.Kom" />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Nomor KTP *</label>
                  <input type="text" name="nomor_ktp" value={formData.nomor_ktp} onChange={handleInputChange} required style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }} placeholder="NIK / KTP" />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }} placeholder="Email Aktif" />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Agama</label>
                  <select name="agama" value={formData.agama} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white' }}>
                    <option value="">Pilih Agama</option>
                    <option value="ISLAM">ISLAM</option>
                    <option value="KRISTEN">KRISTEN</option>
                    <option value="KATHOLIK">KATHOLIK</option>
                    <option value="HINDU">HINDU</option>
                    <option value="BUDDHA">BUDDHA</option>
                    <option value="KONGHUCU">KONGHUCU</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Tempat Lahir</label>
                  <input type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }} placeholder="Kota Lahir" />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Tanggal Lahir</label>
                  <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Jenis Kelamin</label>
                  <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white' }}>
                    <option value="LAKI-LAKI">LAKI-LAKI</option>
                    <option value="PEREMPUAN">PEREMPUAN</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Tahun Masuk</label>
                  <input type="number" name="tahun_masuk" value={formData.tahun_masuk} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }} placeholder="Contoh: 2020" />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Nomor Telepon</label>
                  <input type="text" name="nomor_telepon" value={formData.nomor_telepon} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }} placeholder="08..." />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Alamat Lengkap</label>
                  <textarea name="alamat" value={formData.alamat} onChange={handleInputChange} rows="3" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', resize: 'vertical' }} placeholder="Jl..."></textarea>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="submit" disabled={submitting} className="btn-search" style={{ padding: '12px 30px' }}>
                    {submitting ? <Loader2 size={20} className="animate-spin" /> : 'SIMPAN DATA PEGAWAI'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
             <div style={{ textAlign: 'center', padding: '60px' }}>
               <Loader2 className="animate-spin" size={48} color="#005596" style={{ margin: '0 auto 24px' }} />
             </div>
          ) : pegawaiList.length > 0 ? (
            <div className="table-wrapper">
              <table className="info-table">
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>NIP / KTP</th>
                    <th>Nama & Gelar</th>
                    <th>Detail Latar Belakang</th>
                    <th>Kontak</th>
                  </tr>
                </thead>
                <tbody>
                  {pegawaiList.map((p, i) => (
                    <tr key={i}>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        {p.foto ? (
                          <img src={'/api/' + p.foto} alt="Foto" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                        ) : (
                          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: '#94a3b8' }}>
                            <Users size={24} />
                          </div>
                        )}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{p.nip}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>KTP: {p.nomor_ktp}</div>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: 800, color: '#1e293b' }}>{p.nama_pegawai}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>{p.gelar || '-'}</div>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <div style={{ fontSize: '0.9rem' }}>{p.tempat_lahir}, {p.tanggal_lahir}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>{p.jenis_kelamin} • {p.agama} • Masuk: {p.tahun_masuk}</div>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <div style={{ fontSize: '0.9rem' }}>{p.nomor_telepon || '-'}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>{p.email || '-'}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
              <Users size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>Belum ada data pegawai. Silakan tambahkan data baru.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pegawai;
