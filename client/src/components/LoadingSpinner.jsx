import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 dark:text-blue-400`} />
      {message && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {message}
        </p>
      )}
    </div>
  );
};

const LoadingPage = ({ message = 'Loading page...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <LoadingSpinner size="lg" message={message} />
    </div>
  );
};

const LoadingSection = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size="md" message={message} />
    </div>
  );
};

export { LoadingSpinner, LoadingPage, LoadingSection };
export default LoadingSpinner;