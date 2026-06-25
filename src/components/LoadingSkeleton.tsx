/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function EventCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm animate-pulse">
      <div className="w-full h-48 bg-gray-200 dark:bg-slate-800" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-200 dark:bg-slate-800 rounded-lg w-1/3" />
          <div className="h-5 bg-gray-200 dark:bg-slate-800 rounded-lg w-1/4" />
        </div>
        <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded-lg w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-full" />
          <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-5/6" />
        </div>
        <div className="pt-4 border-t border-gray-50 dark:border-slate-800/80 flex justify-between items-center">
          <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-1/3" />
          <div className="h-9 bg-gray-200 dark:bg-slate-800 rounded-lg w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-gray-100 dark:border-slate-800/50">
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-32" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-24" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-20" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-16" /></td>
      <td className="px-6 py-4"><div className="h-6 bg-gray-200 dark:bg-slate-800 rounded-full w-20" /></td>
      <td className="px-6 py-4 text-right"><div className="h-8 bg-gray-200 dark:bg-slate-800 rounded-lg w-16 ml-auto" /></td>
    </tr>
  );
}

export function AnalyticsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-1/2" />
          <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded-lg w-1/3" />
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-slate-800" />
      </div>
      <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-3/4" />
    </div>
  );
}

export default function LoadingSkeleton({ type = 'card', count = 3 }: { type?: 'card' | 'table' | 'analytics'; count?: number }) {
  const arr = Array.from({ length: count });

  if (type === 'table') {
    return (
      <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
        {arr.map((_, i) => <TableRowSkeleton key={i} />)}
      </tbody>
    );
  }

  if (type === 'analytics') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {arr.map((_, i) => <AnalyticsCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {arr.map((_, i) => <EventCardSkeleton key={i} />)}
    </div>
  );
}
