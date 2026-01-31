import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SpanishDatePipe } from '../../../pipes/spanish-date-pipe';

@Component({
  selector: 'app-footer',
  imports: [SpanishDatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnChanges {
    private _systemData: any;
  @Input()
  set systemData(value: any) {
    this._systemData = value;
    console.log('systemData changed:', value);
  }

  get systemData() {
    return this._systemData;
  }
  @Output() systemDataEmmiter = new EventEmitter<any>();

  avance() {
    this.systemDataEmmiter.emit(this._systemData);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
