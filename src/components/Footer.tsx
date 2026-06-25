/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { Award, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="app-footer" className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand & Mission */}
        <div className="space-y-4">
          <Link id="footer-logo-link" to="/" className="flex items-center gap-2 text-white font-bold text-lg">
            <div className="bg-blue-600 p-1.5 rounded-xl text-white">
              <Award className="w-5 h-5" />
            </div>
            <span>Vola<span className="text-blue-500">Link</span></span>
          </Link>
          <p className="text-xs leading-relaxed">
            Apex State University Student Volunteer Management System. Connecting student hearts to community needs to build a better tomorrow through organized social service.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase">Quick Navigation</h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link id="footer-link-home" to="/" className="hover:text-white transition-colors">Home Landing Page</Link>
            </li>
            <li>
              <Link id="footer-link-opportunities" to="/opportunities" className="hover:text-white transition-colors">Volunteer Opportunities</Link>
            </li>
            <li>
              <Link id="footer-link-about" to="/about" className="hover:text-white transition-colors">About Our Vision</Link>
            </li>
            <li>
              <Link id="footer-link-contact" to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Platform Spaces */}
        <div>
          <h3 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase">Roles Portal</h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link id="footer-portal-student" to="/student" className="hover:text-white transition-colors">Student Portal</Link>
            </li>
            <li>
              <Link id="footer-portal-coord" to="/coordinator" className="hover:text-white transition-colors">Coordinator Portal</Link>
            </li>
            <li>
              <Link id="footer-portal-admin" to="/admin" className="hover:text-white transition-colors">Admin Portal</Link>
            </li>
            <li>
              <Link id="footer-portal-login" to="/login" className="hover:text-white transition-colors">Sign In Portal</Link>
            </li>
          </ul>
        </div>

        {/* Contacts */}
        <div className="space-y-3 text-xs">
          <h3 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase">Contact Office</h3>
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-500 shrink-0" />
            volunteer-affairs@university.edu
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-500 shrink-0" />
            +1 (555) 482-1290
          </p>
          <p className="flex items-center gap-2 leading-relaxed">
            <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
            Student Union Building, Wing B, Room 204
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>&copy; {currentYear} Apex State University VolaLink. All rights reserved.</p>
        <p className="flex items-center gap-1.5 justify-center">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> for Academic Leadership
        </p>
      </div>
    </footer>
  );
}
