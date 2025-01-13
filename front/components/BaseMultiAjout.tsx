'use client'
import React, { useRef, useEffect } from 'react'
import { AutoComplete, type Option } from '@/components/autoComplete'

interface BaseMultiAjoutProps {
  typeAjout: string
  submitLabel: string
  rows: { [key: string]: string }[]
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    fieldName: string,
  ) => void
  addRow: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  className?: string
  options: { [key: string]: Option[] }
}

const BaseMultiAjout: React.FC<BaseMultiAjoutProps> = ({
  typeAjout,
  submitLabel,
  rows,
  onChange,
  addRow,
  onSubmit,
  className,
  options,
}) => {
  const scrollableContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop =
        scrollableContainerRef.current.scrollHeight
    }
  }, [rows])

  return (
    <form
      onSubmit={onSubmit}
      className={`p-4 mt-2 bg-white rounded-lg shadow-md ${className}`}
    >
      <div ref={scrollableContainerRef} className='max-h-96'>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className='flex flex-wrap space-x-4 mb-4 p-2 border-b-2 items-center'
          >
            <div className='flex items-center'>
              <span className='font-bold'>{`${typeAjout} ${rowIndex + 1} :`}</span>
            </div>
            {Object.keys(row).map((fieldName, fieldIndex) => (
              <div key={fieldIndex} className='flex-1 min-w-[150px]'>
                <label
                  htmlFor={`${fieldName}-${rowIndex}`}
                  className='block text-sm font-medium text-gray-700'
                >
                  {fieldName}
                </label>
                <AutoComplete
                  options={options[fieldName]}
                  value={options[fieldName].find(
                    (option) => option.value === row[fieldName],
                  )}
                  onValueChange={(selectedOption) => {
                    const syntheticEvent = {
                      target: {
                        value: selectedOption.value,
                      },
                    } as React.ChangeEvent<HTMLInputElement>
                    onChange(syntheticEvent, rowIndex, fieldName)
                  }}
                  placeholder={`Select ${fieldName}`}
                  emptyMessage='No results.'
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className='flex justify-between mt-4'>
        <button
          type='button'
          onClick={addRow}
          className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          Ajouter une ligne
        </button>
        <button
          type='submit'
          className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

export default BaseMultiAjout
