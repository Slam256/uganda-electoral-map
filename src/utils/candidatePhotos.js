/**
 * Maps candidate names to their photo filenames in the assets folder
 * This utility helps match database candidate names to local image files
 */

// Import all candidate photos locally
import kyagulanyiPhoto from '../assets/candidate photos/kyagulanyi.jpg';
import museveniPhoto from '../assets/candidate photos/museveni.jpg';
import mabiriziPhoto from '../assets/candidate photos/mabirizi-joseph.jpeg';
import mugishaPhoto from '../assets/candidate photos/mugisha-muntu.jpg';
import mafabiPhoto from '../assets/candidate photos/mafabi.jpeg';
import kasibantePhoto from '../assets/candidate photos/kasibante.jpeg';
import munyagwaPhoto from '../assets/candidate photos/munyagwa.jpeg';
import buliraPhoto from '../assets/candidate photos/bulira-frank.jpeg';

// Mapping of candidate names (normalized) to their photo imports
const candidatePhotoMap = {
  'kyagulanyi robert': kyagulanyiPhoto,
  'robert kyagulanyi': kyagulanyiPhoto,
  'kyagulanyi': kyagulanyiPhoto,
  
  'yoweri museveni': museveniPhoto,
  'museveni': museveniPhoto,
  
  'mabirizi joseph': mabiriziPhoto,
  'joseph mabirizi': mabiriziPhoto,
  'mabirizi': mabiriziPhoto,
  
  'mugisha muntu': mugishaPhoto,
  'muntu mugisha': mugishaPhoto,
  'muntu': mugishaPhoto,
  
  'mafabi': mafabiPhoto,
  
  'kasibante': kasibantePhoto,
  
  'munyagwa': munyagwaPhoto,
  
  'bulira frank': buliraPhoto,
  'frank bulira': buliraPhoto,
  'bulira': buliraPhoto,
};

/**
 * Normalizes a candidate name for matching
 * @param {string} name - The candidate name
 * @returns {string} - Normalized name (lowercase, trimmed)
 */
const normalizeName = (name) => {
  if (!name) return '';
  return name.toLowerCase().trim();
};

/**
 * Gets the photo path for a candidate
 * @param {string} candidateName - The candidate's full name
 * @returns {string|null} - Path to the photo or null if not found
 */
export const getCandidatePhoto = (candidateName) => {
  if (!candidateName) return null;
  
  const normalizedName = normalizeName(candidateName);
  
  // Try exact match first
  if (candidatePhotoMap[normalizedName]) {
    return candidatePhotoMap[normalizedName];
  }
  
  // Try partial matching as fallback
  for (const [key, value] of Object.entries(candidatePhotoMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return value;
    }
  }
  
  return null;
};

/**
 * Gets all candidate photo mappings for debugging
 * @returns {Object} - All mappings
 */
export const getAllCandidatePhotos = () => {
  return candidatePhotoMap;
};

