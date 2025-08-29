-- Patient Table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL
);

-- Eligibility Checks Table
CREATE TABLE IF NOT EXISTS eligibility_checks (
    id SERIAL PRIMARY KEY,
    eligibility_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(50) REFERENCES patients(patient_id) ON DELETE CASCADE,
    check_datetime TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    deductible DECIMAL(10,2),
    deductible_met DECIMAL(10,2),
    copay DECIMAL(10,2),
    out_of_pocket_max DECIMAL(10,2),
    out_of_pocket_met DECIMAL(10,2),
    errors TEXT[] DEFAULT '{}'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_patient_id ON patients(patient_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_patient_id ON eligibility_checks(patient_id);