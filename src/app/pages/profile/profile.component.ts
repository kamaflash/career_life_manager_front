import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../core/services/users/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  // Datos del jugador
  playerData: any | null = null;

  // Secciones del perfil
  profileSections: any[] = [];

  // Traducciones para valores
  translations = {
    // Situación actual
    currentSituation: {
      high_school: 'Estudiante de Bachillerato',
      university: 'Estudiante Universitario',
      working: 'Trabajando',
      unemployed: 'Desempleado',
      vocational_training: 'F.P. / Formación Profesional',
      other: 'Otro',
    },

    // Situación familiar
    familySituation: {
      stable_family: 'Familia Estable',
      single_parent: 'Padre/Madre Soltero/a',
      divorced_parents: 'Padres Divorciados',
      extended_family: 'Familia Extendida',
      independent: 'Independiente',
    },

    // Expectativas familiares
    familyExpectations: {
      expect_university: 'Estudios Universitarios',
      expect_family_business: 'Negocio Familiar',
      expect_independence: 'Independencia Temprana',
      expect_trade: 'Oficio/Técnico',
      expect_work: 'Trabajo Inmediato',
    },

    // Nivel educativo
    educationLevel: {
      basic: 'Educación Básica',
      high_school: 'Bachillerato',
      technical: 'Técnico/FP',
      university: 'Universitario',
      postgraduate: 'Postgrado',
    },

    // Rendimiento académico
    academicPerformance: {
      high: 'Alto',
      medium: 'Medio',
      low: 'Bajo',
      excellent: 'Excelente',
    },

    // Intereses profesionales
    careerInterest: {
      technology: 'Tecnología',
      health: 'Salud',
      education: 'Educación',
      business: 'Negocios',
      arts: 'Artes',
      science: 'Ciencias',
      engineering: 'Ingeniería',
      other: 'Otro',
    },

    // Habilidades técnicas
    technicalSkills: {
      basic_programming: 'Programación Básica',
      basic_computer: 'Informática Básica',
      advanced_programming: 'Programación Avanzada',
      design: 'Diseño',
      data_analysis: 'Análisis de Datos',
      networking: 'Redes',
    },

    // Fortalezas
    strengths: {
      math_logic: 'Lógica Matemática',
      creativity: 'Creatividad',
      responsibility: 'Responsabilidad',
      leadership: 'Liderazgo',
      communication: 'Comunicación',
      teamwork: 'Trabajo en Equipo',
      problem_solving: 'Resolución de Problemas',
    },

    // Objetivos a largo plazo
    longTermGoals: {
      stable_career: 'Carrera Estable',
      travel: 'Viajar',
      entrepreneurship: 'Emprender',
      family: 'Formar Familia',
      home_ownership: 'Comprar Casa',
      financial_freedom: 'Libertad Financiera',
    },

    // Objetivos a corto plazo
    shortTermGoals: {
      finish_studies: 'Terminar Estudios',
      first_job: 'Primer Empleo',
      improve_grades: 'Mejorar Notas',
      learn_skill: 'Aprender Habilidad',
      save_money: 'Ahorrar Dinero',
      get_certification: 'Obtener Certificación',
    },
  };

  // Datos editables
  editData = {
    fullName: '',
    city: '',
    careerInterest: '',
    aspiration: '',
    bio: '',
  };

  // Estado UI
  activeTab: 'personal' | 'education' | 'career' | 'finance' | 'goals' =
    'career';
  isEditing = false;
  isSaving = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadPlayerData();
    this.initializeProfileSections();
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones si es necesario
  }

  /**
   * Carga los datos del jugador
   */
  loadPlayerData(): void {
    // Usar los datos proporcionados
    this.playerData = {
      id: 10,
      uid: 5,
      fullName: 'Carlos Rodríguez Pérez',
      birthDate: '2010-01-26',
      age: 16,
      city: 'madrid',
      gender: 'male',
      createdAt: '2026-01-26T21:37:48.951624',
      currentSituation: 'high_school',
      familySituation: 'stable_family',
      familyExpectations: [
        'expect_university',
        'expect_family_business',
        'expect_independence',
        'expect_trade',
        'expect_work',
      ],
      educationLevel: 'basic',
      educationField: null,
      educationSpecialization: null,
      academicPerformance: 'high',
      educationGaps: [],
      careerInterest: 'technology',
      aspiration: null,
      availableTime: null,
      learningResources: [],
      technicalSkills: ['basic_programming', 'basic_computer'],
      strengths: ['math_logic', 'creativity', 'responsibility'],
      economicSupport: null,
      monthlyIncome: null,
      incomeSources: [],
      savings: null,
      debts: null,
      expenses: null,
      academicXp: null,
      challenges: [],
      supportSystem: [],
      longTermGoals: ['stable_career', 'travel'],
      shortTermGoals: ['finish_studies', 'first_job', 'improve_grades'],
    };
    if (this.userService.user) {
      this.playerData = this.userService.user.persons;
    }

    this.initializeEditData();
  }

  /**
   * Inicializa las secciones del perfil
   */
  initializeProfileSections(): void {
    this.profileSections = [
      {
        id: 'education',
        title: 'Educación y Formación',
        icon: '🎓',
        color: 'emerald',
        progress: this.calculateProgress('education'),
        items: [
          {
            label: 'Situación Actual',
            value: this.translateValue(
              'currentSituation',
              this.playerData?.currentSituation,
            ),
            icon: '📚',
          },
          {
            label: 'Nivel Educativo',
            value: this.translateValue(
              'educationLevel',
              this.playerData?.educationLevel,
            ),
            icon: '📈',
          },
          {
            label: 'Rendimiento Académico',
            value: this.translateValue(
              'academicPerformance',
              this.playerData?.academicPerformance,
            ),
            icon: '⭐',
          },
          {
            label: 'Habilidades Técnicas',
            value: this.translateArray(
              'technicalSkills',
              this.playerData?.technicalSkills || [],
            ),
            icon: '💻',
            type: 'list',
          },
          {
            label: 'Puntos experiencia',
            value: this.playerData?.academicXp + " px" || 0 + " px",
            icon: '📖',
          },
          {
            label: 'Nivel formación',
            value: this.returnLevel(this.playerData?.academicLevel),
            icon: '⚠️',
          },
        ],
      },
      {
        id: 'career',
        title: 'Carrera y Habilidades',
        icon: '💼',
        color: 'amber',
        progress: this.calculateProgress('career'),
        items: [
          {
            label: 'Interés Profesional',
            value: this.translateValue(
              'careerInterest',
              this.playerData?.careerInterest,
            ),
            icon: '🎯',
          },
          {
            label: 'Aspiración',
            value: this.playerData?.aspiration || 'No especificada',
            icon: '🚀',
          },
          {
            label: 'Fortalezas',
            value: this.translateArray(
              'strengths',
              this.playerData?.strengths || [],
            ),
            icon: '💪',
            type: 'list',
          },
          {
            label: 'Sistema de Apoyo',
            value: this.playerData?.supportSystem || [],
            icon: '🤝',
            type: 'list',
          },
          {
            label: 'Desafíos',
            value: this.playerData?.challenges || [],
            icon: '🧗',
            type: 'list',
          },
        ],
      },
      {
        id: 'finance',
        title: 'Situación Económica',
        icon: '💰',
        color: 'green',
        progress: this.calculateProgress('finance'),
        items: [
          {
            label: 'Apoyo Económico',
            value: this.playerData?.economicSupport || 'No especificado',
            icon: '🏦',
          },
          {
            label: 'Ingreso Mensual',
            value: this.formatCurrency(this.playerData?.monthlyIncome),
            icon: '💵',
          },
          {
            label: 'Fuentes de Ingreso',
            value: this.playerData?.incomeSources || [],
            icon: '📊',
            type: 'list',
          },
          {
            label: 'Ahorros',
            value: this.formatCurrency(this.playerData?.savings),
            icon: '💰',
          },
          {
            label: 'Deudas',
            value: this.formatCurrency(this.playerData?.debts),
            icon: '💳',
          },
          {
            label: 'Gastos',
            value: this.formatCurrency(this.playerData?.expenses),
            icon: '📉',
          },
        ],
      },
      {
        id: 'goals',
        title: 'Metas y Objetivos',
        icon: '🎯',
        color: 'purple',
        progress: this.calculateProgress('goals'),
        items: [
          {
            label: 'Metas a Corto Plazo',
            value: this.translateArray(
              'shortTermGoals',
              this.playerData?.shortTermGoals || [],
            ),
            icon: '📅',
            type: 'list',
          },
          {
            label: 'Metas a Largo Plazo',
            value: this.translateArray(
              'longTermGoals',
              this.playerData?.longTermGoals || [],
            ),
            icon: '🗓️',
            type: 'list',
          },
          {
            label: 'Tiempo Disponible',
            value: this.playerData?.availableTime || 'No especificado',
            icon: '⏰',
          },
          {
            label: 'Campo de Educación',
            value: this.playerData?.educationField || 'No especificado',
            icon: '🎓',
          },
          {
            label: 'Especialización',
            value:
              this.playerData?.educationSpecialization || 'No especificada',
            icon: '🔬',
          },
        ],
      },
    ];
  }

  /**
   * Inicializa datos de edición
   */
  initializeEditData(): void {
    if (this.playerData) {
      this.editData = {
        fullName: this.playerData.fullName,
        city: this.playerData.city,
        careerInterest: this.playerData.careerInterest,
        aspiration: this.playerData.aspiration || '',
        bio: 'Joven de 16 años interesado en tecnología, con habilidades básicas en programación y computación. Actualmente estudiando bachillerato en Madrid, buscando orientación para su futuro profesional.',
      };
    }
  }

  /**
   * Traduce un valor usando el diccionario
   */
  translateValue(
    category: keyof typeof this.translations,
    value: string | undefined,
  ): string {
    if (!value) return 'No especificado';

    const categoryDict = this.translations[category];
    if (categoryDict && value in categoryDict) {
      return categoryDict[value as keyof typeof categoryDict];
    }

    return this.formatValue(value);
  }

  /**
   * Traduce un array de valores
   */
  translateArray(
    category: keyof typeof this.translations,
    values: string[],
  ): string[] {
    return values.map((value) => this.translateValue(category, value));
  }

  /**
   * Formatea un valor
   */
  formatValue(value: any): string {
    if (!value) return 'No especificado';
    if (typeof value === 'string') {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return String(value);
  }

  /**
   * Formatea el género
   */
  formatGender(gender: string | undefined): string {
    if (!gender) return 'No especificado';
    return gender === 'male' ? 'Hombre' : 'Mujer';
  }

  /**
   * Formatea moneda
   */
  formatCurrency(value: number | null | undefined): string {
    if (!value) return 'No especificado';
    return `$${value.toLocaleString('es-ES')}`;
  }

  /**
   * Calcula el progreso de una sección
   */
  calculateProgress(sectionId: string): number {
    if (!this.playerData) return 0;

    const section = this.profileSections.find((s) => s.id === sectionId);
    if (!section) return 0;

    let filledCount = 0;
    let totalCount = section.items.length;

    section.items.forEach((item: any) => {
      if (Array.isArray(item.value)) {
        if (item.value.length > 0 && item.value[0] !== 'No especificado') {
          filledCount++;
        }
      } else {
        if (
          item.value &&
          item.value !== 'No especificado' &&
          item.value !== 0
        ) {
          filledCount++;
        }
      }
    });

    return Math.round((filledCount / totalCount) * 100);
  }

  /**
   * Cambia la pestaña activa
   */
  setActiveTab(
    tab: 'personal' | 'education' | 'career' | 'finance' | 'goals',
  ): void {
    this.activeTab = tab;
  }

  /**
   * Activa el modo de edición
   */
  startEditing(): void {
    this.isEditing = true;
  }

  /**
   * Guarda los cambios
   */
  saveChanges(): void {
    this.isSaving = true;

    // Simular guardado
    setTimeout(() => {
      if (this.playerData) {
        this.playerData.fullName = this.editData.fullName;
        this.playerData.city = this.editData.city;
        this.playerData.careerInterest = this.editData.careerInterest;
        this.playerData.aspiration = this.editData.aspiration;
      }

      this.isEditing = false;
      this.isSaving = false;
      this.initializeProfileSections(); // Actualizar secciones

      console.log('Cambios guardados:', this.editData);
    }, 1000);
  }

  /**
   * Cancela la edición
   */
  cancelEdit(): void {
    this.initializeEditData();
    this.isEditing = false;
  }

  /**
   * Obtiene la sección activa
   */
  getActiveSection(): any | undefined {
    return this.profileSections.find(
      (section) => section.id === this.activeTab,
    );
  }

  /**
   * Obtiene las iniciales del nombre
   */
  getInitials(fullName: string): string {
    if (!fullName) return 'U';
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  /**
   * Formatea la fecha
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  /**
   * Obtiene el color de progreso
   */
  getProgressColor(progress: number): string {
    if (progress >= 80) return 'bg-emerald-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  }

  /**
   * Obtiene el icono del progreso
   */
  getProgressIcon(progress: number): string {
    if (progress >= 80) return '🎉';
    if (progress >= 60) return '👍';
    if (progress >= 40) return '📊';
    return '📝';
  }

  /**
   * Obtiene el texto del progreso
   */
  getProgressText(progress: number): string {
    if (progress >= 80) return 'Completo';
    if (progress >= 60) return 'Buen Progreso';
    if (progress >= 40) return 'En Proceso';
    return 'Por Comenzar';
  }
  // Añade este método a la clase
  setTab(tabId: string): void {
    const validTabs = ['personal', 'education', 'career', 'finance', 'goals'];
    if (validTabs.includes(tabId)) {
      this.setActiveTab(tabId as any);
    }
  }

  calculateEducationalPotential(): number {
    let potential = 1;

    const levelScore: { [key: string]: number } = {
      none: 0,
      basic: 0,
      highschool: 1,
      technical: 1,
      university: 2,
    };

    potential += levelScore[this.playerData.educationLevel] || 0;

    if (
      this.playerData.academicPerformance === 'high' ||
      this.playerData.academicPerformance === 'excellent'
    ) {
      potential += 1;
    }

    return Math.max(1, Math.min(potential, 3));
  }

  calculateFinancialCapacity(): number {
    let capacity = 1;

    const incomeLevel = this.calculateIncomeLevel();
    if (incomeLevel === 'medium') capacity += 1;
    if (incomeLevel === 'high') capacity += 2;

    if ((this.playerData.savings || 0) > 1000) capacity += 1;
    if (this.calculateMonthlyBalance() > 200) capacity += 1;

    return Math.max(1, Math.min(capacity, 3));
  }

  calculateMonthlyBalance(): number {
    let income = 0;
    switch (this.playerData.familySituation) {
      case 'stable_family':
        income = 400;
        break;
      case 'working_family':
        income = 1000;
        break;
      case 'difficult_situation':
        income = 200;
        break;
      default:
        income = 200;
        break;
    }
    const totalExpenses = this.getMonthlyExpensesSummary().reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    return income - totalExpenses;
  }

  getMonthlyExpensesSummary(): { category: string; amount: number }[] {
    const expenses = [];
    const baseExpense =
      this.playerData.city === 'madrid' ||
      this.playerData.city === 'barcelona'
        ? 400
        : 300;

    if (this.playerData.expenses?.housing > 0) {
      expenses.push({ category: 'Vivienda', amount: 0 });
    } else if (this.playerData.age < 18) {
      expenses.push({ category: 'Vivienda', amount: 0 });
    } else {
      expenses.push({ category: 'Vivienda', amount: 0 });
    }

    expenses.push({
      category: 'Alimentación',
      amount: this.playerData.expenses?.food || 200,
    });

    expenses.push({
      category: 'Transporte',
      amount: this.playerData.expenses?.transport || 50,
    });

    if (this.playerData.expenses?.education > 0) {
      expenses.push({
        category: 'Educación',
        amount: this.playerData.expenses?.education,
      });
    }

    if (this.playerData.expenses?.other > 0) {
      expenses.push({
        category: 'Otros',
        amount: this.playerData.expenses?.other,
      });
    }

    return expenses;
  }

  getPotentialScore(): number {
    let score = 3;

    // Bonificaciones por recursos
    if (this.playerData.economicSupport === 'full_support') score++;
    if (this.playerData.availableTime === 'full_time') score++;
    if (
      this.playerData.learningResources &&
      this.playerData.learningResources.length >= 3
    )
      score++;

    // Bonificaciones por habilidades
    if (
      this.playerData.strengths &&
      this.playerData.strengths.length >= 2
    )
      score++;
    if (
      this.playerData.technicalSkills &&
      this.playerData.technicalSkills.length >= 2
    )
      score++;

    // Nuevas bonificaciones por educación
    if (
      this.playerData.educationLevel === 'technical' ||
      this.playerData.educationLevel === 'university'
    )
      score++;
    if (
      this.playerData.academicPerformance === 'high' ||
      this.playerData.academicPerformance === 'excellent'
    )
      score++;

    // Nueva bonificación por situación económica
    if (this.calculateIncomeLevel() === 'high') score++;
    if ((this.playerData.savings || 0) > 1000) score++;

    // Penalizaciones por desafíos
    if (
      this.playerData.challenges &&
      this.playerData.challenges.length >= 2
    )
      score--;
    if (this.playerData.familySituation === 'difficult_situation')
      score--;

    // Nueva penalización por brechas educativas
    if (
      this.playerData.educationGaps &&
      this.playerData.educationGaps.length >= 3
    )
      score--;
    if ((this.playerData.debts || 0) > 2000) score--;

    return Math.max(1, Math.min(5, score));
  }
  calculateIncomeLevel(): string {
    switch (this.playerData.familySituation) {
      case 'stable_family':
        return 'medium';
      case 'working_family':
        return 'high';
      case 'difficult_situation':
        return 'low';
      default:
        return 'low';
    }
  }

  returnLevel(score: string): string {
    switch (score) {
      case "LEVEL_1":
        return '1';
      case "LEVEL_2":
        return "2";
      case "LEVEL_3":
    return "3";
    default:
        return "1";
    }
  }
}
