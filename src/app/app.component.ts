import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from "./shared/components/ui/modal/modal.component";
import { ModalService } from './core/services/modal/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'career-life-manager';
 data: any;
modalOpen = false;




modalData: any = null;
  private modalSub!: Subscription;
  // Datos de sistema
  constructor(

        private modalService: ModalService
  ) {
  }
  ngOnInit(): void {
    this.modalSub = this.modalService.data$.subscribe((data:any) => {
      this.modalData = data;

    });
  }
  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
  }

  closeModal() {
    this.modalService.close();
  }

}

