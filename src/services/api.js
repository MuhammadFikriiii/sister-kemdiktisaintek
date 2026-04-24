import axios from 'axios';

const BASE_URL = '/api';

const api = axios.create({
  baseURL: BASE_URL,
});

let authToken = localStorage.getItem('sister_token') || '';

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export const login = async (credentials) => {
  try {
    const response = await api.post('/authorize', credentials);
    const token = response.data.token || response.data.kode_barrel;
    if (token) {
      authToken = token;
      localStorage.setItem('sister_token', token);
    }
    return response.data;
  } catch (error) {
    // Discreet error logging for production
    throw new Error(error.response?.data?.message || "Gagal menghubungi server SISTER.");
  }
};

export const searchSDM = async (nama, id_sp = '') => {
  const response = await api.get(`/referensi/sdm`, {
    params: { id_sp, nama }
  });
  return response.data;
};

// New: Get all SDM in a campus without name filter
export const getCampusSDM = async (id_sp, nama = '%%%') => {
  const response = await api.get(`/referensi/sdm`, {
    params: { id_sp, nama, per_page: 1000 }
  });
  return response.data;
};

export const getKepegawaian = async (id_sdm) => {
  const response = await api.get(`/data_pribadi/kepegawaian/${id_sdm}`);
  return response.data;
};

export const getJafung = async (id_sdm) => {
  const response = await api.get(`/jabatan_fungsional`, {
    params: { id_sdm }
  });
  return response.data;
};

export const getEducation = async (id_sdm) => {
  const response = await api.get(`/pendidikan_formal`, {
    params: { id_sdm }
  });
  return response.data;
};

export const getEducationDetail = async (id) => {
  const response = await api.get(`/pendidikan_formal/${id}`);
  return response.data;
};

export const getBKD = async (id_sdm, id_smt) => {
  const response = await api.get(`/bkd/ajar`, {
    params: { id_sdm, id_smt }
  });
  return response.data;
};

export const getPengajaran = async (id_sdm, id_semester) => {
  const response = await api.get(`/pengajaran`, {
    params: { id_sdm, id_semester }
  });
  return response.data;
};

export const getPengabdian = async (id_sdm) => {
  const response = await api.get(`/pengabdian`, {
    params: {
      id_sdm
      , per_page: 100, page: 1
    }
  });
  return response.data;
};

export const getLaporanAkhirBKD = async (id_sdm) => {
  const response = await api.get(`/bkd/laporan_akhir_bkd`, {
    params: { id_sdm }
  });
  return response.data;
};

export const getPublikasi = async (id_sdm) => {
  const response = await api.get(`/publikasi`, {
    params: { id_sdm, per_page: 100, page: 1 }
  });
  return response.data;
};

// New: Get authenticated photo blob
export const getPhotoBlob = async (id_sdm) => {
  const response = await api.get(`/data_pribadi/foto/${id_sdm}`, {
    responseType: 'blob'
  });
  return URL.createObjectURL(response.data);
};

export default api;
