import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaUser, FaRobot } from 'react-icons/fa';

const HelpChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hi there! Welcome to Sweet Home Online Store. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('helpChatNotificationSeen');
      if (!seen) {
        setNotificationCount(1);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = (text) => {
    const nextId = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { id: nextId, text, sender: 'user', timestamp: new Date() }
    ]);
    setNewMessage('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: 'Thanks for your message! Our assistant will get back to you soon.',
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }, 900);
  };

  const handleSubmit = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
  };

  const handleQuickReply = (reply) => {
    setNewMessage(reply);
    setTimeout(() => sendMessage(reply), 120);
  };

  const quickReplies = ['Track my order', 'Return policy', 'Payment issues', 'Product information'];

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
          <button
            onClick={() => {
              setIsOpen(true);
              setNotificationCount(0);
              if (typeof window !== 'undefined') {
                localStorage.setItem('helpChatNotificationSeen', 'true');
              }
            }}
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-600 text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
            aria-label="Open chat"
          >
            <FaComments className="text-xl" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-h-[70vh] max-w-[calc(100vw-1rem)] flex-col rounded-[26px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.14)] sm:right-6 sm:left-auto sm:bottom-6 sm:w-[20rem] sm:max-h-[70vh] sm:max-w-none">
          <div className="flex items-center justify-between gap-2 rounded-t-[26px] bg-gradient-to-r from-sky-500 via-blue-500 to-violet-600 px-3 py-2 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
                <FaRobot className="text-lg" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Support Assistant</h3>
                <p className="text-[11px] opacity-90">Available 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-white/25 px-2 py-2 text-white transition hover:bg-white/10"
              aria-label="Close chat"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1">
            {messages.map((message) => (
              <div key={message.id} className={message.sender === 'bot' ? 'flex justify-start' : 'flex justify-end'}>
                <div className={message.sender === 'bot'
                  ? 'min-w-[55%] max-w-[82%] rounded-[22px] bg-slate-100 px-3 py-3 text-[14px] leading-snug text-slate-700 shadow-sm sm:max-w-[75%]'
                  : 'min-w-[55%] max-w-[82%] rounded-[22px] bg-sky-500 px-3 py-3 text-[14px] leading-snug text-white shadow-sm sm:max-w-[75%]'}
                >
                  <div className="flex items-center gap-1 mb-1 text-[10px] opacity-80">
                    {message.sender === 'bot' ? <FaRobot className="text-[10px] text-sky-500" /> : <FaUser className="text-[10px] text-white" />}
                    <span className="font-medium text-[10px]">{message.sender === 'bot' ? 'Support' : 'You'}</span>
                  </div>
                  <p className="leading-relaxed break-words text-[14px]">{message.text}</p>
                  <p className="mt-1 text-right text-[10px] opacity-60">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-[20px] bg-slate-100 p-2.5 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-[11px] text-slate-500">
                    <FaRobot className="text-xs text-sky-500" />
                    <span>Support is typing...</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 px-3 py-2">
            <div className="mb-2 flex flex-wrap justify-center gap-1">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleQuickReply(reply)}
                  className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-medium text-slate-700 shadow-sm transition hover:bg-slate-200"
                >
                  {reply}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 rounded-full bg-white p-1">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Type your question..."
                className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                onClick={handleSubmit}
                disabled={!newMessage.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                type="button"
                aria-label="Send message"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpChat;
