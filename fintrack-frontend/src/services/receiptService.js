import { supabase } from '../lib/supabaseClient'

const BUCKET      = 'receipts'
const MAX_SIZE_MB = 10
const ALLOWED     = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf']

export const receiptService = {
  /**
   * Sube un archivo al bucket y devuelve la URL pública.
   * @param {File}   file
   * @param {string} userId  — UUID del usuario autenticado
   */
  async upload(file, userId) {
    if (!ALLOWED.includes(file.type))
      throw new Error('Formato no permitido. Usa JPG, PNG, WEBP, HEIC o PDF.')

    if (file.size > MAX_SIZE_MB * 1024 * 1024)
      throw new Error(`El archivo no puede superar los ${MAX_SIZE_MB} MB.`)

    const ext  = file.name.split('.').pop().toLowerCase()
    const path = `${userId}/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (error) throw error

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data.publicUrl
  },

  /**
   * Elimina un archivo del bucket a partir de su URL pública.
   * @param {string} publicUrl
   */
  async remove(publicUrl) {
    const marker = `/object/public/${BUCKET}/`
    const idx    = publicUrl.indexOf(marker)
    if (idx === -1) return
    const path = publicUrl.slice(idx + marker.length)
    await supabase.storage.from(BUCKET).remove([path])
  },
}
