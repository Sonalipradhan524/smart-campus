import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Globe, AlertCircle } from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', label: 'English (India)' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)' },
  { code: 'or-IN', label: 'ଓଡ଼ିଆ (Odia)' },
];

/**
 * Reusable Voice-to-Text Microphone Button component using the Web Speech API.
 * 
 * Props:
 * - onTranscript: (text: string) => void (callback receiving recognized text)
 * - currentValue: string (existing field value)
 * - mode: 'append' | 'replace' (default: 'append')
 * - placeholderHint: string
 * - className: string
 * - disabled: boolean
 */
export const VoiceInputButton = ({
  onTranscript,
  currentValue = '',
  mode = 'append',
  className = '',
  disabled = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const recognitionRef = useRef(null);

  const isSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore cleanup error
        }
      }
    };
  }, []);

  const startListening = () => {
    setErrorMessage(null);

    if (!isSupported) {
      setErrorMessage('Voice input is not supported in this browser. Please type directly or use Chrome / Edge.');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const spokenText = event.results[0][0].transcript.trim();
          if (spokenText) {
            let nextVal = spokenText;
            if (mode === 'append' && currentValue && currentValue.trim()) {
              nextVal = `${currentValue.trim()} ${spokenText}`;
            }
            onTranscript(nextVal);
          }
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permission in your browser.');
        } else if (event.error === 'no-speech') {
          // Quietly finish if no speech was detected
        } else if (event.error === 'language-not-supported') {
          // If Odia or specific dialect is not supported on this device, fallback to Hindi/English
          setErrorMessage(`Selected language dialect is not supported on this device. Switching to English.`);
          setSelectedLang('en-IN');
        } else {
          setErrorMessage(`Voice recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setErrorMessage('Unable to start microphone recording.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (disabled) return;
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      {/* Voice Toggle Button */}
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        title={isListening ? 'Click to stop listening' : `Voice input (${SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.label})`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
          isListening
            ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-300'
            : 'bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 border border-slate-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {isListening ? (
          <>
            <MicOff className="w-3.5 h-3.5 text-white animate-bounce" />
            <span className="text-[11px] font-bold">Listening...</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-[11px] font-medium hidden sm:inline">Voice</span>
          </>
        )}
      </button>

      {/* Language Selector Dropdown Toggle */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowLangMenu(!showLangMenu)}
          title="Select speech recognition language"
          className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition text-[10px] font-bold flex items-center gap-0.5"
        >
          <Globe className="w-3 h-3 text-slate-500" />
          <span className="uppercase text-[10px] font-mono">
            {selectedLang.split('-')[0]}
          </span>
        </button>

        {showLangMenu && (
          <div className="absolute right-0 bottom-full mb-1 sm:bottom-auto sm:top-full sm:mt-1 z-30 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 text-xs">
            <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              Select Language
            </div>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setSelectedLang(lang.code);
                  setShowLangMenu(false);
                  if (isListening) {
                    stopListening();
                  }
                }}
                className={`w-full text-left px-2.5 py-1.5 text-[11px] font-medium transition flex items-center justify-between ${
                  selectedLang === lang.code
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{lang.label}</span>
                {selectedLang === lang.code && <span className="text-teal-600">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error / Fallback Notification Toast / Alert */}
      {errorMessage && (
        <div className="absolute left-0 bottom-full mb-2 z-40 w-64 p-2.5 bg-rose-50 border border-rose-200 rounded-xl shadow-md text-rose-800 text-[11px] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{errorMessage}</p>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="mt-1 text-[10px] font-bold text-rose-700 hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
