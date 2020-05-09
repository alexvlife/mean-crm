import { ElementRef, Injectable } from '@angular/core';

declare var M;

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
}
