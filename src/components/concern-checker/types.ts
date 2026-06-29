export type Symptom =
  | "Pain"
  | "Sensitivity"
  | "Swelling"
  | "Bleeding"
  | "Broken Tooth"
  | "Loose Tooth"
  | "Cosmetic Concern"
  | "Missing Tooth"
  | "Other";

export type Onset = "Today" | "This week" | "This month" | "Longer";
export type YesNoUnsure = "Yes" | "No" | "Unsure";

export type Assessment = {
  teeth: number[]; // FDI numbers
  symptoms: Symptom[];
  painLevel: number; // 1-10
  onset: Onset | null;
  thermalSensitivity: YesNoUnsure | null;
  swelling: "Yes" | "No" | null;
  emergency: "Yes" | "No" | null;
};

export const EMPTY_ASSESSMENT: Assessment = {
  teeth: [],
  symptoms: [],
  painLevel: 3,
  onset: null,
  thermalSensitivity: null,
  swelling: null,
  emergency: null,
};

// FDI tooth labels (adult dentition)
export const TOOTH_NAMES: Record<number, string> = {
  18: "Upper right 2nd molar", 17: "Upper right 1st molar", 16: "Upper right 2nd premolar",
  15: "Upper right 1st premolar", 14: "Upper right canine", 13: "Upper right lateral incisor",
  12: "Upper right central incisor", 11: "Upper right central",
  21: "Upper left central", 22: "Upper left lateral incisor", 23: "Upper left canine",
  24: "Upper left 1st premolar", 25: "Upper left 2nd premolar", 26: "Upper left 1st molar",
  27: "Upper left 2nd molar", 28: "Upper left 3rd molar",
  48: "Lower right 3rd molar", 47: "Lower right 2nd molar", 46: "Lower right 1st molar",
  45: "Lower right 2nd premolar", 44: "Lower right 1st premolar", 43: "Lower right canine",
  42: "Lower right lateral incisor", 41: "Lower right central incisor",
  31: "Lower left central incisor", 32: "Lower left lateral incisor", 33: "Lower left canine",
  34: "Lower left 1st premolar", 35: "Lower left 2nd premolar", 36: "Lower left 1st molar",
  37: "Lower left 2nd molar", 38: "Lower left 3rd molar",
};

export const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
export const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
export const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38];
export const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];

export const QUICK_REGIONS: { label: string; teeth: number[] }[] = [
  { label: "Upper Right", teeth: UPPER_RIGHT },
  { label: "Upper Left", teeth: UPPER_LEFT },
  { label: "Lower Left", teeth: LOWER_LEFT },
  { label: "Lower Right", teeth: LOWER_RIGHT },
  { label: "Front Teeth", teeth: [13, 12, 11, 21, 22, 23, 33, 32, 31, 41, 42, 43] },
];

export function summarize(a: Assessment): string {
  const regions: string[] = [];
  const inSet = (set: number[]) => a.teeth.some((t) => set.includes(t));
  if (inSet(UPPER_RIGHT)) regions.push("upper right");
  if (inSet(UPPER_LEFT)) regions.push("upper left");
  if (inSet(LOWER_LEFT)) regions.push("lower left");
  if (inSet(LOWER_RIGHT)) regions.push("lower right");
  const region = regions.length ? regions.join(", ") : "unspecified area";
  const sx = a.symptoms.length ? a.symptoms.join(", ") : "general concern";
  const parts = [
    `Area: ${region}`,
    a.teeth.length ? `Teeth: ${a.teeth.join(", ")}` : null,
    `Symptoms: ${sx}`,
    a.symptoms.includes("Pain") ? `Pain: ${a.painLevel}/10` : null,
    a.onset ? `Onset: ${a.onset}` : null,
    a.thermalSensitivity ? `Hot/cold: ${a.thermalSensitivity}` : null,
    a.swelling ? `Swelling: ${a.swelling}` : null,
    a.emergency === "Yes" ? "Emergency: yes" : null,
  ].filter(Boolean);
  return parts.join(" · ");
}
