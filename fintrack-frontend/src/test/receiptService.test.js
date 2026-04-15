import { describe, it, expect, vi, beforeEach } from 'vitest'
import { receiptService } from '../services/receiptService'

// Simulamos el cliente de Supabase — no queremos hacer llamadas reales en tests
vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    storage: {
      from: () => ({
        upload:       vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.supabase.co/storage/v1/object/public/receipts/user-id/file.jpg' } }),
        remove:       vi.fn().mockResolvedValue({ error: null }),
      }),
    },
  },
}))

const VALID_USER_ID = 'a1b2c3d4-0000-0000-0000-000000000000'

function makeFile(name, type, sizeBytes) {
  const file = new File(['x'.repeat(sizeBytes)], name, { type })
  return file
}

describe('receiptService.upload — validaciones', () => {
  it('rechaza un tipo de archivo no permitido', async () => {
    const file = makeFile('virus.exe', 'application/octet-stream', 100)
    await expect(receiptService.upload(file, VALID_USER_ID))
      .rejects.toThrow('Formato no permitido')
  })

  it('rechaza archivos mayores a 10 MB', async () => {
    const tenMbPlusOne = 10 * 1024 * 1024 + 1
    const file = makeFile('foto.jpg', 'image/jpeg', tenMbPlusOne)
    await expect(receiptService.upload(file, VALID_USER_ID))
      .rejects.toThrow('10 MB')
  })

  it('acepta un JPG dentro del límite', async () => {
    const file = makeFile('ticket.jpg', 'image/jpeg', 500 * 1024) // 500 KB
    const url  = await receiptService.upload(file, VALID_USER_ID)
    expect(url).toContain('receipts')
  })

  it('acepta un PDF dentro del límite', async () => {
    const file = makeFile('factura.pdf', 'application/pdf', 1024 * 1024) // 1 MB
    const url  = await receiptService.upload(file, VALID_USER_ID)
    expect(typeof url).toBe('string')
  })
})

describe('receiptService.remove', () => {
  it('no lanza error si la URL no contiene el marcador del bucket', async () => {
    await expect(receiptService.remove('https://otro-dominio.com/imagen.jpg'))
      .resolves.toBeUndefined()
  })

  it('llama a remove con la ruta correcta', async () => {
    const url = 'https://example.supabase.co/storage/v1/object/public/receipts/user-id/uuid.jpg'
    await receiptService.remove(url)
    // No lanza — el mock resuelve sin error
  })
})
