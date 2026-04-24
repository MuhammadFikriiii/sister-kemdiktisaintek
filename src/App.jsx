import React, { useState, useEffect } from 'react';
import {
  Search, LogOut, Loader2, User, Briefcase,
  GraduationCap, AlertCircle, ChevronRight,
  ArrowLeft, LayoutDashboard, Database,
  UserCheck, Award, BookOpen, Clock,
  FileText, ShieldCheck, Fingerprint, Globe,
  Link, Download, X, File, Eye, ListChecks,
  FileBarChart, Newspaper, ExternalLink, Menu, X as CloseIcon, HeartHandshake
} from 'lucide-react';
import * as sisterApi from './services/api';
import './App.css';
import XLSX from 'xlsx-js-style';

// Modular Components
import SisterLogo from './components/SisterLogo';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';

// Component for Authenticated Photo Loading
const SdmAvatar = ({ id_sdm, nama, size = 'sm' }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = null;
    const loadPhoto = async () => {
      try {
        url = await sisterApi.getPhotoBlob(id_sdm);
        setImgUrl(url);
      } catch (err) {
        setImgUrl(`https://ui-avatars.com/api/?name=${nama}&background=f1f5f9&color=005596&bold=true`);
      } finally {
        setLoading(false);
      }
    };
    loadPhoto();
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [id_sdm, nama]);

  return (
    <div className={size === 'sm' ? 'avatar-sm' : 'avatar-lg'} style={{
      position: 'relative',
      overflow: 'hidden',
      background: '#f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: size === 'lg' ? '32px' : '50%'
    }}>
      {loading ? <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 24} color="#94a3b8" /> : <img src={imgUrl} alt={nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
    </div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('sister_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // States
  const [currentView, setCurrentView] = useState('search');
  const [activeTab, setActiveTab] = useState('kepegawaian');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [tabData, setTabData] = useState(null);

  const [selectedSemester, setSelectedSemester] = useState('20241');
  const [eduDetail, setEduDetail] = useState(null);
  const [loadingEdu, setLoadingEdu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

  // States for Jafung Kampus
  const [campusJafungData, setCampusJafungData] = useState(null);
  const [campusProgress, setCampusProgress] = useState(0);
  const [isCampusLoading, setIsCampusLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    id_pengguna: ""
  });

  const [guestView, setGuestView] = useState('landing');

  const DEFAULT_ID_SP = import.meta.env.VITE_SISTER_ID_SP || "";

  useEffect(() => {
    if (selectedLecturer && currentView === 'detail') {
      fetchTabData(activeTab, selectedLecturer.id_sdm);
    }
  }, [activeTab, selectedLecturer, currentView, selectedSemester]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      if (!loginData.username || !loginData.password) {
        throw new Error("Harap isi username dan password.");
      }

      let actualCredentials = null;
      const customUsersStr = import.meta.env.VITE_CUSTOM_USERS;

      if (customUsersStr) {
        try {
          const customUsers = JSON.parse(customUsersStr);
          const matchedUser = customUsers.find(
            u => u.username === loginData.username && u.password === loginData.password
          );

          if (matchedUser) {
            actualCredentials = {
              username: import.meta.env.VITE_SISTER_USERNAME,
              password: import.meta.env.VITE_SISTER_PASSWORD,
              id_pengguna: import.meta.env.VITE_SISTER_ID_PENGGUNA
            };
          }
        } catch (e) {
          console.error("Gagal mem-parsing VITE_CUSTOM_USERS", e);
        }
      }

      if (!actualCredentials) {
        throw new Error("Username atau password salah.");
      }

      await sisterApi.login(actualCredentials);
      setIsLoggedIn(true);
    } catch (err) {
      // Production ready: Only show friendly message, no technical logs
      setError(err.message || "Autentikasi gagal. Sesi masuk tidak valid.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sister_token');
    setSearchResults([]);
    setSelectedLecturer(null);
    setTabData(null);
    setSearchQuery('');
    setIsLoggedIn(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const data = await sisterApi.searchSDM(searchQuery, DEFAULT_ID_SP);
      const results = Array.isArray(data) ? data : (data.data || []);
      setSearchResults(results);
    } finally {
      setLoading(false);
    }
  };

  const selectLecturer = (lecturer) => {
    setSelectedLecturer(lecturer);
    setCurrentView('detail');
    setActiveTab('kepegawaian');
  };

  const fetchTabData = async (tab, id_sdm) => {
    setLoading(true);
    setTabData(null);
    try {
      let res;
      if (tab === 'kepegawaian') res = await sisterApi.getKepegawaian(id_sdm);
      if (tab === 'jafung') res = await sisterApi.getJafung(id_sdm);
      if (tab === 'pendidikan') res = await sisterApi.getEducation(id_sdm);
      if (tab === 'pengajaran') res = await sisterApi.getPengajaran(id_sdm, selectedSemester);
      if (tab === 'bkd') res = await sisterApi.getBKD(id_sdm, selectedSemester);
      if (tab === 'bkd_laporan') res = await sisterApi.getLaporanAkhirBKD(id_sdm);
      if (tab === 'publikasi') res = await sisterApi.getPublikasi(id_sdm);
      if (tab === 'pengabdian') res = await sisterApi.getPengabdian(id_sdm);

      let finalData = res;
      if (res && res.data && !Array.isArray(res)) finalData = res.data;
      setTabData(finalData);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Data tidak ditemukan di server SISTER.");
      } else {
        setError(`Gagal memuat data ${formatKey(tab)}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCampusJafung = async () => {
    if (isCampusLoading) return;
    setIsCampusLoading(true);
    setCampusProgress(0);
    setCampusJafungData(null);
    setCurrentView('campus_jafung');
    setIsSidebarOpen(false);
    setError(null);

    try {
      // Strategy: Broad Coverage Fragment Search
      // We use fragments that are extremely common in Indonesian names and titles
      const fragments = [
        'abd', 'ahm', 'adi', 'agu', 'aka', 'ala', 'ama', 'ana', 'and', 'ang', 'ani', 'ans', 'ant', 'ara', 'ari', 'arm', 'art', 'ary', 'asa', 'ase', 'asi', 'asm', 'asr', 'ast', 'ati', 'awa', 'ayu', 'bag', 'bah', 'bam', 'bas', 'bud', 'car', 'cha', 'dah', 'dam', 'dan', 'dar', 'ded', 'den', 'der', 'dew', 'dha', 'dia', 'dik', 'din', 'dwi', 'edy', 'eka', 'eko', 'end', 'eny', 'era', 'eri', 'ern', 'est', 'eva', 'fad', 'faj', 'far', 'fat', 'fau', 'feb', 'fer', 'fit', 'gha', 'gun', 'gus', 'had', 'haf', 'hak', 'hal', 'ham', 'han', 'har', 'has', 'hel', 'hen', 'her', 'hid', 'him', 'hus', 'iam', 'ich', 'ida', 'ifr', 'ikh', 'ila', 'ima', 'ina', 'ind', 'ira', 'irm', 'ism', 'ist', 'ita', 'iva', 'iza', 'jaz', 'joh', 'jum', 'jus', 'kar', 'kas', 'kho', 'kri', 'kun', 'kur', 'kus', 'lan', 'lar', 'lat', 'len', 'les', 'lia', 'lif', 'lil', 'lim', 'lin', 'lis', 'lum', 'lus', 'lut', 'maa', 'mad', 'mag', 'mah', 'mai', 'mal', 'mam', 'man', 'mar', 'mas', 'mat', 'mau', 'may', 'meg', 'mei', 'mel', 'met', 'mif', 'moh', 'muh', 'mul', 'mun', 'mur', 'mus', 'mut', 'nad', 'naf', 'nan', 'nar', 'nas', 'nat', 'nav', 'naz', 'nen', 'nia', 'nik', 'nil', 'nin', 'nir', 'nis', 'nit', 'nov', 'nur', 'oct', 'ona', 'ovi', 'pam', 'pan', 'par', 'per', 'pra', 'pri', 'puj', 'pur', 'pus', 'put', 'qod', 'rad', 'rah', 'rai', 'raj', 'rak', 'ram', 'ran', 'rar', 'rat', 'ray', 'ren', 'res', 'ret', 'rez', 'ria', 'rid', 'rif', 'rik', 'rin', 'ris', 'riz', 'rob', 'roc', 'roh', 'roj', 'rom', 'ron', 'ros', 'roy', 'rud', 'rum', 'rus', 'sab', 'sad', 'saf', 'sah', 'sai', 'sak', 'sal', 'sam', 'san', 'sap', 'sar', 'sas', 'sat', 'say', 'sel', 'sep', 'set', 'sha', 'shf', 'sho', 'sia', 'sid', 'sif', 'sig', 'sil', 'sim', 'sin', 'sir', 'sit', 'sla', 'sof', 'son', 'sri', 'sub', 'sud', 'sug', 'suh', 'suk', 'sul', 'sum', 'sun', 'sup', 'sur', 'sus', 'sut', 'suw', 'sya', 'syah', 'syar', 'syih', 'syuk', 'tah', 'tam', 'tan', 'tar', 'tau', 'ted', 'ten', 'ter', 'tet', 'tit', 'tri', 'tut', 'umi', 'uta', 'uti', 'ver', 'vic', 'vid', 'vir', 'vit', 'wah', 'wal', 'wan', 'war', 'wat', 'wen', 'wia', 'wid', 'wig', 'wik', 'win', 'wir', 'wis', 'wiw', 'wiy', 'yan', 'yar', 'yas', 'yat', 'yef', 'yen', 'yoh', 'yos', 'yud', 'yul', 'yun', 'yur', 'yus', 'zai', 'zak', 'zul', 'sti', 'pan', 'cas', 'eti'
      ];
      let allLecturersMap = new Map();

      for (let f = 0; f < fragments.length; f++) {
        const fragment = fragments[f];
        setCampusProgress(Math.round(((f + 1) / fragments.length) * 20));

        try {
          const sdmRes = await sisterApi.getCampusSDM(DEFAULT_ID_SP, fragment);
          const chunk = Array.isArray(sdmRes) ? sdmRes : (sdmRes.data || []);
          chunk.forEach(l => {
            if (l.id_sdm) allLecturersMap.set(l.id_sdm, l);
          });
        } catch (e) {
          console.error(`Fragment ${fragment} failed`);
        }
      }

      const lecturers = Array.from(allLecturersMap.values());

      if (lecturers.length === 0) {
        throw new Error("Tidak ada data dosen ditemukan. Coba lagi nanti.");
      }

      let aggregatedData = [];
      for (let i = 0; i < lecturers.length; i++) {
        const sdm = lecturers[i];
        setCampusProgress(20 + Math.round(((i + 1) / lecturers.length) * 80));

        try {
          const res = await sisterApi.getJafung(sdm.id_sdm);
          const jafungRecords = Array.isArray(res) ? res : (res.data || []);

          if (jafungRecords.length > 0) {
            jafungRecords.forEach(j => {
              aggregatedData.push({
                ...j,
                nama_sdm: sdm.nama_sdm,
                nidn: sdm.nidn
              });
            });
          }
          // Note: Lecturers with no jafung records are now omitted as requested
        } catch (e) {
          console.error(`Failed to fetch jafung for ${sdm.nama_sdm}`);
        }
      }

      setCampusJafungData(aggregatedData);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Gagal memuat data Jafung Kampus.";
      setError(msg);
    } finally {
      setIsCampusLoading(false);
    }
  };

  // Helper to group records by lecturer for rowSpan
  const getGroupedCampusData = () => {
    if (!campusJafungData) return [];
    
    const groups = [];
    let currentGroup = null;

    campusJafungData.forEach(item => {
      if (!currentGroup || currentGroup.nidn !== item.nidn) {
        currentGroup = {
          nama_sdm: item.nama_sdm,
          nidn: item.nidn,
          records: [item]
        };
        groups.push(currentGroup);
      } else {
        currentGroup.records.push(item);
      }
    });

    return groups;
  };

  const openEduDetail = async (id) => {
    setLoadingEdu(true);
    setEduDetail(null);
    try {
      const data = await sisterApi.getEducationDetail(id);
      setEduDetail(data.data || data);
    } catch (err) {
      alert("Gagal memuat detail pendidikan.");
    } finally {
      setLoadingEdu(false);
    }
  };

  const formatKey = (key) => {
    const mapping = {
      'id': 'ID Record',
      'nidn': 'NIDN / NUPTK',
      'nip': 'Nomor Induk Pegawai (NIP)',
      'nuptk': 'NUPTK',
      'nama_sdm': 'Nama Lengkap',
      'nama_status_pegawai': 'Status Pegawai',
      'sk_cpns': 'Nomor SK CPNS',
      'tanggal_sk_cpns': 'Tanggal SK CPNS',
      'sk_tmmd': 'Nomor SK TMMD',
      'tmmd': 'Terhitung Mulai Masa Dinas (TMMD)',
      'id_sumber_gaji': 'ID Sumber Gaji',
      'sumber_gaji': 'Sumber Pendanaan Gaji',
      'status_kepegawaian': 'Status Kepegawaian',
      'ikatan_kerja': 'Ikatan Kerja',
      'jabatan_fungsional': 'Jabatan Fungsional',
      'sk': 'Nomor SK',
      'tanggal_mulai': 'Terhitung Mulai Tanggal (TMT)',
      'jenjang_pendidikan': 'Jenjang Pendidikan',
      'gelar_akademik': 'Gelar Akademik',
      'bidang_studi': 'Bidang Studi / Keilmuan',
      'nama_perguruan_tinggi': 'Nama Perguruan Tinggi',
      'tahun_lulus': 'Tahun Kelulusan',
      'tanggal_lulus': 'Tanggal Kelulusan',
      'nomor_induk': 'Nomor Induk Mahasiswa (NIM)',
      'jumlah_semester': 'Jumlah Semester Terlewati',
      'jumlah_sks': 'Total SKS Lulus',
      'ipk': 'Indeks Prestasi Kumulatif (IPK)',
      'sk_penyetaraan': 'Nomor SK Penyetaraan',
      'nomor_ijazah': 'Nomor Ijazah',
      'judul_tesis': 'Judul Tesis / Disertasi',
      'kategori_kegiatan': 'Kategori Kegiatan',
      'nama_program_studi': 'Nama Program Studi',
      'tahun_masuk': 'Tahun Masuk Kuliah',
      'jenis_ajuan': 'Jenis Pengajuan',
      'id_sdm': 'ID SDM SISTER',
      'id_reg_ptk': 'ID Registrasi PTK',
      'id_smt': 'ID Semester',
      'sks_kinerja_ajar': 'SKS Kinerja Pengajaran',
      'sks_lebih_ajar': 'SKS Kelebihan Pengajaran',
      'sks_kinerja_didik': 'SKS Kinerja Pendidikan',
      'sks_lebih_didik': 'SKS Kelebihan Pendidikan',
      'sks_kinerja_lit': 'SKS Kinerja Penelitian',
      'sks_lebih_lit': 'SKS Kelebihan Penelitian',
      'sks_kinerja_pengmas': 'SKS Kinerja Pengabdian Masyarakat',
      'sks_lebih_pengmas': 'SKS Kelebihan Pengabdian',
      'sks_kinerja_penunjang': 'SKS Kinerja Penunjang',
      'sks_lebih_tunjang': 'SKS Kelebihan Penunjang',
      'sks_kinerja': 'Total SKS Kinerja',
      'sks_lebih': 'Total SKS Kelebihan',
      'stat_kewajiban': 'Status Kewajiban BKD',
      'stat_tugas': 'Status Tugas Tambahan',
      'stat_belajar': 'Status Belajar / Tugas Belajar',
      'id_jabfung': 'ID Jabatan Fungsional',
      'simpulan_asesor': 'Kesimpulan Hasil Asesor',
      'judul': 'Judul Publikasi / Karya',
      'quartile': 'Peringkat Quartile',
      'jenis_publikasi': 'Jenis Publikasi Ilmiah',
      'tanggal': 'Tanggal Publikasi',
      'asal_data': 'Sumber Data Sinkronisasi',
      'id_program_studi': 'ID Prodi',
      'id_jenjang_pendidikan': 'ID Jenjang',
      'id_gelar_akademik': 'ID Gelar',
      'id_bidang_studi': 'ID Bidang Studi',
      'judul_tugas_akhir': 'Judul Tugas Akhir',
      'tanggal_sk_penyetaraan': 'Tanggal SK Penyetaraan',
      'mata_kuliah': 'Mata Kuliah',
      'kelas': 'Kelas',
      'jumlah_mahasiswa': 'Jumlah Mahasiswa',
      'sks': 'SKS',
      'tahun_pelaksanaan': 'Tahun Pelaksanaan',
      'lama_kegiatan': 'Lama Kegiatan',

    };
    return mapping[key] || key;
  };

  const getF = (obj, key) => (obj && obj[key] !== undefined && obj[key] !== null ? String(obj[key]) : '-');

  const handleExportExcel = () => {
    const isGlobal = currentView === 'campus_jafung';
    const targetData = isGlobal ? campusJafungData : tabData;
    
    if (!targetData) return;

    try {
      const wb = XLSX.utils.book_new();
      let exportRows = [];
      let sheetName = "";

      let merges = [];

      if (currentView === 'campus_jafung') {
        const groupedData = getGroupedCampusData();
        let currentRow = 1; // Start after header

        groupedData.forEach((group, idx) => {
          const rowCount = group.records.length;
          
          // Add merge records for columns: No (0), Nama (1), NIDN (2)
          if (rowCount > 1) {
            merges.push(
              { s: { r: currentRow, c: 0 }, e: { r: currentRow + rowCount - 1, c: 0 } }, // No
              { s: { r: currentRow, c: 1 }, e: { r: currentRow + rowCount - 1, c: 1 } }, // Nama
              { s: { r: currentRow, c: 2 }, e: { r: currentRow + rowCount - 1, c: 2 } }  // NIDN
            );
          }

          group.records.forEach(record => {
            exportRows.push({
              'No': idx + 1,
              'Nama Dosen': group.nama_sdm,
              'NIDN': group.nidn,
              'Jabatan Fungsional': record.jabatan_fungsional,
              'Nomor SK': record.sk || '-',
              'TMT Jabatan': record.tanggal_mulai || '-'
            });
            currentRow++;
          });
        });
        sheetName = "Jafung_Kampus_Global";
      } else if (activeTab === 'kepegawaian') {
        const row = {};
        Object.keys(tabData).forEach(k => {
          row[formatKey(k)] = getF(tabData, k);
        });
        exportRows = [row];
        sheetName = "Kepegawaian";
      } else {
        exportRows = (Array.isArray(tabData) ? tabData : []).map(item => {
          const row = {};
          Object.keys(item).forEach(k => {
            if (k !== 'dokumen') row[formatKey(k)] = getF(item, k);
          });
          return row;
        });
        sheetName = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
      }

      const ws = XLSX.utils.json_to_sheet(exportRows);
      
      if (merges.length > 0) {
        ws['!merges'] = merges;
      }

      // Apply Styles (Borders, Alignment, Font)
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
          if (!ws[cell_ref]) continue;
          
          ws[cell_ref].s = {
            alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
            border: {
              top: { style: 'thin', color: { rgb: "000000" } },
              bottom: { style: 'thin', color: { rgb: "000000" } },
              left: { style: 'thin', color: { rgb: "000000" } },
              right: { style: 'thin', color: { rgb: "000000" } }
            },
            font: { name: 'Arial', sz: 10 }
          };

          // Header Styling
          if (R === 0) {
            ws[cell_ref].s.fill = { fgColor: { rgb: "E2E8F0" } };
            ws[cell_ref].s.font = { bold: true, name: 'Arial', sz: 10 };
          }
        }
      }

      if (exportRows.length > 0) {
        const colsWidth = [];
        const headers = Object.keys(exportRows[0]);

        headers.forEach((header, i) => {
          let maxLen = header.length;
          exportRows.forEach(row => {
            const val = row[header] ? String(row[header]) : "";
            if (val.length > maxLen) maxLen = val.length;
          });
          colsWidth[i] = { wch: maxLen + 5 };
        });
        ws["!cols"] = colsWidth;
        ws["!autofilter"] = { ref: XLSX.utils.encode_range(XLSX.utils.decode_range(ws["!ref"])) };
      }

      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      const fileName = currentView === 'campus_jafung' 
        ? `SISTER_JAFUNG_KAMPUS_ALL_${new Date().toISOString().split('T')[0]}.xlsx`
        : `SISTER_${activeTab}_${selectedLecturer.nama_sdm.replace(/\s+/g, '_')}.xlsx`;
        
      XLSX.writeFile(wb, fileName);
    } catch (err) {
      alert("Gagal melakukan export Excel.");
    }
  };


  if (!isLoggedIn) {
    return (
      <div className="guest-layout-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'clip' }}>
        <header className="landing-nav" style={{
          padding: '12px 5%',
          backgroundColor: '#ac1234',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setGuestView('landing')}>
            <div style={{ background: 'white', borderRadius: '50%', padding: '4px', display: 'flex' }}>
              <img src="/icon2.png" alt="Icon" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
            </div>
            <div style={{ lineHeight: 1 }}>
              <h1 style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>SISTER</h1>
              <p style={{ fontSize: 'clamp(0.5rem, 2vw, 0.6rem)', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '3px' }}>STIE PANCASETIA</p>
            </div>
          </div>
          <button onClick={() => setGuestView(guestView === 'landing' ? 'login' : 'landing')} className="btn-search" style={{ borderRadius: '12px', padding: '8px 18px', fontSize: '0.8rem', background: 'white', color: '#ac1234', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
            {guestView === 'landing' ? 'Masuk' : 'Beranda'}
          </button>
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {guestView === 'landing' ? (
            <LandingPage setGuestView={setGuestView} />
          ) : (
            <LoginPage
              loginData={loginData}
              setLoginData={setLoginData}
              handleLogin={handleLogin}
              loading={loading}
              error={error}
              setError={setError}
            />
          )}
        </main>

        <footer style={{ padding: '80px 8% 40px', background: 'white', borderTop: '1px solid #f1f5f9', color: '#1e293b' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '60px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src="/icon2.png" alt="Icon" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                <div>
                  <h3 style={{ fontWeight: 900, fontSize: '1.5rem', color: '#ac1234', letterSpacing: '-1px' }}>SISTER</h3>
                  <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>STIE PANCASETIA</p>
                </div>
              </div>
              <p style={{ opacity: 0.8, fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '300px' }}>Sistem Informasi Sumberdaya Terintegrasi untuk pengelolaan data dosen dan tenaga kependidikan STIE Pancasetia.</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                {/* Social placeholders similar to SIPERU */}
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ac1234' }}><Globe size={18} /></div>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ac1234' }}><Link size={18} /></div>
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: 900, fontSize: '0.8rem', color: '#ac1234', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>KAMPUS BANJARMASIN</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>Jl. Ahmad Yani km 5.5 RT. 08 Banjarmasin<br />(0511) 325 6560</p>
            </div>

            <div>
              <h4 style={{ fontWeight: 900, fontSize: '0.8rem', color: '#ac1234', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>KAMPUS BANJARBARU</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>Jl. Trikora RT.018 RW.03 Kel. Guntung Manggis Kec. Landasan Ulin Banjarbaru<br />(0511) 4777200</p>
            </div>
          </div>
          <div style={{ borderTop: '1.5px solid #f1f5f9', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <p style={{ fontWeight: 800, fontSize: '0.85rem', color: '#ac1234' }}>© {new Date().getFullYear()} IT STIE PANCASETIA. All Rights Reserved.</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>Privacy Policy</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>Terms of Service</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-left">
          <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={24} />
          </button>
          <img src="/icon2.png" alt="Icon" className="logo-sister" style={{ width: '38px', height: '38px', cursor: 'pointer', objectFit: 'contain' }} />
          <div className="navbar-title"><h2>SISTER STIE PANCASETIA</h2></div>
        </div>
        <button className="btn-logout-alt" onClick={handleLogout}>
          <LogOut size={16} /> <span className="hide-mobile">Keluar</span>
        </button>
      </nav>

      <div className="main-layout">
        <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
        
        <aside className={`sidebar ${isSidebarOpen ? 'mobile-open' : 'collapsed'}`}>
          <div className="sidebar-content">
            <div className={`nav-item ${currentView === 'search' ? 'active' : ''}`} onClick={() => { setCurrentView('search'); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }}><LayoutDashboard size={20} /> <span>Beranda</span></div>
            
            <div className="menu-label">FITUR GLOBAL</div>
            <div className={`nav-item ${currentView === 'campus_jafung' ? 'active' : ''}`} onClick={() => { fetchCampusJafung(); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }}>
              <Database size={20} /> <span>Jafung Kampus</span>
            </div>

            <div className="menu-label">PENARIKAN DATA</div>
            <div className={`nav-item ${!selectedLecturer ? 'disabled' : ''} ${currentView === 'detail' && activeTab === 'kepegawaian' ? 'active' : ''}`} onClick={() => selectedLecturer && (setCurrentView('detail'), setActiveTab('kepegawaian'), window.innerWidth <= 1024 && setIsSidebarOpen(false))}><UserCheck size={20} /> <span>Kepegawaian</span></div>
            <div className={`nav-item ${!selectedLecturer ? 'disabled' : ''} ${currentView === 'detail' && activeTab === 'jafung' ? 'active' : ''}`} onClick={() => selectedLecturer && (setCurrentView('detail'), setActiveTab('jafung'), window.innerWidth <= 1024 && setIsSidebarOpen(false))}><Award size={20} /> <span>Jabatan Fungsional</span></div>
            <div className={`nav-item ${!selectedLecturer ? 'disabled' : ''} ${currentView === 'detail' && activeTab === 'pendidikan' ? 'active' : ''}`} onClick={() => selectedLecturer && (setCurrentView('detail'), setActiveTab('pendidikan'), window.innerWidth <= 1024 && setIsSidebarOpen(false))}><BookOpen size={20} /> <span>Pendidikan Formal</span></div>
            <div className={`nav-item ${!selectedLecturer ? 'disabled' : ''} ${currentView === 'detail' && activeTab === 'pengajaran' ? 'active' : ''}`} onClick={() => selectedLecturer && (setCurrentView('detail'), setActiveTab('pengajaran'), window.innerWidth <= 1024 && setIsSidebarOpen(false))}><GraduationCap size={20} /> <span>Pengajaran</span></div>

            <div className="menu-label">BEBAN KERJA (BKD)</div>
            <div className={`nav-item ${!selectedLecturer ? 'disabled' : ''} ${currentView === 'detail' && activeTab === 'bkd' ? 'active' : ''}`} onClick={() => selectedLecturer && (setCurrentView('detail'), setActiveTab('bkd'), window.innerWidth <= 1024 && setIsSidebarOpen(false))}><ListChecks size={20} /> <span>BKD Pengajaran</span></div>
            <div className={`nav-item ${!selectedLecturer ? 'disabled' : ''} ${currentView === 'detail' && activeTab === 'bkd_laporan' ? 'active' : ''}`} onClick={() => selectedLecturer && (setCurrentView('detail'), setActiveTab('bkd_laporan'), window.innerWidth <= 1024 && setIsSidebarOpen(false))}><FileBarChart size={20} /> <span>Laporan Akhir BKD</span></div>

            <div className="menu-label">PUBLIKASI</div>
            <div className={`nav-item ${!selectedLecturer ? 'disabled' : ''} ${currentView === 'detail' && activeTab === 'publikasi' ? 'active' : ''}`} onClick={() => selectedLecturer && (setCurrentView('detail'), setActiveTab('publikasi'), window.innerWidth <= 1024 && setIsSidebarOpen(false))}><Newspaper size={20} /> <span>Publikasi Ilmiah</span></div>

            <div className="menu-label">PENGABDIAN</div>
            <div className={`nav-item ${!selectedLecturer ? 'disabled' : ''} ${currentView === 'detail' && activeTab === 'pengabdian' ? 'active' : ''}`} onClick={() => selectedLecturer && (setCurrentView('detail'), setActiveTab('pengabdian'), window.innerWidth <= 1024 && setIsSidebarOpen(false))}><HeartHandshake size={20} /> <span>Pengabdian Masyarakat</span></div>
          </div>
        </aside>

        <main className="content-body">
          {currentView === 'search' ? (
            <div className="welcome-card">
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Selamat Datang</h1>
              <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '12px' }}>Cari dosen untuk melihat riwayat lengkap Kepegawaian, Pendidikan, BKD, dan Publikasi.</p>
              <form className="search-field" style={{ marginTop: '44px' }} onSubmit={handleSearch}>
                <Search size={22} style={{ marginLeft: '20px', color: '#94a3b8' }} />
                <input type="text" placeholder="Masukkan nama dosen yang ingin dicari..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <button type="submit" className="btn-search">CARI DATA</button>
              </form>
              <div className="sdm-grid">
                {searchResults.map(item => (
                  <div key={item.id_sdm} className="sdm-item" onClick={() => selectLecturer(item)}>
                    <SdmAvatar id_sdm={item.id_sdm} nama={item.nama_sdm} size="sm" />
                    <div style={{ flex: 1 }}>
                      <span className="status-badge" style={{ marginBottom: '10px' }}>{getF(item, 'nama_status_pegawai')}</span>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>{getF(item, 'nama_sdm')}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>NIDN: <strong>{getF(item, 'nidn')}</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : currentView === 'campus_jafung' ? (
            <div className="detail-page" style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <div className="banner-blue">
                <Database size={48} />
                <div className="banner-text">
                  <h1>Data Jabatan Fungsional Kampus</h1>
                  <p style={{ opacity: 0.9, fontSize: '1rem', fontWeight: 600 }}>Menampilkan seluruh riwayat jafung dosen STIE Pancasetia secara kolektif.</p>
                </div>
              </div>

              <div className="profile-card">
                <div className="profile-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Database size={22} /> REKAPITULASI JAFUNG SELURUH DOSEN
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {campusJafungData && (
                      <button className="btn-detail-row" onClick={handleExportExcel} style={{ background: '#166534', color: 'white', borderColor: '#166534' }}>
                        <FileText size={16} style={{ marginRight: '6px' }} /> Export Excel (.xlsx)
                      </button>
                    )}
                    <button className="btn-search" onClick={fetchCampusJafung} disabled={isCampusLoading} style={{ padding: '8px 20px', fontSize: '0.8rem' }}>
                      {isCampusLoading ? 'MENARIK DATA...' : 'REFRESH DATA'}
                    </button>
                  </div>
                </div>

                <div className="profile-card-body">
                  {isCampusLoading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                      <Loader2 className="animate-spin" size={48} color="#005596" style={{ margin: '0 auto 24px' }} />
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>Sedang Mengambil Data...</h3>
                      <p style={{ color: '#64748b', marginTop: '8px' }}>Proses ini mungkin memakan waktu beberapa menit tergantung jumlah dosen.</p>
                      
                      <div style={{ maxWidth: '500px', margin: '32px auto 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 700 }}>
                          <span>Progress Pengambilan Data</span>
                          <span>{campusProgress}%</span>
                        </div>
                        <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                          <div style={{ height: '100%', width: `${campusProgress}%`, background: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
                        </div>
                      </div>
                    </div>
                  ) : error && currentView === 'campus_jafung' ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>
                      <AlertCircle size={48} style={{ marginBottom: '16px' }} />
                      <h3 style={{ fontWeight: 800 }}>Terjadi Kesalahan</h3>
                      <p style={{ marginTop: '8px', fontWeight: 600 }}>{error}</p>
                      <button className="btn-search" onClick={fetchCampusJafung} style={{ marginTop: '24px' }}>COBA LAGI</button>
                    </div>
                  ) : campusJafungData ? (
                    <div className="table-wrapper">
                      <table className="info-table">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Nama Dosen</th>
                            <th>NIDN</th>
                            <th>Jabatan Fungsional</th>
                            <th>Nomor SK</th>
                            <th>TMT Jabatan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getGroupedCampusData().map((group, groupIdx) => (
                            <React.Fragment key={groupIdx}>
                              {group.records.map((record, recordIdx) => (
                                <tr key={`${groupIdx}-${recordIdx}`}>
                                  {recordIdx === 0 && (
                                    <>
                                      <td rowSpan={group.records.length} style={{ color: '#94a3b8', fontWeight: 700, verticalAlign: 'middle' }}>
                                        {groupIdx + 1}
                                      </td>
                                      <td rowSpan={group.records.length} style={{ verticalAlign: 'middle' }}>
                                        <strong>{group.nama_sdm}</strong>
                                      </td>
                                      <td rowSpan={group.records.length} style={{ verticalAlign: 'middle' }}>
                                        <span className="status-badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                                          {group.nidn}
                                        </span>
                                      </td>
                                    </>
                                  )}
                                  <td><strong style={{ color: 'var(--primary)' }}>{record.jabatan_fungsional}</strong></td>
                                  <td>{record.sk || '-'}</td>
                                  <td>{record.tanggal_mulai || '-'}</td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                      <AlertCircle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                      <p>Klik tombol 'REFRESH DATA' untuk mulai menarik data jafung seluruh dosen.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="detail-page" style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <div className="banner-red">
                <SdmAvatar id_sdm={selectedLecturer.id_sdm} nama={selectedLecturer.nama_sdm} size="lg" />
                <div className="banner-text">
                  <h1>{getF(selectedLecturer, 'nama_sdm')}</h1>
                  <div className="banner-badges"><div className="card-badge">NIDN: {getF(selectedLecturer, 'nidn')}</div><div className="card-badge">{getF(selectedLecturer, 'nama_status_pegawai')}</div></div>
                </div>
              </div>

              <div className="profile-card">
                <div className="profile-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {activeTab === 'kepegawaian' && <><UserCheck size={22} /> DATA KEPEGAWAIAN LENGKAP</>}
                  {activeTab === 'jafung' && <><Award size={22} /> RIWAYAT JABATAN FUNGSIONAL</>}
                  {activeTab === 'pendidikan' && <><BookOpen size={22} /> RIWAYAT PENDIDIKAN FORMAL</>}
                  {activeTab === 'pengajaran' && <><GraduationCap size={22} /> DATA PENGAJARAN (Sem: {selectedSemester})</>}
                  {activeTab === 'bkd' && <><ListChecks size={22} /> BKD PENGAJARAN (Sem: {selectedSemester})</>}
                  {activeTab === 'bkd_laporan' && <><FileBarChart size={22} /> LAPORAN AKHIR BKD</>}
                  {activeTab === 'publikasi' && <><Newspaper size={22} /> DAFTAR PUBLIKASI ILMIAH</>}
                  {activeTab === 'pengabdian' && <><ShieldCheck size={22} /> DAFTAR PENGABDIAN MASYARAKAT</>}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {(activeTab === 'bkd' || activeTab === 'pengajaran') && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '0.75rem', fontWeight: 800 }}>SEMESTER:</span><input type="text" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} style={{ width: '90px', padding: '6px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700 }} /></div>
                    )}
                    <button className="btn-detail-row" onClick={handleExportExcel} style={{ background: '#166534', color: 'white', borderColor: '#166534' }}>
                      <FileText size={16} style={{ marginRight: '6px' }} /> Export Excel
                    </button>
                  </div>
                </div>

                <div className="profile-card-body">
                  {loading && !loadingEdu ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}><Loader2 className="animate-spin" size={40} color="#005596" /></div>
                  ) : tabData ? (
                    <div className="table-wrapper">
                      {activeTab === 'kepegawaian' && (
                        <table className="info-table">
                          <tbody>
                            {Object.keys(tabData).map(key => (
                              <tr key={key}><td className="label-cell">{formatKey(key)}</td><td className="value-cell">{getF(tabData, key)}</td></tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {activeTab === 'jafung' && (
                        <table className="info-table">
                          <thead><tr><th>ID Record</th><th>Jabatan Fungsional</th><th>Nomor SK</th><th>Terhitung Mulai Tanggal Jabatan</th></tr></thead>
                          <tbody>
                            {(Array.isArray(tabData) ? tabData : []).map((j, i) => (
                              <tr key={i}>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{getF(j, 'id')}</td>
                                <td><strong>{getF(j, 'jabatan_fungsional')}</strong></td>
                                <td>{getF(j, 'sk')}</td>
                                <td>{getF(j, 'tanggal_mulai')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {activeTab === 'pendidikan' && (
                        <table className="info-table">
                          <thead><tr><th>ID</th><th>Jenjang</th><th>Perguruan Tinggi</th><th>Tahun Lulus</th><th style={{ textAlign: 'center' }}>Opsi</th></tr></thead>
                          <tbody>
                            {(Array.isArray(tabData) ? tabData : []).map((edu, i) => (
                              <tr key={i}>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{getF(edu, 'id')}</td>
                                <td><span className="status-badge" style={{ backgroundColor: '#005596', color: 'white', border: 'none' }}>{getF(edu, 'jenjang_pendidikan')}</span></td>
                                <td><strong>{getF(edu, 'nama_perguruan_tinggi')}</strong></td>
                                <td>{getF(edu, 'tahun_lulus')}</td>
                                <td style={{ textAlign: 'center' }}><button className="btn-detail-row" onClick={() => openEduDetail(edu.id)}><Eye size={16} style={{ marginRight: '6px' }} /> Detail</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {activeTab === 'pengajaran' && (
                        <table className="info-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Semester</th>
                              <th>Mata Kuliah</th>
                              <th>Kelas</th>
                              <th style={{ textAlign: 'center' }}>Jumlah Mhs</th>
                              <th style={{ textAlign: 'center' }}>SKS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(Array.isArray(tabData) ? tabData : []).map((p, i) => (
                              <tr key={i}>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#94a3b8' }}>{getF(p, 'id')}</td>
                                <td>{getF(p, 'semester')}</td>
                                <td><strong>{getF(p, 'mata_kuliah')}</strong></td>
                                <td>{getF(p, 'kelas')}</td>
                                <td style={{ textAlign: 'center' }}>{getF(p, 'jumlah_mahasiswa')}</td>
                                <td style={{ textAlign: 'center' }}><strong>{getF(p, 'sks')}</strong></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {activeTab === 'bkd' && (
                        <table className="info-table">
                          <thead>
                            <tr>
                              <th>Nama Dosen</th>
                              <th>NIDN</th>
                              <th>SMT</th>
                              <th>Unsur</th>
                              <th>Judul Kegiatan</th>
                              <th style={{ textAlign: 'center' }}>SKS</th>
                              <th style={{ textAlign: 'center' }}>Nilai</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(Array.isArray(tabData) ? tabData : []).map((b, i) => (
                              <tr key={i}>
                                <td>{getF(b, 'nm_sdm')}</td>
                                <td>{getF(b, 'nidn')}</td>
                                <td>{getF(b, 'id_smt')}</td>
                                <td>{getF(b, 'unsur')}</td>
                                <td><strong style={{ fontSize: '0.85rem' }}>{getF(b, 'judul_keg')}</strong></td>
                                <td style={{ textAlign: 'center' }}><strong>{Number(getF(b, 'beban_sks')).toFixed(2)}</strong></td>
                                <td style={{ textAlign: 'center' }}><strong>{Number(getF(b, 'nilai')).toFixed(2)}</strong></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {activeTab === 'bkd_laporan' && (
                        <table className="info-table">
                          <thead>
                            <tr>
                              <th>ID Registrasi</th>
                              <th>Semester</th>
                              <th>Kinerja Ajar</th>
                              <th>Lebih Ajar</th>
                              <th>Kinerja Didik</th>
                              <th>Lebih Didik</th>
                              <th>Kinerja Lit</th>
                              <th>Lebih Lit</th>
                              <th>Kinerja Pengmas</th>
                              <th>Lebih Pengmas</th>
                              <th>Kinerja Penunjang</th>
                              <th>Lebih Penunjang</th>
                              <th>Total Kinerja</th>
                              <th>Total Lebih</th>
                              <th>Stat Kewajiban</th>
                              <th>Stat Tugas</th>
                              <th>Stat Belajar</th>
                              <th>ID Jafung</th>
                              <th>Simpulan Asesor</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(Array.isArray(tabData) ? tabData : []).map((l, i) => (
                              <tr key={i}>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{getF(l, 'id_reg_ptk')}</td>
                                <td><strong>{getF(l, 'id_smt')}</strong></td>
                                <td>{getF(l, 'sks_kinerja_ajar')}</td>
                                <td>{getF(l, 'sks_lebih_ajar')}</td>
                                <td>{getF(l, 'sks_kinerja_didik')}</td>
                                <td>{getF(l, 'sks_lebih_didik')}</td>
                                <td>{getF(l, 'sks_kinerja_lit')}</td>
                                <td>{getF(l, 'sks_lebih_lit')}</td>
                                <td>{getF(l, 'sks_kinerja_pengmas')}</td>
                                <td>{getF(l, 'sks_lebih_pengmas')}</td>
                                <td>{getF(l, 'sks_kinerja_penunjang')}</td>
                                <td>{getF(l, 'sks_lebih_tunjang')}</td>
                                <td style={{ color: '#005596', fontWeight: 800 }}>{getF(l, 'sks_kinerja')}</td>
                                <td style={{ color: '#eab308', fontWeight: 800 }}>{getF(l, 'sks_lebih')}</td>
                                <td>{getF(l, 'stat_kewajiban')}</td>
                                <td>{getF(l, 'stat_tugas')}</td>
                                <td>{getF(l, 'stat_belajar')}</td>
                                <td>{getF(l, 'id_jabfung')}</td>
                                <td style={{ color: l.simpulan_asesor === 'M' ? '#166534' : '#b91c1c', fontWeight: 800 }}>{getF(l, 'simpulan_asesor')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {activeTab === 'publikasi' && (
                        <table className="info-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Kategori Kegiatan</th>
                              <th>Judul Publikasi</th>
                              <th style={{ textAlign: 'center' }}>Quartile</th>
                              <th>Tanggal</th>
                              <th>Sumber Data</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(Array.isArray(tabData) ? tabData : []).map((p, i) => (
                              <tr key={i}>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#94a3b8' }}>{getF(p, 'id')}</td>
                                <td><span style={{ fontSize: '0.8rem', color: '#64748b' }}>{getF(p, 'kategori_kegiatan')}</span></td>
                                <td><strong>{getF(p, 'judul')}</strong></td>
                                <td style={{ textAlign: 'center' }}><span className="status-badge" style={{ background: '#fef3c7', color: '#92400e' }}>{getF(p, 'quartile')}</span></td>
                                <td>{getF(p, 'tanggal')}</td>
                                <td><span className="status-badge" style={{ background: '#dcfce7', color: '#166534' }}>{getF(p, 'asal_data')}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {activeTab === 'pengabdian' && (
                        <table className="info-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Judul Pengabdian</th>
                              <th style={{ textAlign: 'center' }}>Tahun</th>
                              <th style={{ textAlign: 'center' }}>Lama (Tahun)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(Array.isArray(tabData) ? tabData : []).map((p, i) => (
                              <tr key={i}>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#94a3b8' }}>{getF(p, 'id')}</td>
                                <td><strong>{getF(p, 'judul')}</strong></td>
                                <td style={{ textAlign: 'center' }}>{getF(p, 'tahun_pelaksanaan')}</td>
                                <td style={{ textAlign: 'center' }}>{getF(p, 'lama_kegiatan')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  ) : <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Informasi tidak tersedia di server.</p>}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Detail & Dokumen */}
      {(loadingEdu || eduDetail) && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><img src="/icon2.png" alt="Icon" style={{ width: '36px', height: '36px', objectFit: 'contain' }} /><h2>Detail Riwayat Pendidikan Full</h2></div>
              <button className="close-btn" onClick={() => (setEduDetail(null), setLoadingEdu(false))}><X size={20} /></button>
            </div>
            <div className="modal-body">
              {loadingEdu ? (<div style={{ textAlign: 'center', padding: '60px' }}><Loader2 className="animate-spin" size={48} color="#005596" /></div>) : (
                <div className="edu-detail-grid">
                  <div style={{ background: 'var(--primary-light)', padding: '24px', borderRadius: '24px', border: '2px solid #d0e6ff', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <div style={{ background: 'var(--primary)', color: 'white', padding: '18px 24px', borderRadius: '20px', fontSize: '2.2rem', fontWeight: 900 }}>{getF(eduDetail, 'jenjang_pendidikan')}</div>
                      <div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>{getF(eduDetail, 'nama_perguruan_tinggi')}</h3>
                        <p style={{ color: '#475569', fontSize: '1.1rem', fontWeight: 600 }}>Gelar: <span style={{ color: 'var(--primary)' }}>{getF(eduDetail, 'gelar_akademik')}</span></p>
                      </div>
                    </div>
                  </div>

                  <h4 className="card-label">DATA ATRIBUT LENGKAP</h4>
                  <table className="info-table-mini">
                    <tbody>
                      {Object.keys(eduDetail).map(key => key !== 'dokumen' && (
                        <tr key={key}><td className="label-cell">{formatKey(key)}</td><td className="value-cell">{getF(eduDetail, key)}</td></tr>
                      ))}
                    </tbody>
                  </table>

                  {eduDetail.dokumen && (
                    <div style={{ marginTop: '40px' }}>
                      <h4 className="card-label" style={{ color: '#166534' }}>DOKUMEN PENDUKUNG (IJAZAH / TRANSKRIP)</h4>
                      <div className="doc-list" style={{ marginTop: '16px' }}>
                        {Array.isArray(eduDetail.dokumen) && eduDetail.dokumen.length > 0 ? eduDetail.dokumen.map((doc, idx) => (
                          <div key={idx} className="doc-item" style={{ background: '#ffffff', border: '2.5px solid #f1f5f9', padding: '20px', borderRadius: '20px' }}>
                            <div style={{ background: '#f1f5f9', padding: '14px', borderRadius: '18px' }}><FileText size={30} color="#005596" /></div>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1e293b' }}>{doc.nama}</p>
                              <span className="status-badge" style={{ marginTop: '4px' }}>{doc.jenis_dokumen}</span>
                              <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '4px' }}>{doc.nama_file}</p>
                            </div>
                            <a
                              href={doc.tautan}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-download"
                              style={{ padding: '12px 18px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', borderRadius: '14px' }}
                              download={doc.nama_file}
                            >
                              <Download size={18} /> <span style={{ fontWeight: 700 }}>Download</span>
                            </a>
                          </div>
                        )) : <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Tidak ada dokumen pendukung terlampir.</p>}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
