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
