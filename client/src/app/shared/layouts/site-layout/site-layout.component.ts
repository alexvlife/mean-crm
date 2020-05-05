import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MaterialService } from '../../services/material.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements AfterViewInit {
  @ViewChild('floating') floatingRef: ElementRef;

  links: {[key: string]: string}[] = [
    { url: '/overview', name: 'Обзор'},
    { url: '/analytics', name: 'Аналитика'},
    { url: '/history', name: 'История'},
    { url: '/order', name: 'Добавить заказ'},
    { url: '/categories', name: 'Ассортимент'},
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    MaterialService.initializeFloatingButton(this.floatingRef);
  }

  logout(evt: Event): void {
    evt.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
