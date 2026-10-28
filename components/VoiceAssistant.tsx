'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Send, X, Sparkles, AlertCircle } from 'lucide-react';
import { useSpeech } from '@/lib/useSpeech';
import { API_URL } from '@/lib/api';
import { voiceBus } from './voiceBus';
import { ROUTES, resolveRoutePath, matchRoute } from '@/lib/voiceRoutes';

export default function VoiceAssistant() {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  // Hide on login and register
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'bn'>('en'); // React state only, no localStorage
  const [inputText, setInputText] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);

  const {
    supported,
    listening,
    transcript,
    interimTranscript,
    error: speechError,
    speaking,
    start,
    stop,
    speak,
    cancelSpeak,
    setTranscript,
  } = useSpeech();

  const transcriptRef = useRef('');
  const inputRef = useRef('');
  const isLoadingRef = useRef(loading);
  const isSpeakingRef = useRef(speaking);
  const langRef = useRef(lang);
  const isOpenRef = useRef(isOpen);
  const mutedRef = useRef(muted);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prevSpeakingRef = useRef(false);

  const handleSend = async (queryText?: string) => {
    const spoken = (queryText ?? inputRef.current ?? inputText ?? '').trim();
    if (!spoken) return;

    const action = matchRoute(spoken);
    if (action) {
      console.log('voice action hit', action);
      if (listening) {
        stop();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      setLoading(false);
      setCustomError(null);
      const isBn = langRef.current === 'bn';
      const labelToUse = isBn ? action.labelBn : action.label;

      if (action.type === 'navigate') {
        const replyMsg = `Opening ${labelToUse}`;
        setReply(replyMsg);
        setInputText('');
        inputRef.current = '';
        transcriptRef.current = '';
        setTranscript('');

        if (!mutedRef.current) {
          speak(replyMsg, isBn ? 'bn-BD' : 'en-US');
        }

        router.push(action.path);
        return;
      } else if (action.type === 'scroll') {
        const replyMsg = labelToUse;
        setReply(replyMsg);
        setInputText('');
        inputRef.current = '';
        transcriptRef.current = '';
        setTranscript('');

        if (!mutedRef.current) {
          speak(replyMsg, isBn ? 'bn-BD' : 'en-US');
        }

        if (action.direction === 'down') {
          window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
        } else if (action.direction === 'up') {
          window.scrollBy({ top: -window.innerHeight * 0.75, behavior: 'smooth' });
        } else if (action.direction === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (action.direction === 'bottom') {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
        return;
      } else if (action.type === 'close') {
        const replyMsg = labelToUse;
        setReply(replyMsg);
        setInputText('');
        inputRef.current = '';
        transcriptRef.current = '';
        setTranscript('');

        if (!mutedRef.current) {
          speak(replyMsg, isBn ? 'bn-BD' : 'en-US');
        }

        stop();
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        setIsOpen(false);
        return;
      }
    }

    if (listening) {
      stop();
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    // Extract campaignId if on /campaigns/<id>
    const campaignMatch = pathname.match(/^\/campaigns\/([^/]+)$/);
    const campaignId = campaignMatch ? campaignMatch[1] : undefined;

    setLoading(true);
    setCustomError(null);
    setReply('');
    transcriptRef.current = '';
    setTranscript('');
    setInputText('');
    inputRef.current = '';

    try {
      const res = await fetch(`/api/ai/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: spoken,
          lang: langRef.current === 'bn' ? 'bn' : 'en',
          campaignId,
          page: pathname,
        }),
        credentials: 'include',
      });

      if (res.status === 429) {
        throw new Error('Rate limit reached. Please wait a moment before trying again.');
      }
      if (res.status === 502 || res.status === 503 || res.status === 504) {
        throw new Error('Server is temporarily busy or unavailable. Please try again shortly.');
      }
      if (!res.ok) {
        throw new Error('Failed to get AI response. Please try again.');
      }

      const data = await res.json();
      const aiReply = data.reply || data.message || 'I have processed your request.';
      setReply(aiReply);

      // Speak reply if not muted
      if (!mutedRef.current) {
        speak(aiReply, langRef.current === 'bn' ? 'bn-BD' : 'en-US');
      }

      // Handle server action: resolve target only through ROUTES; ignore unknown keys
      if (data.action && data.action.type === 'navigate') {
        const { target, query } = data.action;
        if (target && ROUTES[target]) {
          const targetPath = resolveRoutePath(target, campaignId, query);
          if (targetPath) {
            router.push(targetPath);
          }
        }
      } else if (data.action && data.action.type === 'scroll') {
        const { direction } = data.action;
        if (direction === 'down') {
          window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
        } else if (direction === 'up') {
          window.scrollBy({ top: -window.innerHeight * 0.75, behavior: 'smooth' });
        } else if (direction === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (direction === 'bottom') {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
      }
    } catch (err: any) {
      setCustomError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
      if (mutedRef.current && isOpenRef.current) {
        setTimeout(() => {
          if (isOpenRef.current && !isLoadingRef.current && !isSpeakingRef.current) {
            start(langRef.current === 'bn' ? 'bn-BD' : 'en-US', handleResult);
          }
        }, 500);
      }
    }
  };

  const sendNow = useCallback((text: string) => {
    console.log('VoiceAssistant sendNow:', text);
    if (!text) return;
    const trimmed = text.trim();
    if (trimmed.length < 2) return;
    if (isLoadingRef.current || isSpeakingRef.current) return;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    stop();

    transcriptRef.current = '';
    setTranscript('');
    setInputText('');
    inputRef.current = '';

    handleSend(trimmed);
  }, [stop, handleSend]);

  const handleResult = useCallback((final: string, interim: string) => {
    console.log('VoiceAssistant onresult:', { final, interim });
    let currentFinal = transcriptRef.current;
    if (final) {
      currentFinal = currentFinal ? `${currentFinal} ${final}` : final;
      transcriptRef.current = currentFinal;
      setTranscript(currentFinal);
    }

    const displayText = currentFinal + (interim ? ` ${interim}` : '');
    setInputText(displayText);
    inputRef.current = displayText;

    if (final) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      sendNow(currentFinal);
    } else if (interim) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      silenceTimerRef.current = setTimeout(() => {
        sendNow(transcriptRef.current);
      }, 600);
    }
  }, [sendNow, setTranscript]);

  // Subscribe to voiceBus for preset questions from other pages
  useEffect(() => {
    const unsubscribe = voiceBus.subscribe((question) => {
      setIsOpen(true);
      isOpenRef.current = true;
      setInputText(question);
      inputRef.current = question;
      handleSend(question);
    });
    return unsubscribe;
  }, [handleSend]);

  // Hands-free loop: after reply is spoken, restart listening
  useEffect(() => {
    if (prevSpeakingRef.current && !speaking) {
      if (isOpenRef.current && !isLoadingRef.current) {
        setTimeout(() => {
          if (isOpenRef.current && !isLoadingRef.current && !isSpeakingRef.current) {
            start(langRef.current === 'bn' ? 'bn-BD' : 'en-US', handleResult);
          }
        }, 300);
      }
    }
    prevSpeakingRef.current = speaking;
  }, [speaking, start, handleResult]);

  // Auto-restart listening if browser stops it due to silence timeout while open
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      if (isOpenRef.current && !listening && !isLoadingRef.current && !isSpeakingRef.current) {
        start(langRef.current === 'bn' ? 'bn-BD' : 'en-US', handleResult);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [isOpen, listening, start, handleResult]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (listening) {
        stop();
      }
    }
    isOpenRef.current = isOpen;
  }, [isOpen, listening, stop]);

  const handleToggleListening = () => {
    if (listening) {
      stop();
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    } else {
      transcriptRef.current = '';
      setTranscript('');
      setInputText('');
      inputRef.current = '';
      start(lang === 'bn' ? 'bn-BD' : 'en-US', handleResult);
    }
  };

  const handleToggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
      stop();
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    } else {
      setIsOpen(true);
      start(lang === 'bn' ? 'bn-BD' : 'en-US', handleResult);
    }
  };

  // Keyboard Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleToggleOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const exampleChips = [
    { label: 'Show technology campaigns', q: 'Show technology campaigns' },
    { label: 'Scroll down / নিচে যাও', q: 'scroll down' },
    { label: 'Take me to my dashboard', q: 'Take me to my dashboard' },
  ];

  return (
    <>
      {/* Floating Mic Button (bottom-right, above back-to-top, 56px, soft gradient, pulsing ring while listening) */}
      <div className="fixed bottom-24 right-6 z-50">
        {listening && (
          <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping pointer-events-none" />
        )}
        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          onClick={handleToggleOpen}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Open Voice Assistant"
        >
          <Mic className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Glass Panel Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            className="fixed bottom-40 right-6 z-50 w-[92vw] max-w-[360px] sm:max-w-[420px] md:max-w-[460px] bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl text-white p-5 flex flex-col gap-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg">AI Voice Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Language Toggle */}
                <button
                  onClick={() => {
                    const nextLang = lang === 'en' ? 'bn' : 'en';
                    setLang(nextLang);
                    langRef.current = nextLang;
                    if (listening) {
                      stop();
                      start(nextLang === 'bn' ? 'bn-BD' : 'en-US', handleResult);
                    }
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors border border-white/10"
                >
                  {lang === 'en' ? 'বাংলা' : 'English'}
                </button>
                <button
                  onClick={handleToggleOpen}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                  aria-label="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Waveform Visualizer & Listening status */}
            {listening && (
              <div className="flex flex-col items-center justify-center py-3 bg-blue-950/40 rounded-xl border border-blue-500/20">
                <div className="flex items-center gap-1.5 h-8 mb-2">
                  {[40, 70, 30, 90, 60, 80, 45].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={shouldReduceMotion ? {} : { height: [`${h}%`, '20%', `${h}%`] }}
                      transition={shouldReduceMotion ? {} : { repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                      className="w-1.5 bg-blue-400 rounded-full"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <p className="text-xs text-blue-300 font-medium">Listening ({lang === 'bn' ? 'বাংলা' : 'English'})...</p>
              </div>
            )}

            {/* Live Transcript / Input Preview */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/10 min-h-[60px] flex flex-col justify-center">
              <span className="text-xs text-gray-400 mb-1">Transcript / Prompt:</span>
              <p className="text-sm text-gray-200">
                {inputText || interimTranscript || (listening ? 'Speak now...' : 'Tap mic or type below')}
              </p>
            </div>

            {/* Assistant Reply (with aria-live) */}
            {(reply || loading || customError || speechError) && (
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-blue-500/30 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Assistant Response
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setMuted(!muted)}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition-colors"
                      title={muted ? 'Unmute speech' : 'Mute speech'}
                    >
                      {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    {speaking && (
                      <button
                        onClick={cancelSpeak}
                        className="px-2 py-0.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-xs text-white transition-colors"
                      >
                        Stop speech
                      </button>
                    )}
                  </div>
                </div>
                <div aria-live="polite" className="text-sm text-gray-100 leading-relaxed">
                  {loading ? (
                    <div className="flex items-center gap-2 text-gray-400 py-1">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  ) : customError || speechError ? (
                    <span className="text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {customError || speechError}
                    </span>
                  ) : (
                    reply
                  )}
                </div>
              </div>
            )}

            {/* Example Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {exampleChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(chip.q);
                    inputRef.current = chip.q;
                    handleSend(chip.q);
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-xs text-gray-300 hover:text-white border border-white/10 transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Text Input with Send & Mic trigger */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleToggleListening}
                className={`p-2.5 rounded-xl border transition-colors ${
                  listening ? 'bg-red-600 border-red-500 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                title={listening ? 'Stop listening' : 'Start microphone'}
              >
                {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <input
                type="text"
                placeholder={lang === 'bn' ? 'কিছু জিজ্ঞেস করুন...' : 'Ask anything...'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                className="flex-grow bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !inputText.trim()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Privacy Note */}
            <p className="text-[10px] text-gray-400 text-center leading-tight pt-1 border-t border-white/5">
              Voice is converted to text by your browser. Only the text is sent to our AI. No audio is stored.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
