import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  BookmarkPlus,
  Copy,
  Check,
  Brain,
  Flame,
  Target,
  Loader2,
  Zap,
  Cpu
} from 'lucide-react';
import { COACH_PERSONAS } from '../../data/initialData';
import { CoachPersona, ChatMessage, EvidenceEntry } from '../../types';
import { GlowCard } from '../ui/GlowCard';
import { SPRINGS } from '../../styles/tokens';

interface CoachChatProps {
  onSaveInsightToEvidence?: (entry: Omit<EvidenceEntry, 'id'>) => void;
}

export const CoachChat: React.FC<CoachChatProps> = ({ onSaveInsightToEvidence }) => {
  const [selectedPersona, setSelectedPersona] = useState<CoachPersona>(COACH_PERSONAS[0]);
  const [modelChoice, setModelChoice] = useState<string>('gemini-3.8-flash');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('beliefcraft_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        text: `Welcome to your safe sanctuary for growth. I am **${COACH_PERSONAS[0].name}**, your ${COACH_PERSONAS[0].title}.

How is your internal dialogue feeling today? Are you grappling with any self-doubt, perfectionism, or life choices? What can we untangle together?`,
        timestamp: Date.now(),
        personaId: COACH_PERSONAS[0].id,
      },
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Persist chat history
  useEffect(() => {
    localStorage.setItem('beliefcraft_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handlePersonaChange = (persona: CoachPersona) => {
    setSelectedPersona(persona);
    const introMsg: ChatMessage = {
      id: `msg-switch-${Date.now()}`,
      role: 'assistant',
      text: `Hello, I am **${persona.name}** (${persona.title}). ${persona.tagline}\n\nI am here to support your self-belief and life quality. Where shall we direct our attention?`,
      timestamp: Date.now(),
      personaId: persona.id,
    };
    setMessages((prev) => [...prev, introMsg]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputMessage).trim();
    if (!content || isLoading) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      text: content,
      timestamp: Date.now(),
      personaId: selectedPersona.id,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      const formattedForApi = newHistory.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedForApi,
          systemInstruction: selectedPersona.systemInstruction,
          model: modelChoice,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to receive guidance from the mentor.');
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `msg-assistant-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'Let us reflect on this deeply. What is the next smallest empirical step?',
        timestamp: Date.now(),
        personaId: selectedPersona.id,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(err.message || 'Connection lost with mentor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    const freshWelcome: ChatMessage = {
      id: `msg-welcome-${Date.now()}`,
      role: 'assistant',
      text: `Dialogue refreshed. I am **${selectedPersona.name}**. What breakthrough shall we focus on today?`,
      timestamp: Date.now(),
      personaId: selectedPersona.id,
    };
    setMessages([freshWelcome]);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const saveToEvidenceLocker = (msgText: string, id: string) => {
    if (!onSaveInsightToEvidence) return;
    const cleanSnippet = msgText.replace(/[#*`]/g, '').slice(0, 180);
    onSaveInsightToEvidence({
      title: `Insight with ${selectedPersona.name}`,
      category: 'growth',
      description: cleanSnippet,
      date: 'Today',
      strengthTag: 'Self-Coaching Insight',
    });
    setSavedId(id);
    setTimeout(() => setSavedId(null), 2500);
  };

  const getPersonaIcon = (avatarIcon: string) => {
    switch (avatarIcon) {
      case 'Brain':
        return Brain;
      case 'Flame':
        return Flame;
      case 'Target':
        return Target;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* 21st.dev Top Control Header */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0e1117]/80 backdrop-blur-xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Gemini Mentorship</span>
              </span>
              <span className="text-xs text-stone-400">Psychological Safety & Growth</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white">
              AI Mindset & Life Sanctuary
            </h1>
          </div>

          {/* Model Switcher & Reset */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center bg-[#131722] p-1 rounded-2xl border border-white/[0.08]">
              <button
                onClick={() => setModelChoice('gemini-3.8-flash')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  modelChoice === 'gemini-3.8-flash'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Gemini 3.8 Flash for nuanced mindset and CBT coaching"
              >
                <Sparkles className="w-3 h-3" />
                <span>Deep Wisdom</span>
              </button>

              <button
                onClick={() => setModelChoice('gemini-3.1-flash-lite')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  modelChoice === 'gemini-3.1-flash-lite'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Ultra-fast quick advice"
              >
                <Zap className="w-3 h-3" />
                <span>Lite (Fast)</span>
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={clearChat}
              id="clear-chat-btn"
              className="p-2.5 rounded-2xl bg-[#131722] hover:bg-[#1a202e] text-stone-400 hover:text-rose-400 border border-white/[0.08] transition-colors"
              title="Reset conversation"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Persona Selectors */}
        <div>
          <p className="text-[11px] font-bold text-stone-400 mb-2 uppercase tracking-wider">
            Choose Your Dedicated Mentor:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {COACH_PERSONAS.map((persona) => {
              const isSelected = selectedPersona.id === persona.id;
              const Icon = getPersonaIcon(persona.avatarIcon);
              return (
                <motion.button
                  key={persona.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePersonaChange(persona)}
                  className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-[#181d2a] border-amber-500/60 text-white shadow-lg shadow-amber-950/20 ring-1 ring-amber-500/40'
                      : 'bg-[#11141c]/60 border-white/[0.06] text-stone-300 hover:bg-[#141824]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-amber-500 text-stone-950 shadow-sm' : 'bg-white/[0.06] text-stone-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white truncate">
                        {persona.name}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-stone-300 font-medium">
                      {persona.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                    {persona.tagline}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Chat Stream Container */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0e1117]/80 backdrop-blur-xl shadow-2xl flex flex-col h-[580px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth"
          id="chat-messages-thread"
        >
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    isUser
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'bg-[#141824] border border-white/[0.08] text-amber-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`group relative rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-medium rounded-tr-none shadow-md'
                      : 'bg-[#121622]/90 text-stone-100 border border-white/[0.08] rounded-tl-none shadow-sm'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="prose prose-invert prose-stone max-w-none text-stone-100 space-y-2 text-xs sm:text-sm leading-relaxed">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}

                  {/* Footnotes & Actions */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/10 dark:border-white/[0.06] text-[10px] text-stone-400 opacity-80">
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {!isUser && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="hover:text-white p-1 transition-colors"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>

                        {onSaveInsightToEvidence && (
                          <button
                            onClick={() => saveToEvidenceLocker(msg.text, msg.id)}
                            className="hover:text-amber-300 p-1 transition-colors flex items-center gap-1"
                            title="Save as proof to Evidence Locker"
                          >
                            {savedId === msg.id ? (
                              <Check className="w-3 h-3 text-amber-400" />
                            ) : (
                              <BookmarkPlus className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-[#141824] border border-white/[0.08] text-amber-400 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              </div>
              <div className="bg-[#121622]/90 border border-white/[0.08] rounded-2xl rounded-tl-none p-3.5 text-xs text-stone-400 flex items-center gap-2">
                <span>{selectedPersona.name} is synthesizing cognitive guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-4 py-2.5 bg-[#0a0c12] border-t border-white/[0.06] overflow-x-auto flex items-center gap-2 scrollbar-none">
          <span className="text-[10px] uppercase font-bold text-stone-500 whitespace-nowrap">
            Catalysts:
          </span>
          {selectedPersona.promptStarters.map((prompt, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] text-stone-300 hover:text-white bg-[#141824] hover:bg-[#1a2030] border border-white/[0.06] hover:border-amber-500/30 rounded-full px-3 py-1 whitespace-nowrap transition-colors"
            >
              {prompt}
            </motion.button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-[#0e1117] border-t border-white/[0.08]">
          <div className="flex items-end gap-2 bg-[#080a0f] border border-white/[0.1] focus-within:border-amber-400/80 rounded-2xl p-2 transition-colors">
            <textarea
              ref={inputRef}
              rows={2}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Share what you are feeling with ${selectedPersona.name}... (Press Enter to send)`}
              className="flex-1 bg-transparent text-white placeholder-stone-500 text-xs sm:text-sm px-2 py-1 resize-none focus:outline-none"
            />

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-40 text-stone-950 font-bold transition-all shadow-md shadow-amber-950/40"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
