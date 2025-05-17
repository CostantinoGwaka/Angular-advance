import { Component, Inject, Input, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { NotificationService } from "../../../services/notification.service";
import { ModalHeaderComponent } from '../modal-header/modal-header.component';


@Component({
  selector: 'app-view-attachment',
  templateUrl: './view-attachment.component.html',
  styleUrls: ['./view-attachment.component.scss'],
  standalone: true,
  imports: [ModalHeaderComponent],
})
export class ViewAttachmentComponent implements OnInit {
  base64: string;
  format: string;
  isBlob: boolean = false;
  @ViewChild('iframeContainer') iframeContainer: ElementRef;

  constructor(
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<ViewAttachmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.isBlob) {
      this.isBlob = data.isBlob;
    }
  }

  ngOnInit() {
    if (this.data.file) {
      this.base64 = this.b64toBlob(
        this.data.file,
        'application/' + this.data.format
      );
      // console.log(this.base64);
    }
  }

  getBase64DataUrl(): SafeResourceUrl {
    const dataUrl = `data:application/pdf;base64,${this.data.file}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
  }

  ngAfterViewInit(): void {
    const iframe = this.renderer.createElement('iframe');
    this.renderer.setAttribute(iframe, 'width', '100%');
    this.renderer.setAttribute(iframe, 'height', '100%');
    this.renderer.setAttribute(iframe, 'title', 'PDF Viewer');
    let screenWidth = window.innerWidth

    /**Handle download file based on screen size less than 460 width**/
    if (screenWidth < 460) {
      const a = document.createElement('a');
      a.href = "data:application/pdf;base64," + this.data.file;
      a.download = 'document.pdf';
      a.click();
      this.closeDialog();
      this.notificationService.successSnackbar('File downloaded successfully');
      return;
    }
    /**End handle download file based on screen size less than 460 width**/


    if (!this.isBlob) {
      this.renderer.setAttribute(iframe, 'src', "data:application/pdf;base64," + this.data.file);
      const container = this.iframeContainer.nativeElement;
      this.renderer.appendChild(container, iframe);
      // Add the download attribute to the anchor element within the iframe
      iframe.onload = () => {
        const iframeDoc = iframe.contentWindow.document;
        const anchor = iframeDoc.createElement('a');
        anchor.href = "data:application/pdf;base64," + this.data.file;
        anchor.download = 'document.pdf';
        anchor.style.display = 'none';
        iframeDoc.body.appendChild(anchor);
        anchor.click();
        iframeDoc.body.removeChild(anchor);
      };
    } else {
      const byteCharacters = atob(this.data.file);
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
        const url = URL.createObjectURL(blob);

        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.height = '100%';

        const container = document.getElementById('pdf-container');
        container.appendChild(iframe);
        const parentDiv = document.createElement('a');
        parentDiv.classList.add(
          'flex items-center justify-start',
        )

        // Add Download button
        const downloadButton = document.createElement('button');
        downloadButton.classList.add(
          'mt-2',       // Background color
          'mx-2',       // Background color
          'bg-blue-500',       // Background color
          'text-white',        // Text color
          'font-bold',         // Font weight
          'py-2',              // Padding on the y-axis
          'px-4',              // Padding on the x-axis
          'rounded',           // Rounded corners
          'hover:bg-blue-700', // Hover background color
          'transition',        // Smooth transition for hover effects
          'duration-200',      // Transition duration
          'flex',              // Flexbox container
          'items-center',      // Center items vertically
          'gap-2'              // Gap between icon and text
        );
        downloadButton.textContent = 'Download ';
        /**Handle download file based on screen size less than 460 width**/
        // if (screenWidth < 460){
        //   const a = document.createElement('a');
        //   a.href = url;
        //   a.download = 'document.pdf';
        //   a.click();
        //   this.closeDialog();
        //   this.notificationService.successSnackbar('File downloaded successfully');
        //   return;
        // }else{
        //   downloadButton.addEventListener('click', () => {
        //     const a = document.createElement('a');
        //     a.href = url;
        //     a.download = 'document.pdf';
        //     a.click();
        //     this.closeDialog();
        //     this.notificationService.successSnackbar('File downloaded successfully');
        //   });
        //   container.appendChild(downloadButton);
        // }

        downloadButton.addEventListener('click', () => {
          const a = document.createElement('a');
          a.href = url;
          a.download = 'document.pdf';
          a.click();
          this.closeDialog();
          this.notificationService.successSnackbar('File downloaded successfully');
        });


        // Add Print button
        const printButton = document.createElement('button');
        printButton.classList.add(
          'mt-2',       // Background color
          'bg-blue-500',       // Background color
          'text-white',        // Text color
          'font-bold',         // Font weight
          'py-2',              // Padding on the y-axis
          'px-4',              // Padding on the x-axis
          'rounded',           // Rounded corners
          'hover:bg-blue-700', // Hover background color
          'transition',        // Smooth transition for hover effects
          'duration-200',      // Transition duration
          'flex',              // Flexbox container
          'items-center',      // Center items vertically
          'gap-2'              // Gap between icon and text
        );
        printButton.textContent = ' Print';
        printButton.addEventListener('click', () => {
          iframe.contentWindow.print();
        });

        parentDiv.appendChild(downloadButton);
        parentDiv.appendChild(printButton);
        container.appendChild(parentDiv);
        // Disable refresh for the iframe
        iframe.addEventListener('load', () => {
          iframe.contentWindow.onbeforeunload = function () {
            return false;
          };
        });
      } catch (error) {
        console.error('Failed to open PDF:', error);
      }
    }
  }

  isMacOS(): boolean {
    return /Mac/.test(navigator.platform);
  }


  private base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  downloadFile() {
    const downloadLink = document.createElement('a');
    const name = this.data.name;
    const fileName = name ? name + '.pdf' : 'download.pdf';
    downloadLink.href = `data:application/pdf;base64,${this.data.file}`;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  b64toBlob(b64Data: string, contentType: string, sliceSize = 512) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return URL.createObjectURL(blob);
  }
}
