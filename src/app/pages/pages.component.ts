import { UserService } from './../core/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../shared/components/layout/header/header.component';
import { FooterComponent } from '../shared/components/layout/footer/footer.component';
import { SidebarComponent } from '../shared/components/layout/sidebar/sidebar.component';
import { RightPanelComponent } from '../shared/components/layout/right-panel/right-panel.component';
import { environment } from '../../enviroments/environment';
import { BaseService } from '../core/services/base/base-service.service';
import { ModalComponent } from "../shared/components/ui/modal/modal.component";
const endpoint = environment.baseUrlSpring + 'systems';

@Component({
  selector: 'app-pages',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    RightPanelComponent,
    ModalComponent
],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css',
})
export class PagesComponent implements OnInit {
  data: any;

  // Datos de sistema
  constructor(
    private userService: UserService,
    private baseService: BaseService,
  ) {
    this.data = {
      systemName: 'Mi Aplicación',
      version: '1.0.0',
      apiEndpoint: endpoint,
    };
  }
  ngOnInit(): void {
    this.getDataSystem();
  }
  getDataSystem() {
    const url = endpoint + '/uid/' + this.userService.user?.id;
    this.baseService.getItems(url).subscribe({
      next: (resp: any) => {
        this.data = { ...resp };
      },
      error: (err) => {
        console.error('Error fetching system data:', err);
      },
    });
  }

  avanceData(event: any) {
    console.log('Avanzar Mes', event);
    this.data = event;
    const date = new Date(event.actualityAt);
    date.setDate(date.getDate() + 1);
    this.data.actualityAt = date;
    const url = endpoint + '/' + this.data?.id;
    this.baseService.putItem(url, this.data).subscribe({
      next: (resp: any) => {
        console.log('Sistema actualizado:', resp);
      },
      error: (err) => {
        console.error('Error updating system data:', err);
      },
    });
  }

}
