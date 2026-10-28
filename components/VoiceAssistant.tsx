'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Send, X, Sparkles, AlertCircle } from 'lucide-react';
import { useSpeech } from '@/lib/useSpeech';
import { API_URL } from '@/lib/api';
import { voiceBus } from './voiceBus';
import { ROUTES, matchRoute } from '@/lib/voiceRoutes';
import { useSession } from '@/lib/auth-client';
import { takePageSnapshot } from '@/lib/pageSnapshot';
import { executeActions } from '@/lib/agentActions';

export default function VoiceAssistant() {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const { data: session } = useSession();

  const role = session?.user?.role ? session.user.role.toLowerCase().trim() : 'supporter';

  // Hide on login and register
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [inputText, setInputText] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const [autoListen, setAutoListen] = useState(true);
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');

  const {
    speaking,
    speak,
    cancelSpeak,
    setTranscript,
  } = useSpeech();

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef('');
  const inputRef = useRef('');
  const isLoadingRef = useRef(loading);
  const isSpeakingRef = useRef(speaking);
  const langRef = useRef(lang);
  const isOpenRef = useRef(isOpen);
  const mutedRef = useRef(muted);
  const autoListenRef = useRef(autoListen);
  const roleRef = useRef(role);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const confirmationResolverRef = useRef<((confirmed: boolean) => void) | null>(null);

  useEffect(() => {
    isLoadingRef.current = loading;
    isSpeakingRef.current = speaking;
    langRef.current = lang;
    isOpenRef.current = isOpen;
    mutedRef.current = muted;
    autoListenRef.current = autoListen;
    roleRef.current = role;
  }, [loading, speaking, lang, isOpen, muted, autoListen, role]);

  const requestConfirmation = useCallback((label: string): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmationResolverRef.current = resolve;
      setTimeout(() => {
        if (confirmationResolverRef.current === resolve) {
          confirmationResolverRef.current = null;
          resolve(false);
        }
      }, 8000);
    });
  }, []);

  const startListening = useCallback((targetLang: 'en' | 'bn', onResultCb: (alternatives: string[], interim: string) => void) => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setCustomError('Speech recognition is not supported in this browser.');
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 5;
    recognition.lang = targetLang === 'bn' ? 'bn-BD' : 'en-US';

    recognition.onstart = () => {
      setListening(true);
      setCustomError(null);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let finalAlternatives: string[] = [];

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const res = event.results[i];
        if (res.isFinal) {
          for (let j = 0; j < res.length; j++) {
            const alt = res[j]?.transcript?.trim();
            if (alt && !finalAlternatives.includes(alt)) {
              finalAlternatives.push(alt);
            }
          }
        } else {
          if (res[0]?.transcript) {
            interim += res[0].transcript;
          }
        }
      }

      if (finalAlternatives.length > 0) {
        onResultCb(finalAlternatives, interim);
      } else if (interim) {
        setInterimTranscript(interim);
      }
    };

    recognition.onerror = (e: any) => {
      setCustomError(`Speech error: ${e.error}`);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      try {
        recognition.stop();
        recognition.start();
      } catch (ex) {}
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setListening(false);
  }, []);

  // Continuous conversation listening loop
  useEffect(() => {
    if (isOpen && autoListen && !loading && !speaking && !listening) {
      const timer = setTimeout(() => {
        if (isOpenRef.current && autoListenRef.current && !isLoadingRef.current && !isSpeakingRef.current && !listening) {
          startListening(langRef.current, handleResult);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoListen, loading, speaking, listening, startListening]);

  const callAgentStep = async (transcripts: string[], step: number) => {
    if (step > 3) return;

    const campaignMatch = pathname.match(/^\/campaigns\/([^/]+)$/);
    const campaignId = campaignMatch ? campaignMatch[1] : undefined;
    const { elements, elementMap } = takePageSnapshot();

    const routesSummary = Object.entries(ROUTES)
      .map(([k, r]) => `Key: "${k}", Path: "${r.path}", EN: [${r.en?.join(', ') || ''}], BN: [${r.bn?.join(', ') || ''}]`)
      .join('\n');

    try {
      const res = await fetch(`${API_URL}/api/ai/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcripts,
          lang: langRef.current,
          page: pathname,
          role: roleRef.current,
          elements,
          routes: routesSummary,
          step,
        }),
        credentials: 'include',
      });

      if (res.status === 429 || res.status === 502 || res.status === 503 || res.status === 504 || !res.ok) {
        let retrySecs = 5;
        const dataJson = await res.json().catch(() => ({}));
        if (dataJson.retryAfterSeconds) {
          retrySecs = dataJson.retryAfterSeconds;
        }
        throw new Error(`AI_UNAVAILABLE (retry in ${retrySecs}s)`);
      }

      const data = await res.json();
      const aiReply = data.reply || (langRef.current === 'bn' ? 'অনুরোধটি প্রক্রিয়া করা হয়েছে।' : 'Request processed.');
      setReply(aiReply);

      if (!mutedRef.current) {
        speak(aiReply, langRef.current === 'bn' ? 'bn-BD' : 'en-US');
      }

      if (data.actions && Array.isArray(data.actions) && data.actions.length > 0) {
        await executeActions(data.actions, {
          elementMap,
          router,
          speak: (txt, l) => { if (!mutedRef.current) speak(txt, l); },
          lang: langRef.current,
          campaignId,
          requestConfirmation,
        });
      }

      if (data.needsMore && step < 3) {
        await new Promise(r => setTimeout(r, 800));
        await callAgentStep(transcripts, step + 1);
      }
    } catch (err: any) {
      const isUnavailable = err.message?.includes('AI_UNAVAILABLE') || err.message?.includes('502') || err.message?.includes('503') || err.message?.includes('429');
      const errMessage = isUnavailable 
        ? (langRef.current === 'bn' ? 'এআই ব্যস্ত আছে, সাধারণ কমান্ড কাজ করবে' : 'AI is busy, basic commands still work')
        : (err.message || 'Something went wrong.');
      setCustomError(errMessage);
      if (!mutedRef.current) {
        speak(errMessage, langRef.current === 'bn' ? 'bn-BD' : 'en-US');
      }
    } finally {
      setLoading(false);
      if (autoListenRef.current && isOpenRef.current) {
        setTimeout(() => {
          if (isOpenRef.current && autoListenRef.current && !isLoadingRef.current && !isSpeakingRef.current) {
            startListening(langRef.current, handleResult);
          }
        }, 600);
      }
    }
  };

  const handleSend = async (queryText?: string, queryAlternatives?: string[]) => {
    const spoken = (queryText ?? inputRef.current ?? inputText ?? '').trim();
    const transcripts = queryAlternatives && queryAlternatives.length > 0 ? queryAlternatives : (spoken ? [spoken] : []);
    if (transcripts.length === 0) return;

    const primaryText = transcripts[0];
    const lowerPrimary = primaryText.toLowerCase();

    // (a) Tiny local fast path for stop / থামো / scroll up/down for instant response
    if (lowerPrimary.includes('stop') || lowerPrimary.includes('thamo') || lowerPrimary.includes('বন্ধ') || lowerPrimary.includes('থামো')) {
      stopListening();
      setIsOpen(false);
      return;
    }

    // (b) matchRoute for clear page names / scroll actions
    const action = matchRoute(primaryText);
    if (action) {
      stopListening();
      setLoading(false);
      setCustomError(null);
      const isBn = langRef.current === 'bn';
      const labelToUse = isBn ? action.labelBn : action.label;

      if (action.type === 'navigate') {
        const replyMsg = isBn ? `খুলে দেওয়া হচ্ছে: ${labelToUse}` : `Opening ${labelToUse}`;
        setReply(replyMsg);
        setInputText('');
        inputRef.current = '';
        if (!mutedRef.current) speak(replyMsg, isBn ? 'bn-BD' : 'en-US');
        router.push(action.path);
        return;
      } else if (action.type === 'scroll') {
        const replyMsg = labelToUse;
        setReply(replyMsg);
        setInputText('');
        inputRef.current = '';
        if (!mutedRef.current) speak(replyMsg, isBn ? 'bn-BD' : 'en-US');

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
        if (!mutedRef.current) speak(replyMsg, isBn ? 'bn-BD' : 'en-US');
        stopListening();
        setIsOpen(false);
        return;
      }
    }

    stopListening();
    setLoading(true);
    setCustomError(null);
    setReply('');
    setInputText('');
    inputRef.current = '';

    await callAgentStep(transcripts, 0);
  };

  const sendNow = useCallback((text: string, alts?: string[]) => {
    if (!text) return;
    const trimmed = text.trim();
    if (trimmed.length < 2) return;
    if (isLoadingRef.current || isSpeakingRef.current) return;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    stopListening();
    transcriptRef.current = '';
    setTranscript('');
    setInputText('');
    inputRef.current = '';

    handleSend(trimmed, alts);
  }, [stopListening, handleSend, setTranscript]);

  const handleResult = useCallback((alternatives: string[], interim: string) => {
    const primary = alternatives[0] || '';
    if (confirmationResolverRef.current) {
      const lowerAlts = alternatives.map(a => a.toLowerCase());
      if (lowerAlts.some(a => a.includes('confirm') || a.includes('yes') || a.includes('হ্যাঁ'))) {
        const resolve = confirmationResolverRef.current;
        confirmationResolverRef.current = null;
        resolve(true);
        return;
      }
    }

    let currentFinal = transcriptRef.current;
    if (primary) {
      currentFinal = currentFinal ? `${currentFinal} ${primary}` : primary;
      transcriptRef.current = currentFinal;
      setTranscript(currentFinal);
    }

    const displayText = currentFinal + (interim ? ` ${interim}` : '');
    setInputText(displayText);
    inputRef.current = displayText;

    if (primary) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      sendNow(currentFinal, alternatives);
    } else if (interim) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      silenceTimerRef.current = setTimeout(() => {
        sendNow(transcriptRef.current, [transcriptRef.current]);
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
      handleSend(question, [question]);
    });
    return unsubscribe;
  }, [handleSend]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (listening) {
        stopListening();
      }
    }
    isOpenRef.current = isOpen;
  }, [isOpen, listening, stopListening]);

  const handleToggleListening = () => {
    if (listening || autoListen) {
      setAutoListen(false);
      stopListening();
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    } else {
      setAutoListen(true);
      transcriptRef.current = '';
      setTranscript('');
      setInputText('');
      inputRef.current = '';
      startListening(lang, handleResult);
    }
  };

  const handleToggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
      setAutoListen(false);
      stopListening();
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    } else {
      setIsOpen(true);
      setAutoListen(true);
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
  }, [isOpen, handleToggleOpen]);

  const exampleChips = [
    { label: 'Show technology campaigns', q: 'Show technology campaigns' },
    { label: 'Scroll down / নিচে যাও', q: 'scroll down' },
    { label: 'Take me to my dashboard', q: 'Take me to my dashboard' },
  ];

  return (
    <>
      {/* Floating Mic Button */}
      <div className="fixed bottom-24 right-6 z-50">
        {listening && (
          <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping pointer-events-none" />
        )}
        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          onClick={() => {
            if (!isOpen) {
              setIsOpen(true);
              setAutoListen(true);
            } else {
              handleToggleOpen();
            }
          }}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Open Voice Assistant"
        >
          <Mic className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Glass Panel Modal marked with data-voice-ignore */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-voice-ignore="true"
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
                <h3 className="font-bold text-lg">AI Voice Agent</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const nextLang = lang === 'en' ? 'bn' : 'en';
                    setLang(nextLang);
                    langRef.current = nextLang;
                    if (listening) {
                      stopListening();
                      startListening(nextLang, handleResult);
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

            {/* Assistant Reply */}
            {(reply || loading || customError) && (
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-blue-500/30 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Agent Response
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
                  ) : customError ? (
                    <span className="text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {customError}
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
                    handleSend(chip.q, [chip.q]);
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

            {/* Privacy Note (Exact requested text) */}
            <p className="text-[10px] text-gray-400 text-center leading-tight pt-1 border-t border-white/5">
              Voice is converted to text by your browser. Only the text and visible button names are sent to our AI. No audio is stored.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
