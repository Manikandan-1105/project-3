import {repository,Filter,} from '@loopback/repository';
import {post,get,param,patch,del,requestBody,response,getModelSchemaRef,HttpErrors} from '@loopback/rest';
import {Doctor,DoctorLeave} from '../models';
import {DoctorRepository,DoctorLeaveRepository,AppointmentRepository} from '../repositories';

export class DoctorController {
  constructor(
    @repository(DoctorLeaveRepository)
    public doctorLeaveRepository: DoctorLeaveRepository,
     @repository(DoctorRepository)
    public doctorRepository: DoctorRepository,
    @repository(AppointmentRepository)
    public appointmentRepository: AppointmentRepository,
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

  @post('/doctor-leaves')
  @response(200, {
    description: 'Doctor leave created and appointments updated',
  })
  async createLeave(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              doctor_id: {type: 'number'},
              start_date: {type: 'string', format: 'date'},
              end_date: {type: 'string', format: 'date'},
              reason: {type: 'string'},
            },
            required: ['doctor_id', 'start_date', 'end_date', 'reason'],
          },
        },
      },
    })
    leaveData: Omit<DoctorLeave, 'leave_id'>,
  ): Promise<object> {
    // Save the leave record
    const leave = await this.doctorLeaveRepository.create(leaveData);

    // Find affected appointments
    const affectedAppointments = await this.appointmentRepository.find({
      where: {
        doctor_id: leave.doctor_id,
        appointment_date: {
          between: [leave.start_date, leave.end_date],
        },
      },
    });

    if (affectedAppointments.length > 0) {
      // Get doctor specialization
      const doctor = await this.doctorRepository.findById(leave.doctor_id);

      // Find available doctor with same specialization
      const availableDoctor = await this.doctorRepository.findOne({
        where: {
          specialization: doctor.specialization,
          doctorId: {neq: doctor.doctorId}, // not the same doctor
        },
      });

      if (!availableDoctor) {
        throw new HttpErrors.NotFound(
          'No available doctor found for reassignment.',
        );
      }

      // Reassign each appointment
      for (const appt of affectedAppointments) {
        await this.appointmentRepository.updateById(appt.appointment_id, {
          doctor_id: availableDoctor.doctorId,
          notes: `${appt.notes || ''} (Auto-reassigned from Dr.${doctor.firstName})`,
        });
      }

      return {
        message: `Doctor on leave. ${affectedAppointments.length} appointment(s) reassigned to Dr.${availableDoctor.firstName}.`,
        reassignedDoctor: availableDoctor,
      };
    }

    return {
      message: 'Doctor leave added. No appointments affected.',
      leave,
    };
  }
}
