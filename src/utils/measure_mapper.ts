import { Measurements } from "@/types/user";

type MeasureMapperItem = {
  key: keyof Measurements;
  label: string;
  unit: "cm";
};


export const measureMapper: MeasureMapperItem[] = [
  { key: "chest_cm", label: "Peito", unit: "cm" },
  { key: "biceps_right_cm", label: "Bíceps direito", unit: "cm" },
  { key: "biceps_left_cm", label: "Bíceps esquerdo", unit: "cm" },
  { key: "waist_abdomen_cm", label: "Cintura / Abdômen", unit: "cm" },
  { key: "thigh_right_cm", label: "Coxa direita", unit: "cm" },
  { key: "thigh_left_cm", label: "Coxa esquerda", unit: "cm" },
  { key: "calf_right_cm", label: "Panturrilha direita", unit: "cm" },
  { key: "calf_left_cm", label: "Panturrilha esquerda", unit: "cm" },
  { key: "forearm_right_cm", label: "Antebraço direito", unit: "cm" },
  { key: "forearm_left_cm", label: "Antebraço esquerdo", unit: "cm" },
  { key: "hip_cm", label: "Quadril", unit: "cm" },
];