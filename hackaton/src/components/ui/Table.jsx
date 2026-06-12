import React from 'react';

export const Table = ({ headers, children, className = '' }) => {
  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-border bg-white shadow-soft ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg border-b border-border">
              {headers.map((header, index) => (
                <th key={index} className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const TableRow = ({ children, className = '' }) => (
  <tr className={`hover:bg-slate-50 transition-colors ${className}`}>
    {children}
  </tr>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 text-sm text-text-main font-medium ${className}`}>
    {children}
  </td>
);
