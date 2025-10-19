import {
  Filter,
  repository,
} from '@loopback/repository';
import { post,param, get,getModelSchemaRef, patch,del,requestBody,response,} from '@loopback/rest';
import {Patients} from '../models';
import {PatientsRepository} from '../repositories';

export class PatientController {
  constructor(
    @repository(PatientsRepository)
    public patientRepository : PatientsRepository,
  ) {}

  // CREATE
  @post('/patients')
  @response(200, {
    description: 'Patient model instance',
    content: {'application/json': {schema: getModelSchemaRef(Patients)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Patients, {exclude: ['patientId']}),
        },
      },
    })
    patient: Omit<Patients, 'patientId'>,
  ): Promise<Patients> {
    return this.patientRepository.create(patient);
  }

  // READ ALL
  @get('/patients')
  @response(200, {
    description: 'Array of Patient model instances',
    content: {'application/json': {schema: {type: 'array', items: getModelSchemaRef(Patients)}}},
  })
  async find(@param.filter(Patients) filter?: Filter<Patients>): Promise<Patients[]> {
    return this.patientRepository.find(filter);
  }

  // READ BY ID
  @get('/patients/{id}')
  @response(200, {
    description: 'Patient model instance',
    content: {'application/json': {schema: getModelSchemaRef(Patients)}},
  })
  async findById(@param.path.number('id') id: number): Promise<Patients> {
    return this.patientRepository.findById(id);
  }

  // UPDATE
  @patch('/patients/{id}')
  @response(204, {
    description: 'Patient PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() patient: Partial<Patients>,
  ): Promise<void> {
    await this.patientRepository.updateById(id, patient);
  }

  // DELETE
  @del('/patients/{id}')
  @response(204, {
    description: 'Patient DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.patientRepository.deleteById(id);
  }
}
