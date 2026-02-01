import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseService } from '../../../../../../core/services/base/base-service.service';
import { UserService } from '../../../../../../core/services/users/users.service';
import { environment } from '../../../../../../../enviroments/environment';
const endpoint = environment.baseUrlSpring;

@Component({
  selector: 'app-subscribe',
  imports: [],
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.css'
})
export class SubscribeComponent implements OnInit {

  @Input() actionSelected: any;
  @Output() closed = new EventEmitter<any>();
  @Output() submit = new EventEmitter<any>();

  formation: any;
  constructor(private baseService: BaseService, private userService: UserService) { }
  ngOnInit(): void {
    this.getFormation();
  }


  getFormation() {
    const url = `${endpoint}formations/${this.actionSelected.id}`;
    return this.baseService.getItems(url).subscribe({
      next: (resp: any) => {
        console.log('Formation data:', resp);
        this.formation = resp;
      },
      error: (err) => {
        console.error('Error fetching formation data:', err);
      }
    });
  }
  onClose() {
    this.closed.emit(true);
  }
  onSUbmit() {
    this.submit.emit();
  }

}
