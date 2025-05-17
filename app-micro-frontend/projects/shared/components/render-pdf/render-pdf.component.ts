import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, SimpleChange, ViewChild } from "@angular/core";
import { ApolloNamespace } from 'src/app/apollo.config';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { NgStyle } from '@angular/common';
import { DomSanitizer } from "@angular/platform-browser";
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-render-pdf',
  templateUrl: './render-pdf.component.html',
  styleUrls: ['./render-pdf.component.scss'],
  standalone: true,
  imports: [SafeUrlPipe, LoaderComponent, NgStyle],
})
export class RenderPdfComponent implements AfterViewInit {
  @Input() url: string;
  @Input() isBlob: boolean = false;
  @Input() height: string = '100%';
  @Input() width: string = '100%';
  @Input() title: string = 'Report';
  loadingDocument: boolean = false;

  data: string;
  @ViewChild('iframeContainer', { static: false }) iframeContainer!: ElementRef;

  constructor(
    private sanitizer: DomSanitizer,
    private renderer: Renderer2) { }

  previousValue: any;
  currentValue: any;
  firstChange: boolean;
  isFirstChange(): boolean {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit(): void {
    this.renderDocument();
  }

  renderDocument(): void {

    this.loadingDocument = true;
    const iframe = this.renderer.createElement('iframe');
    this.renderer.setAttribute(iframe, 'width', '100%');
    this.renderer.setAttribute(iframe, 'height', '100%');
    this.renderer.setAttribute(iframe, 'title', 'PDF Viewer');
    let screenWidth = window.innerWidth;

    /**Handle download file based on screen size less than 460 width**/
    if (screenWidth < 460) {
      const a = document.createElement('a');
      a.href = 'data:application/pdf;base64,' + this.url;
      a.download = 'document.pdf';
      a.click();
      this.loadingDocument = false;
      return;
    }
    /**End handle download file based on screen size less than 460 width**/

    if (!this.isBlob) {
      this.renderer.setAttribute(
        iframe,
        'src',
        'data:application/pdf;base64,' + this.url
      );
      const container = this.iframeContainer.nativeElement;
      this.renderer.appendChild(container, iframe);
      // Add the download attribute to the anchor element within the iframe
      iframe!.onload = () => {
        const iframeDoc = iframe!.contentWindow!.document;
        const anchor = iframeDoc.createElement('a');
        anchor.href = 'data:application/pdf;base64,' + this.url;
        anchor.download = 'document.pdf';
        anchor.style.display = 'none';
        iframeDoc.body.appendChild(anchor);
        anchor.click();
        iframeDoc.body.removeChild(anchor);
      };
      this.loadingDocument = false;
    } else {
      this.loadingDocument = false;
    }

    if (this.isBlob) {
      this.loadingDocument = true;
      const byteCharacters = atob(this.url);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      try {
        const blob = new Blob(byteArrays, { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        const iframe = this.renderer.createElement('iframe');
        this.renderer.setAttribute(iframe, 'src', blobUrl);
        this.renderer.setAttribute(iframe, 'width', '100%');
        this.renderer.setAttribute(iframe, 'height', '100%');
        const container = this.iframeContainer.nativeElement;
        this.renderer.appendChild(container, iframe);
        this.loadingDocument = false;
      } catch (error) {
        console.error('Failed to render PDF:', error);
        this.loadingDocument = false;
      }
      this.loadingDocument = false;
    }
  }

  onLoading() { }
}
