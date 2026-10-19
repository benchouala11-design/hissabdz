import { Table } from 'lucide-react';

export default function ComparativeTable({
  title = 'Tableau Comparatif Détaillé',
  headers = [],
  rows = [],
  highlightRowIndex = 0,
}) {
  if (!rows || rows.length === 0) return null;

  return (
    <section className="my-10">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
          <Table className="w-5 h-5" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {title}
        </h3>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs uppercase tracking-wider font-semibold">
              {headers.map((h, i) => (
                <th key={i} className="py-3.5 px-4 font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, rIdx) => {
              const isHighlight = rIdx === highlightRowIndex;
              return (
                <tr
                  key={rIdx}
                  className={`transition-colors ${
                    isHighlight
                      ? 'bg-emerald-50/70 font-semibold text-emerald-950'
                      : 'hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="py-3.5 px-4 whitespace-nowrap">
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
