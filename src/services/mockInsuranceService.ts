import { EligibilityRequest, EligibilityResponse } from '../types';

export const mockInsuranceCheck = (request: EligibilityRequest): EligibilityResponse => {
  const timestamp = new Date().toISOString();
  // Check if memberNumber ends with '0'
  if (request.memberNumber.endsWith('0')) {
    return {
      eligibilityId: `ELG-${timestamp}`,
      patientId: request.patientId,
      checkDateTime: timestamp,
      status: 'Unknown',
      coverage: {},
      errors: ['Invalid member number'],
    };
  }
  // Existing logic for Active/Inactive based on memberNumber parity
  const isEven = parseInt(request.memberNumber.replace(/\D/g, '')) % 2 === 0;
  return {
    eligibilityId: `ELG-${timestamp}`,
    patientId: request.patientId,
    checkDateTime: timestamp,
    status: isEven ? 'Active' : 'Inactive',
    coverage: isEven
      ? {
          deductible: 1500,
          deductibleMet: 750,
          copay: 25,
          outOfPocketMax: 5000,
          outOfPocketMet: 1200,
        }
      : {},
    errors: [],
  };
};