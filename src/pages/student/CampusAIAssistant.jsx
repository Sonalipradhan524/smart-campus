import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Sparkles, Send, User, Bot, ArrowRight, CornerDownLeft } from 'lucide-react';

export const CampusAIAssistant = () => {
  const { getAIResponse } = useData();

  const [inputMsg, setInputMsg] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'bot',
      text: `Hello Sonali! 👋 I'm **CampusAI**, your smart university assistant powered by Gemini. How can I help simplify your campus life today?`,
    },
  ]);

  const suggestedPrompts = [
    'How can I apply for a gate pass?',
    'Show my pending requests.',
    'When is my next class?',
    'How do I request a certificate?',
    'Report a hostel complaint.',
    'What is today\'s mess menu?',
  ];

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMsg;
    if (!query.trim() || isThinking) return;

    const userMsgObj = { id: `u-${Date.now()}`, sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsgObj]);
    setInputMsg('');
    setIsThinking(true);

    try {
      const aiReply = await getAIResponse(query);
      const botMsgObj = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: aiReply.response,
        actionLink: aiReply.actionLink,
        actionLabel: aiReply.actionLabel,
        poweredBy: aiReply.poweredBy,
      };
      setMessages((prev) => [...prev, botMsgObj]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: 'CampusAI is currently experiencing connection issues. Please try again shortly.',
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      <PageHeader
        title="CampusAI Intelligent Assistant"
        subtitle="24/7 smart assistant for instant campus navigation, permits, and service shortcuts."
        badge="AI Powered"
      />

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'bot' && (
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-lg p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-tr-xs'
                    : 'bg-slate-100/80 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {m.poweredBy && (
                  <div className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-200/50 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-500" /> Powered by {m.poweredBy}
                  </div>
                )}

                {m.actionLink && (
                  <div className="pt-2">
                    <Link
                      to={m.actionLink}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-bold shadow-xs transition"
                    >
                      <span>{m.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-9 h-9 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-md flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-start gap-3 justify-start animate-pulse">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-100/80 text-slate-600 border border-slate-200/80 p-3.5 rounded-2xl rounded-tl-xs text-xs font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
                <span>CampusAI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompts Pills */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-600" /> Suggested Prompts
          </p>
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                disabled={isThinking}
                onClick={() => handleSendMessage(p)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-xs font-medium whitespace-nowrap transition disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMsg}
            disabled={isThinking}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Ask CampusAI about gate passes, complaints, mess menu..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm outline-none focus:bg-white focus:border-blue-500 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isThinking || !inputMsg.trim()}
            className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:opacity-95 shadow-md shadow-blue-500/20 transition flex-shrink-0 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
