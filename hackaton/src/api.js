const API_BASE = 'http://localhost:3001/api'

async function request(endpoint, options = {}) {
  const { method = 'GET', body } = options
  const config = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) config.body = JSON.stringify(body)

  const res = await fetch(`${API_BASE}${endpoint}`, config)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),

  // Users
  getUsers: () => request('/users'),

  // Sekolah
  getSekolah: () => request('/sekolah'),
  getSekolahById: (id) => request(`/sekolah/${id}`),
  createSekolah: (data) => request('/sekolah', { method: 'POST', body: data }),
  updateSekolah: (id, data) => request(`/sekolah/${id}`, { method: 'PUT', body: data }),
  deleteSekolah: (id) => request(`/sekolah/${id}`, { method: 'DELETE' }),

  // Vendors
  getVendors: () => request('/vendors'),
  getVendorById: (id) => request(`/vendors/${id}`),
  createVendor: (data) => request('/vendors', { method: 'POST', body: data }),
  updateVendor: (id, data) => request(`/vendors/${id}`, { method: 'PUT', body: data }),
  deleteVendor: (id) => request(`/vendors/${id}`, { method: 'DELETE' }),

  // Dapur
  getDapur: () => request('/dapur'),
  createDapur: (data) => request('/dapur', { method: 'POST', body: data }),
  updateDapur: (id, data) => request(`/dapur/${id}`, { method: 'PUT', body: data }),
  deleteDapur: (id) => request(`/dapur/${id}`, { method: 'DELETE' }),

  // Stok Dapur
  getStok: (idDapur) => request(`/stok/${idDapur}`),
  createStok: (data) => request('/stok', { method: 'POST', body: data }),
  updateStok: (id, data) => request(`/stok/${id}`, { method: 'PUT', body: data }),
  deleteStok: (id) => request(`/stok/${id}`, { method: 'DELETE' }),

  // Mapping
  getMapping: () => request('/mapping'),
  createMapping: (data) => request('/mapping', { method: 'POST', body: data }),
  deleteMapping: (id) => request(`/mapping/${id}`, { method: 'DELETE' }),

  // Menus
  getMenus: () => request('/menus'),
  getMenuById: (id) => request(`/menus/${id}`),
  createMenu: (data) => request('/menus', { method: 'POST', body: data }),
  updateMenu: (id, data) => request(`/menus/${id}`, { method: 'PUT', body: data }),
  deleteMenu: (id) => request(`/menus/${id}`, { method: 'DELETE' }),

  // Produksi
  getProduksi: () => request('/produksi'),
  createProduksi: (data) => request('/produksi', { method: 'POST', body: data }),
  updateProduksi: (id, data) => request(`/produksi/${id}`, { method: 'PUT', body: data }),

  // Distribusi
  getDistribusi: () => request('/distribusi'),
  createDistribusi: (data) => request('/distribusi', { method: 'POST', body: data }),
  updateDistribusi: (id, data) => request(`/distribusi/${id}`, { method: 'PUT', body: data }),

  // Standar Gizi
  getStandarGizi: () => request('/standar-gizi'),
  createStandarGizi: (data) => request('/standar-gizi', { method: 'POST', body: data }),
  updateStandarGizi: (id, data) => request(`/standar-gizi/${id}`, { method: 'PUT', body: data }),
  deleteStandarGizi: (id) => request(`/standar-gizi/${id}`, { method: 'DELETE' }),

  // Validasi Log
  getValidasiLog: () => request('/validasi-log'),
  createValidasiLog: (data) => request('/validasi-log', { method: 'POST', body: data }),

  // Feedback
  getFeedback: () => request('/feedback'),
  createFeedback: (data) => request('/feedback', { method: 'POST', body: data }),

  // Konfirmasi
  getKonfirmasi: () => request('/konfirmasi'),
  createKonfirmasi: (data) => request('/konfirmasi', { method: 'POST', body: data }),

  // Alerts
  getAlerts: () => request('/alerts'),
  createAlert: (data) => request('/alerts', { method: 'POST', body: data }),
  resolveAlert: (id, userId) => request(`/alerts/${id}/resolve`, { method: 'PUT', body: { resolved_by: userId } }),

  // Wilayah
  getWilayah: () => request('/wilayah'),

  // Dokumen
  getDokumen: (vendorId) => request(`/dokumen/${vendorId}`),
  createDokumen: (data) => request('/dokumen', { method: 'POST', body: data }),

  // Health
  health: () => request('/health'),
}

export default api
