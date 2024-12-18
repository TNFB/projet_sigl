'use client'
import React, { useRef, useEffect } from 'react';

interface BaseMultiAjoutProps {
  title: string;
  typeAjout: string;
  submitLabel: string;
  rows: { [key: string]: string }[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>, rowIndex: number, fieldName: string) => void;
  addRow: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

const BaseMultiAjout: React.FC<BaseMultiAjoutProps> = ({ title, typeAjout, submitLabel, rows, onChange, addRow, onSubmit, className }) => {
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
    }
  }, [rows]);

  const getInputSize = (fieldName: string) => {
    switch (fieldName) {
      case 'nom':
        return 8;
      case 'prenom':
        return 10;
      case 'email':
        return 25;
      default:
        return 20;
    }
  };

  return (
    <form onSubmit={onSubmit} className={`p-4 bg-white rounded-lg shadow-md ${className}`}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div ref={scrollableContainerRef} className="max-h-96 overflow-y-auto">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex space-x-4 mb-4 p-2 border-b-2 items-center">
            <div className="flex items-center">
              <span className="font-bold pt-5">{`${typeAjout} ${rowIndex + 1} :`}</span>
            </div>
            {Object.keys(row).map((fieldName, fieldIndex) => (
              <div key={fieldIndex} className="flex-1">
                <label htmlFor={`${fieldName}-${rowIndex}`} className="block text-sm font-medium text-gray-700">
                  {fieldName}
                </label>
                <input
                  type="text"
                  id={`${fieldName}-${rowIndex}`}
                  name={fieldName}
                  value={row[fieldName]}
                  onChange={(e) => onChange(e, rowIndex, fieldName)}
                  size={getInputSize(fieldName)}
                  className="mt-1 block text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mb-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        +
      </button>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default BaseMultiAjout;