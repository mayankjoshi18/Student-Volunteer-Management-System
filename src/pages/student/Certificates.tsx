/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Certificate } from '../../types';
import { Award, Eye, Download, ShieldCheck, Heart } from 'lucide-react';
import CertificatePreviewModal from '../../components/CertificatePreviewModal';

export default function Certificates() {
  const { currentUser, addToast } = useApp();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    const fetchCerts = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const data = await mockApi.getCertificatesByStudent(currentUser.id);
        setCerts(data);
      } catch (err) {
        addToast('error', 'Sync Failed', 'Could not sync volunteer certificates.');
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, [currentUser]);

  const handleDownload = (eventTitle: string) => {
    addToast('success', 'Download Started', `Your certificate for "${eventTitle}" is being compiled to a PDF.`);
  };

  return (
    <div id="student-certificates" className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-none">
          My Verification Certificates
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          View, print, and download your officially signed academic volunteering credentials.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-semibold">Validating credentials...</p>
        </div>
      ) : certs.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl max-w-xl mx-auto space-y-4">
          <Award className="w-12 h-12 text-amber-200 dark:text-amber-950/40 mx-auto" />
          <h3 className="font-bold text-gray-950 dark:text-white text-base">No Certificates Issued Yet</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            Once event coordinators approve your attendance and mark hours complete, your digital certificate credentials will instantly publish here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((cert) => (
            <div
              key={cert.id}
              id={`cert-item-${cert.id}`}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all gap-5"
            >
              <div className="flex gap-4 items-start font-sans">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl text-white shadow-md shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="font-extrabold text-sm text-gray-950 dark:text-white truncate" title={cert.eventTitle}>
                    {cert.eventTitle}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold">Issued At: {cert.issuedAt}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">By: {cert.issuedBy}</p>
                </div>
              </div>

              {/* Verified Badge and Actions */}
              <div className="pt-4 border-t border-gray-50 dark:border-slate-800/80 flex items-center justify-between gap-3 font-sans">
                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> SECURE REGISTRY VERIFIED
                </span>
                
                <div className="flex gap-2">
                  <button
                    id={`cert-preview-trigger-${cert.id}`}
                    onClick={() => setSelectedCert(cert)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/60 rounded-xl text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                    title="Preview Certificate"
                  >
                    <Eye className="w-4.5 h-4.5" />
                  </button>
                  <button
                    id={`cert-download-trigger-${cert.id}`}
                    onClick={() => handleDownload(cert.eventTitle)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/60 rounded-xl text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                    title="Download PDF"
                  >
                    <Download className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Preview Modal Portal */}
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
