import React from 'react';
import { CheckCircle2, Clock, RefreshCw, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const AdminOperationsScreen: React.FC = () => {
  const { housekeeping, toggleHousekeepingStatus, offlineQueue, syncOfflineQueue } =
    useAppStore();

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h1 className="font-display text-xl font-semibold">Housekeeping &amp; Staging Ops</h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Tap any task to cycle status: Scheduled → In Progress → Completed
        </p>
      </div>

      {offlineQueue.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Offline Sync Queue ({offlineQueue.length})</span>
            <button
              type="button"
              onClick={() => syncOfflineQueue()}
              className="px-3 py-1 rounded-lg bg-amber-600 text-white flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync All</span>
            </button>
          </div>
          {offlineQueue.map((q) => (
            <div key={q.id} className="text-[11px] text-stone-600 dark:text-stone-300">
              · {q.action}: {q.detail} ({q.timestamp})
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2.5">
        {housekeeping.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => toggleHousekeepingStatus(task.id)}
            className="w-full p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 text-left active:scale-[0.99]"
          >
            <div className="min-w-0">
              <div className="text-[11px] text-stone-500">
                {task.area} · {task.type} · {task.scheduledTime}
              </div>
              <div className="font-display text-sm font-semibold truncate mt-0.5">
                {task.apartmentName}
              </div>
              <div className="text-xs text-stone-500 mt-0.5">Lead: {task.assignee}</div>
            </div>

            <span
              className={`shrink-0 text-xs font-semibold flex items-center gap-1 ${
                task.status === 'Completed'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : task.status === 'In Progress'
                    ? 'text-[#B45309]'
                    : 'text-stone-500'
              }`}
            >
              {task.status === 'Completed' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : task.status === 'In Progress' ? (
                <Sparkles className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3.5 h-3.5" />
              )}
              <span>{task.status}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
