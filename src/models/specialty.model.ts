/**
 * Represents a medical specialty.
 * Stored in `src/core/constants.ts` as a static array (DEFAULT_SPECIALTIES).
 * Can optionally be persisted in a `specialties` Firestore collection for admin control.
 *
 * color is a CSS hex string, converted from Flutter's Color(0xFFRRGGBB) format.
 */
export interface SpecialtyModel {
  id:       string   // kebab-case identifier, e.g. "cardiology"
  nameAr:   string   // Arabic display name
  nameEn:   string   // English display name
  imageUrl: string
  color:    string   // CSS hex, e.g. "#E53935"
}
