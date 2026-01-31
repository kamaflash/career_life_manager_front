import { Component, Input } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

export type SnackType = 'success' | 'error' | 'info' | 'warning';

@Component({
  selector: 'app-snack',
  imports:[CommonModule],
  template: `
    <div
      *ngIf="visible"
      [@fadeInOut]
      [ngClass]="getClasses(type)"
      class="fixed top-5 right-5 z-50 px-4 py-3 rounded shadow-lg text-white flex items-center gap-2 max-w-xs "
    >
      <span>{{ message }}</span>
      <button (click)="close()" class="ml-auto text-white font-bold">×</button>
    </div>
  `,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class SnackComponent {
  @Input() message = '';
  @Input() type: SnackType = 'info';
  visible = true;

  ngOnInit() {
    setTimeout(() => this.close(), 3000);
  }

  close() {
    this.visible = false;
  }

  getClasses(type: SnackType) {
    switch (type) {
      case 'success': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      case 'warning': return 'bg-yellow-500 text-black';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  }
}
