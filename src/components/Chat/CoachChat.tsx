import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import { COACH_PERSONAS } from '../../data/initialData';
import { CoachPersona, ChatMessage, EvidenceEntry } from '../../types';

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
    // Add an introduction message if switching
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
      // Format messages for server API
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
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        text: data.reply || "I'm reflecting on your insight. How does this land with you?",
        timestamp: Date.now(),
        personaId: selectedPersona.id,
        modelUsed: modelChoice,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(err.message || 'Unable to connect to AI Mindset Coach.');
      // Add a friendly error bubble
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          text: `⚠️ **Connection Note**: ${err.message || 'Could not fetch a response from Gemini.'}\n\nPlease check your GEMINI_API_KEY or connection and try again.`,
          timestamp: Date.now(),
          personaId: selectedPersona.id,
        },
      ]);
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const saveInsight = (msg: ChatMessage) => {
    if (!onSaveInsightToEvidence) return;
    const titleSnippet = msg.text.slice(0, 50).replace(/[#*]/g, '').trim() + '...';
    onSaveInsightToEvidence({
      title: `Insight from ${selectedPersona.name}`,
      category: 'growth',
      description: msg.text,
      date: 'Today',
      strengthTag: 'Mindset Realization',
    });
    setSavedId(msg.id);
    setTimeout(() => setSavedId(null), 2500);
  };

  const clearChat = () => {
    if (window.confirm('Reset conversation history with your mentors?')) {
      const resetMsg: ChatMessage = {
        id: `msg-reset-${Date.now()}`,
        role: 'assistant',
        text: `Fresh slate initiated with **${selectedPersona.name}**. What goal, feeling, or barrier is front of mind right now?`,
        timestamp: Date.now(),
        personaId: selectedPersona.id,
      };
      setMessages([resetMsg]);
      localStorage.removeItem('beliefcraft_chat_history');
    }
  };

  const getPersonaIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return Brain;
      case 'Flame':
        return Flame;
      case 'Sparkles':
        return Sparkles;
      case 'Target':
        return Target;
      default:
        return Bot;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Top Banner & Persona Picker */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 mb-6 text-stone-100 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Multi-Turn Mentorship
              </span>
              <span className="text-xs text-stone-400">Powered by Gemini</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-['Outfit'] mt-1">
              AI Mindset & Self-Belief Coach
            </h1>
            <p className="text-xs md:text-sm text-stone-400 mt-0.5">
              Engage with specialized psychological frameworks to dismantle limiting narratives and elevate life quality.
            </p>
          </div>

          {/* Model Selector & Reset */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <div className="flex items-center bg-stone-800/90 rounded-lg p-1 border border-stone-700">
              <button
                onClick={() => setModelChoice('gemini-3.8-flash')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  modelChoice === 'gemini-3.8-flash'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-300 hover:text-stone-100'
                }`}
                title="Deep reasoning & nuanced psychological reframing"
              >
                <Sparkles className="w-3 h-3" />
                <span>3.8 Flash (Deep)</span>
              </button>
              <button
                onClick={() => setModelChoice('gemini-3.1-flash-lite')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  modelChoice === 'gemini-3.1-flash-lite'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-300 hover:text-stone-100'
                }`}
                title="Ultra-fast quick advice"
              >
                <Zap className="w-3 h-3" />
                <span>Lite (Fast)</span>
              </button>
            </div>

            <button
              onClick={clearChat}
              id="clear-chat-btn"
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700/80 text-stone-400 hover:text-rose-300 transition-colors"
              title="Reset conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Persona Selectors */}
        <div className="pt-4">
          <p className="text-xs font-medium text-stone-400 mb-2 uppercase tracking-wider">
            Choose Your Specialized Mentor:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {COACH_PERSONAS.map((persona) => {
              const isSelected = selectedPersona.id === persona.id;
              const Icon = getPersonaIcon(persona.avatarIcon);
              return (
                <button
                  key={persona.id}
                  id={`persona-btn-${persona.id}`}
                  onClick={() => handlePersonaChange(persona)}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500/80 text-amber-200 ring-1 ring-amber-500/50 shadow-sm'
                      : 'bg-stone-800/50 border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:border-stone-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-700 text-stone-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-stone-100 truncate">
                        {persona.name}
                      </span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-700/60 text-stone-300 font-medium">
                      {persona.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 line-clamp-2 mt-1 leading-snug">
                    {persona.tagline}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Chat Stream Container */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl shadow-xl flex flex-col h-[580px] overflow-hidden">
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
                  className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    isUser
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-800 border border-stone-700 text-amber-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`group relative rounded-2xl p-4 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-amber-600 text-stone-950 font-medium rounded-tr-none shadow-md'
                      : 'bg-stone-800/90 text-stone-100 border border-stone-700/70 rounded-tl-none shadow-sm'
                  }`}
                >
                  {/* Markdown Renderer for Assistant, standard text for user */}
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="prose prose-invert prose-stone max-w-none text-stone-100 space-y-2 text-sm leading-relaxed">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}

                  {/* Message Footnotes / Action Bar */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/10 dark:border-stone-700/50 text-[10px] text-stone-400 opacity-80">
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {!isUser && (
                      <div className="flex items-center gap-1.5">
                        {/* Copy Button */}
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="hover:text-stone-200 p-1 transition-colors"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>

                        {/* Save to Evidence Ledger Button */}
                        {onSaveInsightToEvidence && (
                          <button
                            onClick={() => saveInsight(msg)}
                            className="flex items-center gap-1 hover:text-amber-300 p-1 transition-colors"
                            title="Save insight to Evidence Locker"
                          >
                            {savedId === msg.id ? (
                              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> Saved
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5">
                                <BookmarkPlus className="w-3 h-3" /> Save Insight
                              </span>
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

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="w-8 h-8 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-stone-800/90 text-stone-300 border border-stone-700/80 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2 text-xs">
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                <span>{selectedPersona.name} is formulating a mindful reframe...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Starters Suggestions */}
        <div className="px-4 py-2 bg-stone-950/60 border-t border-stone-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-stone-400 flex items-center gap-1 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-amber-400" /> Prompts:
          </span>
          {selectedPersona.promptStarters.map((starter, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(starter)}
              disabled={isLoading}
              className="text-[11px] bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-200 border border-stone-700 rounded-full px-3 py-1 whitespace-nowrap transition-colors disabled:opacity-50"
            >
              {starter}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-stone-900 border-t border-stone-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 bg-stone-800 rounded-xl border border-stone-700 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
              <textarea
                ref={inputRef}
                id="coach-chat-input"
                rows={2}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${selectedPersona.name} about self-doubt, courage, daily energy, or habits... (Shift+Enter for newline)`}
                className="w-full bg-transparent text-stone-100 placeholder-stone-400 text-sm px-3.5 py-2.5 resize-none focus:outline-none scrollbar-thin"
              />
            </div>

            <button
              type="submit"
              id="send-chat-btn"
              disabled={!inputMessage.trim() || isLoading}
              className="h-11 px-4 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-500 text-stone-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-950/30"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline text-xs">Send</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-[10px] text-stone-400 mt-2 text-center flex items-center justify-center gap-1">
            <Info className="w-3 h-3" />
            <span>Ascend AI provides cognitive coaching & growth mindset strategies for self-development.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
