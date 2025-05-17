import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';


declare var ace: any;

@Component({
    selector: 'html-code-editor',
    templateUrl: './html-code-editor.component.html',
    standalone: true,
    imports: []
})
export class HtmlCodeEditorComponent implements OnInit, OnDestroy {
  @ViewChild('codeEditor') editorContent: ElementRef;

  @Input() content: string;

  private editorInstance: any;

  editorLoaded: boolean = false;
  loadingEditor: boolean = true;

  constructor() { }

  ngOnInit() {

    this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.4/ace.js')
      .then(() => {
        return this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.4/mode-html.js');
      })
      .then(() => {
        this.loadingEditor = false;
        this.editorLoaded = true;
        this.editorInstance = ace.edit('codeEditor');
        this.editorInstance.setTheme('ace/theme/twilight');
        this.editorInstance.session.setMode('ace/mode/html');

        this.editorInstance.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true
        });
      })
      .catch((err) => {
        this.loadingEditor = false;
        console.error('Error loading Ace Editor: ', err);
      });
  }

  loadStylesheet(href: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  ngOnDestroy() {
    if (this.editorInstance) {
      this.editorInstance.destroy();
      this.editorInstance.container.remove();
      this.editorInstance = null;
    }
  }
  loadScript(src: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
}