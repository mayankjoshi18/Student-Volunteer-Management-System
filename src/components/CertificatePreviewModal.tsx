/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { X, Download, Printer, Award, ShieldCheck, Share2 } from 'lucide-react';
import { Certificate } from '../types';
import { useApp } from '../context/AppContext';

interface CertificatePreviewModalProps {
  certificate: Certificate;
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificatePreviewModal({ certificate, isOpen, onClose }: CertificatePreviewModalProps) {
  const { addToast } = useApp();

  if (!isOpen) return null;

  const handleDownload = () => {
    addToast('success', 'Download Started', `Your certificate "${certificate.eventTitle}" is being generated as a PDF.`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/verify/${certificate.certificateCode}`);
    addToast('success', 'Link Copied', 'Certificate verification link copied to clipboard.');
  };

  return (
    <div id="certificate-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      {/* Background click close */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        id="certificate-modal-content"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 max-w-4xl w-full z-10 overflow-hidden"
      >
        {/* Header toolbar */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">Certificate Credentials</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="cert-btn-share"
              onClick={handleShare}
              className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700/60 rounded-xl transition-colors"
              title="Copy Verification Link"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>
            <button
              id="cert-btn-print"
              onClick={handlePrint}
              className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700/60 rounded-xl transition-colors"
              title="Print"
            >
              <Printer className="w-4.5 h-4.5" />
            </button>
            <button
              id="cert-btn-download"
              onClick={handleDownload}
              className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700/60 rounded-xl transition-colors"
              title="Download PDF"
            >
              <Download className="w-4.5 h-4.5" />
            </button>
            <div className="w-px h-6 bg-gray-200 dark:bg-slate-700 mx-1" />
            <button
              id="cert-btn-close"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Visual representation to print or view) */}
        <div className="p-8 sm:p-12 overflow-x-auto">
          <div className="min-w-[650px] bg-amber-50/20 dark:bg-slate-950 border-8 border-double border-amber-800/40 p-12 rounded-2xl relative text-center text-slate-800 dark:text-slate-100 font-serif">
            
            {/* Elegant corner flourishes */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-800/50" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-800/50" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-800/50" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-800/50" />

            {/* University Crest placeholder */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full border-2 border-amber-800/60 flex items-center justify-center bg-amber-50 dark:bg-slate-900 text-amber-800 dark:text-amber-500 shadow-sm">
                <Award className="w-9 h-9" />
              </div>
            </div>

            <p className="text-xs uppercase tracking-widest font-sans text-amber-800 dark:text-amber-500 font-bold">Apex State University</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-4 font-serif italic tracking-wide">Certificate of Appreciation</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-sans tracking-wide">STUDENT VOLUNTEER NETWORK CREDENTIAL</p>

            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-800/50 to-transparent mx-auto my-6" />

            <p className="text-sm font-sans italic text-gray-600 dark:text-gray-300">This honor is proudly presented to</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 dark:text-white my-4 font-sans tracking-normal underline decoration-amber-800/30 underline-offset-8">
              {certificate.studentName}
            </h2>

            <p className="max-w-xl mx-auto text-sm leading-relaxed text-gray-600 dark:text-gray-300 font-sans mt-2">
              for their exceptional commitment, personal initiative, and altruistic contribution to the event
              <span className="block font-bold text-gray-900 dark:text-white not-italic mt-2 text-base font-serif">
                "{certificate.eventTitle}"
              </span>
              demonstrating high leadership, dedication, and service to our community.
            </p>

            {/* Signatures & Seal */}
            <div className="grid grid-cols-3 items-end mt-12 pt-6 border-t border-gray-100 dark:border-slate-800 font-sans">
              
              {/* Issued By Signature */}
              <div className="text-center">
                <p className="font-serif italic text-base text-blue-600 dark:text-blue-400 leading-none h-6">{certificate.issuedBy}</p>
                <div className="w-32 h-px bg-gray-300 dark:bg-slate-700 mx-auto my-2" />
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Authorized Coordinator</p>
              </div>

              {/* Gold Seal */}
              <div className="flex justify-center flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md relative group">
                  <div className="absolute inset-1 rounded-full border border-dashed border-white/40" />
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <p className="text-[9px] text-amber-800 dark:text-amber-500 font-bold uppercase tracking-widest mt-2">OFFICIAL SEAL</p>
              </div>

              {/* Issued At Date */}
              <div className="text-center">
                <p className="font-semibold text-sm text-gray-900 dark:text-white leading-none h-6">{certificate.issuedAt}</p>
                <div className="w-32 h-px bg-gray-300 dark:bg-slate-700 mx-auto my-2" />
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Date of Issuance</p>
              </div>

            </div>

            {/* Credential verification footer info */}
            <div className="mt-10 pt-4 border-t border-amber-800/10 font-sans flex flex-col sm:flex-row justify-between items-center gap-2 text-[9px] text-gray-400 dark:text-gray-500">
              <p className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" /> Securely verified via VMS Digital Registry
              </p>
              <p className="font-mono bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-gray-600 dark:text-gray-400">
                Credential ID: {certificate.certificateCode}
              </p>
            </div>

          </div>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3">
          <button
            id="cert-btn-close-bottom"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            Close Preview
          </button>
          <button
            id="cert-btn-download-bottom"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download Certificate
          </button>
        </div>
      </motion.div>
    </div>
  );
}
