import { Component, OnInit, ViewChild } from '@angular/core';
import { FormDynamicComponent } from '../../../shared/components/ui/form-dynamic/form-dynamic.component';
import { FormConfig } from '../../../core/interfaces';
import { CommonModule } from '@angular/common';
import { CharacterPreview } from '../../../core/models/player.model';
import { environment } from '../../../../enviroments/environment';
import { BaseService } from '../../../core/services/base/base-service.service';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/users/users.service';
import { PROVINCIAS_ESPAÑA } from '../../../core/constantes';

const endpoint = environment.baseUrlSpring + 'persons';

@Component({
  selector: 'app-create-person',
  imports: [FormDynamicComponent, CommonModule],
  templateUrl: './create-person.component.html',
  styleUrl: './create-person.component.css',
})
export class CreatePersonComponent implements OnInit {
  isLoading: boolean = false;
  characterPreview: CharacterPreview = {
    fullName: 'Nuevo Personaje',
    age: 0,
    currentSituation: 'high_school',
    city: { label: 'Madrid', value: 'madrid', avgRoomRent: 600 },
    residentialCity: 'si',
    careerInterest: 'technology',
    aspiration: 'university',
    economicSupport: 'partial_support',
    availableTime: 'full_time',
    learningResources: [] as string[],
    strengths: [] as string[],
    technicalSkills: [] as string[],
    familySituation: 'stable_family',
    familyExpectations: [] as string[],
    challenges: [] as string[],
    supportSystem: [] as string[],
    // Nuevas propiedades añadidas
    educationLevel: 'basic' as CharacterPreview['educationLevel'],
    educationField: '' as string,
    educationSpecialization: '' as string,
    academicPerformance: 'average' as CharacterPreview['academicPerformance'],
    educationGaps: [] as string[],
    monthlyIncome: 0 as number,
    incomeSources: [] as string[],
    savings: 0 as number,
    debts: 0 as number,
    expenses: {
      housing: 0,
      food: 0,
      transport: 0,
      education: 0,
      other: 0,
    },
    gender: 'male',
    longTermGoals: [],
    shortTermGoals: [],
    academicLevel: 'LEVEL_1',
    academicXp: 0,
    workLevel: 'LEVEL_1',
    workXp: 0,
  };

  @ViewChild(FormDynamicComponent) formDynamicComponent!: FormDynamicComponent;

