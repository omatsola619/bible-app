import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";

// Icon families for easy access
export const IconFamilies = {
  Material: MaterialIcons,
  AntDesign: AntDesign,
  Feather: Feather,
  Ionicons: Ionicons,
} as const;

// Predefined icon configurations for consistency
export const Icons = {
  // Navigation
  home: { family: "Material", name: "home", size: 24 },
  bible: { family: "Material", name: "menu-book", size: 24 },
  progress: { family: "AntDesign", name: "trophy", size: 24 },
  profile: { family: "Feather", name: "user", size: 24 },

  // Bible features
  search: { family: "Feather", name: "search", size: 24 },
  favorite: { family: "AntDesign", name: "heart", size: 24 },
  favoriteFilled: { family: "AntDesign", name: "heart", size: 24 },
  bookmark: { family: "Feather", name: "bookmark", size: 24 },
  share: { family: "Feather", name: "share-2", size: 24 },

  // Actions
  play: { family: "Material", name: "play-arrow", size: 24 },
  pause: { family: "Material", name: "pause", size: 24 },
  next: { family: "Material", name: "navigate-next", size: 24 },
  previous: { family: "Material", name: "navigate-before", size: 24 },
  close: { family: "Material", name: "close", size: 24 },
  check: { family: "Material", name: "check", size: 24 },

  // UI elements
  settings: { family: "Feather", name: "settings", size: 24 },
  menu: { family: "Feather", name: "menu", size: 24 },
  back: { family: "Material", name: "arrow-back", size: 24 },
  forward: { family: "Material", name: "arrow-forward", size: 24 },
  down: { family: "Material", name: "keyboard-arrow-down", size: 24 },
  up: { family: "Material", name: "keyboard-arrow-up", size: 24 },

  // Status
  success: { family: "Material", name: "check-circle", size: 24 },
  error: { family: "Material", name: "error", size: 24 },
  warning: { family: "Material", name: "warning", size: 24 },
  info: { family: "Material", name: "info", size: 24 },

  // Authentication
  email: { family: "Material", name: "email", size: 24 },
  lock: { family: "Material", name: "lock", size: 24 },
  visibility: { family: "Material", name: "visibility", size: 24 },
  visibilityOff: { family: "Material", name: "visibility-off", size: 24 },

  // Theme
  lightMode: { family: "Material", name: "light-mode", size: 24 },
  darkMode: { family: "Material", name: "dark-mode", size: 24 },
  systemMode: { family: "Material", name: "brightness-auto", size: 24 },

  // Roadmap
  star: { family: "Material", name: "star", size: 24 },
} as const;

// Color palette for Duolingo-like design
export const IconColors = {
  primary: "#4CAF50", // Green (success/primary)
  secondary: "#FF6B6B", // Red (energy/action)
  accent: "#FFD700", // Gold (achievement)
  info: "#3B82F6", // Blue (information)
  warning: "#FF9800", // Orange (warning)
  success: "#4CAF50", // Green (success)
  error: "#EF4444", // Red (error)
  neutral: "#6B7280", // Gray (neutral)
  white: "#FFFFFF", // White
  black: "#000000", // Black
  lightGray: "#F3F4F6", // Light gray
  darkGray: "#374151", // Dark gray
} as const;

// Helper function to get icon component
export const getIconComponent = (family: keyof typeof IconFamilies) => {
  return IconFamilies[family];
};

// Helper function to render icon with theme colors
export const renderIcon = (
  iconKey: keyof typeof Icons,
  color?: string,
  size?: number,
  style?: object
) => {
  const icon = Icons[iconKey];
  const IconComponent = getIconComponent(
    icon.family as keyof typeof IconFamilies
  );

  return React.createElement(IconComponent as any, {
    name: icon.name as any,
    size: size || icon.size,
    color,
    style,
  });
};
