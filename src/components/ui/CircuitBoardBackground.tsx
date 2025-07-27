import { useThemeStore } from "@/store/themeStore";

const lightColors = {
  line: "rgba(75, 85, 99, 0.08)",
  dot: "rgba(55, 65, 81, 0.12)",
};

const darkColors = {
  line: "rgba(34, 197, 94, 0.15)",
  dot: "rgba(16, 185, 129, 0.18)",
};

export function CircuitBoardBackground() {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? darkColors : lightColors;

  const style = {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 19px, ${colors.line} 19px, ${colors.line} 20px, transparent 20px, transparent 39px, ${colors.line} 39px, ${colors.line} 40px),
      repeating-linear-gradient(90deg, transparent, transparent 19px, ${colors.line} 19px, ${colors.line} 20px, transparent 20px, transparent 39px, ${colors.line} 39px, ${colors.line} 40px),
      radial-gradient(circle at 20px 20px, ${colors.dot} 2px, transparent 2px),
      radial-gradient(circle at 40px 40px, ${colors.dot} 2px, transparent 2px)
    `,
    backgroundSize: "40px 40px, 40px 40px, 40px 40px, 40px 40px",
  };

  return (
    <div className="absolute inset-0 z-0 pointer-events-none" style={style} />
  );
}
