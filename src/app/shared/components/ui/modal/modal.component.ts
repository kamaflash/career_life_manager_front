import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  get sizeClasses() {
    switch (this.size) {
      case 'sm': return 'max-w-sm';
      case 'lg': return 'max-w-3xl';
      case 'xl': return 'max-w-5xl';
      default: return 'max-w-xl';
    }
  }
}
