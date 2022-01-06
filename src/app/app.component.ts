import { AfterViewInit, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocScannerConfig } from 'ngx-document-scanner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,AfterViewInit {
  parentElementId
  processing
  constructor(public route: ActivatedRoute) { }



 urltoFile(url, filename, mimeType){
  mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1];
  return (fetch(url)
      .then(function(res){return res.arrayBuffer();})
      .then(function(buf){return new File([buf], filename, {type:mimeType});})
  );
}

 b64toBlob(b64Data, contentType='', sliceSize=512) {
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

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

  ngAfterViewInit() {
    let cb = (file)=>{
      this.image = file
    }
    
    window.addEventListener("message", (event) => {
      if(event['data']['scannerEvent']=="scannerEvent"){
      console.log(event)
        this.image = event['data']['file']
      }
  });
    console.log(15)
    this.openInputFile()
  }
  ngOnInit(): void {
    this.processing = false
    this.route.queryParams.subscribe((param) => {
      console.log(param)
      this.parentElementId = param['scanner-id']
    })
  }
  title = 'Docscanner';
  image: File;
  config: DocScannerConfig = {
    editorBackgroundColor: '#fafafa',
    buttonThemeColor: 'primary',
    cropToolColor:"white",
    cropToolLineWeight:3,
    cropToolDimensions:{width:15,height:15},
    cropToolShape: 'circle',
    exportImageIcon: 'done'
  };

  openFile($e) {
    this.image = $e.target.files[0]

  }
  editResult($event) {
    this.FileUpload($event)
  }
  exitEditor($event) {
    this.image = null;
    this.processing = false;
    (window as any).parent.postMessage({
      'func': 'closeScannerIframe',
      'from': 'slplScannerComponent',
    }, '*');
  }
  onError(error) {
    console.log(error);
    (window as any).parent.postMessage({
      'func': 'ErrorOccured',
      'from': 'slplScannerComponent',
    }, '*');
  }
  editorState($event) {
    console.log($event)
    this.processing = $event
  }
  openInputFile() {
    document.getElementById('inputBox').click()
  }
  fireURLEvent(url): void {
    (window as any).parent.postMessage({
      'func': 'scannerOutputEvent',
      'from': 'slplScannerComponent',
      'message': this.parentElementId + '___id___' + (url)
    }, '*');
  }
  FileUpload(file){
    this.image = null;
    this.processing = false;
    (window as any).parent.postMessage({
      'func': 'scannerOutputEvent',
      'from': 'slplScannerComponent',
      'file': file
    }, '*');
  }
  TempFileUpload(file) {
    let cb = (url) => {
      this.fireURLEvent(url)
    }
    let xb = () => {
    }
    var url = `https://api.cloudinary.com/v1_1/jaycee/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onreadystatechange = function (e) {
      xb()
      if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        cb(response['secure_url'])
      } else {

      }
    };
    fd.append('upload_preset', "bw1zzwyg");
    fd.append('tags', 'SalesReturnsImage');
    fd.append('file', file);
    xhr.send(fd);
  }
}
