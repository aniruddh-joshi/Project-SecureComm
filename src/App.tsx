import React from 'react';
import Header from './components/Header';
import EncryptionForm from './components/EncryptionForm';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <Header />
        <div className="flex items-center justify-center">
          <EncryptionForm />
        </div>
      </div>
    </div>
  );
}

export default App;