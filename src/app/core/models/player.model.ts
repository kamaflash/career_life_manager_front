import { CharacterExpenses, ProgressLevel } from "../interfaces";

export interface CharacterPreview {

  // ===== IDENTIDAD =====
  fullName: string;
  age: number;                 // calculada desde birthDate
  city: any;
residentialCity: 'si' | 'no';
  gender: 'male' | 'female' | 'nonbinary' | 'unspecified';

  // ===== SITUACIÓN VITAL =====
  currentSituation:
    | 'high_school'
    | 'vocational_training'
    | 'university'
    | 'unemployed'
    | 'working';

  familySituation:
    | 'stable_family'
    | 'working_family'
    | 'difficult_situation';

  familyExpectations: string[];

  // ===== EDUCACIÓN =====
  educationLevel:
    | 'none'
    | 'basic'
    | 'secondary'
    | 'vocational'
    | 'technical'
    | 'highschool'
    | 'university';

  educationField: string;            // ej: technology, arts
  educationSpecialization: string;   // ej: software, design

  academicPerformance:
    | 'low'
    | 'average'
    | 'high'
    | 'excellent';

  educationGaps: string[];

  // ===== PROFESIONAL / FUTURO =====
  careerInterest:
    | 'technology'
    | 'health'
    | 'arts'
    | 'business'
    | 'education'
    | 'sports'
    | 'construction'
    | 'creative'
    | 'social'
    | 'science'
    | 'hospitality'
    | 'other';

  aspiration:
    | 'university'
    | 'vocational_training'
    | 'employment'
    | 'entrepreneurship';

  availableTime:
    | 'full_time'
    | 'part_time'
    | 'limited';

  learningResources: string[];
  technicalSkills: string[];
  strengths: string[];

  // ===== ECONOMÍA =====
  economicSupport:
    | 'none'
    | 'partial_support'
    | 'full_support';

  monthlyIncome: number;
  incomeSources: string[];
  savings: number;
  debts: number;

  expenses: CharacterExpenses;

  // ===== RETOS, APOYO Y METAS =====
  challenges: string[];
  supportSystem: string[];

  longTermGoals: string[];
  shortTermGoals: string[];

   // ===== EXPERIENCIA =====
  academicXp: number;
  workXp: number;

  // ===== NIVELES =====
  academicLevel: ProgressLevel;
  workLevel: ProgressLevel;
}
