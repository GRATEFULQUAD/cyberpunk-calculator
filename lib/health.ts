// BMI + calorie estimation. Informational only, not medical advice.

export type Sex = "male" | "female";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "very"
  | "extra";

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (little/no exercise)",
  light: "Lightly active (1-3 days/week)",
  moderate: "Moderately active (3-5 days/week)",
  very: "Very active (6-7 days/week)",
  extra: "Extra active (physical job/training)",
};

export interface BMIResult {
  bmi: number;
  category: "Underweight" | "Healthy" | "Overweight" | "Obese";
  healthyMinKg: number;
  healthyMaxKg: number;
}

export function calculateBMI(heightCm: number, weightKg: number): BMIResult {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  let category: BMIResult["category"] = "Healthy";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Healthy";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  const healthyMinKg = 18.5 * heightM * heightM;
  const healthyMaxKg = 24.9 * heightM * heightM;

  return {
    bmi: Number.isFinite(bmi) ? bmi : 0,
    category,
    healthyMinKg,
    healthyMaxKg,
  };
}

// Mifflin-St Jeor equation for BMR, then scaled by activity multiplier.
export function estimateDailyCalories(
  sex: Sex,
  weightKg: number,
  heightCm: number,
  age: number,
  activity: ActivityLevel
): number {
  const bmr =
    10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
  const calories = bmr * ACTIVITY_MULTIPLIERS[activity];
  return Number.isFinite(calories) ? Math.max(0, calories) : 0;
}

// Unit helpers
export function lbToKg(lb: number): number {
  return lb * 0.45359237;
}
export function kgToLb(kg: number): number {
  return kg / 0.45359237;
}
export function inToCm(inches: number): number {
  return inches * 2.54;
}
export function cmToIn(cm: number): number {
  return cm / 2.54;
}
export function feetInchesToCm(feet: number, inches: number): number {
  return inToCm(feet * 12 + inches);
}
