import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const NotificationsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markNotificationRead } = useAppStore();

  return (
    <div className="space-y-3 pb-8">
      {notifications.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <Bell className="w-7 h-7 mx-auto text-stone-400" />
          <p className="font-display text-base font-semibold">All caught up</p>
        </div>
      ) : (
        notifications.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => {
              markNotificationRead(n.id);
              navigate(n.deepLink);
            }}
            className={`w-full p-4 rounded-2xl border text-left transition-colors flex items-start gap-3 ${
              n.read
                ? 'bg-white/60 dark:bg-[#1B1815]/60 border-stone-200/70 dark:border-stone-800/70'
                : 'bg-white dark:bg-[#1B1815] border-[#B45309]/40 shadow-sm'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-[#B45309]/10 text-[#B45309] flex items-center justify-center shrink-0 mt-0.5">
              {n.read ? <CheckCircle2 className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold truncate">{n.title}</span>
                <span className="text-[10px] text-stone-500 shrink-0">{n.timestamp}</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                {n.body}
              </p>
            </div>
          </button>
        ))
      )}
    </div>
  );
};
