import React from 'react'

interface InputField {
  type: 'input'
  label: string
  inputType: string
  name: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

interface SelectField {
  type: 'select'
  label: string
  name: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

type Field = InputField | SelectField

interface BaseFormProps {
  title: string
  submitLabel: string
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  fields: Field[]
  fieldsOrder: string[]
  className?: string
  children?: React.ReactNode
}

const BaseForm: React.FC<BaseFormProps> = ({
  title,
  submitLabel,
  onSubmit,
  fields,
  fieldsOrder,
  className,
  children,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`p-4 bg-white rounded-lg shadow-md ${className}`}
    >
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {fieldsOrder.map((fieldName, index) => {
        const field = fields.find((f) => f.name === fieldName)
        if (!field) return null

        if (field.type === 'input') {
          return (
            <div key={index} className="mb-4">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              <input
                type={field.inputType}
                id={field.name}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          )
        }

        if (field.type === 'select') {
          return (
            <div key={index} className="mb-4">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {field.options.map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )
        }

        return null
      })}
      {children}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {submitLabel}
      </button>
    </form>
  )
}

export default BaseForm
