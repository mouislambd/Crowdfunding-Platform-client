type Listener = (question: string) => void;

class VoiceBus {
  private listeners: Listener[] = [];

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  ask(question: string) {
    this.listeners.forEach(l => l(question));
  }
}

export const voiceBus = new VoiceBus();
