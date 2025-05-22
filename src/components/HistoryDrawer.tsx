import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { History, ArrowUpRight, X } from 'lucide-react';
import type { EncryptionHistory } from '../utils/types';

interface HistoryDrawerProps {
  history: EncryptionHistory[];
  onSelect: (item: EncryptionHistory) => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function HistoryDrawer({ history, onSelect, isOpen, onOpenChange }: HistoryDrawerProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm transition-opacity z-40"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Toggle Button */}
      <button
        onClick={() => onOpenChange(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-white p-3 shadow-lg rounded-l-lg hover:bg-gray-50 transition-all z-50"
        title="View History"
      >
        <History size={20} className="text-blue-600" />
      </button>

      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out transform z-50 w-96 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold text-gray-800">Encryption History</h3>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <History size={48} className="mx-auto mb-3 opacity-50" />
                <p>No encryption history yet</p>
                <p className="text-sm">Your recent encryptions will appear here</p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="p-4 bg-white border rounded-xl hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-800">{item.algorithm}</span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 truncate">{item.inputPreview}</p>
                    <div className="flex items-center gap-1 text-blue-600">
                      <ArrowUpRight size={16} />
                      <p className="text-sm truncate group-hover:text-blue-700 transition-colors">
                        {item.outputPreview}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}