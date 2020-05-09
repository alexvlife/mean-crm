import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  isNew: boolean = true;

  private _routeParamsSubscription: Subscription;

  constructor(private route: ActivatedRoute) { }

  get title(): string {
    const actionText: string = this.isNew ? 'Добавить' : 'Редактировать';
    return `${actionText} категорию`;
  }

  ngOnInit(): void {
    this.subscribeToRouteParams();
  }

  ngOnDestroy(): void {
    this.clearSubscription();
  }

  private subscribeToRouteParams(): void {
    this._routeParamsSubscription = this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        // editing form
        this.isNew = false;
      }
    });
  }

  private clearSubscription(): void {
    if (this._routeParamsSubscription) {
      this._routeParamsSubscription.unsubscribe();
    }
  }
}
