import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ 
  title = 'Bir Hata Oluştu',
  message = 'Veriler yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.',
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <FiAlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="btn-primary"
        >
          Tekrar Dene
        </button>
      )}
    </div>
  );
}
