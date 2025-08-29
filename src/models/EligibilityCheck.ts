import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('eligibility_checks')
export class EligibilityCheck {
  @PrimaryGeneratedColumn()
  id: number; // Internal DB ID

  @Column({ unique: true })
  eligibility_id: string; // Unique insurance eligibility check identifier

  @Column()
  patient_id: string;  // References Patient.patient_id

  @Column('timestamp')
  check_datetime: Date; // When the check was performed

  @Column()
  status: string;  // Active/Inactive/Unknown

  @Column('decimal', { nullable: true })
  deductible: number; // Total deductible amount

  @Column('decimal', { nullable: true })
  deductible_met: number; // Amount of deductible met

  @Column('decimal', { nullable: true })
  copay: number; // Copay amount

  @Column('decimal', { nullable: true })
  out_of_pocket_max: number; // Out-of-pocket maximum amount

  @Column('decimal', { nullable: true })
  out_of_pocket_met: number; // Amount of out-of-pocket met

  @Column('text', { array: true, default: () => "'{}'" })
  errors: string[]; // error messages, if any
}