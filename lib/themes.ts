// Complete theme system. Each theme redefines the whole palette:
// glass tint, neon borders/glow, text accents, nav colors, and the
// decorative particle color palette. Layout never changes between themes.

export interface Theme {
  id: string;
  name: string;
  bg: string;
  glassTint: string;
  primary: string;
  secondary: string;
  textAccent: string;
  particleColors: string[];
  buttonColors: string[];
  operatorColor: string;
  equalsColor: string;
}

export const THEMES: Theme[] = [
  {
    id: "neon-rainbow",
    name: "Neon Rainbow",
    bg: "#000000",
    glassTint: "255,255,255",
    primary: "0,255,240",
    secondary: "255,0,230",
    textAccent: "0,255,240",
    particleColors: [
      "255,0,230",
      "255,105,180",
      "255,140,0",
      "255,255,0",
      "57,255,20",
      "255,0,0",
      "0,191,255",
      "0,255,240",
      "64,224,208",
      "191,0,255",
    ],
    buttonColors: [
      "255,105,180",
      "255,0,230",
      "0,255,240",
      "255,140,0",
      "64,224,208",
      "255,105,180",
      "0,150,255",
      "255,60,90",
      "255,255,0",
      "191,0,255",
    ],
    operatorColor: "255,140,0",
    equalsColor: "57,255,20",
  },
  {
    id: "electric-blue",
    name: "Electric Blue",
    bg: "#000004",
    glassTint: "0,150,255",
    primary: "0,180,255",
    secondary: "80,220,255",
    textAccent: "120,220,255",
    particleColors: ["0,150,255", "0,200,255", "40,120,255", "100,220,255", "0,255,240"],
    buttonColors: ["0,150,255", "40,120,255", "0,200,255", "100,180,255", "0,255,240"],
    operatorColor: "0,255,240",
    equalsColor: "80,220,255",
  },
  {
    id: "magenta-pulse",
    name: "Magenta Pulse",
    bg: "#050002",
    glassTint: "255,0,180",
    primary: "255,0,200",
    secondary: "255,100,200",
    textAccent: "255,120,220",
    particleColors: ["255,0,200", "255,60,180", "255,0,120", "255,150,220", "200,0,255"],
    buttonColors: ["255,0,200", "255,60,180", "255,0,120", "255,150,220", "200,0,255"],
    operatorColor: "255,150,220",
    equalsColor: "255,0,120",
  },
  {
    id: "toxic-green",
    name: "Toxic Green",
    bg: "#000200",
    glassTint: "57,255,20",
    primary: "80,255,80",
    secondary: "180,255,100",
    textAccent: "120,255,120",
    particleColors: ["57,255,20", "120,255,60", "180,255,100", "0,255,150", "100,255,0"],
    buttonColors: ["57,255,20", "120,255,60", "180,255,100", "0,255,150", "100,255,0"],
    operatorColor: "0,255,150",
    equalsColor: "180,255,100",
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    bg: "#050100",
    glassTint: "255,120,0",
    primary: "255,140,0",
    secondary: "255,80,40",
    textAccent: "255,180,80",
    particleColors: ["255,140,0", "255,80,40", "255,180,0", "255,60,60", "255,210,100"],
    buttonColors: ["255,140,0", "255,80,40", "255,180,0", "255,60,60", "255,210,100"],
    operatorColor: "255,60,60",
    equalsColor: "255,180,0",
  },
  {
    id: "purple-storm",
    name: "Purple Storm",
    bg: "#030005",
    glassTint: "160,0,255",
    primary: "180,80,255",
    secondary: "220,150,255",
    textAccent: "200,120,255",
    particleColors: ["160,0,255", "190,80,255", "120,0,200", "220,150,255", "100,60,255"],
    buttonColors: ["160,0,255", "190,80,255", "120,0,200", "220,150,255", "100,60,255"],
    operatorColor: "220,150,255",
    equalsColor: "120,0,200",
  },
  {
    id: "red-voltage",
    name: "Red Voltage",
    bg: "#040000",
    glassTint: "255,20,20",
    primary: "255,40,40",
    secondary: "255,120,120",
    textAccent: "255,90,90",
    particleColors: ["255,20,20", "255,80,0", "255,0,60", "255,150,150", "200,0,0"],
    buttonColors: ["255,20,20", "255,80,0", "255,0,60", "255,150,150", "200,0,0"],
    operatorColor: "255,150,150",
    equalsColor: "255,80,0",
  },
  {
    id: "cyan-ice",
    name: "Cyan Ice",
    bg: "#000303",
    glassTint: "0,255,240",
    primary: "80,255,240",
    secondary: "180,255,250",
    textAccent: "120,255,245",
    particleColors: ["0,255,240", "64,224,208", "0,220,255", "180,255,250", "0,180,220"],
    buttonColors: ["0,255,240", "64,224,208", "0,220,255", "180,255,250", "0,180,220"],
    operatorColor: "180,255,250",
    equalsColor: "0,220,255",
  },
  {
    id: "hot-pink-dream",
    name: "Hot Pink Dream",
    bg: "#050002",
    glassTint: "255,105,180",
    primary: "255,120,190",
    secondary: "255,180,220",
    textAccent: "255,150,200",
    particleColors: ["255,105,180", "255,150,200", "255,60,150", "255,200,230", "255,0,140"],
    buttonColors: ["255,105,180", "255,150,200", "255,60,150", "255,200,230", "255,0,140"],
    operatorColor: "255,200,230",
    equalsColor: "255,60,150",
  },
  {
    id: "cyberpunk-mixed",
    name: "Cyberpunk Mixed",
    bg: "#000000",
    glassTint: "255,0,230",
    primary: "255,0,230",
    secondary: "0,255,240",
    textAccent: "255,255,0",
    particleColors: [
      "255,0,230",
      "0,255,240",
      "255,255,0",
      "191,0,255",
      "255,60,90",
      "0,255,150",
    ],
    buttonColors: ["255,0,230", "0,255,240", "255,255,0", "191,0,255", "255,60,90", "0,255,150"],
    operatorColor: "255,255,0",
    equalsColor: "0,255,240",
  },
  {
    id: "matrix",
    name: "Matrix",
    bg: "#000000",
    glassTint: "0,255,80",
    primary: "0,255,90",
    secondary: "100,255,140",
    textAccent: "0,255,90",
    particleColors: ["0,255,90", "0,200,60", "100,255,140", "0,150,40", "0,255,150"],
    buttonColors: ["0,255,90", "0,200,60", "100,255,140", "0,150,40", "0,255,150"],
    operatorColor: "100,255,140",
    equalsColor: "0,200,60",
  },
  {
    id: "synthwave",
    name: "Synthwave",
    bg: "#050014",
    glassTint: "255,60,180",
    primary: "255,60,180",
    secondary: "120,80,255",
    textAccent: "0,230,255",
    particleColors: ["255,60,180", "120,80,255", "0,230,255", "255,150,0", "255,0,140"],
    buttonColors: ["255,60,180", "120,80,255", "0,230,255", "255,150,0", "255,0,140"],
    operatorColor: "0,230,255",
    equalsColor: "255,150,0",
  },
];

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty("--bg", theme.bg);
  root.style.setProperty("--glass-tint", theme.glassTint);
  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--secondary", theme.secondary);
  root.style.setProperty("--text-accent", theme.textAccent);
  root.style.setProperty("--operator-color", theme.operatorColor);
  root.style.setProperty("--equals-color", theme.equalsColor);
}
