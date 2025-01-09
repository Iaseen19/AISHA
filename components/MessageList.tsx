'use client';

import { Message } from 'ai';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages = [] }: MessageListProps) {
  if (!Array.isArray(messages)) {
    console.error('Messages prop must be an array');
    return null;
  }

  return (
    <div className="space-y-0 pb-32">
      {messages.map((message, index) => {
        if (!message || typeof message.role !== 'string' || typeof message.content !== 'string') {
          console.error('Invalid message format:', message);
          return null;
        }

        const isUser = message.role === 'user';
        const isSystem = message.role === 'system';

        return (
          <div
            key={index}
            className={`w-full ${
              isSystem ? 'bg-red-50 dark:bg-red-900/10' :
              isUser ? 'bg-white dark:bg-[#343541]' : 'bg-gray-50 dark:bg-[#444654]'
            } py-6`}
          >
            <div className="max-w-3xl mx-auto flex px-4">
              <div className={`w-[30px] h-[30px] rounded-sm mr-4 flex-shrink-0 ${
                isUser ? 'bg-blue-500' : 'bg-green-500'
              } flex items-center justify-center text-white text-sm`}>
                {isUser ? 'U' : 'A'}
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 