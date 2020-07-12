import { ElementRef, Injectable } from '@angular/core';

declare var M;

export interface IMaterialInstance {
  open?(): void;
  close?(): void;
  destroy?(): void;
}

export interface IMaterialDatepicker extends IMaterialInstance {
  date?: Date;
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

  static initTooltip(ref: ElementRef): IMaterialInstance {
    return M.Tooltip.init(ref.nativeElement);
  }

  static initDatepicker(ref: ElementRef, onClose: () => void): IMaterialDatepicker {
    return M.Datepicker.init(ref.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose,
    });
  }

  static initTapTarget(ref: ElementRef): IMaterialInstance {
    return M.TapTarget.init(ref.nativeElement);
  }
}
