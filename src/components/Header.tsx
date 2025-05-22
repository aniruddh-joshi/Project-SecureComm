import React from 'react';
import { Shield } from 'lucide-react';

export default function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-2">
        <Shield className="w-12 h-12 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          MAJOR PROJECT: CRYPTOGRAPHIC TECHNIQUE FOR COMMUNICATION SYSTEM
        </h1>
      </div>
      <div className="text-gray-600 font-medium">
        <p>Developed by</p>
        <p className="text-blue-600">Aniruddh Joshi & Diksha Bargali</p>
      </div>
    </div>
  );
}