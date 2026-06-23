export const parseNutrientValue = (value) => {
  const parsed = parseFloat(String(value ?? '').replace(',', '.').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

export const parseJsonField = (value, fallback) => {
  if (value === null || value === undefined || value === '') return fallback
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export const normalizeValidationLog = (log) => ({
  ...log,
  catatan: typeof log?.catatan === 'string' ? log.catatan.trim() : (log?.catatan || ''),
})

export const attachValidationMetadata = (menu, validationLogs = []) => {
  const menuId = menu.id_menu || menu.id
  const logs = validationLogs
    .filter((item) => (item.id_menu || item.id) === menuId)
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

  return {
    ...menu,
    validationLogs: logs,
    latestValidationLog: logs[0] || null,
    latestRejectedLog: logs.find((item) => item.aksi === 'rejected') || null,
    latestApprovedLog: logs.find((item) => item.aksi === 'approved') || null,
  }
}

export const normalizeMenuIngredient = (item, nutritionMap) => {
  const linkedItem = nutritionMap.get(String(item?.id_nutrition || ''))
  const jumlah = parseNutrientValue(item?.jumlah ?? item?.berat ?? item?.takaran)
  return {
    ...item,
    id_nutrition: item?.id_nutrition ?? null,
    nama: linkedItem?.nama || item?.nama || 'Bahan tanpa nama',
    jumlah,
    satuan: item?.satuan || linkedItem?.satuan || 'gram',
    takaran: item?.takaran || (jumlah > 0 ? `~${jumlah} g` : '-'),
    nutritionItem: linkedItem || null
  }
}

export const formatShortDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const formatDateTime = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export const getFileLabel = (path = '') => {
  if (!path) return 'Tanpa file'
  const normalized = String(path).split('?')[0]
  const extension = normalized.includes('.') ? normalized.split('.').pop() : ''
  return extension ? extension.toUpperCase() : 'FILE'
}
