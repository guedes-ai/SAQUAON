class OceanAudioSynthesizer {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoGain: GainNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.4;

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
  }

  public play(): boolean {
    try {
      this.initContext();
      if (!this.audioCtx) return false;

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      if (this.isPlaying) return true;

      const bufferSize = this.audioCtx.sampleRate * 5;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut * 0.95) + (white * 0.05);
        data[i] = lastOut * 3.5;
      }

      this.noiseNode = this.audioCtx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;
      this.filterNode = this.audioCtx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 350;
      this.filterNode.Q.value = 2.0;
      this.lfoOsc = this.audioCtx.createOscillator();
      this.lfoOsc.type = 'sine';
      this.lfoOsc.frequency.value = 0.13; 
      this.lfoGain = this.audioCtx.createGain();
      this.lfoGain.gain.value = 250;
      this.lfoOsc.connect(this.lfoGain);
      this.lfoGain.connect(this.filterNode.frequency);
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(this.volume, this.audioCtx.currentTime + 1.2);
      this.noiseNode.connect(this.filterNode);
      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.audioCtx.destination);

      this.noiseNode.start(0);
      this.lfoOsc.start(0);

      this.isPlaying = true;
      return true;
    } catch (e) {
      console.warn('Audio play notice:', e);
      return false;
    }
  }

  public stop() {
    if (!this.isPlaying || !this.masterGain || !this.audioCtx) return;

    try {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.audioCtx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.8);

      setTimeout(() => {
        try {
          this.noiseNode?.stop();
          this.lfoOsc?.stop();
          this.noiseNode?.disconnect();
          this.lfoOsc?.disconnect();
          this.filterNode?.disconnect();
          this.masterGain?.disconnect();
        } catch {
        }
        this.isPlaying = false;
      }, 850);
    } catch {
      this.isPlaying = false;
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const oceanAudio = new OceanAudioSynthesizer();