  // Configuración del formulario de creación de personaje
  characterConfig: FormConfig = {
    sections: [
  // Sección 1: Información Básica
  {
    title: 'Información Personal',
    icon: 'person',
    description: 'Datos básicos de tu personaje',
    fields: [
      {
        name: 'fullName',
        label: 'Nombre completo',
        type: 'text',
        icon: 'badge',
        placeholder: 'Ej: Carlos Rodríguez Pérez',
        required: true,
        fullWidth: true,
        max: 50,
      },
      {
        name: 'birthDate',
        label: 'Fecha de nacimiento',
        type: 'date',
        icon: 'cake',
        placeholder: 'DD/MM/AAAA',
        required: true,
        fullWidth: false,
        minDate: this.getDateYearsAgo(17),
        maxDate: this.getDateYearsAgo(16),
      },
      {
        name: 'gender',
        label: 'Género',
        type: 'select',
        icon: 'wc',
        required: true,
        fullWidth: false,
        options: [
          { label: 'Hombre', value: 'male', icon: 'man' },
          { label: 'Mujer', value: 'female', icon: 'woman' },
          { label: 'No binario', value: 'nonbinary', icon: 'person' },
          {
            label: 'Prefiero no decirlo',
            value: 'unspecified',
            icon: 'sentiment_satisfied',
          },
        ],
      },
      {
        name: 'city',
        label: 'Ciudad de residencia',
        type: 'select',
        icon: 'location_city',
        required: true,
        fullWidth: false,
        options: PROVINCIAS_ESPAÑA,
      },
      {
        name: 'residentialCity',
        label: 'Residencia familiar',
        type: 'select',
        icon: 'home',
        required: true,
        fullWidth: false,
        options: [
          { label: 'SI, vivo con mi familia', value: 'si' },
          { label: 'No, alquilo habitación', value: 'no' },
        ],
      },
    ],
  },

  // Sección 2: Situación Educativa/Profesional
  {
    title: 'Situación Educativa',
    icon: 'school',
    description: '¿Qué estás haciendo actualmente?',
    fields: [
      {
        name: 'currentSituation',
        label: 'Situación actual a los 16 años',
        type: 'difficulty-selector',
        icon: 'calendar_month',
        required: true,
        fullWidth: true,
        buttons: [
          {
            label: 'Estudios Secundaria',
            value: 'high_school',
            icon: 'menu_book',
            description: 'Estudiando ESO/Bachillerato',
          },
          {
            label: 'Formación Profesional',
            value: 'vocational_training',
            icon: 'settings',
            description: 'Cursando FP Básica/Grado Medio',
          },
          {
            label: 'Sin Estudiar',
            value: 'not_studying',
            icon: 'home',
            description: 'Sin estudios ni trabajo actual',
          },
        ],
      },
      {
        name: 'educationLevel',
        label: 'E.S.O / Formación secundaria alcanzada',
        type: 'select',
        icon: 'menu_book',
        required: true,
        fullWidth: true,
        options: [
          { label: 'Si', value: 'basic' },
          { label: 'No', value: 'none' },
        ],
      },
      {
        name: 'academicPerformance',
        label: 'Rendimiento académico',
        type: 'select',
        icon: 'trending_up',
        required: false,
        fullWidth: false,
        options: [
          { label: 'Bajo', value: 'low' },
          { label: 'Promedio', value: 'average' },
          { label: 'Alto', value: 'high' },
          { label: 'Excelente', value: 'excellent' },
        ],
      },
    ],
  },

  // Sección 3: Intereses Profesionales
  {
    title: 'Intereses y Aspiraciones',
    icon: 'track_changes',
    description: '¿Qué te gustaría hacer en el futuro?',
    fields: [
      {
        name: 'careerInterest',
        label: 'Área de interés principal',
        type: 'difficulty-selector',
        icon: 'work',
        required: true,
        fullWidth: true,
        buttons: [
          {
            label: 'Tecnología',
            value: 'technology',
            icon: 'computer',
            description: 'Informática, programación, IA',
          },
          {
            label: 'Salud',
            value: 'health',
            icon: 'medical_services',
            description: 'Medicina, enfermería, farmacia',
          },
          {
            label: 'Construcción',
            value: 'construction',
            icon: 'construction',
            description: 'Arquitectura, ingeniería, obras',
          },
          {
            label: 'Negocios',
            value: 'business',
            icon: 'trending_up',
            description: 'Administración, finanzas, marketing',
          },
          {
            label: 'Creativo',
            value: 'creative',
            icon: 'palette',
            description: 'Diseño, arte, música, comunicación',
          },
          {
            label: 'Social',
            value: 'social',
            icon: 'groups',
            description: 'Educación, psicología, trabajo social',
          },
          {
            label: 'Ciencia',
            value: 'science',
            icon: 'science',
            description: 'Investigación, biología, química',
          },
          {
            label: 'Hostelería',
            value: 'hospitality',
            icon: 'restaurant',
            description: 'Cocina, turismo, restauración',
          },
        ],
      },
    ],
  },

  // Sección 4: Habilidades y Competencias
  {
    title: 'Habilidades Personales',
    icon: 'psychology',
    description: '¿En qué destacas?',
    fields: [
      {
        name: 'strengths',
        label: 'Fortalezas principales',
        type: 'checkbox-group',
        icon: 'star',
        required: false,
        fullWidth: true,
        maxSelections: 3,
        options: [
          { label: 'Matemáticas y lógica', value: 'math_logic', checked: false },
          { label: 'Comunicación verbal', value: 'verbal_communication', checked: false },
          { label: 'Creatividad', value: 'creativity', checked: false },
          { label: 'Trabajo en equipo', value: 'teamwork', checked: false },
          { label: 'Responsabilidad', value: 'responsibility', checked: false },
          { label: 'Adaptabilidad', value: 'adaptability', checked: false },
          { label: 'Liderazgo', value: 'leadership', checked: false },
          { label: 'Resolución de problemas', value: 'problem_solving', checked: false },
        ],
      },
      {
        name: 'technicalSkills',
        label: 'Habilidades técnicas',
        type: 'checkbox-group',
        icon: 'build',
        required: false,
        fullWidth: true,
        maxSelections: 2,
        options: [
          { label: 'Informática básica', value: 'basic_computer', checked: false },
          { label: 'Ofimática (Word, Excel)', value: 'office', checked: false },
          { label: 'Programación básica', value: 'basic_programming', checked: false },
          { label: 'Diseño gráfico', value: 'graphic_design', checked: false },
          { label: 'Mecánica', value: 'mechanics', checked: false },
          { label: 'Electricidad', value: 'electricity', checked: false },
          { label: 'Cocina', value: 'cooking', checked: false },
          { label: 'Idiomas', value: 'languages', checked: false },
        ],
      },
    ],
  },

  // Sección 5: Contexto Familiar y Económico
  {
    title: 'Contexto Familiar y Económico',
    icon: 'family_restroom',
    description: 'Tu entorno influye en tus oportunidades',
    fields: [
      {
        name: 'familySituation',
        label: 'Situación familiar',
        type: 'select',
        icon: 'home',
        required: true,
        fullWidth: true,
        options: [
          {
            label: 'Familia con recursos estables',
            value: 'stable_family',
            description: 'Apoyo económico para estudios',
          },
          {
            label: 'Familia acomodada',
            value: 'working_family',
            description: 'Recursos abundantes, economía fluida',
          },
          {
            label: 'Situación complicada',
            value: 'difficult_situation',
            description: 'Barreras económicas/sociales importantes',
          },
        ],
      },
      {
        name: 'familyExpectations',
        label: 'Expectativas familiares',
        type: 'checkbox-group',
        icon: 'theater_comedy',
        required: false,
        fullWidth: true,
        options: [
          { label: 'Que estudie una carrera', value: 'expect_university', checked: false },
          { label: 'Que aprenda un oficio', value: 'expect_trade', checked: false },
          { label: 'Que ayude en el negocio familiar', value: 'expect_family_business', checked: false },
          { label: 'Que trabaje cuanto antes', value: 'expect_work', checked: false },
          { label: 'Que decida por mí mismo', value: 'expect_independence', checked: false },
        ],
      },
    ],
  },

  // Sección 9: Confirmación y Metas
  {
    title: 'Metas Finales',
    icon: 'flag',
    description: 'Define tus objetivos a largo plazo',
    fields: [
      {
        name: 'longTermGoals',
        label: 'Metas a 10 años',
        type: 'checkbox-group',
        icon: 'target',
        required: false,
        fullWidth: true,
        maxSelections: 2,
        options: [
          { label: 'Tener una carrera estable', value: 'stable_career', checked: false },
          { label: 'Crear mi propio negocio', value: 'own_business', checked: false },
          { label: 'Viajar y conocer mundo', value: 'travel', checked: false },
          { label: 'Formar una familia', value: 'family', checked: false },
          { label: 'Contribuir a la sociedad', value: 'contribute', checked: false },
          { label: 'Ser reconocido en mi campo', value: 'recognition', checked: false },
          { label: 'Equilibrio vida-trabajo', value: 'work_life_balance', checked: false },
          { label: 'Independencia financiera', value: 'financial_independence', checked: false },
        ],
      },
      {
        name: 'shortTermGoals',
        label: 'Metas inmediatas (1-2 años)',
        type: 'checkbox-group',
        icon: 'calendar_month',
        required: false,
        fullWidth: true,
        maxSelections: 3,
        options: [
          { label: 'Terminar mis estudios actuales', value: 'finish_studies', checked: false },
          { label: 'Aprender una nueva habilidad', value: 'learn_skill', checked: false },
          { label: 'Conseguir mi primer trabajo', value: 'first_job', checked: false },
          { label: 'Ahorrar dinero', value: 'save_money', checked: false },
          { label: 'Mejorar mis notas', value: 'improve_grades', checked: false },
          { label: 'Hacer nuevos amigos', value: 'new_friends', checked: false },
          { label: 'Participar en actividades extraescolares', value: 'extracurricular', checked: false },
          { label: 'Tomar decisiones sobre mi futuro', value: 'future_decisions', checked: false },
        ],
      },
      {
        name: 'submit',
        label: '¡Comenzar mi Viaje Profesional!',
        type: 'submit-button',
        icon: 'rocket_launch',
        fullWidth: true,
      },
    ],
  },
],

    columns: 2,
    showProgress: true,
    currentStep: 1,
    totalSteps: 9,
    showSocialLogin: false,
  };

