import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CalendarComponent } from './app/calendar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalendarComponent],
  template: `
    <div style="min-height: 100vh; background: #f8fafc; padding: 24px 0;">
      <app-calendar></app-calendar>
    </div>
  `,
})
export class App {
  name = 'Angular Full Calendar';
}

bootstrapApplication(App);