// App color scheme
export const colors = {
  primary: "#4E7DE9", // Main blue
  secondary: "#F5A623", // Accent orange
  success: "#4CAF50", // Green for correct answers
  error: "#F44336", // Red for incorrect answers
  background: "#FFFFFF",
  card: "#F8F9FA",
  text: "#1A1A1A",
  textSecondary: "#6E6E6E",
  border: "#E0E0E0",
  placeholder: "#BDBDBD",
  highlight: "#E8F0FE",
  darkOverlay: "rgba(0, 0, 0, 0.5)",
};

// Theme configuration
export const theme = {
  light: {
    text: colors.text,
    background: colors.background,
    tint: colors.primary,
    tabIconDefault: colors.placeholder,
    tabIconSelected: colors.primary,
    card: colors.card,
    border: colors.border,
  },
};

export default theme;