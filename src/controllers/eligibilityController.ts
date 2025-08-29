// src/controllers/eligibilityController.ts
// Controller for handling eligibility check requests and history retrieval

import { Router, Request, Response } from 'express';
import { AppDataSource } from '../db/data-source';
import { Patient } from '../models/Patient';
import { EligibilityCheck } from '../models/EligibilityCheck';
import { mockInsuranceCheck } from '../services/mockInsuranceService';
import { EligibilityRequest, EligibilityResponse } from '../types';

const router = Router();
const patientRepo = AppDataSource.getRepository(Patient);
const checkRepo = AppDataSource.getRepository(EligibilityCheck);

// POST /eligibility/check
router.post('/check', async (req: Request, res: Response) => {
  const request: EligibilityRequest = req.body;

  // Validate input (basic)
  if (!request.patientId || !request.patientName || !request.dateOfBirth || !request.memberNumber || !request.insuranceCompany || !request.serviceDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Upsert patient (create if not exists)
    let patient = await patientRepo.findOneBy({ patient_id: request.patientId });
    if (!patient) {
      patient = patientRepo.create({
        patient_id: request.patientId,
        name: request.patientName,
        date_of_birth: new Date(request.dateOfBirth),
      });
      await patientRepo.save(patient);
    }

    // Simulate API call
    const response: EligibilityResponse = mockInsuranceCheck(request);

    // Store result
    const check = checkRepo.create({
      eligibility_id: response.eligibilityId,
      patient_id: request.patientId,
      check_datetime: new Date(response.checkDateTime),
      status: response.status,
      deductible: response.coverage.deductible,
      deductible_met: response.coverage.deductibleMet,
      copay: response.coverage.copay,
      out_of_pocket_max: response.coverage.outOfPocketMax,
      out_of_pocket_met: response.coverage.outOfPocketMet,
      errors: response.errors,
    });
    await checkRepo.save(check);

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /eligibility/history/{patientId}
router.get('/history/:patientId', async (req: Request, res: Response) => {
  const { patientId } = req.params;

  try {
    const checks = await checkRepo.find({ where: { patient_id: patientId } });
    if (!checks.length) {
      return res.status(404).json({ error: 'No history found' });
    }
    res.json(checks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;