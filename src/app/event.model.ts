export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
  category: 'work' | 'personal' | 'meeting' | 'reminder' | 'holiday';
  description?: string;
  location?: string;
}