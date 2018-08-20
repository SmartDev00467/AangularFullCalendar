import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventApi, EventClickArg, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarEvent } from './event.model';
import { EventModalComponent } from './event-modal.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, EventModalComponent],
  template: `
    <div class="calendar-container">
      <div class="calendar-header">
        <h1 class="calendar-title">Full Calendar</h1>
        <div class="calendar-controls">
          <button class="btn btn-primary" (click)="openCreateModal()">
            + Add Event
          </button>
          <button class="btn btn-secondary" (click)="goToToday()">
            Today
          </button>
        </div>
      </div>
      
      <div class="calendar-wrapper">
        <full-calendar [options]="calendarOptions"></full-calendar>
      </div>
    </div>

    <app-event-modal
      [isOpen]="isModalOpen"
      [isEditing]="isEditing"
      [event]="selectedEvent"
      (save)="onEventSave($event)"
      (delete)="onEventDelete($event)"
      (close)="closeModal()"
    ></app-event-modal>
  `
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: any;

  isModalOpen = false;
  isEditing = false;
  selectedEvent: CalendarEvent | null = null;

  events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Team Meeting',
      start: new Date(2025, 0, 15, 10, 0),
      end: new Date(2025, 0, 15, 11, 0),
      category: 'meeting',
      description: 'Weekly team sync-up meeting',
      location: 'Conference Room A'
    },
    {
      id: '2',
      title: 'Project Deadline',
      start: new Date(2025, 0, 20),
      allDay: true,
      category: 'work',
      description: 'Final submission for Q1 project'
    },
    {
      id: '3',
      title: 'Lunch with Client',
      start: new Date(2025, 0, 18, 12, 30),
      end: new Date(2025, 0, 18, 14, 0),
      category: 'work',
      location: 'Downtown Restaurant'
    },
    {
      id: '4',
      title: 'Doctor Appointment',
      start: new Date(2025, 0, 22, 15, 0),
      end: new Date(2025, 0, 22, 16, 0),
      category: 'personal',
      description: 'Annual checkup'
    },
    {
      id: '5',
      title: 'Birthday Party',
      start: new Date(2025, 0, 25, 18, 0),
      end: new Date(2025, 0, 25, 22, 0),
      category: 'personal',
      location: 'Home'
    },
    {
      id: '6',
      title: 'Pay Bills Reminder',
      start: new Date(2025, 0, 28),
      allDay: true,
      category: 'reminder',
      description: 'Monthly bill payments due'
    }
  ];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
    events: []
  };

  currentEvents: EventApi[] = [];

  ngOnInit() {
    this.updateCalendarEvents();
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.selectedEvent = {
      id: '',
      title: '',
      start: selectInfo.start,
      end: selectInfo.end,
      category: 'work'
    };
    this.isEditing = false;
    this.isModalOpen = true;
  }

  handleEventClick(clickInfo: EventClickArg) {
    const eventId = clickInfo.event.id;
    const event = this.events.find(e => e.id === eventId);
    
    if (event) {
      this.selectedEvent = event;
      this.isEditing = true;
      this.isModalOpen = true;
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  handleEventDrop(info: any) {
    const eventId = info.event.id;
    const event = this.events.find(e => e.id === eventId);
    
    if (event) {
      event.start = info.event.start;
      event.end = info.event.end;
      this.updateCalendarEvents();
    }
  }

  handleEventResize(info: any) {
    const eventId = info.event.id;
    const event = this.events.find(e => e.id === eventId);
    
    if (event) {
      event.start = info.event.start;
      event.end = info.event.end;
      this.updateCalendarEvents();
    }
  }

  openCreateModal() {
    this.selectedEvent = null;
    this.isEditing = false;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedEvent = null;
  }

  onEventSave(event: CalendarEvent) {
    if (this.isEditing) {
      const index = this.events.findIndex(e => e.id === event.id);
      if (index !== -1) {
        this.events[index] = event;
      }
    } else {
      this.events.push(event);
    }
    this.updateCalendarEvents();
  }

  onEventDelete(eventId: string) {
    this.events = this.events.filter(e => e.id !== eventId);
    this.updateCalendarEvents();
  }

  goToToday() {
    if (this.calendarComponent) {
      this.calendarComponent.getApi().today();
    }
  }

  private updateCalendarEvents() {
    const calendarEvents = this.events.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      className: `event-${event.category}`,
      extendedProps: {
        category: event.category,
        description: event.description,
        location: event.location
      }
    }));

    this.calendarOptions = {
      ...this.calendarOptions,
      events: calendarEvents
    };
  }
}