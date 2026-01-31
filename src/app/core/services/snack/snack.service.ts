import { Injectable, ComponentRef, ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { SnackComponent, SnackType } from '../../../shared/components/ui/snack/snack.component';

@Injectable({
  providedIn: 'root'
})
export class SnackService {
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private resolver: ComponentFactoryResolver
  ) {}

  show(message: string, type: SnackType = 'info') {
    const factory = this.resolver.resolveComponentFactory(SnackComponent);
    const componentRef: ComponentRef<SnackComponent> = factory.create(this.injector);
    componentRef.instance.message = message;
    componentRef.instance.type = type;

    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild((componentRef.hostView as any).rootNodes[0]);

    setTimeout(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }, 3500);
  }

  success(msg: string) { this.show(msg, 'success'); }
  error(msg: string) { this.show(msg, 'error'); }
  warning(msg: string) { this.show(msg, 'warning'); }
  info(msg: string) { this.show(msg, 'info'); }
}
