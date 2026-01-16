export interface PlayerSkills {
  technical: number;
  business: number;
  social: number;
  creative: number;
  knowledge: number;
  [key: string]: number;
}

export interface PlayerStatistics {
  totalDays: number;
  totalMoneyEarned: number;
  totalMoneySpent: number;
  jobsHeld: number;
  educationCompleted: number;
}

export interface PlayerState {
  id: string;
  playerId: string;
  name: string;
  age: number;
  birthDate: Date;
  currentDate: Date;
  money: number;
  energy: number;
  happiness: number;
  prestige: number;
  health: number;
  skills: PlayerSkills;
  education?: {
    degree: string;
    institution: string;
    status: 'none' | 'studying' | 'graduated';
    gpa: number;
  };
  jobs?: any[];
  lifestyle?: {
    qualityLevel: number;
    monthlyExpenses: number;
  };
  timeSpeed: number;
  isPaused: boolean;
  statistics: PlayerStatistics;
}

export interface AppState {
  player: PlayerState;
}
