import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────────────────────
// Supabase Storage — singleton client
// Bucket: "avatars"  (create it in Supabase Dashboard → Storage → New bucket)
// Make the bucket PUBLIC so imageUrl can be used directly in <img> tags.
// ─────────────────────────────────────────────────────────────────────────────

class StorageService {
  private static instance: StorageService | null = null
  private client: SupabaseClient

  private constructor() {
    this.client = createClient(
      import.meta.env.VITE_SUPABASE_URL as string,
      import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    )
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  /**
   * Upload an avatar image for a user.
   * Path: avatars/{uid}/avatar.{ext}
   * Returns the public URL.
   */
  private async ensureBucket(): Promise<void> {
    const { data: buckets } = await this.client.storage.listBuckets()
    const exists = buckets?.some(b => b.name === 'avatars')
    if (!exists) {
      await this.client.storage.createBucket('avatars', { public: true })
    }
  }

  async uploadAvatar(uid: string, file: File): Promise<string> {
    await this.ensureBucket()

    const ext  = file.name.split('.').pop() ?? 'jpg'
    const path = `${uid}/avatar.${ext}`

    const { error } = await this.client.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (error) throw error

    const { data } = this.client.storage.from('avatars').getPublicUrl(path)
    return `${data.publicUrl}?t=${Date.now()}`
  }
}

export const storageService = StorageService.getInstance()
