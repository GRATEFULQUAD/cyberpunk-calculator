// Unit conversion tables and helpers for the Converter screen.

export type UnitCategory =
  | "length"
  | "weight"
  | "temperature"
  | "volume"
  | "speed"
  | "area";

export interface UnitDef {
  key: string;
  label: string;
  // factor to convert TO the base unit (multiply). Ignored for temperature.
  toBase: number;
}

export const UNIT_CATEGORIES: Record<UnitCategory, { label: string; base: string; units: UnitDef[] }> = {
  length: {
    label: "Length",
    base: "m",
    units: [
      { key: "mm", label: "Millimeters", toBase: 0.001 },
      { key: "cm", label: "Centimeters", toBase: 0.01 },
      { key: "m", label: "Meters", toBase: 1 },
      { key: "km", label: "Kilometers", toBase: 1000 },
      { key: "in", label: "Inches", toBase: 0.0254 },
      { key: "ft", label: "Feet", toBase: 0.3048 },
      { key: "yd", label: "Yards", toBase: 0.9144 },
      { key: "mi", label: "Miles", toBase: 1609.344 },
    ],
  },
  weight: {
    label: "Weight",
    base: "g",
    units: [
      { key: "mg", label: "Milligrams", toBase: 0.001 },
      { key: "g", label: "Grams", toBase: 1 },
      { key: "kg", label: "Kilograms", toBase: 1000 },
      { key: "oz", label: "Ounces", toBase: 28.349523125 },
      { key: "lb", label: "Pounds", toBase: 453.59237 },
    ],
  },
  temperature: {
    label: "Temperature",
    base: "c",
    units: [
      { key: "c", label: "Celsius", toBase: 1 },
      { key: "f", label: "Fahrenheit", toBase: 1 },
      { key: "k", label: "Kelvin", toBase: 1 },
    ],
  },
  volume: {
    label: "Volume",
    base: "ml",
    units: [
      { key: "ml", label: "Milliliters", toBase: 1 },
      { key: "l", label: "Liters", toBase: 1000 },
      { key: "cup", label: "Cups", toBase: 236.588 },
      { key: "pt", label: "Pints", toBase: 473.176 },
      { key: "qt", label: "Quarts", toBase: 946.353 },
      { key: "gal", label: "Gallons", toBase: 3785.41 },
      { key: "floz", label: "Fluid Ounces", toBase: 29.5735 },
    ],
  },
  speed: {
    label: "Speed",
    base: "ms",
    units: [
      { key: "mph", label: "mph", toBase: 0.44704 },
      { key: "kmh", label: "km/h", toBase: 0.277778 },
      { key: "ms", label: "m/s", toBase: 1 },
    ],
  },
  area: {
    label: "Area",
    base: "sqm",
    units: [
      { key: "sqft", label: "Square Feet", toBase: 0.092903 },
      { key: "sqm", label: "Square Meters", toBase: 1 },
      { key: "acre", label: "Acres", toBase: 4046.86 },
      { key: "hectare", label: "Hectares", toBase: 10000 },
      { key: "sqmi", label: "Square Miles", toBase: 2589988.11 },
      { key: "sqkm", label: "Square Kilometers", toBase: 1000000 },
    ],
  },
};

function celsiusToBase(value: number, unit: string): number {
  if (unit === "c") return value;
  if (unit === "f") return ((value - 32) * 5) / 9;
  if (unit === "k") return value - 273.15;
  return value;
}

function baseToCelsius(value: number, unit: string): number {
  if (unit === "c") return value;
  if (unit === "f") return (value * 9) / 5 + 32;
  if (unit === "k") return value + 273.15;
  return value;
}

export function convertUnit(
  category: UnitCategory,
  from: string,
  to: string,
  value: number
): number {
  if (category === "temperature") {
    const celsius = celsiusToBase(value, from);
    return baseToCelsius(celsius, to);
  }
  const def = UNIT_CATEGORIES[category];
  const fromUnit = def.units.find((u) => u.key === from);
  const toUnit = def.units.find((u) => u.key === to);
  if (!fromUnit || !toUnit) return NaN;
  const base = value * fromUnit.toBase;
  return base / toUnit.toBase;
}

// ---- Unit price comparison helpers ----

export type QuantityUnit =
  | "item"
  | "oz"
  | "lb"
  | "g"
  | "kg"
  | "ml"
  | "l";

const QUANTITY_TO_BASE: Record<QuantityUnit, { base: "count" | "mass" | "volume"; factor: number }> = {
  item: { base: "count", factor: 1 },
  oz: { base: "mass", factor: 28.349523125 },
  lb: { base: "mass", factor: 453.59237 },
  g: { base: "mass", factor: 1 },
  kg: { base: "mass", factor: 1000 },
  ml: { base: "volume", factor: 1 },
  l: { base: "volume", factor: 1000 },
};

export function unitsAreComparable(a: QuantityUnit, b: QuantityUnit): boolean {
  return QUANTITY_TO_BASE[a].base === QUANTITY_TO_BASE[b].base;
}

export function pricePerBaseUnit(price: number, quantity: number, unit: QuantityUnit): number {
  const { factor } = QUANTITY_TO_BASE[unit];
  if (quantity <= 0) return Infinity;
  const baseQuantity = quantity * factor;
  return price / baseQuantity;
}

export const QUANTITY_UNIT_LABELS: Record<QuantityUnit, string> = {
  item: "items",
  oz: "ounces",
  lb: "pounds",
  g: "grams",
  kg: "kilograms",
  ml: "milliliters",
  l: "liters",
};
