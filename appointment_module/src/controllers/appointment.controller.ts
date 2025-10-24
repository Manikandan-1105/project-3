import {
  repository,
} from '@loopback/repository';
import {
  post, get, getModelSchemaRef, patch, del, param, requestBody, response
} from '@loopback/rest';
import {Appointment} from '../models';
import {AppointmentRepository} from '../repositories';

export class AppointmentController {
  constructor(
    @repository(AppointmentRepository)
    public appointmentRepository: AppointmentRepository,
  ) {}

  // CREATE
  @post('/appointments')
  @response(200, {
    description: 'Appointment model instance',
    content: {'application/json': {schema: getModelSchemaRef(Appointment)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Appointment, {exclude: ['appointment_id']}),
        },
      },
    })
    appointment: Omit<Appointment, 'appointment_id'>,
  ): Promise<Appointment> {
    return this.appointmentRepository.create(appointment);
  }

  // READ ALL
  @get('/appointments')
  @response(200, {
    description: 'Array of Appointment model instances',
    content: {'application/json': {schema: {type: 'array', items: getModelSchemaRef(Appointment)}}},
  })
  async find(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }

  // READ BY ID
  @get('/appointments/{id}')
  @response(200, {
    description: 'Appointment model instance',
    content: {'application/json': {schema: getModelSchemaRef(Appointment)}},
  })
  async findById(@param.path.number('id') id: number): Promise<Appointment> {
    return this.appointmentRepository.findById(id);
  }

  // UPDATE
  @patch('/appointments/{id}')
  @response(204, {
    description: 'Appointment PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() appointment: Partial<Appointment>,
  ): Promise<void> {
    await this.appointmentRepository.updateById(id, appointment);
  }

  // DELETE
  @del('/appointments/{id}')
  @response(204, {
    description: 'Appointment DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.appointmentRepository.deleteById(id);
  }
}
