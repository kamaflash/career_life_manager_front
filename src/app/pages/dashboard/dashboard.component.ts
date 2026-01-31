import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../core/services/users/users.service';
import { BaseService } from '../../core/services/base/base-service.service';
import { environment } from '../../../enviroments/environment';
const endpoint = environment.baseUrlSpring + 'users';

// Interfaces
interface PlayerState {
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
  skills: {
    technical: number;
    business: number;
    social: number;
    creative: number;
    knowledge: number;
    [key: string]: number;
  };
  education?: {
    degree: string;
    institution: string;
    status: 'none' | 'studying' | 'graduated';
    gpa: number;
  };
  jobs?: Job[];
  lifestyle?: {
    qualityLevel: number;
    monthlyExpenses: number;
  };
  timeSpeed: number;
  isPaused: boolean;
  statistics: {
    totalDays: number;
    totalMoneyEarned: number;
    totalMoneySpent: number;
    jobsHeld: number;
    educationCompleted: number;
  };
}

interface Job {
  id: string;
  company: string;
  position: string;
  salary: number;
  startDate: Date;
  endDate?: Date;
  level: number;
  active: boolean;
}

interface GameEvent {
  id: string;
  type:
    | 'education'
    | 'career'
    | 'business'
    | 'financial'
    | 'personal'
    | 'random';
  title: string;
  description: string;
  date: Date;
  isResolved: boolean;
  choices: EventChoice[];
}

interface EventChoice {
  text: string;
  consequences: any;
}

interface DailyAction {
  id: string;
  name: string;
  icon: string;
  energyCost: number;
  reward: any;
}

interface SkillItem {
  name: string;
  level: number;
  icon: string;
  color: string;
}

interface QuickStat {
  label: string;
  value: string | number;
}

@Component({
  selector: 'clm-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private baseService: BaseService,
  ) {}
  ngOnInit(): void {
    this.getUser();
  }
  title = 'Career Life Manager 2025';

  // Métodos para la barra superior
  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  getPlayerAge(): number {
    // Aquí deberías obtener la edad real del jugador
    return 22;
  }

  getUser() {
    const url = endpoint + '/full/' + this.userService.user?.id;
    this.baseService.getItems(url).subscribe({
      next: (resp) => {
        if (resp) {
          this.userService.user = resp;
          sessionStorage.setItem('us', JSON.stringify(resp));
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        if (this.userService.user && !this.userService.user.persons) {
          this.router.navigate(['/create-person']);
        } else {
          this.router.navigate(['/index']);
        }
      },
    });
  }
}
