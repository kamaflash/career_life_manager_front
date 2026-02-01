import { Component, OnInit, HostListener, Input } from '@angular/core';
import { UserService } from '../../../../core/services/users/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Interface para los menús
interface MenuItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  dropdown?: SubMenuItem[];
}

interface SubMenuItem {
  name: string;
  icon: string;
  color: string;
  link?: string;
}

interface MobileMenuItem {
  name: string;
  icon: string;
  color?: string;
}

interface UserMenuItem {
  name: string;
  icon: string;
  color?: string;
  link?: string;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  player: any;
  isMobileMenuOpen = false;
  isSearchOpen = false;
  searchQuery = '';
  screenWidth = 0;
  activeDropdown: string | null = null;
  @Input() systemData: any;

  // Estado de notificaciones
  notifications = [
    { id: 1, title: 'Nuevo curso disponible', read: false, icon: '🎓' },
    { id: 2, title: 'Recordatorio: Revisar CV', read: false, icon: '📄' },
    { id: 3, title: 'Metro financiero alcanzado', read: false, icon: '💰' }
  ];

  unreadNotifications = this.notifications.filter(n => !n.read).length;

  // Constantes con los datos de menú
  readonly MENU_NAVIGATION = {
  mainNav: [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: 'dashboard', // 📊 → dashboard
      color: 'blue',
      dropdown: [
        { name: 'Análisis General', icon: 'analytics', color: 'blue', link: '/dashboard/analytics' }, // 📈 → analytics
        { name: 'Objetivos', icon: 'flag', color: 'blue', link: '/dashboard/goals' }, // 🎯 → target
        { name: 'Reportes', icon: 'assessment', color: 'blue', link: '/dashboard/reports' }, // 📋 → assessment
        { name: 'Métricas', icon: 'bar_chart', color: 'blue', link: '/dashboard/metrics' }, // 📊 → bar_chart
        { name: 'Panel Principal', icon: 'home', color: 'blue', link: '/dashboard/main' } // 🏠 → home
      ]
    },
    {
      id: 'desarrollo',
      name: 'Desarrollo',
      icon: 'rocket_launch', // 🚀 → rocket_launch
      color: 'emerald',
      dropdown: [
        { name: 'Cursos & Certificaciones', icon: 'school', color: 'emerald', link: '/development/courses' }, // 🎓 → school
        { name: 'Habilidades', icon: 'library_books', color: 'emerald', link: '/development/skills' }, // 📚 → library_books
        { name: 'Metas de Aprendizaje', icon: 'school', color: 'emerald', link: '/development/learning-goals' }, // 🎯 → target
        { name: 'Proyectos Personales', icon: 'code', color: 'emerald', link: '/development/projects' }, // 💻 → code
        { name: 'Idiomas', icon: 'language', color: 'emerald', link: '/development/languages' } // 🌐 → language
      ]
    },
    {
      id: 'carrera',
      name: 'Carrera',
      icon: 'work', // 💼 → work
      color: 'amber',
      dropdown: [
        { name: 'Experiencia Laboral', icon: 'business', color: 'amber', link: '/career/experience' }, // 🏢 → business
        { name: 'CV & Portafolio', icon: 'description', color: 'amber', link: '/career/portfolio' }, // 📄 → description
        { name: 'Networking', icon: 'handshake', color: 'amber', link: '/career/networking' }, // 🤝 → handshake (necesita Material Icons Extended)
        { name: 'Plan de Carrera', icon: 'timeline', color: 'amber', link: '/career/plan' }, // 🎯 → timeline
        { name: 'Entrevistas', icon: 'forum', color: 'amber', link: '/career/interviews' }, // 💬 → forum
        { name: 'Recomendaciones', icon: 'star', color: 'amber', link: '/career/recommendations' } // ⭐ → star
      ]
    },
    {
      id: 'finanzas',
      name: 'Finanzas',
      icon: 'attach_money', // 💰 → attach_money
      color: 'green',
      dropdown: [
        { name: 'Presupuesto', icon: 'pie_chart', color: 'green', link: '/finance/budget' }, // 📊 → pie_chart
        { name: 'Ingresos', icon: 'payments', color: 'green', link: '/finance/income' }, // 💵 → payments
        { name: 'Inversiones', icon: 'account_balance', color: 'green', link: '/finance/investments' }, // 🏦 → account_balance
        { name: 'Metas Financieras', icon: 'savings', color: 'green', link: '/finance/goals' }, // 🎯 → savings
        { name: 'Ahorros', icon: 'account_balance_wallet', color: 'green', link: '/finance/savings' }, // 💰 → account_balance_wallet
        { name: 'Deudas', icon: 'credit_card', color: 'green', link: '/finance/debts' } // 💳 → credit_card
      ]
    },
    {
      id: 'salud',
      name: 'Salud',
      icon: 'favorite', // ❤️ → favorite
      color: 'red',
      dropdown: [
        { name: 'Ejercicio', icon: 'fitness_center', color: 'red', link: '/health/exercise' }, // 💪 → fitness_center
        { name: 'Nutrición', icon: 'restaurant', color: 'red', link: '/health/nutrition' }, // 🥗 → restaurant
        { name: 'Descanso', icon: 'hotel', color: 'red', link: '/health/rest' }, // 😴 → hotel (o bed)
        { name: 'Salud Mental', icon: 'psychology', color: 'red', link: '/health/mental' }, // 🧠 → psychology
        { name: 'Chequeos Médicos', icon: 'medical_services', color: 'red', link: '/health/checkups' }, // 🏥 → medical_services
        { name: 'Hábitos', icon: 'checklist', color: 'red', link: '/health/habits' } // 📝 → checklist
      ]
    }
  ] as MenuItem[],

