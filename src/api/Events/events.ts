import { ApiRequest } from '../api';
import { CreateEventDto, Event, UpdateEventDto } from './types';

export class EventsService {
  constructor(private api: ApiRequest) {}

  public async list(): Promise<Event[]> {
    return this.api.get<Event[]>('events');
  }

  public async getById(id: string): Promise<Event> {
    return this.api.get<Event>(`events/${id}`);
  }

  public async create(payload: CreateEventDto): Promise<Event> {
    return this.api.post<Event>('events', payload);
  }

  public async update(id: string, payload: UpdateEventDto): Promise<Event> {
    return this.api.patch<Event>(`events/${id}`, payload);
  }

  public async delete(id: string): Promise<void> {
    return this.api.delete<void>(`events/${id}`);
  }
}
