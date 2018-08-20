import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarEvent } from './event.model';

@Component({
  selector: 'app-event-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)" *ngIf="isOpen">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEditing ? 'Edit Event' : 'Create Event' }}</h2>
          <button class="close-btn" (click)="closeModal()">&times;</button>
        </div>
        
        <form (ngSubmit)="onSubmit()" #eventForm="ngForm">
          <div class="form-group">
            <label class="form-label" for="title">Event Title</label>
            <input
              type="text"
              id="title"
              name="title"
              class="form-input"
              [(ngModel)]="formEvent.title"
              required
              placeholder="Enter event title"
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="start">Start Date</label>
              <input
                type="datetime-local"
                id="start"
                name="start"
                class="form-input"
                [(ngModel)]="startDateString"
                required
              />
            </div>
            
            <div class="form-group">
              <label class="form-label" for="end">End Date</label>
              <input
                type="datetime-local"
                id="end"
                name="end"
                class="form-input"
                [(ngModel)]="endDateString"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="category">Category</label>
            <select
              id="category"
              name="category"
              class="form-select"
              [(ngModel)]="formEvent.category"
              required
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="meeting">Meeting</option>
              <option value="reminder">Reminder</option>
              <option value="holiday">Holiday</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              class="form-input"
              [(ngModel)]="formEvent.location"
              placeholder="Enter location (optional)"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="description">Description</label>
            <textarea
              id="description"
              name="description"
              class="form-textarea"
              [(ngModel)]="formEvent.description"
              placeholder="Enter description (optional)"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <input
                type="checkbox"
                [(ngModel)]="formEvent.allDay"
                name="allDay"
                style="margin-right: 8px;"
              />
              All Day Event
            </label>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn" (click)="closeModal()">
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              (click)="deleteEvent()"
              *ngIf="isEditing"
            >
              Delete
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="!eventForm.valid">
              {{ isEditing ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EventModalComponent {
  @Input() isOpen = false;
  @Input() isEditing = false;
  @Input() event: CalendarEvent | null = null;
  
  @Output() save = new EventEmitter<CalendarEvent>();
  @Output() delete = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  formEvent: Partial<CalendarEvent> = {
    title: '',
    category: 'work',
    description: '',
    location: '',
    allDay: false
  };

  startDateString = '';
  endDateString = '';

  ngOnChanges() {
    if (this.isOpen) {
      if (this.event && this.isEditing) {
        this.formEvent = { ...this.event };
        this.startDateString = this.formatDateForInput(this.event.start);
        this.endDateString = this.event.end ? this.formatDateForInput(this.event.end) : '';
      } else {
        this.resetForm();
      }
    }
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private resetForm() {
    this.formEvent = {
      title: '',
      category: 'work',
      description: '',
      location: '',
      allDay: false
    };
    const now = new Date();
    this.startDateString = this.formatDateForInput(now);
    this.endDateString = this.formatDateForInput(new Date(now.getTime() + 60 * 60 * 1000));
  }

  onSubmit() {
    if (!this.formEvent.title || !this.startDateString) return;

    const eventToSave: CalendarEvent = {
      id: this.isEditing && this.event ? this.event.id : this.generateId(),
      title: this.formEvent.title,
      start: new Date(this.startDateString),
      end: this.endDateString ? new Date(this.endDateString) : undefined,
      category: this.formEvent.category as any,
      description: this.formEvent.description,
      location: this.formEvent.location,
      allDay: this.formEvent.allDay
    };

    this.save.emit(eventToSave);
    this.closeModal();
  }

  deleteEvent() {
    if (this.event?.id) {
      this.delete.emit(this.event.id);
      this.closeModal();
    }
  }

  closeModal() {
    this.close.emit();
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}