  mobileNav: [
    { name: 'Dashboard', icon: 'dashboard', color: 'blue' }, // 📊 → dashboard
    { name: 'Desarrollo', icon: 'rocket_launch', color: 'emerald' }, // 🚀 → rocket_launch
    { name: 'Carrera', icon: 'work', color: 'amber' }, // 💼 → work
    { name: 'Finanzas', icon: 'attach_money', color: 'green' }, // 💰 → attach_money
    { name: 'Salud', icon: 'favorite', color: 'red' }, // ❤️ → favorite
    { name: 'Configuración', icon: 'settings', color: 'gray' } // ⚙️ → settings
  ] as MobileMenuItem[],

  userMenu: [
    { name: 'Mi Perfil', icon: 'person', link: '/profile' }, // 👤 → person
    { name: 'Configuración', icon: 'settings', link: '/settings' }, // ⚙️ → settings
    { name: 'Privacidad', icon: 'shield', link: '/privacy' }, // 🛡️ → shield
    { name: 'Ayuda & Soporte', icon: 'help', link: '/help' }, // ❓ → help
    { name: 'Cerrar Sesión', icon: 'logout', color: 'red', link: '/logout' } // 🚪 → logout
  ] as UserMenuItem[]
};
  constructor(private userService: UserService) {
    if (this.userService.user?.persons) {
      this.player = this.userService.user?.persons;
    }
    this.updateScreenWidth();
  }

  ngOnInit(): void {

   // this.updateScreenWidth();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateScreenWidth();
    // Cerrar menús en móvil cuando se cambia a desktop
    if (this.screenWidth >= 1024 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  updateScreenWidth() {
    this.screenWidth = window.innerWidth;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.activeDropdown = null;
    }
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
    if (this.isSearchOpen) {
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }, 100);
    }
  }

  toggleDropdown(menuId: string) {
    this.activeDropdown = this.activeDropdown === menuId ? null : menuId;
  }

  closeAllDropdowns() {
    this.activeDropdown = null;
  }

  markAllNotificationsAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.unreadNotifications = 0;
  }

  getCurrentDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return today.toLocaleDateString('es-ES', options);
  }

  // Método para obtener las iniciales del nombre
  getPlayerInitials(): string {
    if (!this.player?.fullName) return 'M';
    const names = this.player.fullName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  isMobile(): boolean {
    return this.screenWidth < 1024;
  }

  isTablet(): boolean {
    return this.screenWidth >= 768 && this.screenWidth < 1024;
  }

  isDesktop(): boolean {
    return this.screenWidth >= 1024;
  }

  // Para manejar mejor el estado
closeSearch() {
  this.isSearchOpen = false;
  this.searchQuery = '';
}

closeMobileMenu() {
  this.isMobileMenuOpen = false;
  this.activeDropdown = null;
}

}
