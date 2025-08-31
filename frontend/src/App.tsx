/* App.tsx - Louis Romeo */
/* Written for sleek and user-friendly front-end design */

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    dateOfBirth: '',
    memberNumber: '',
    insuranceCompany: '',
    serviceDate: '',
  });
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [historyPatientId, setHistoryPatientId] = useState('');
  const [isCoverageOpen, setIsCoverageOpen] = useState(false); // For collapsible coverage

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await axios.post('http://localhost:3000/eligibility/check', formData);
      console.log('POST response:', res.data);
      setResult(res.data);
    } catch (err: any) {
      console.error('POST error:', err.response || err.message);
      setError(err.response?.data?.error || `Error during eligibility check: ${err.message}`);
    }
    setLoading(false);
  };

  const fetchHistory = async () => {
    if (!historyPatientId) {
      setError('Please enter a Patient ID to fetch history.');
      return;
    }
    setLoading(true);
    setError('');
    setHistory([]);
    try {
      const res = await axios.get(`http://localhost:3000/eligibility/history/${historyPatientId}`);
      console.log('GET response:', res.data);
      setHistory(res.data);
    } catch (err: any) {
      console.error('GET error:', err.response || err.message);
      setError(err.response?.data?.error || `Error fetching history: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>Insurance Eligibility Verification - Louis Romeo</h1>

      {/* Form Section */}
      <section className="form-section">
        <h2>Check Eligibility</h2>
        <form onSubmit={handleSubmit} className="eligibility-form">
          <div className="form-grid">
            <label>
              Patient ID
              <input type="text" name="patientId" value={formData.patientId} onChange={handleInputChange} required />
            </label>
            <label>
              Patient Name
              <input type="text" name="patientName" value={formData.patientName} onChange={handleInputChange} required />
            </label>
            <label>
              Date of Birth
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
            </label>
            <label>
              Insurance Member ID
              <input type="text" name="memberNumber" value={formData.memberNumber} onChange={handleInputChange} required />
            </label>
            <label>
              Insurance Company
              <input type="text" name="insuranceCompany" value={formData.insuranceCompany} onChange={handleInputChange} required />
            </label>
            <label>
              Service Date
              <input type="date" name="serviceDate" value={formData.serviceDate} onChange={handleInputChange} required />
            </label>
          </div>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Checking...' : 'Check Eligibility'}
          </button>
        </form>
      </section>

      {/* Loading Spinner */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="error-alert">
          <span>{error}</span>
          <button onClick={() => setError('')} className="close-alert">×</button>
        </div>
      )}

      {/* Result Section */}
      {result && (
        <section className="result-section">
          <h2>Eligibility Result</h2>
          <div className="result-card">
            <p><strong>Eligibility ID:</strong> {result.eligibilityId}</p>
            <p><strong>Patient ID:</strong> {result.patientId}</p>
            <p><strong>Check Date/Time:</strong> {new Date(result.checkDateTime).toLocaleString()}</p>
            <p><strong>Status:</strong> {result.status}</p>
            {(result.status === 'Active' || result.errors.length > 0) && (
              <div>
                <button
                  className="toggle-button"
                  onClick={() => setIsCoverageOpen(!isCoverageOpen)}
                >
                  {isCoverageOpen ? 'Hide Details' : 'Show Details'}
                </button>
                {isCoverageOpen && (
                  <div className="details-content">
                    {result.status === 'Active' && result.coverage && (
                      <div>
                        <h3>Coverage Details</h3>
                        <p>Deductible: ${parseFloat(result.coverage.deductible).toFixed(2)}</p>
                        <p>Deductible Met: ${parseFloat(result.coverage.deductibleMet).toFixed(2)}</p>
                        <p>Copay: ${parseFloat(result.coverage.copay).toFixed(2)}</p>
                        <p>Out-of-Pocket Max: ${parseFloat(result.coverage.outOfPocketMax).toFixed(2)}</p>
                        <p>Out-of-Pocket Met: ${parseFloat(result.coverage.outOfPocketMet).toFixed(2)}</p>
                      </div>
                    )}
                    {result.errors.length > 0 && (
                      <div>
                        <h3>Errors</h3>
                        <ul>
                          {result.errors.map((err: string, index: number) => (
                            <li key={index}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* History Section */}
      <section className="history-section">
        <h2>Eligibility History</h2>
        <div className="history-input">
          <label>
            Patient ID
            <input
              type="text"
              value={historyPatientId}
              onChange={(e) => setHistoryPatientId(e.target.value)}
              placeholder="Enter Patient ID"
            />
          </label>
          <button onClick={fetchHistory} disabled={loading} className="fetch-button">
            {loading ? 'Fetching...' : 'Fetch History'}
          </button>
        </div>
        {history.length > 0 && (
          <div className="table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Eligibility ID</th>
                  <th>Check Date/Time</th>
                  <th>Status</th>
                  <th>Deductible</th>
                  <th>Deductible Met</th>
                  <th>Copay</th>
                  <th>Out-of-Pocket Max</th>
                  <th>Out-of-Pocket Met</th>
                  <th>Errors</th>
                </tr>
              </thead>
              <tbody>
                {history.map((check: any, index: number) => (
                  <tr key={index}>
                    <td>{check.eligibility_id}</td>
                    <td>{new Date(check.check_datetime).toLocaleString()}</td>
                    <td>{check.status}</td>
                    <td>
                      {check.deductible != null
                        ? `$${parseFloat(check.deductible).toFixed(2)}`
                        : 'N/A'}
                    </td>
                    <td>
                      {check.deductible_met != null
                        ? `$${parseFloat(check.deductible_met).toFixed(2)}`
                        : 'N/A'}
                    </td>
                    <td>
                      {check.copay != null ? `$${parseFloat(check.copay).toFixed(2)}` : 'N/A'}
                    </td>
                    <td>
                      {check.out_of_pocket_max != null
                        ? `$${parseFloat(check.out_of_pocket_max).toFixed(2)}`
                        : 'N/A'}
                    </td>
                    <td>
                      {check.out_of_pocket_met != null
                        ? `$${parseFloat(check.out_of_pocket_met).toFixed(2)}`
                        : 'N/A'}
                    </td>
                    <td>{check.errors.length > 0 ? check.errors.join(', ') : 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default App;