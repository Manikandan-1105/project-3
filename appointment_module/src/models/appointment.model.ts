import {Entity, model, property} from '@loopback/repository';

@model({name:"appointment",settings: {strict: false}})
export class Appointment extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  appointment_id?: number;

  @property({
    type: 'number',
    required: true,
  })
  patient_id: number;

  @property({
    type: 'number',
    required: true,
  })
  doctor_id: number;

  @property({
    type: 'date',
    required: true,
  })
  appointment_date: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string; // e.g., "Scheduled", "Completed", "Cancelled"

  @property({
    type: 'string',
    required: false,
  })
  notes?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  created_at?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  updated_at?: string;

  [prop: string]: any;

  constructor(data?: Partial<Appointment>) {
    super(data);
  }
}

export interface AppointmentRelations {}
export type AppointmentWithRelations = Appointment & AppointmentRelations;
