'use client';
import { useMemo, useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';

// Helper function to safely get value with fallback
const safeGet = (obj, path, defaultValue = '') => {
  if (!obj) return defaultValue;
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined || result === null) return defaultValue;
  }
  return result;
};

export default function StudentTable({ students = [], onSelectStudent, selectedStudent }) {
  // Add debug logging
  useEffect(() => {
    console.log('StudentTable - Received students:', students);
    if (students.length > 0) {
      console.log('Sample student data:', students[0]);
    }
  }, [students]);

  const data = useMemo(() => students, [students]);
  
  const columns = useMemo(
    () => [
      {
        id: 'StudentID',
        header: 'ID',
        accessorKey: 'StudentID',
        cell: info => info.getValue() || 'N/A',
      },
      {
        id: 'Name',
        header: 'Name',
        accessorKey: 'Name',
        cell: info => info.getValue() || 'Unknown',
      },
      {
        id: 'Class',
        header: 'Class',
        accessorKey: 'Class',
        cell: info => info.getValue() || 'N/A',
      },
      {
        id: 'Assessment_Score',
        header: 'Score',
        accessorKey: 'Assessment_Score',
        cell: info => {
          const value = parseFloat(info.getValue() || 0);
          return Math.round(value * 10) / 10;
        },
      },
      {
        id: 'Persona',
        header: 'Persona',
        accessorKey: 'learning_persona',
        cell: info => `Persona ${(parseInt(info.getValue()) || 0) + 1}`,
      },
    ],
    []
  );

  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    // Ensure the table updates when data changes
    autoResetPageIndex: false,
  });

  const getRowClass = (student) => {
    const isSelected = student && selectedStudent && 
                      (student.student_id === selectedStudent.student_id || 
                       (student.name === selectedStudent.name && 
                        student.class === selectedStudent.class));
    
    return isSelected 
      ? 'bg-blue-50 hover:bg-blue-100 cursor-pointer' 
      : 'hover:bg-gray-50 cursor-pointer';
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search students..."
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="overflow-hidden border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === 'desc' ? ' 🔽' : ' 🔼'
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => {
              const student = row.original;
              return (
                <tr
                  key={row.id}
                  onClick={() => onSelectStudent(student)}
                  className={`cursor-pointer ${getRowClass(student)}`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>
          Showing {table.getRowModel().rows.length} of {students.length} students
        </div>
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 border rounded-md disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 border rounded-md disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
