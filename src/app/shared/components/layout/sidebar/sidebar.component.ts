import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Action, ActionCard, ActionCategory, Formation } from '../../../../core/interfaces';
import { environment } from '../../../../../enviroments/environment';
import { UserService } from '../../../../core/services/users/users.service';
import { BaseService } from '../../../../core/services/base/base-service.service';
const endpoint = environment.baseUrlSpring;


@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent  implements OnInit {
  points = 5;
  actionCategories: ActionCategory[] = [];
  constructor(private userService: UserService, private baseService: BaseService) { }
  ngOnInit() {
    this.initializeActionCategories();
    this.getFormation();
  }

  initializeActionCategories() {
    this.actionCategories = [
      {
        id: 'empleo',
        name: 'EMPLEO',
        icon: '💼',
        color: 'blue',
        badge: '2 AP',
        actions: [
          {
            name: 'Buscar Trabajo',
            description: '3 ofertas disponibles',
            icon: '🎯',
            cost: 2,
            costType: 'ap',
            academicXpReward: undefined,
            showArrow: true,
            execute: () => this.searchJob()
          },
          {
            name: 'Solicitar Ascenso',
            description: 'Reunión con jefe',
            icon: '📊',
            cost: 'Nivel 5',
            costType: 'requirement',
            academicXpReward: undefined,
            showArrow: false,
            execute: () => this.requestPromotion()
          }
        ]
      },
      {
        id: 'formacion',
        name: 'FORMACIÓN',
        icon: '🎓',
        color: 'purple',
        badge: '1-3 AP',
        actions: [
          {
            name: 'Curso Online',
            description: 'React Avanzado (8h)',
            icon: '📚',
            cost: 3,
            costType: 'ap',
            academicXpReward: '+200 XP',
            showArrow: false,
            execute: () => this.takeCourse()
          },
          {
            name: 'Taller Presencial',
            description: 'Habilidades Blandas',
            icon: '🎤',
            cost: 2,
            costType: 'ap',
            academicXpReward: '+150 XP',
            showArrow: false,
            execute: () => this.attendWorkshop()
          },
          {
            name: 'Certificación',
            description: 'AWS Developer',
            icon: '🏆',
            cost: 4,
            costType: 'ap',
            academicXpReward: '+50% salario',
            showArrow: false,
            execute: () => this.getCertification()
          }
        ]
      },
      {
        id: 'finanzas',
        name: 'FINANZAS',
        icon: '💰',
        color: 'emerald',
        badge: 'Capital: €12,500',
        actions: [
          {
            name: 'Invertir en Bolsa',
            description: 'Mínimo €500',
            icon: '📈',
            cost: 'Riesgo: Medio',
            costType: 'requirement',
            academicXpReward: undefined,
            showArrow: true,
            execute: () => this.investStock()
          },
          {
            name: 'Abrir Cuenta Ahorro',
            description: '2.5% interés anual',
            icon: '🏦',
            cost: undefined,
            costType: 'none',
            academicXpReward: 'Sin AP',
            showArrow: true,
            execute: () => this.openSavingsAccount()
          },
          {
            name: 'Solicitar Crédito',
            description: 'Hasta €20,000',
            icon: '💳',
            cost: 'Deuda: -15%',
            costType: 'requirement',
            academicXpReward: undefined,
            showArrow: false,
            execute: () => this.requestLoan()
          }
        ]
      },
      {
        id: 'salud',
        name: 'SALUD & BIENESTAR',
        icon: '❤️',
        color: 'pink',
        badge: 'Salud: 90%',
        actions: [
          {
            name: 'Ir al Gimnasio',
            description: '+10% energía',
            icon: '🏋️',
            cost: 1,
            costType: 'ap',
            academicXpReward: '2h',
            showArrow: false,
            execute: () => this.goGym()
          },
          {
            name: 'Descansar',
            description: 'Recuperar energía',
            icon: '🛌',
            cost: undefined,
            costType: 'none',
            academicXpReward: '+40% energía',
            showArrow: true,
            execute: () => this.rest()
          },
          {
            name: 'Consulta Médica',
            description: 'Chequeo anual',
            icon: '🍎',
            cost: 150,
            costType: 'money',
            academicXpReward: '+20% salud',
            showArrow: false,
            execute: () => this.medicalCheckup()
          }
        ]
      },
      {
        id: 'social',
        name: 'VIDA SOCIAL',
        icon: '👥',
        color: 'amber',
        badge: '35 contactos',
        actions: [
          {
            name: 'Networking Event',
            description: 'Conferencia Tech',
            icon: '🤝',
            cost: 2,
            costType: 'ap',
            academicXpReward: '+10 contactos',
            showArrow: false,
            execute: () => this.networkingEvent()
          },
          {
            name: 'Salir con Amigos',
            description: '+15% felicidad',
            icon: '🎉',
            cost: 50,
            costType: 'money',
            academicXpReward: '3h',
            showArrow: false,
            execute: () => this.goOutWithFriends()
          },
          {
            name: 'Cita Romántica',
            description: 'Restaurante elegante',
            icon: '💑',
            cost: 120,
            costType: 'money',
            academicXpReward: '+25% felicidad',
            showArrow: false,
            execute: () => this.romanticDate()
          }
        ]
      },
      {
        id: 'vivienda',
        name: 'VIVIENDA',
        icon: '🏠',
        color: 'indigo',
        badge: 'Estudio €800/mes',
        actions: [
          {
            name: 'Buscar Apartamento',
            description: 'Mejorar vivienda',
            icon: '🏢',
            cost: 1,
            costType: 'ap',
            academicXpReward: undefined,
            showArrow: true,
            execute: () => this.searchApartment()
          },
          {
            name: 'Amueblar Casa',
            description: 'Muebles nuevos',
            icon: '🛋️',
            cost: 2000,
            costType: 'money',
            academicXpReward: '+10% comodidad',
            showArrow: false,
            execute: () => this.furnishHouse()
          },
          {
            name: 'Comprar Casa',
            description: 'Propiedad propia',
            icon: '🏡',
            cost: '€150,000',
            costType: 'requirement',
            academicXpReward: 'Requisito: Capital €30k',
            showArrow: false,
            execute: () => this.buyHouse()
          }
        ]
      }
    ];
  }

  executeAction(action: Action) {
    if (action.costType === 'ap' && typeof action.cost === 'number' && this.points >= action.cost) {
      this.points -= action.cost;
    }

    action.execute();
  }

  useAllPoints() {
    if (this.points > 0) {
      console.log(`Usando todos los puntos (${this.points} AP)`);
      this.points = 0;
    }
  }

  // Métodos de ejecución de acciones
  updateCV() {
    console.log('Actualizando CV...');
    // Lógica para actualizar CV
  }

  searchJob() {
    console.log('Buscando trabajo...');
    // Lógica para buscar trabajo
  }

  requestPromotion() {
    console.log('Solicitando ascenso...');
    // Lógica para solicitar ascenso
  }

  takeCourse() {
    console.log('Tomando curso...');
    // Lógica para tomar curso
  }

  attendWorkshop() {
    console.log('Asistiendo a taller...');
    // Lógica para taller
  }

  getCertification() {
    console.log('Obteniendo certificación...');
    // Lógica para certificación
  }

  investStock() {
    console.log('Invirtiendo en bolsa...');
    // Lógica para invertir
  }

  openSavingsAccount() {
    console.log('Abriendo cuenta de ahorros...');
    // Lógica para cuenta de ahorros
  }

  requestLoan() {
    console.log('Solicitando crédito...');
    // Lógica para crédito
  }

  goGym() {
    console.log('Yendo al gimnasio...');
    // Lógica para gimnasio
  }

  rest() {
    console.log('Descansando...');
    // Lógica para descansar
  }

  medicalCheckup() {
    console.log('Consultando médico...');
    // Lógica para consulta médica
  }

  networkingEvent() {
    console.log('Asistiendo a evento de networking...');
    // Lógica para networking
  }

  goOutWithFriends() {
    console.log('Saliendo con amigos...');
    // Lógica para salir con amigos
  }

  romanticDate() {
    console.log('Teniedo cita romántica...');
    // Lógica para cita
  }

  searchApartment() {
    console.log('Buscando apartamento...');
    // Lógica para buscar apartamento
  }

  furnishHouse() {
    console.log('Amueblando casa...');
    // Lógica para amueblar
  }

  buyHouse() {
    console.log('Comprando casa...');
    // Lógica para comprar casa
  }

  getFormation() {
    const url:string = endpoint + "trainer/character/"+this.userService.user?.persons?.id+"/available"

    this.baseService.getItems(url).subscribe({
      next: (resp:any) => {
        this.actionCategories[1].actions = [resp.formations]; // Limpiar acciones actuales

        this.actionCategories[1].actions = resp.formations.map((f:any) =>
  this.mapFormationToAction(f, (formation:any) => {

  })
);
      },
      error: (err) => {
        console.error('Error fetching formation data', err);
      }
    });
  }

  mapFormationToAction(
  formation: Formation,
  onExecute: (formation: Formation) => void
): ActionCard {
  return {
    id: formation.id,
    name: formation.name,
    description: `${formation.durationHours}h · ${formation.difficulty}`,
    icon: this.getIconByCategory(formation.category),
    cost: formation.effort,
    costType: 'ap',
    academicXpReward: `+${formation.academicXpReward} XP`,
    showArrow: false,
    execute: () => onExecute(formation)
  };
}
getIconByCategory(category: string): string {
  switch (category) {
    case 'technology': return '💻';
    case 'business': return '📊';
    case 'health': return '🩺';
    case 'creative': return '🎨';
    case 'sports': return '🏋️';
    case 'science': return '🔬';
    default: return '📚';
  }
}
}