  constructor(
    public baseService: BaseService,
    private router: Router,
    private userService: UserService,
  ) {}
  ngOnInit(): void {

  }

  // Helper methods
  private getDateYearsAgo(years: number): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - years);
    return date.toISOString().split('T')[0];
  }



  // Cargar personaje predefinido
  loadPredefinedCharacter(type: string): void {
    let character: any = {};

    switch (type) {
      case 'student':
        character = {
          fullName: 'Ana Martínez López',
          birthDate: this.getDateYearsAgo(16),
          gender: 'female',
          city: { label: 'Madrid', value: 'madrid', avgRoomRent: 600 },
          currentSituation: 'high_school',
          educationLevel: 'highschool',
          academicPerformance: 'high',
          careerInterest: 'technology',
          aspiration: 'university',
          familySituation: 'academic_family',
          economicSupport: 'full_support',
          monthlyIncome: 0,
          savings: 1000,
          debts: 0,
          availableTime: 'full_time',
          strengths: ['math_logic', 'creativity'],
          learningResources: ['internet', 'computer', 'library'],
        };
        break;

      case 'worker':
        character = {
          fullName: 'Juan García Fernández',
          birthDate: this.getDateYearsAgo(18),
          gender: 'male',
          city: 'barcelona',
          currentSituation: 'vocational_training',
          educationLevel: 'technical',
          academicPerformance: 'average',
          careerInterest: 'construction',
          aspiration: 'technical',
          familySituation: 'working_family',
          economicSupport: 'partial_support',
          monthlyIncome: 800,
          savings: 200,
          debts: 500,
          availableTime: 'part_time',
          technicalSkills: ['mechanics', 'electricity'],
          workExperience: ['summer_job'],
        };
        break;

      case 'entrepreneur':
        character = {
          fullName: 'Sofía Chen Wang',
          birthDate: this.getDateYearsAgo(17),
          gender: 'female',
          city: { label: 'Álava', value: 'alava', avgRoomRent: 450 },
          currentSituation: 'high_school',
          educationLevel: 'highschool',
          academicPerformance: 'excellent',
          careerInterest: 'business',
          aspiration: 'entrepreneurship',
          familySituation: 'entrepreneur_family',
          economicSupport: 'full_support',
          monthlyIncome: 300,
          savings: 2000,
          debts: 0,
          availableTime: 'full_time',
          strengths: ['leadership', 'problem_solving'],
          incomeSources: ['family'],
        };
        break;

      case 'unsure':
        character = {
          fullName: 'Alex Torres Ruiz',
          birthDate: this.getDateYearsAgo(16),
          gender: 'nonbinary',
          city: { label: 'Álava', value: 'alava', avgRoomRent: 450 },
          currentSituation: 'high_school',
          educationLevel: 'basic',
          academicPerformance: 'average',
          careerInterest: 'social',
          aspiration: 'unsure',
          familySituation: 'stable_family',
          economicSupport: 'partial_support',
          monthlyIncome: 0,
          savings: 100,
          debts: 0,
          availableTime: 'full_time',
          challenges: ['indecision', 'motivation'],
        };
        break;
    }

    if (Object.keys(character).length > 0) {
      this.formDynamicComponent.setFormValues(character);
      this.updateCharacterPreview(character);
    }
  }

  // Manejar envío del formulario
  onFormSubmit(data: any): void {
    this.isLoading = true;
    data.uid = this.userService.user!.id;
    data.age = 16; // Edad fija para este formulario
    // 👇 campos que en el backend son List<String>
    const arrayFields = [
      'familyExpectations',
      'educationGaps',
      'learningResources',
      'technicalSkills',
      'strengths',
      'incomeSources',
      'challenges',
      'supportSystem',
      'longTermGoals',
      'shortTermGoals',
    ];

    arrayFields.forEach((field) => {
      if (data[field] === '' || data[field] == null) {
        data[field] = [];
      }
    });
    data.educationLevel === 'basic'
      ? (data.academicXp = 10)
      : (data.academicXp = 0);
    data.technicalSkills ? (data.workXp = 10) : (data.workXp = 0);
    data.academicLevel = 'LEVEL_1';
    data.workLevel = 'LEVEL_1';
    this.baseService.postItem(endpoint, data).subscribe({
      next: (resp) => {
        if (resp) {
          this.router.navigate(['/index']);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  // Métodos helper para obtener labels
  private getNationalityLabel(value: string): string {
    const nationalities: { [key: string]: string } = {
      es: 'Español 🇪🇸',
      us: 'Estadounidense 🇺🇸',
      gb: 'Británico 🇬🇧',
    };
    return nationalities[value] || value;
  }

  getBackgroundLabel(value: string): string {
    const backgrounds: { [key: string]: string } = {
      graduate: 'Recién Graduado Universitario 🎓',
      professional: 'Profesional con Experiencia 💼',
    };
    return backgrounds[value] || value;
  }

  getCityLabel(value: string): string {
    const cities: { [key: string]: string } = {
      madrid: 'Madrid 🏙️',
      barcelona: 'Barcelona 🌉',
    };
    return cities[value] || value;
  }

  getCareerLabel(value: string): string {
    const careers: { [key: string]: string } = {
      software: 'Desarrollo de Software 💻',
      data: 'Análisis de Datos 📊',
    };
    return careers[value] || value;
  }

  getDifficultyLabel(value: string): string {
    const difficulties: { [key: string]: string } = {
      easy: 'Principiante 😊',
      normal: 'Normal 😐',
    };
    return difficulties[value] || value;
  }

  // Manejar clics en botones de acción
  onActionClick(action: string): void {
    switch (action) {
      case 'random':
        this.generateRandomCharacter();
        break;
      case 'clear':
        this.clearForm();
        break;
      case 'preview':
        this.showCurrentPreview();
        break;
      case 'saveTemplate':
        this.saveAsTemplate();
        break;
    }
  }

  // Generar personaje aleatorio
  generateRandomCharacter(): void {
    const firstNames = [
      'Carlos',
      'Ana',
      'Juan',
      'Sofía',
      'Alex',
      'María',
      'David',
      'Laura',
    ];
    const lastNames = [
      'Rodríguez',
      'Martínez',
      'García',
      'López',
      'Fernández',
      'González',
      'Pérez',
      'Sánchez',
    ];

    const randomCharacter = {
      fullName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      birthDate: this.getRandomDate(2005, 2007),
      gender: ['male', 'female', 'nonbinary'][Math.floor(Math.random() * 3)],
      city: PROVINCIAS_ESPAÑA[Math.floor(Math.random() * 4)],
      currentSituation: ['high_school', 'vocational_training', 'not_studying'][
        Math.floor(Math.random() * 3)
      ],
      educationLevel: ['none', 'basic', 'highschool', 'technical'][
        Math.floor(Math.random() * 4)
      ],
      academicPerformance: ['low', 'average', 'high', 'excellent'][
        Math.floor(Math.random() * 4)
      ],
      careerInterest: ['technology', 'health', 'business', 'creative'][
        Math.floor(Math.random() * 4)
      ],
      aspiration: ['university', 'fp_superior', 'entrepreneurship', 'unsure'][
        Math.floor(Math.random() * 4)
      ],
      familySituation: [
        'stable_family',
        'working_family',
        'entrepreneur_family',
      ][Math.floor(Math.random() * 3)],
      economicSupport: ['full_support', 'partial_support', 'minimal_support'][
        Math.floor(Math.random() * 3)
      ],
      monthlyIncome: Math.floor(Math.random() * 1000),
      savings: Math.floor(Math.random() * 2000),
      debts: Math.floor(Math.random() * 1000),
      gameDifficulty: ['simulation', 'realistic', 'challenging'][
        Math.floor(Math.random() * 3)
      ],
      gameFocus: ['strategic', 'narrative', 'professional'][
        Math.floor(Math.random() * 3)
      ],
      terms: true,
    };

    this.formDynamicComponent.setFormValues(randomCharacter);
    this.updateCharacterPreview(randomCharacter);
    alert('¡Personaje aleatorio generado!');
  }

  private getRandomDate(startYear: number, endYear: number): string {
    const year =
      Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  // Limpiar formulario
  clearForm(): void {
    if (this.formDynamicComponent) {
      this.formDynamicComponent.resetForm();
    }
  }

  // Mostrar vista previa actual
  showCurrentPreview(): void {
    if (this.formDynamicComponent) {
      const data = this.formDynamicComponent.getForm().value;
      this.updateCharacterPreview(data);
    }
  }

  // Guardar como plantilla
  saveAsTemplate(): void {
    if (this.formDynamicComponent) {
      const data = this.formDynamicComponent.getForm().value;
      const templateName = prompt(
        'Nombre para la plantilla:',
        `Plantilla ${new Date().toLocaleDateString()}`,
      );

      if (templateName) {
        console.log('Guardando plantilla:', templateName, data);
        alert(`Plantilla "${templateName}" guardada exitosamente`);
      }
    }
  }

  onFormChange(data: any): void {
    this.updateCharacterPreview(data);
  }

  // MÉTODOS NUEVOS PARA SECCIONES EDUCATIVAS Y ECONÓMICAS

  // Métodos para la sección educativa
  getEducationLevelLabel(level: string): string {
    const levels: { [key: string]: string } = {
      none: 'Sin estudios formales',
      basic: 'Educación básica',
      highschool: 'Bachillerato/Preparatoria',
      technical: 'Técnico/FP',
      university: 'Universitario',
    };
    return levels[level] || 'No especificado';
  }

  getEducationFieldLabel(field: string): string {
    const fields: { [key: string]: string } = {
      stem: 'STEM (Ciencias/Tecnología)',
      humanities: 'Humanidades',
      social: 'Ciencias Sociales',
      arts: 'Artes',
      business: 'Negocios',
      health: 'Salud',
      technical_field: 'Técnico/Industrial',
    };
    return fields[field] || field;
  }

  getAcademicPerformanceLabel(performance: string): string {
    const performances: { [key: string]: string } = {
      low: 'Bajo',
      average: 'Promedio',
      high: 'Alto',
      excellent: 'Excelente',
    };
    return performances[performance] || 'No evaluado';
  }

  getEducationGapLabel(gap: string): string {
    const gaps: { [key: string]: string } = {
      math: 'Matemáticas',
      language: 'Lenguaje',
      english: 'Inglés',
      digital: 'Competencias digitales',
      science: 'Ciencias básicas',
    };
    return gaps[gap] || gap;
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

    potential += levelScore[this.characterPreview.educationLevel] || 0;

    if (
      this.characterPreview.academicPerformance === 'high' ||
      this.characterPreview.academicPerformance === 'excellent'
    ) {
      potential += 1;
    }

    return Math.max(1, Math.min(potential, 3));
  }

  // Métodos para la sección económica
  formatCurrency(amount: number): string {
    if (amount === undefined || amount === null) amount = 0;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  formatCurrencyEconomy(familySituation: string): string {
    let amount = 0;
    switch (familySituation) {
      case 'stable_family':
        amount = 400;
        break;
      case 'working_family':
        amount = 1000;
        break;
      case 'difficult_situation':
        amount = 0;
        break;
      default:
        amount = 0;
        break;
    }
    if (amount === undefined || amount === null) amount = 0;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  calculateIncomeLevel(): string {
    switch (this.characterPreview.familySituation) {
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

  getIncomeLevelLabel(level: string): string {
    const levels: { [key: string]: string } = {
      low: 'Bajos ingresos',
      medium: 'Ingresos medios',
      high: 'Buenos ingresos',
    };
    return levels[level] || 'No especificado';
  }

  getIncomeSourceLabel(source: string): string {
    const sources: { [key: string]: string } = {
      salary: 'Salario fijo',
      freelance: 'Trabajo freelance',
      business: 'Negocio propio',
      scholarship_income: 'Beca',
      family: 'Apoyo familiar',
      part_time_job: 'Tiempo parcial',
    };
    return sources[source] || source;
  }

  getMonthlyExpensesSummary(): { category: string; amount: number }[] {
    const expenses = [];
    if (this.characterPreview.residentialCity === 'no') {
      expenses.push({
        category: 'Vivienda',
        amount: this.characterPreview.city.avgRoomRent || 0,
      });
    } else {
      expenses.push({ category: 'Vivienda', amount: 0 });
    }
    expenses.push({
      category: 'Alimentación',
      amount: this.characterPreview.expenses.food || 200,
    });
    expenses.push({
      category: 'Transporte',
      amount: this.characterPreview.expenses.transport || 50,
    });

    if (this.characterPreview.expenses.education > 0) {
      expenses.push({
        category: 'Educación',
        amount: this.characterPreview.expenses.education,
      });
    }

    if (this.characterPreview.expenses.other > 0) {
      expenses.push({
        category: 'Otros',
        amount: this.characterPreview.expenses.other,
      });
    }

    return expenses;
  }

  calculateMonthlyBalance(): number {
    let income = 0;
    switch (this.characterPreview.familySituation) {
      case 'stable_family':
        income = 400;
        break;
      case 'working_family':
        income = 1000;
        break;
      case 'difficult_situation':
        income = 0;
        break;
      default:
        income = 0;
        break;
    }
    const totalExpenses = this.getMonthlyExpensesSummary().reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    return income - totalExpenses;
  }

  getBalanceStatusLabel(balance: number): string {
    if (balance < 0) return 'Déficit mensual';
    if (balance < 100) return 'Ajustado justo';
    if (balance < 500) return 'Con capacidad de ahorro';
    return 'Buen margen financiero';
  }

  getSavingsLevelLabel(savings: number): string {
    if (!savings || savings === 0) return 'Sin ahorros';
    if (savings < 500) return 'Ahorros básicos';
    if (savings < 2000) return 'Colchón moderado';
    return 'Buena reserva financiera';
  }

  getDebtLevelLabel(debt: number): string {
    if (!debt || debt === 0) return 'Sin deudas';
    if (debt < 1000) return 'Deuda manejable';
    if (debt < 5000) return 'Deuda significativa';
    return 'Deuda elevada';
  }

  calculateEducationInvestmentCapacity(): string {
    const balance = this.calculateMonthlyBalance();
    const savings = this.characterPreview.savings || 0;

    if (balance < 0 || savings < 100) return 'none';
    if (balance < 100 && savings < 500) return 'low';
    if (balance < 300 && savings < 1000) return 'medium';
    return 'high';
  }

  getInvestmentCapacityLabel(capacity: string): string {
    const capacities: { [key: string]: string } = {
      none: 'Muy limitada',
      low: 'Limitada',
      medium: 'Moderada',
      high: 'Buena',
    };
    return capacities[capacity] || 'No evaluada';
  }

  calculateEducationCareerCompatibility(): number {
    let score = 5;

    if (
      this.characterPreview.educationLevel === 'technical' &&
      (this.characterPreview.careerInterest === 'technology' ||
        this.characterPreview.careerInterest === 'construction')
    ) {
      score += 3;
    }

    if (
      this.characterPreview.academicPerformance === 'high' ||
      this.characterPreview.academicPerformance === 'excellent'
    ) {
      if (this.characterPreview.aspiration === 'university') {
        score += 2;
      }
    }

    if (
      this.characterPreview.educationGaps &&
      this.characterPreview.educationGaps.length > 2
    ) {
      score -= 2;
    }

    return Math.max(1, Math.min(score, 10));
  }

  calculateFinancialCapacity(): number {
    let capacity = 1;

    const incomeLevel = this.calculateIncomeLevel();
    if (incomeLevel === 'medium') capacity += 1;
    if (incomeLevel === 'high') capacity += 2;

    if ((this.characterPreview.savings || 0) > 1000) capacity += 1;
    if (this.calculateMonthlyBalance() > 200) capacity += 1;

    return Math.max(1, Math.min(capacity, 3));
  }

  // Métodos existentes para obtener labels
  getAvatarByAgeAndSituation(age: number, situation: string): string {
    const avatars: { [key: string]: string } = {
      high_school: '👨‍🎓',
      vocational_training: '🔧',
      not_studying: '🏠',
    };
    return avatars[situation] || (age < 18 ? '👦' : '👤');
  }

  getSituationLabel(situation: string): string {
    const labels: { [key: string]: string } = {
      high_school: 'Estudiante de Secundaria',
      vocational_training: 'Estudiante de FP',
      not_studying: 'Sin estudios actuales',
    };
    return labels[situation] || 'Nueva situación';
  }

  getCurrentSituationLabel(situation: string): string {
    const labels: { [key: string]: string } = {
      high_school: '🎓 ESO/Bachillerato',
      vocational_training: '🔧 FP Básica/Media',
      not_studying: '🏠 Sin estudios',
    };
    return labels[situation] || situation;
  }

  getCityName(city: string): string {
    const cities: { [key: string]: string } = {
      madrid: 'Madrid',
      barcelona: 'Barcelona',
      valencia: 'Valencia',
      sevilla: 'Sevilla',
      bilbao: 'Bilbao',
      malaga: 'Málaga',
      zaragoza: 'Zaragoza',
      murcia: 'Murcia',
      palma: 'Palma',
      granada: 'Granada',
    };
    return cities[city] || city;
  }

  getCareerInterestLabel(interest: string): string {
    const interests: { [key: string]: string } = {
      technology: '💻 Tecnología',
      health: '🏥 Salud',
      construction: '🏗️ Construcción',
      business: '📊 Negocios',
      creative: '🎨 Creativo',
      social: '⚖️ Social',
      science: '🔬 Ciencia',
      hospitality: '🍽️ Hostelería',
    };
    return interests[interest] || interest;
  }

  getAspirationLabel(aspiration: string): string {
    const aspirations: { [key: string]: string } = {
      university: '👨‍🎓 Universidad',
      fp_superior: '🔧 FP Superior',
      entrepreneurship: '🚀 Emprender',
      technical: '👷‍♀️ Oficio técnico',
      artistic: '🎭 Arte',
      sports: '⚽ Deporte',
      unsure: '🤔 Indeciso',
    };
    return aspirations[aspiration] || aspiration;
  }

  getEconomicSupportLabel(support: string): string {
    const supports: { [key: string]: string } = {
      full_support: 'Completo',
      partial_support: 'Parcial',
      minimal_support: 'Mínimo',
      no_support: 'Ninguno',
    };
    return supports[support] || support;
  }

  getAvailableTimeLabel(time: string): string {
    const times: { [key: string]: string } = {
      full_time: 'Tiempo completo',
      part_time: 'Medio tiempo',
      weekends: 'Fines de semana',
      limited: 'Muy limitado',
    };
    return times[time] || time;
  }

  getResourceLabel(resource: string): string {
    const resources: { [key: string]: string } = {
      internet: '🌐',
      computer: '💻',
      library: '📚',
      free_courses: '🎓',
      mentor: '👨‍🏫',
      scholarship: '💰',
    };
    return resources[resource] || resource;
  }

  getStrengthLabel(strength: string): string {
    const strengths: { [key: string]: string } = {
      math_logic: 'Matemáticas',
      verbal_communication: 'Comunicación',
      creativity: 'Creatividad',
      teamwork: 'Equipo',
      responsibility: 'Responsabilidad',
      adaptability: 'Adaptabilidad',
      leadership: 'Liderazgo',
      problem_solving: 'Problemas',
    };
    return strengths[strength] || strength;
  }

  getTechnicalSkillLabel(skill: string): string {
    const skills: { [key: string]: string } = {
      basic_computer: 'Informática',
      office: 'Ofimática',
      basic_programming: 'Programación',
      graphic_design: 'Diseño',
      mechanics: 'Mecánica',
      electricity: 'Electricidad',
      cooking: 'Cocina',
      languages: 'Idiomas',
    };
    return skills[skill] || skill;
  }

  getFamilySituationLabel(situation: string): string {
    const situations: { [key: string]: string } = {
      stable_family: 'Estable',
      working_family: 'Trabajadora',
      entrepreneur_family: 'Emprendedora',
      academic_family: 'Académica',
      difficult_situation: 'Complicada',
    };
    return situations[situation] || situation;
  }

  getFamilyExpectationLabel(expectation: string): string {
    const expectations: { [key: string]: string } = {
      expect_university: 'Estudiar',
      expect_trade: 'Oficio',
      expect_family_business: 'Negocio',
      expect_work: 'Trabajar',
      expect_independence: 'Independencia',
    };
    return expectations[expectation] || expectation;
  }

  getChallengeLabel(challenge: string): string {
    const challenges: { [key: string]: string } = {
      financial: 'Dificultades económicas',
      family_issues: 'Problemas familiares',
      academic: 'Dificultades académicas',
      health_issues: 'Problemas de salud',
      motivation: 'Falta de motivación',
      indecision: 'Dificultad para decidir',
      social_pressure: 'Presión social',
      distance: 'Distancia a centros',
    };
    return challenges[challenge] || challenge;
  }

  getSupportLabel(support: string): string {
    const supports: { [key: string]: string } = {
      family_support: 'Familia',
      friends_support: 'Amigos',
      teachers_support: 'Profesores',
      counselor_support: 'Orientador',
      community_support: 'Comunidad',
      support_groups: 'Grupos',
    };
    return supports[support] || support;
  }

  getGameDifficultyLabel(difficulty: string): string {
    const difficulties: { [key: string]: string } = {
      simulation: 'Simulación',
      realistic: 'Realista',
      challenging: 'Desafiante',
      survival: 'Supervivencia',
    };
    return difficulties[difficulty] || difficulty;
  }

  getGameFocusLabel(focus: string): string {
    const focuses: { [key: string]: string } = {
      narrative: 'Narrativo',
      strategic: 'Estratégico',
      social: 'Social',
      professional: 'Profesional',
    };
    return focuses[focus] || focus;
  }

  getPotentialScore(): number {
    let score = 3;

    // Bonificaciones por recursos
    if (this.characterPreview.economicSupport === 'full_support') score++;
    if (this.characterPreview.availableTime === 'full_time') score++;
    if (
      this.characterPreview.learningResources &&
      this.characterPreview.learningResources.length >= 3
    )
      score++;

    // Bonificaciones por habilidades
    if (
      this.characterPreview.strengths &&
      this.characterPreview.strengths.length >= 2
    )
      score++;
    if (
      this.characterPreview.technicalSkills &&
      this.characterPreview.technicalSkills.length >= 2
    )
      score++;

    // Nuevas bonificaciones por educación
    if (
      this.characterPreview.educationLevel === 'technical' ||
      this.characterPreview.educationLevel === 'university'
    )
      score++;
    if (
      this.characterPreview.academicPerformance === 'high' ||
      this.characterPreview.academicPerformance === 'excellent'
    )
      score++;

    // Nueva bonificación por situación económica
    if (this.calculateIncomeLevel() === 'high') score++;
    if ((this.characterPreview.savings || 0) > 1000) score++;

    // Penalizaciones por desafíos
    if (
      this.characterPreview.challenges &&
      this.characterPreview.challenges.length >= 2
    )
      score--;
    if (this.characterPreview.familySituation === 'difficult_situation')
      score--;

    // Nueva penalización por brechas educativas
    if (
      this.characterPreview.educationGaps &&
      this.characterPreview.educationGaps.length >= 3
    )
      score--;
    if ((this.characterPreview.debts || 0) > 2000) score--;

    return Math.max(1, Math.min(5, score));
  }

  // Método para actualizar la vista previa con los datos del formulario
  updateCharacterPreview(data: any): void {
    const age = this.calculateYearsDifference(data.birthDate);

    this.characterPreview = {
      fullName: data.fullName || 'Nuevo Personaje',
      age: age,
      currentSituation: data.currentSituation || 'high_school',
      city: PROVINCIAS_ESPAÑA.find((p) => p.value.toLowerCase()  === data.city.toLowerCase() ) ,
      residentialCity: data.residentialCity || 'si',
      careerInterest: data.careerInterest || 'technology',
      aspiration: data.aspiration || 'university',
      economicSupport: data.economicSupport || 'partial_support',
      availableTime: data.availableTime || 'full_time',
      learningResources: Array.isArray(data.learningResources)
        ? data.learningResources
        : [],
      strengths: Array.isArray(data.strengths) ? data.strengths : [],
      technicalSkills: Array.isArray(data.technicalSkills)
        ? data.technicalSkills
        : [],
      familySituation: data.familySituation || 'stable_family',
      familyExpectations: Array.isArray(data.familyExpectations)
        ? data.familyExpectations
        : [],
      challenges: Array.isArray(data.challenges) ? data.challenges : [],
      supportSystem: Array.isArray(data.supportSystem)
        ? data.supportSystem
        : [],
      // Nuevos campos
      educationLevel: data.educationLevel || 'basic',
      educationField: data.educationField || '',
      educationSpecialization: data.educationSpecialization || '',
      academicPerformance: data.academicPerformance || 'average',
      educationGaps: Array.isArray(data.educationGaps)
        ? data.educationGaps
        : [],
      monthlyIncome: data.monthlyIncome || 0,
      incomeSources: Array.isArray(data.incomeSources)
        ? data.incomeSources
        : [],
      savings: data.savings || 0,
      debts: data.debts || 0,
      expenses: {
        housing: data.housingExpense || 0,
        food: data.foodExpense || 200,
        transport: data.transportExpense || 50,
        education: data.educationExpense || 0,
        other: data.otherExpense || 0,
      },
      gender: 'male',
      longTermGoals: [],
      shortTermGoals: [],
      academicLevel: data.educationLevel || 'basic',
      academicXp: data.academicPerformance || 'average',
      workLevel: 'LEVEL_1',
      workXp: 0,
    };
  }

  // Método para calcular años de diferencia
  calculateYearsDifference(
    date1: Date | string,
    date2: Date | string = new Date(),
  ): number {
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);

    let years = d2.getFullYear() - d1.getFullYear();
    const monthDiff = d2.getMonth() - d1.getMonth();
    const dayDiff = d2.getDate() - d1.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      years--;
    }

    return Math.max(0, years);
  }
}
