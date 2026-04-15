import { supabase } from '../lib/supabaseClient'

const BUCKET  = 'avatars'
const MAX_PX  = 400    // máx. px en cualquier dimensión tras comprimir
const QUALITY = 0.82   // calidad JPEG
const MAX_MB  = 5
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

/**
 * Reduce la imagen al tamaño máximo y la convierte a JPEG.
 * Una foto de 8 MB queda en ~80-150 KB.
 */
async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale  = Math.min(1, MAX_PX / Math.max(img.width, img.height))
      const width  = Math.round(img.width  * scale)
      const height = Math.round(img.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width  = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        blob => {
          if (blob) resolve(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }))
          else reject(new Error('No se pudo comprimir la imagen'))
        },
        'image/jpeg',
        QUALITY,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen'))
    }

    img.src = url
  })
}

export const avatarService = {
  /**
   * Comprime y sube la imagen al bucket. Siempre sobreescribe el avatar anterior
   * del usuario (upsert: true) con la ruta fija {userId}/avatar.jpg.
   * @returns {Promise<string>} URL pública con cache-buster
   */
  async upload(file, userId) {
    if (!ALLOWED.includes(file.type))
      throw new Error('Formato no permitido. Usa JPG, PNG, WEBP o HEIC.')

    if (file.size > MAX_MB * 1024 * 1024)
      throw new Error(`La imagen no puede superar los ${MAX_MB} MB.`)

    const compressed = await compressImage(file)
    const path = `${userId}/avatar.jpg`

    // Eliminar la versión anterior si existe (la política DELETE ya lo permite).
    // Supabase upsert requiere permiso UPDATE separado; delete + insert evita ese problema.
    await supabase.storage.from(BUCKET).remove([path])

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, compressed, { cacheControl: '3600', upsert: false })

    if (error) throw error

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    // El ?t= rompe el caché del navegador cuando se reemplaza la imagen
    return `${data.publicUrl}?t=${Date.now()}`
  },

  /**
   * Elimina el avatar del bucket.
   */
  async remove(userId) {
    await supabase.storage.from(BUCKET).remove([`${userId}/avatar.jpg`])
  },
}
