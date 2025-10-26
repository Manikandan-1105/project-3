import {repository,} from '@loopback/repository';
import { post, get, getModelSchemaRef, patch, del, param, requestBody, response,HttpErrors} from '@loopback/rest';
import {Appointment} from '../models';
import {AppointmentRepository, DoctorLeaveRepository, DoctorRepository} from '../repositories';

export class AppointmentController {
  constructor(
    @repository(AppointmentRepository)
    public appointmentRepository: AppointmentRepository,
    @repository(DoctorRepository)
    public doctorRepository: DoctorRepository,
    @repository(DoctorLeaveRepository)
    public doctorLeaveRepository: DoctorLeaveRepository,
  ) {}

  // Create an appointment
  @post('/appointments')
  @response(200, {
    description: 'Appointment created successfully',
    content: {'application/json': {schema: {'x-ts-type': Appointment}}},
  })
  async createAppointment(
    @requestBody() appointmentData: Appointment,
  ): Promise<Appointment> {
    let doctor=null;

    if (!appointmentData.doctorName) {
      throw new HttpErrors.BadRequest('doctorName is required');
    }

    // Find doctor by name and optional specialization
     doctor = await this.doctorRepository.findOne({
      where:{firstName:appointmentData.doctorName}
    });

    console.log(doctor);

    if (!doctor) {
      throw new HttpErrors.NotFound(
        'No doctor found with the given name and specialization',
      );
    }

    //Check if the doctor is on leave for that appointment date
    const isOnLeave = await this.doctorLeaveRepository.findOne({
  where: {
    and: [
      {doctor_id: appointmentData.doctor_id},
      {start_date: {lte: appointmentData.appointment_date}},
      {end_date: {gte: appointmentData.appointment_date}}
    ],
  },
});

    if (isOnLeave) {
  // Option 1: Throw error and ask to pick another date
  throw new HttpErrors.BadRequest(
    `Doctor ${doctor.firstName} is on leave on ${appointmentData.appointment_date}`,
  );
}


    // Check doctor's availability for the appointment day
    if (doctor.availability) {
      const availableDays = doctor.availability
        .split(',')
        .map(d => d.trim().toLowerCase());
        console.log(availableDays);
      const appointmentDay = new Date(appointmentData.appointment_date)
        .toLocaleDateString('en-US', {weekday: 'long'})
        .toLowerCase()
        .slice(0, 3);
      console.log(appointmentDay);
      if (!availableDays.includes(appointmentDay)) {
        throw new HttpErrors.BadRequest(
          `Doctor ${doctor.firstName} is not available on ${appointmentDay}`,
        );
      }
    }
    

    // Count how many appointments the doctor already has that day
    const appointmentCount = await this.appointmentRepository.count({
      and: [
        {doctorId: doctor.doctorId},
        {appointmentDate: appointmentData.appointmentDate},
      ],
    });

    // If doctor already has 10 appointments, assign another doctor
    if (appointmentCount.count >= 10) {
      const alternativeDoctor = await this.doctorRepository.findOne({
        where: {
          and: [
            {specialization: doctor.specialization},
            {doctorId: {neq: doctor.doctorId}},
          ],
        },
      });
      

      if (alternativeDoctor) {
        doctor = alternativeDoctor;
      } else {
        throw new HttpErrors.BadRequest(
          `All doctors with specialization "${doctor.specialization}" are busy on that date.`,
        );
      }
    }

    // Assign doctorId and timestamps
    appointmentData.created_at = new Date().toISOString();
    appointmentData.updated_at = new Date().toISOString();
    appointmentData.status = 'Scheduled';

    return this.appointmentRepository.create(appointmentData);
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
