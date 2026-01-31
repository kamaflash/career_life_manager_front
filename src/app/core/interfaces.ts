// Tipos para el formulario de registro
export interface RegisterFormData {
  fullName: string;
  age: number;
  country: string;
  difficulty: 'easy' | 'normal' | 'hard';
  careerGoal: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  newsletter: boolean;
}

// Tipos para la dificultad
export type DifficultyLevel = 'easy' | 'normal' | 'hard';

// Tipos para país
export interface Country {
  code: string;
  name: string;
  flag: string;
}
// form-interfaces.ts
// form-interfaces.ts
export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'number'
    | 'password'
    | 'select'
    | 'date'
    | 'textarea'
    | 'difficulty-selector'
    | 'checkbox-simple'
    | 'submit-button'
    | 'checkbox-group'
    | 'link-button';

  placeholder?: string;
  icon?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  grid?: boolean;  // Ocupa múltiples columnas en grid
  fullWidth?: boolean;  // NUEVO: Ocupa todo el ancho disponible
minDate?: string; // Para campos de fecha
maxDate?: string;
  // Para selects
  options?: { label: string; value: any; icon?: string, description?: string ,checked?: boolean}[];
  maxSelections?: number; // Para checkbox-group
description?: string;
  // Para difficulty-selector
  buttons?: {
    label: string;
    value: any;
    description?: string;
    icon?: string;
  }[];

  // Validaciones
  min?: number;
  max?: number;

  // Condicional
  showWhen?: {
    field: string;
    value: any;
  };

  // Específico para password
  showStrength?: boolean;
}

export interface FormSection {
  title?: string;
  icon?: string;
  description?: string;
  fullWidth?: boolean;  // NUEVO: Toda la sección en ancho completo
  fields: FormField[];
}

export interface FormConfig {
  sections: FormSection[];
  columns?: number;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
  showSocialLogin?: boolean;
}

export interface PasswordStrength {
  score: number;
  text: string;
  color: string;
}
export interface AccountData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface CharacterData {
  characterName: string;
  characterAge: number;
  characterGender: 'male' | 'female' | 'nonbinary' | 'prefer_not_say';
  background: 'graduate' | 'professional' | 'career_change' | 'entrepreneur';
  startingCity: 'madrid' | 'barcelona' | 'nyc' | 'silicon_valley';
  careerPath: 'software' | 'data' | 'finance' | 'marketing' | 'management';
}

export interface GamePreferences {
  difficulty: 'easy' | 'normal' | 'hard';
  gameSpeed?: 'normal' | 'fast';
  acceptTerms: boolean;
  newsletter?: boolean;
}

export interface CompleteRegistrationData {
  account: AccountData;
  character: CharacterData;
  preferences: GamePreferences;
}

export interface CharacterExpenses {
  housing: number;
  food: number;
  transport: number;
  education: number;
  other: number;
}
export interface Action {
  title: string;
  description: string;
  icon: string;
  cost?: number | string;
  costType?: 'ap' | 'money' | 'requirement' | 'none';
  reward?: string;
  showArrow?: boolean;
  execute: () => void;
}

export interface ActionCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  badge: string;
  actions: Action[];
}

export type ProgressLevel =
  | 'LEVEL_1'
  | 'LEVEL_2'
  | 'LEVEL_3'
  | 'LEVEL_4'
  | 'LEVEL_5';


