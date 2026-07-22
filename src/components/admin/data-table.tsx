"use client";

import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T extends { _id?: string; id?: string }>({
  columns,
  rows,
  emptyMessage = "No items found.",
  loading,
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  emptyMessage?: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border/60 p-10 text-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 p-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60">
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-muted/40 text-left">
            {columns.map((col) => (
              <th key={col.header} className={`px-4 py-3 font-semibold ${col.className || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {rows.map((row) => (
            <tr key={row._id || row.id} className="hover:bg-muted/30">
              {columns.map((col) => (
                <td key={col.header} className={`px-4 py-3 ${col.className || ""}`}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
