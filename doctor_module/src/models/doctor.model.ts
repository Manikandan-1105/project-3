
import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {postgresql: {tableName: 'doctor'},
  strict: true,
  },
})
export class Doctor extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    postgresql: {columnName: 'doctor_id'}, 
  })
  doctorId?: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {columnName: 'first_name'},
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {columnName: 'last_name'},
  })
  lastName: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'specialization'},
  })
  specialization?: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'qualification'},
  })
  qualification?: string;

  @property({
    type: 'number',
    postgresql: {columnName: 'experience'},
  })
  experience?: number;

  @property({
    type: 'number',
    required: true,
    postgresql: {columnName: 'contact_number'},
  })
  contactNumber: number;

  @property({
    type: 'string',
    postgresql: {columnName: 'email'},
  })
  email?: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'address'},
  })
  address?: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'availability'},
  })
  availability?: string;

  constructor(data?: Partial<Doctor>) {
    super(data);
  }
}
export interface DoctorRelations { 
 }
export type DoctorWithRelations = Doctor & DoctorRelations;
