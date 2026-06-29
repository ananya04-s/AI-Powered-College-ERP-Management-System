/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

interface ChatbotProps {
  userRole: string;
  userContext?: any;
}

interface Message {
  sender: 'user' | 'athena';
  text: string;
  timestamp: Date;
}

export default function Chatbot({ userRole, userContext }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'athena',
      text: `Hello! I am Athena, the AI ERP Coordinator. How can I assist you in managing university operations, forecasting student progress, or checking schedules today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: "Predict placement probability", prompt: "Can you analyze placement prospects for a student with CGPA 8.4?" },
    { label: "Show low attendance risk", prompt: "Who are the students with attendance below 75%?" },
    { label: "Hostel statistics summary", prompt: "Could you summarize our hostel blocks status?" },
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput('');
    
    const userMsg: Message = { sender: 'user', text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          role: userRole,
          context: userContext,
        }),
      });
      const data = await response.json();
      
      const athenaMsg: Message = {
        sender: 'athena',
        text: data.reply || "I am processing the data logs. How else can I help?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, athenaMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'athena',
          text: "I am having difficulty reaching the central ERP AI engine. However, feel free to browse the manual dashboard reports!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Bubble */}
      <button
        id="athena-chat-bubble"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-amber-400 hover:text-slate-950 hover:bg-amber-400 rounded-full shadow-2xl shadow-slate-900/50 flex items-center justify-center border border-amber-500/20 transition-all duration-300 transform hover:scale-110 group cursor-pointer"
      >
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-slate-950 animate-pulse" />
        <Bot className="w-6 h-6 animate-bounce" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-32 transition-all duration-300 ease-out text-xs font-semibold uppercase tracking-wider pl-0 group-hover:pl-2">
          Athena AI
        </span>
      </button>

      {/* Floating AI Chat Panel */}
      {isOpen && (
        <div 
          id="athena-chat-panel"
          className="fixed bottom-24 right-6 w-96 h-[500px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wider uppercase font-display">Athena AI</h3>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  ERP Coordinator Online
                </span>
              </div>
            </div>
            <button 
              id="athena-chat-close"
              onClick={() => setIsOpen(false)} 
              className="text-slate-400 hover:text-slate-100 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages body */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-slate-900/40">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <div 
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none' 
                      : 'bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 font-mono mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {loading && (
              <div className="self-start flex items-center gap-2 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 rounded-tl-none">
                <span className="text-xs text-amber-400 animate-pulse flex items-center gap-1.5 font-mono">
                  <Bot className="w-3.5 h-3.5 animate-spin" /> Athena thinking...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick recommendations */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/20">
              <span className="text-[10px] text-slate-500 uppercase font-bold font-mono tracking-wider block mb-1.5">Quick Prompts</span>
              <div className="flex flex-col gap-1.5">
                {quickActions.map((act, i) => (
                  <button
                    id={`quick-action-${i}`}
                    key={i}
                    onClick={() => handleSend(act.prompt)}
                    className="w-full text-left text-[11px] text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-800/80 transition-all flex items-center justify-between group"
                  >
                    <span>{act.label}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              id="athena-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Athena AI about university data..."
              className="flex-1 bg-slate-900 text-slate-100 placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500/40"
            />
            <button
              id="athena-send"
              onClick={() => handleSend()}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
