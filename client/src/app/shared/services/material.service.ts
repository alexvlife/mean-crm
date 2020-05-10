import { ElementRef, Injectable } from '@angular/core';

declare var M;

export interface IMaterialInstance {
  open?(): void;
  close?(): void;
  destroy?(): void;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  static toast(message: string) {
    M.toast({ html: message });
  }

  static initializeFloatingButton(ref: ElementRef): void {
    M.FloatingActionButton.init(ref.nativeElement);
  }

  static updateTextInputs(): void {
    M.updateTextFields();
  }

  static initModal(ref: ElementRef): IMaterialInstance {
    return M.Modal.init(ref.nativeElement);
  }
}
