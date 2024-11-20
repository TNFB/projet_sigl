import React from 'react';

interface InputField {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface BaseFormProps {
  title: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  inputFields: InputField[];
  className?: string;
}

const BaseForm: React.FC<BaseFormProps> = ({ title, onSubmit, inputFields, className }) => {
  return (
    <form onSubmit={onSubmit} className={`p-4 bg-white rounded-lg shadow-md ${className}`}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {inputFields.map((field, index) => (
        <div key={index} className="mb-4">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit
      </button>
    </form>
  );
};

export default BaseForm;