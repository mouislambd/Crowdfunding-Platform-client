'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const langRef = useRef<string>('en-US');
  const onResultRef = useRef<((final: string, interim: string) => void) | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSupported(true);
      }
    }
  }, []);

  const initRecognition = useCallback((lang: string) => {
    if (typeof window === 'undefined') return null;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    if (recognitionRef.current && langRef.current === lang) {
      return recognitionRef.current;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onstart = () => {
      setListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (final) {
        setTranscript(prev => (prev ? prev + ' ' + final : final));
        setInterimTranscript('');
      } else {
        setInterimTranscript(interim);
      }
      if (onResultRef.current) {
        onResultRef.current(final, interim);
      }
    };

    recognition.onerror = (event: any) => {
      const err = event.error;
      if (err === 'not-allowed') {
        setError('Microphone permission denied. Please allow microphone access or use text input.');
      } else if (err === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else {
        setError(`Speech recognition error: ${err}`);
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    langRef.current = lang;
    return recognition;
  }, []);

  const start = useCallback((lang: string = 'en-US', onResult?: (final: string, interim: string) => void) => {
    setError(null);
    setInterimTranscript('');
    onResultRef.current = onResult || null;
    const recognition = initRecognition(lang);
    if (!recognition) {
      setSupported(false);
      setError('Speech recognition is not supported in this browser. Please use the text input fallback.');
      return;
    }
    try {
      recognition.start();
    } catch (e: any) {
      try {
        recognition.stop();
        recognition.start();
      } catch (ex) {}
    }
  }, [initRecognition]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setListening(false);
  }, []);

  const speak = useCallback((text: string, lang: string = 'en-US') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(v => v.lang.startsWith(lang.substring(0, 2)));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setSpeaking(false);
    }
  }, []);

  const cancelSpeak = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } catch (e) {}
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
      }
    };
  }, []);

  return {
    supported,
    listening,
    transcript,
    interimTranscript,
    error,
    speaking,
    start,
    stop,
    speak,
    cancelSpeak,
    setTranscript,
    setInterimTranscript,
  };
}
