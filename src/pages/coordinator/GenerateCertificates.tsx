/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Registration, Certificate } from '../../types';
import { Award, FileSignature, CheckCircle, RefreshCw, Eye } from 'lucide-react';
import CertificatePreviewModal from '../../components/CertificatePreviewModal';

export default function GenerateCertificates() {
  const { currentUser, addToast } = useApp();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [issuedCerts, setIssuedCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const fetchRosters = async () => {
    setLoading(true);
    try {
      // Get all registration logs where student attended the event
      const regs = await mockApi.getRegistrations();
      setRegistrations(regs.filter(r => r.attended && r.status === 'approved'));

      // Get issued certificates
      const certs = await mockApi.getCertificates();
      setIssuedCerts(certs);
    } catch (err) {
      addToast('error', 'Sync Failed', 'Could not load certificate rosters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRosters();
  }, []);

  const handleIssueCertificate = async (reg: Registration) => {
    try {
      const coordName = currentUser?.name || 'Academic Coordinator';
      const cert = await mockApi.generateCertificate(reg.studentId, reg.eventId, reg.eventTitle, coordName);
      
      addToast('success', 'Certificate Issued!', `Successfully published credential security certificate for ${reg.studentName}.`);
      fetchRosters();
    } catch (err: any) {
      addToast('error', 'Action Failed', err.message || 'Could not issue certificate.');
    }
  };

  return (
    <div id="coordinator-generate-certs" className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-500" />
            Issue Digital Security Certificates
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Issue cryptographically verified institutional credentials to volunteers who completed academic hours.
          </p>
        </div>
        <button
          id="refresh-certs-btn"
          onClick={fetchRosters}
          className="p-2 border border-gray-100 dark:border-slate-850 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-500"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-semibold font-sans">Updating certificate databases...</p>
        </div>
      ) : registrations.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl max-w-md mx-auto text-xs text-gray-400">
          No students with verified attendance records are ready for certification. Confirm attendance logs first.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-400 font-extrabold uppercase border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student Volunteer</th>
                  <th className="px-6 py-4">Academic Project</th>
                  <th className="px-6 py-4">Verified Hours</th>
                  <th className="px-6 py-4">Secured Credential ID</th>
                  <th className="px-6 py-4 text-right">Certificate Authorization</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium text-gray-700 dark:text-gray-200">
                {registrations.map((r) => {
                  // Find if a certificate already exists for this student + event
                  const matchingCert = issuedCerts.find(
                    (c) => c.studentId === r.studentId && c.eventTitle === r.eventTitle
                  );

                  return (
                    <tr key={r.id} id={`cert-row-${r.id}`} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-all">
                      
                      {/* Student details */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-gray-950 dark:text-white">{r.studentName}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">ID: {r.studentId} • {r.department}</p>
                        </div>
                      </td>

                      {/* Event project */}
                      <td className="px-6 py-4 max-w-xs truncate font-bold text-gray-900 dark:text-white">
                        {r.eventTitle}
                      </td>

                      {/* Logged hours */}
                      <td className="px-6 py-4 font-black text-gray-950 dark:text-white">
                        +{r.hoursApproved} Hrs Verified
                      </td>

                      {/* Secured Credential Status */}
                      <td className="px-6 py-4">
                        {matchingCert ? (
                          <span className="font-mono text-[9px] font-bold text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/20 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-950 uppercase">
                            ID: {matchingCert.id.split('-')[0].toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">Not issued yet</span>
                        )}
                      </td>

                      {/* Issue/Action Column */}
                      <td className="px-6 py-4 text-right">
                        {matchingCert ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600">
                              <CheckCircle className="w-3.5 h-3.5" /> ISSUED
                            </span>
                            <button
                              id={`preview-issued-cert-${r.id}`}
                              onClick={() => setSelectedCert(matchingCert)}
                              className="p-1 border border-gray-100 dark:border-slate-800 hover:bg-gray-50 rounded-lg text-gray-500 cursor-pointer"
                              title="Preview issued certificate"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            id={`issue-cert-action-${r.id}`}
                            onClick={() => handleIssueCertificate(r)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] shadow-sm cursor-pointer"
                          >
                            <FileSignature className="w-3.5 h-3.5" />
                            Sign & Issue
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        </div>
      )}

      {/* Preview Portal Modal */}
      {selectedCert && (
        <CertificatePreviewModal
          certificate={selectedCert}
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}

    </div>
  );
}
