import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EligibilityCheck } from './EligibilityCheck';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number; // Internal DB ID

  @Column({ unique: true })
  patient_id: string; // Unique patient identifier

  @Column()
  name: string; // Full name

  @Column('date')
  date_of_birth: Date; // Date of birth

  @OneToMany(() => EligibilityCheck, (check) => check.patient_id)
  checks: EligibilityCheck[]; // defines one-to-many relationship with EligibilityCheck
}