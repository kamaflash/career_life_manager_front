import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private _data$ = new BehaviorSubject<any>(null);

  data$ = this._data$.asObservable();

  open(data: any = true) {
    this._data$.next(data);
  }

  close() {
    this._data$.next(null);
  }
}
