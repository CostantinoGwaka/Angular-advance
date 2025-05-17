import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';


interface IWindow extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

declare let window: IWindow;

@Injectable({
  providedIn: 'root',
})


export class VoiceService {
  recognition: any;
  synth: SpeechSynthesis;
  isListening = false;
  wordsLog: string[] = [];


  commands = [
    'stop',
    'initiation',
    'ppra dashboard',
    'procuring entity dashboard',
    'procuring entity auditing',
    'tenderer management',
    'framework agreement',
    'calloff',
    'app management',
    'pre qualification',
    'opening',
    'micro value',
    'tender evaluation',
    'post qualification',
    'negotiation',
    'tender award',
    'tender lookup',
    'complaint management',
    'government supplier',
    'tender board',
    'contracts',
    'pe management',
    'bills',
    'templates management',
    'pe self registration',
    'landing'
  ];

  constructor(private zone: NgZone,
    private router: Router,
  ) {

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
      // const { webkitSpeechRecognition } = window;
      // this.recognition = new webkitSpeechRecognition();
      // this.recognition.continuous = true;
      // this.recognition.interimResults = false;
      // this.recognition.lang = 'en-US';
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.synth = window.speechSynthesis;

      this.recognition.onresult = (event) => {
        this.zone.run(() => {
          const transcript = event.results[event.resultIndex][0].transcript.trim();
          this.logWords(transcript.toLowerCase());
          console.log(transcript);
        });
      };

      this.recognition.onerror = (event) => {
        console.error(event.error);
      };
    } else {
      console.error('webkitSpeechRecognition is not supported in this browser');
    }
  }

  navigateUrl(url) {
    this.router
      .navigateByUrl(
        url
      )
      .then(success => {
        if (success) {
        } else {
          location.replace(url);
        }
      });
  }

  routes(routes) {
    if (routes == 'initiation') {
      this.navigateUrl('/modules/tender-initiation/dashboard');
    } else if (routes == 'ppra dashboard') {
      this.navigateUrl('/modules/ppra-dashboard/billing-details');
    } else if (routes == 'pe dashboard') {
      this.navigateUrl('/modules/pe-dashboard/merged-main-req-summary');
    } else if (routes == 'tenderer management') {
      this.navigateUrl('/modules/tenderer-management/dashboard');
    } else if (routes == 'framework agreement') {
      this.navigateUrl('/modules/framework-agreement/dashboard');
    } else if (routes == 'calloff') {
      this.navigateUrl('/modules/calloff/dashboard');
    } else if (routes == 'app management') {
      this.navigateUrl('/modules/app-management/dashboard');
    } else if (routes == 'pre qualification') {
      this.navigateUrl('/modules/pre-qualification/dashboard');
    } else if (routes == 'opening') {
      this.navigateUrl('/modules/opening/pre-qualification-opening/opened');
    } else if (routes == 'micro value') {
      this.navigateUrl('/modules/micro-value-procurement');
    } else if (routes == 'tender evaluation') {
      this.navigateUrl('/modules/tender-evaluation/dashboard');
    } else if (routes == 'post qualification') {
      this.navigateUrl('/modules/post-qualification/dashboard');
    } else if (routes == 'negotiation') {
      this.navigateUrl('/modules/negotiation/dashboard');
    } else if (routes == 'tender award') {
      this.navigateUrl('/modules/tender-award/intention-to-award');
    } else if (routes == 'tender lookup') {
      this.navigateUrl('/modules/tender-lookup/tender-search');
    } else if (routes == 'complaint management') {
      this.navigateUrl('/modules/complaint-management/dashboard');
    } else if (routes == 'tender lookup') {
      this.navigateUrl('/modules/tender-lookup/tender-search');
    } else if (routes == 'tender lookup') {
      this.navigateUrl('/modules/tender-lookup/tender-search');
    } else if (routes == 'government supplier') {
      this.navigateUrl('/modules/government-supplier/dashboard');
    } else if (routes == 'tender board') {
      this.navigateUrl('/modules/tender-board/dashboard');
    } else if (routes == 'contracts') {
      this.navigateUrl('/modules/contracts');
    } else if (routes == 'pe management') {
      this.navigateUrl('/modules/pe-management/dashboard');
    } else if (routes == 'bills') {
      this.navigateUrl('/modules/bills/bills-wallet');
    } else if (routes == 'templates management') {
      this.navigateUrl('/modules/templates-management/templates');
    } else if (routes == 'pe self registration') {
      this.navigateUrl('/pe-self-registration');
    } else if (routes == 'landing') {
      this.navigateUrl('/landing');
    }
  }

  logWords(transcript: string) {
    if (this.wordsLog.length > 0) {
      const lowerCaseTranscript = transcript.toLowerCase();

      if (this.commands.includes(lowerCaseTranscript)) {
        switch (lowerCaseTranscript) {
          case 'stop':
            this.recognition.stop();
            this.isListening = false;
            break;
          case 'open initiation':
            this.routes('initiation');
            break;
          case 'open ppra dashboard':
            this.routes('ppra dashboard');
            break;
          case 'open pe dashboard':
            this.routes('pe initiation');
            break;
          case 'open pe auditing':
            this.routes('pe auditing');
            break;
          case 'open tenderer management':
            this.routes('tenderer management');
            break;
          case 'open framework agreement':
            this.routes('framework agreement');
            break;
          case 'open calloff':
            this.routes('calloff');
            break;
          case 'open app management':
            this.routes('app management');
            break;
          case 'open pre qualification':
            this.routes('pre qualification');
            break;
          case 'opening':
            this.routes('opening');
            break;
          case 'open micro value':
            this.routes('micro value');
            break;
          case 'open tender evaluation':
            this.routes('tender evaluation');
            break;
          case 'open post qualification':
            this.routes('post qualification');
            break;
          case 'open negotiation':
            this.routes('negotiation');
            break;
          case 'open tender award':
            this.routes('tender award');
            break;
          case 'open tender lookup':
            this.routes('tender lookup');
            break;
          case 'open complaint management':
            this.routes('complaint management');
            break;
          case 'open government supplier':
            this.routes('government supplier');
            break;
          case 'open tender board':
            this.routes('tender board');
            break;
          case 'open contracts':
            this.routes('contracts');
            break;
          case 'open pe management':
            this.routes('pe management');
            break;
          case 'open bills':
            this.routes('bills');
            break;
          case 'open templates management':
            this.routes('templates management');
            break;
          case 'open pe self registration':
            this.routes('pe self registration');
            break;
          case 'landing':
            this.routes('landing');
            break;
        }
      } else {
        // Suggest closest matching command
        let closestCommand = '';
        let minDistance = Infinity;

        for (const command of this.commands) {
          const distance = this.levenshteinDistance(lowerCaseTranscript, command);
          if (distance < minDistance) {
            minDistance = distance;
            closestCommand = command;
          }
        }

        if (closestCommand) {
          this.speak(`Sorry, I don't understand what you're saying. Did you mean "${closestCommand}"?`);
        } else {
          this.speak('Sorry, I don\'t understand what you\'re saying, or those pages were not found in the NeST.');
        }
      }
    }

    // if (transcript != '') {
    //   this.wordsLog = [];
    //   this.wordsLog.push(transcript);
    // }
    // if (this.wordsLog.length > 0 && this.wordsLog.includes('stop')) {
    //   this.recognition.stop();
    //   this.isListening = false;
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open initiation')) {
    //   this.routes('initiation');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open ppra dashboard')) {
    //   this.routes('ppra dashboard');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open pe dashboard')) {
    //   this.routes('pe initiation');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open pe auditing')) {
    //   this.routes('pe auditing');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open tenderer management')) {
    //   this.routes('tenderer management');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open framework agreement')) {
    //   this.routes('framework agreement');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open calloff')) {
    //   this.routes('calloff');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open app management')) {
    //   this.routes('app management');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open pre qualification')) {
    //   this.routes('pre qualification');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('opening')) {
    //   this.routes('opening');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open micro value')) {
    //   this.routes('micro value');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open tender evaluation')) {
    //   this.routes('tender evaluation');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open post qualification')) {
    //   this.routes('post qualification');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open negotiation')) {
    //   this.routes('negotiation');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open tender award')) {
    //   this.routes('tender award');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open tender lookup')) {
    //   this.routes('tender lookup');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open complaint management')) {
    //   this.routes('complaint management');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open government supplier')) {
    //   this.routes('government supplier');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open tender board')) {
    //   this.routes('tender board');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open contracts')) {
    //   this.routes('contracts');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open pe management')) {
    //   this.routes('pe management');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open bills')) {
    //   this.routes('bills');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open templates management')) {
    //   this.routes('templates management');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('open pe self registration')) {
    //   this.routes('pe self registration');
    // } else if (this.wordsLog.length > 0 && this.wordsLog.includes('landing')) {
    //   this.routes('landing');
    // } else if (this.wordsLog.length > 0 && transcript != '') {
    //   this.speak('Sorry, I don\'t understand what you\'re saying, or those pages were not found in the NeST');
    // }
    // this.wordsLog = [];
  }


  levenshteinDistance(a: string, b: string): number {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  getLoggedWords(): string[] {
    return this.wordsLog;
  }

  startListening() {
    if (!this.isListening) {
      this.recognition.start();
      this.isListening = true;
    }
  }

  stopListening() {
    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  stopTalk() {
    this.synth.cancel();
  }

  speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    this.synth.speak(utterance);
  }
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
