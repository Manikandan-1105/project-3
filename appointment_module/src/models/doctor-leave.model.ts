import {Entity, model, property} from '@loopback/repository';

@model({name:"doctor_leave",settings: {strict: false}})
export class DoctorLeave extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  leave_id?: number;

  @property({
    type: 'number',
    required: true,
  })
  doctor_id: number;

  @property({
    type: 'date',
    required: true,
  })
  start_date: string;

  @property({
    type: 'date',
    required: true,
  })
  end_date: string;

  @property({
    type: 'string',
    required: true,
  })
  reason: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<DoctorLeave>) {
    super(data);
  }
}

export interface DoctorLeaveRelations {
  // describe navigational properties here
}

export type DoctorLeaveWithRelations = DoctorLeave & DoctorLeaveRelations;
