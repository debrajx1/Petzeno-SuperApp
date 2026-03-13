// PetZeno Brand Color System — Premium Indigo & Mint Theme
// Tech-forward, modern, and clean visual language

const primary = "#6366F1";       // Vibrant Indigo — Core buttons / Active states
const primaryLight = "#818CF8";  // Soft Indigo — Accents / Hover
const primaryLight1 = "#EEF2FF"; // Cloud White/Indigo — Gradient start
const primaryDark = "#4F46E5";   // Deep Indigo — Pressed states
const secondary = "#F8FAFC";     // Slate White — Section backgrounds / Cards
const emergency = "#EF4444";     // Modern Red — SOS / Urgent
const healthy = "#10B981";       // Mint/Emerald — Positive status
const warning = "#F59E0B";       // Amber — Attention status
const info = "#3B82F6";          // Royal Blue — Informational
const black = "#0F172A";         // Slate Black — Text / Deep dark mode

export default {
  primary,
  primaryLight,
  primaryLight1,
  primaryDark,
  secondary,
  emergency,
  healthy,
  warning,
  info,
  black,

  light: {
    text: "#1E293B",              // Slate Dark
    textSecondary: "#64748B",     // Slate Muted
    textTertiary: "#94A3B8",      // Slate Light
    background: "#F8FAFC",        // Clean Slate White
    surface: "#FFFFFF",
    surfaceSecondary: "#F1F5F9",  // Light Slate gray
    border: "#E2E8F0",            // Subtle Slate border
    tint: primary,
    tabIconDefault: "#94A3B8",
    tabIconSelected: primary,
    card: "#FFFFFF",
    shadow: "rgba(99,102,241,0.08)", // Indigo-tinted shadow
  },

  dark: {
    text: "#F8FAFC",
    textSecondary: "#94A3B8",
    textTertiary: "#64748B",
    background: "#0F172A",        // Deep Slate Black
    surface: "#1E293B",           // Slate Dark surface
    surfaceSecondary: "#334155",  // Slate Muted surface
    border: "#334155",            // Dark Slate border
    tint: "#818CF8",
    tabIconDefault: "#475569",
    tabIconSelected: "#818CF8",
    card: "#1E293B",
    shadow: "rgba(0,0,0,0.4)",
  },

  petColors: {
    dog: "#F59E0B",    // Amber
    cat: "#6366F1",    // Indigo
    bird: "#0EA5E9",   // Sky
    rabbit: "#EC4899", // Pink
    fish: "#06B6D4",   // Cyan
    other: "#8B5CF6",  // Violet
  },
};
