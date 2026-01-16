import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../shared/components/layout/header/header.component";
import { FooterComponent } from "../shared/components/layout/footer/footer.component";
import { SidebarComponent } from "../shared/components/layout/sidebar/sidebar.component";
import { RightPanelComponent } from "../shared/components/layout/right-panel/right-panel.component";

@Component({
  selector: 'app-pages',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SidebarComponent, RightPanelComponent],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css'
})
export class PagesComponent {

}
