const primary = "#42cfb1ff"; // Match the exact button green from mockup
const primaryLight = "#6cceb6ff"; 
const primaryLight1 = "#4eb399ff"; // More solid light green for background
const primaryDark = "#42cfb1ff"; // Darker green for text headings
const secondary = "#fbf9f8ff";
const emergency = "#FF3B30";

export default {
  primary,
  primaryLight,
  primaryLight1,
  primaryDark,
  secondary,
  emergency,

  light: {
    text: "#1C1C1E",
    textSecondary: "#636366",
    textTertiary: "#AEAEB2",
    background: "#F5F6FA",
    surface: "#FFFFFF",
    surfaceSecondary: "#F2F2F7", 
    border: "#E5E5EA",
    tint: primary,
    tabIconDefault: "#AEAEB2",
    tabIconSelected: primary,
    card: "#FFFFFF",
    shadow: "rgba(0,0,0,0.08)",
  },

  dark: {
    text: "#FFFFFF",
    textSecondary: "#AEAEB2",
    textTertiary: "#636366",
    background: "#000000",
    surface: "#1C1C1E",
    surfaceSecondary: "#2C2C2E",
    border: "#38383A",
    tint: "#2EBF98",
    tabIconDefault: "#636366",
    tabIconSelected: "#2EBF98",
    card: "#1C1C1E",
    shadow: "rgba(0,0,0,0.3)",
  },

  petColors: {
    dog: "#FF9F43",
    cat: "#EE5A24",
    bird: "#0652DD",
    rabbit: "#FDA7DF",
    fish: "#12CBC4",
    other: "#9980FA",
  },
};
