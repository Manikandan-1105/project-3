import {repository,Filter,} from '@loopback/repository';
import {post,get,param,patch,del,requestBody,response,getModelSchemaRef,} from '@loopback/rest';
import {Doctor} from '../models';
import {DoctorRepository} from '../repositories';

export class DoctorController {
  constructor(
    @repository(DoctorRepository)
    public doctorRepository: DoctorRepository,
  ) {}

  // CREATE
  @post('/doctors')
  @response(200, {
    description: 'Doctor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Doctor)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Doctor, {
            exclude: ['doctorId'],
          }),
        },
      },
    })
    doctor: Omit<Doctor, 'doctorId'>,
  ): Promise<Doctor> {
    return this.doctorRepository.create(doctor);
  }

  // READ ALL
  @get('/doctors')
  @response(200, {
    description: 'Array of Doctor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Doctor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Doctor) filter?: Filter<Doctor>,
  ): Promise<Doctor[]> {
    return this.doctorRepository.find(filter);
  }

  // READ BY ID
  @get('/doctors/{id}')
  @response(200, {
    description: 'Doctor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Doctor)}},
  })
  async findById(@param.path.number('id') id: number): Promise<Doctor> {
    return this.doctorRepository.findById(id);
  }

  // UPDATE
  @patch('/doctors/{id}')
  @response(204, {
    description: 'Doctor PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Doctor, {partial: true}),
        },
      },
    })
    doctor: Partial<Doctor>,
  ): Promise<void> {
    await this.doctorRepository.updateById(id, doctor);
  }

  // DELETE
  @del('/doctors/{id}')
  @response(204, {
    description: 'Doctor DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.doctorRepository.deleteById(id);
  }
}
