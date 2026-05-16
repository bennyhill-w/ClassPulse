// ── TIME & DATE ───────────────────────────────────────────────────
export function timeStr() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function shortDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 17) return "Good afternoon,";
  return "Good evening,";
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── USER ─────────────────────────────────────────────────────────
export function displayName(user) {
  if (!user) return "Teacher";
  return `${user.title || ""} ${user.firstName} ${user.lastName}`.trim();
}

export function initials(user) {
  if (!user) return "TC";
  return `${(user.firstName || "T")[0]}${(user.lastName || "C")[0]}`.toUpperCase();
}

// ── VALIDATION ───────────────────────────────────────────────────
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidStaffId(id) {
  return id && id.trim().length >= 3;
}

// ── GPS ──────────────────────────────────────────────────────────
// GTC Agidingbi coordinates
const SCHOOL_LAT = 6.6018;
const SCHOOL_LNG = 3.3515;
const ALLOWED_RADIUS_KM = 0.15; // 150 metres

export function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function isWithinSchool(lat, lng) {
  return getDistanceKm(lat, lng, SCHOOL_LAT, SCHOOL_LNG) <= ALLOWED_RADIUS_KM;
}

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported on this device"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        // Fallback to school coordinates for demo
        resolve({ lat: SCHOOL_LAT, lng: SCHOOL_LNG });
      },
      { timeout: 8000, enableHighAccuracy: true },
    );
  });
}
