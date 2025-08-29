// types.ts
// Define request and response types for insurance eligibility checks


export interface EligibilityRequest {
  patientId: string;
  patientName: string;
  dateOfBirth: string;
  memberNumber: string;
  insuranceCompany: string;
  serviceDate: string;
}

export interface EligibilityResponse {
  eligibilityId: string;
  patientId: string;
  checkDateTime: string;
  status: string;
  coverage: {
    deductible?: number;
    deductibleMet?: number;
    copay?: number;
    outOfPocketMax?: number;
    outOfPocketMet?: number;
  };
  errors: string[];
}