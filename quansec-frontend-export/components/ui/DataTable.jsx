'use client';

import { useState } from 'react';

export default function DataTable({ columns, data }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div className="overflow-x-auto rounded-lg scrollbar-none">
      <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-3.5 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono whitespace-nowrap border-b border-slate-800/40 bg-slate-800/15 first:rounded-tl-lg last:rounded-tr-lg"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr
              key={ri}
              className="transition-colors duration-150"
              style={{ background: hoveredRow === ri ? 'rgba(56,189,248,0.03)' : 'transparent' }}
              onMouseEnter={() => setHoveredRow(ri)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {columns.map((col, ci) => (
                <td
                  key={ci}
                  className={`px-3.5 py-3 text-[12px] text-slate-300 border-b border-slate-800/25 whitespace-nowrap ${
                    col.mono ? 'font-mono text-[11px]' : ''
                  }`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
