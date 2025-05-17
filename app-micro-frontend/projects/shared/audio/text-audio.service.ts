import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextAudioService {

  private synth = window.speechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;

  // Method to speak text
  speak(text: string) {
    if (this.synth.speaking) {
      console.error('SpeechSynthesis is already speaking.');
      return;
    }

    this.utterance = new SpeechSynthesisUtterance(text);

    // Optional: Configure voice, pitch, rate, and volume
    this.utterance.voice = this.getVoice();
    this.utterance.pitch = 2; // Range: 0 to 2
    this.utterance.rate = 1;  // Range: 0.1 to 10
    this.utterance.volume = 1; // Range: 0 to 1

    this.synth.speak(this.utterance);
  }

  // Method to stop speaking
  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
  }

  // Method to get a specific voice (optional)
  private getVoice(): SpeechSynthesisVoice | null {
    const voices = this.synth.getVoices();

    // console.log('Available Voices:', voices.map(voice => ({
    //   name: voice.name,
    //   lang: voice.lang,
    //   default: voice.default
    // })));

    // Look for Microsoft Susan - English (United Kingdom)
    const preferredVoice = voices.find(voice => voice.name.includes('Microsoft Zira') && voice.lang === 'en-US');

    // Fallback to any en-GB voice
    const fallbackVoice = voices.find(voice => voice.lang === 'en-GB');

    // Fallback to any en-US voice
    const lastResort = voices.find(voice => voice.lang === 'en-US');

    return preferredVoice || fallbackVoice || lastResort || null;
  }
}
