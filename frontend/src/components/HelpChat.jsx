import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaUser, FaRobot, FaSmile } from 'react-icons/fa';

const HelpChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: 'Hi there! Welcome to Sweet Home Online Store! How can I help you today?',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const addMessage = (message) => {
        setMessages((prev) => [...prev, message]);
    };

    const handleSendMessage = () => {
        const trimmed = newMessage.trim();
        if (!trimmed) return;

        addMessage({
            id: messages.length + 1,
            text: trimmed,
            sender: 'user',
            timestamp: new Date()
        });

        setNewMessage('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            addMessage({
                id: messages.length + 2,
                text: 'Thanks for your message! Our AI assistant will respond shortly.',
                sender: 'bot',
                timestamp: new Date()
            });
        }, 1400);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const quickReplies = [
        'Track my order',
        'Return policy',
        'Payment issues',
        'Product information'
    ];

    const handleQuickReply = (reply) => {
        setNewMessage(reply);
        setTimeout(handleSendMessage, 120);
    };

    return (
        <>
            <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
                <button
                    onClick={() => setIsOpen((open) => !open)}
                    className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-600 text-white shadow-lg"
                    aria-label={isOpen ? 'Close chat' : 'Open chat'}
                >
                    {isOpen ? <FaTimes className="text-xl" /> : <FaComments className="text-xl" />}
                    {!isOpen && messages.length > 1 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                            {messages.filter((message) => message.sender === 'bot').length}
                        </span>
                    )}
                </button>
            </div>

            {isOpen && (
                <div className="fixed bottom-20 left-4 right-4 z-40 flex w-full max-w-[24rem] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl sm:bottom-24 sm:right-6 sm:left-auto sm:w-[24rem] sm:h-[30rem] sm:max-w-none md:right-8 lg:right-10">
                    <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-sky-500 to-violet-600 p-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                <FaRobot className="text-base" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold">Support Assistant</h3>
                                <p className="text-[11px] opacity-90">Available 24/7</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-full border border-white/20 px-2 py-2 text-sm transition hover:bg-white/10"
                            aria-label="Close chat"
                        >
                            <FaTimes className="text-sm" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={message.sender === 'bot' ? 'flex justify-start' : 'flex justify-end'}
                            >
                                <div
                                    className={
                                        message.sender === 'bot'
                                            ? 'w-full max-w-[80%] rounded-3xl bg-slate-100 p-3 text-slate-700 shadow-sm sm:max-w-[78%]'
                                            : 'w-full max-w-[80%] ml-auto rounded-3xl bg-sky-500 p-3 text-white shadow-sm sm:max-w-[78%]'
                                    }
                                >
                                    <div className="flex items-center gap-2 mb-1 text-[11px] opacity-80">
                                        {message.sender === 'bot' ? (
                                            <FaRobot className="text-xs text-sky-500" />
                                        ) : (
                                            <FaUser className="text-xs text-white" />
                                        )}
                                        <span>{message.sender === 'bot' ? 'Support' : 'You'}</span>
                                    </div>
                                    <p className="leading-relaxed">{message.text}</p>
                                    <p className="mt-2 text-right text-[10px] opacity-60">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="rounded-[24px] bg-slate-100 p-3 shadow-sm">
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

                    <div className="border-t border-slate-200 px-4 py-3">
                        <div className="mb-3 flex flex-wrap gap-2">
                            {quickReplies.map((reply) => (
                                <button
                                    key={reply}
                                    onClick={() => handleQuickReply(reply)}
                                    className="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-200"
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 shadow-sm transition duration-200 focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-100">
                            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition hover:bg-slate-100" type="button" aria-label="Add emoji">
                                <FaSmile className="text-lg" />
                            </button>
                            <input
                                ref={inputRef}
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your question..."
                                className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                className={
                                    newMessage.trim()
                                        ? 'flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg transition hover:from-sky-600 hover:to-indigo-700'
                                        : 'flex h-11 w-11 items-center justify-center rounded-full bg-slate-300 text-slate-500 transition'
                                }
                                type="button"
                                aria-label="Send message"
                            >
                                <FaPaperPlane className="text-base" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HelpChat;
