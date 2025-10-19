import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Patients, PatientsRelations} from '../models';

export class PatientsRepository extends DefaultCrudRepository<
  Patients,
  typeof Patients.prototype.patient_id,
  PatientsRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Patients, dataSource);
  }
}
