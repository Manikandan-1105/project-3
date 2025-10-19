import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Patients extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  patient_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  first_name: string;

  @property({
    type: 'string',
    required: true,
  })
  last_name: string;

  @property({
    type: 'number',
    required: true,
  })
  age: number;

  @property({
    type: 'string',
    required: true,
  })
  gender: string;

  @property({
    type: 'number',
    required: true,
  })
  contact_number: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'string',
    required: true,
  })
  medical_history: string;

  @property({
    type: 'date',
    defaultFn: 'now',
    required: false,
  })
  created_at: string;

  @property({
    type: 'date',
    defaultFn: 'now',
    required: false,
  })
  updated_at: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Patients>) {
    super(data);
  }
}

export interface PatientsRelations {
  // describe navigational properties here
}

export type PatientsWithRelations = Patients & PatientsRelations;
