const API_ORIGIN = 'http://localhost:3001'
const API_BASE = `${API_ORIGIN}/api`

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
  getLoginAccounts: () => request('/auth/accounts'),

  // Users
  getUsers: () => request('/users'),

  // Sekolah
  getSekolah: (options = {}) => request(`/sekolah${options.includeInactive ? '?includeInactive=true' : ''}`),
  getSekolahById: (id) => request(`/sekolah/${id}`),
  getSekolahByUser: (userId, options = {}) => request(`/sekolah/by-user/${userId}${options.includeInactive ? '?includeInactive=true' : ''}`),
  createSekolah: (data) => request('/sekolah', { method: 'POST', body: data }),
  updateSekolah: (id, data) => request(`/sekolah/${id}`, { method: 'PUT', body: data }),
  deleteSekolah: (id) => request(`/sekolah/${id}`, { method: 'DELETE' }),
  reactivateSekolah: (id) => request(`/sekolah/${id}/reactivate`, { method: 'PUT' }),

  // Vendors
  getVendors: () => request('/vendors'),
  getVendorById: (id) => request(`/vendors/${id}`),
  getVendorByUser: (userId) => request(`/vendors/by-user/${userId}`),
  createVendor: (data) => request('/vendors', { method: 'POST', body: data }),
  updateVendor: (id, data) => request(`/vendors/${id}`, { method: 'PUT', body: data }),
  deleteVendor: (id) => request(`/vendors/${id}`, { method: 'DELETE' }),

  // Dapur
  getDapur: () => request('/dapur'),
  createDapur: (data) => request('/dapur', { method: 'POST', body: data }),
  updateDapur: (id, data) => request(`/dapur/${id}`, { method: 'PUT', body: data }),
  deleteDapur: (id) => request(`/dapur/${id}`, { method: 'DELETE' }),
  approveDapur: (id, data) => request(`/dapur/${id}/approve`, { method: 'PUT', body: data }),
  rejectDapur: (id, data) => request(`/dapur/${id}/reject`, { method: 'PUT', body: data }),

  getStok: (idDapur) => request(`/stok/${idDapur}`),
  createStok: (data) => request('/stok', { method: 'POST', body: data }),
  updateStok: (id, data) => request(`/stok/${id}`, { method: 'PUT', body: data }),
  deleteStok: (id) => request(`/stok/${id}`, { method: 'DELETE' }),
  getStokHistory: (idDapur) => request(`/stok/history/${idDapur}`),

  // Mapping
  getMapping: () => request('/mapping'),
  createMapping: (data) => request('/mapping', { method: 'POST', body: data }),
  deleteMapping: (id) => request(`/mapping/${id}`, { method: 'DELETE' }),

  // Menus
  getMenus: (options = {}) => request(`/menus${options.ahliGiziUserId ? `?ahliGiziUserId=${options.ahliGiziUserId}` : ''}`),
  getMenuById: (id) => request(`/menus/${id}`),
  createMenu: (data) => request('/menus', { method: 'POST', body: data }),
  updateMenu: (id, data) => request(`/menus/${id}`, { method: 'PUT', body: data }),
  deleteMenu: (id) => request(`/menus/${id}`, { method: 'DELETE' }),
  uploadMenuPhoto: (data) => request('/uploads/menu-photo', { method: 'POST', body: data }),
  uploadVendorDocument: (data) => request('/uploads/vendor-document', { method: 'POST', body: data }),
  uploadConfirmationPhoto: (data) => request('/uploads/confirmation-photo', { method: 'POST', body: data }),
  assetUrl: (path) => path?.startsWith('/uploads') ? `${API_ORIGIN}${path}` : path,

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
  generateAhliGiziReport: (data) => request('/reports/ahli-gizi/menu-review', { method: 'POST', body: data }),

  // Feedback
  getFeedback: () => request('/feedback'),
  createFeedback: (data) => request('/feedback', { method: 'POST', body: data }),

  // Konfirmasi
  getKonfirmasi: () => request('/konfirmasi'),
  createKonfirmasi: (data) => request('/konfirmasi', { method: 'POST', body: data }),

  // Alerts
  getAlerts: () => request('/alerts'),
  createAlert: (data) => request('/alerts', { method: 'POST', body: data }),
  updateAlert: (id, data) => request(`/alerts/${id}`, { method: 'PUT', body: data }),
  archiveAlert: (id) => request(`/alerts/${id}`, { method: 'DELETE' }),
  resolveAlert: (id, userId) => request(`/alerts/${id}/resolve`, { method: 'PUT', body: { resolved_by: userId } }),

  // Wilayah
  getWilayah: () => request('/wilayah'),

  // Dokumen
  getDokumen: (vendorId) => request(`/dokumen/${vendorId}`),
  createDokumen: (data) => request('/dokumen', { method: 'POST', body: data }),
  updateDokumen: (id, data) => request(`/dokumen/${id}`, { method: 'PUT', body: data }),
  updateDokumenStatus: (id, data) => request(`/dokumen/${id}/status`, { method: 'PUT', body: data }),
  archiveDokumen: (id) => request(`/dokumen/${id}`, { method: 'DELETE' }),

  // Vendor Registrations
  getVendorRegistrations: () => request('/vendor-registrations'),
  createVendorRegistration: (data) => request('/vendor-registrations', { method: 'POST', body: data }),
  approveVendorRegistration: (id, data) => request(`/vendor-registrations/${id}/approve`, { method: 'PUT', body: data }),
  rejectVendorRegistration: (id, data) => request(`/vendor-registrations/${id}/reject`, { method: 'PUT', body: data }),

  // Nutrition Database
  getNutrition: () => request('/nutrition'),
  createNutrition: (data) => request('/nutrition', { method: 'POST', body: data }),
  updateNutrition: (id, data) => request(`/nutrition/${id}`, { method: 'PUT', body: data }),
  retireNutrition: (id) => request(`/nutrition/${id}`, { method: 'DELETE' }),
  getNutritionRequests: () => request('/nutrition-requests'),
  createNutritionRequest: (data) => request('/nutrition-requests', { method: 'POST', body: data }),
  approveNutritionRequest: (id, data) => request(`/nutrition-requests/${id}/approve`, { method: 'PUT', body: data }),
  rejectNutritionRequest: (id, data) => request(`/nutrition-requests/${id}/reject`, { method: 'PUT', body: data }),

  // Government Stats
  getPemerintahStats: () => request('/pemerintah/stats'),

  // Health
  health: () => request('/health'),
}

export default api
