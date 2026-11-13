import React, { useState } from 'react';
import { CheckCheck, Mic, Paperclip, Send } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getInitials } from '../lib/format';

export const MessagesScreen: React.FC = () => {
  const { chatThreads, sendChatMessage } = useAppStore();
  const [activeThreadId, setActiveThreadId] = useState(chatThreads[0]?.id ?? 'chat-1');
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);

  const activeThread = chatThreads.find((t) => t.id === activeThreadId) ?? chatThreads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || !activeThread) return;
    sendChatMessage(activeThread.id, trimmed);
    setDraft('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
    }, 1600);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Thread Selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {chatThreads.map((th) => {
          const active = th.id === activeThread?.id;
          return (
            <button
              key={th.id}
              type="button"
              onClick={() => setActiveThreadId(th.id)}
              className={`min-h-[44px] px-3.5 py-2 rounded-2xl border text-left shrink-0 transition-colors ${
                active
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900'
                  : 'bg-white dark:bg-[#1B1815] border-stone-200 dark:border-stone-800'
              }`}
            >
              <div className="text-xs font-semibold whitespace-nowrap">{th.name}</div>
              <div className="text-[10px] opacity-75 whitespace-nowrap">{th.context}</div>
            </button>
          );
        })}
      </div>

      {/* Active Conversation */}
      {activeThread && (
        <div className="rounded-3xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col min-h-[430px]">
          <div className="px-4 py-3 border-b border-stone-200/80 dark:border-stone-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#134E4A] text-white flex items-center justify-center font-display text-xs font-semibold">
              {getInitials(activeThread.name)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{activeThread.name}</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                {activeThread.roleLabel}
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[340px]">
            {activeThread.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'me'
                      ? 'bg-[#B45309] text-white rounded-br-sm'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-bl-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.attachmentLabel && (
                    <div className="mt-2 p-2 rounded-xl bg-black/10 dark:bg-white/10 text-[11px] font-medium">
                      {msg.attachmentLabel}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-1 px-1">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-[#134E4A]" />}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-start">
                <div className="px-3.5 py-2 rounded-2xl bg-stone-100 dark:bg-stone-800 text-xs text-stone-500">
                  {activeThread.name.split(' ')[0]} is typing...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="p-2.5 border-t border-stone-200/80 dark:border-stone-800 flex items-center gap-1.5"
          >
            <button
              type="button"
              onClick={() => sendChatMessage(activeThread.id, 'Attached suite photo for custom fit.')}
              aria-label="Attach photo"
              className="min-h-[42px] min-w-[40px] flex items-center justify-center rounded-xl text-stone-500 hover:text-stone-900"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => sendChatMessage(activeThread.id, 'Voice note (0:14) — Check-in ETA 4:30 PM.')}
              aria-label="Send voice note"
              className="min-h-[42px] min-w-[40px] flex items-center justify-center rounded-xl text-stone-500 hover:text-stone-900"
            >
              <Mic className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message concierge or workshop..."
              className="flex-1 min-h-[42px] px-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:border-[#B45309]"
            />
            <button
              type="submit"
              aria-label="Send"
              className="min-h-[42px] min-w-[42px] rounded-xl bg-[#B45309] text-white flex items-center justify-center active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
