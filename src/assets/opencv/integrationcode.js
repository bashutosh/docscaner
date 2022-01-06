// Scanner Code Starts here

let iframeContainer = document.createElement('iframe');
iframeContainer['src'] = "https://docscanner.netlify.app"
// iframeContainer['src'] = "https://docscanner.netlify.app"
iframeContainer['id'] = "scanner-id"
iframeContainer.style.display = "none"
iframeContainer.style.position = "absolute"
iframeContainer.style.height = "100vh"
iframeContainer.style.width = "100vw"
iframeContainer.style.top = "0px"
iframeContainer.style.background = "white"
iframeContainer.style.zIndex = "99999"
document.body.appendChild(iframeContainer)

const slplLoadDocScanner =(file,resultCallback,exitfunction) => {

    iframeContainer.style.display = "block"
    iframeContainer.contentWindow.postMessage({'file': file,"scannerEvent":"scannerEvent"}, "https://docscanner.netlify.app");
    let cb = (event) => {
        if(event['data']['from'] && event['data']['from']=="slplScannerComponent"){
          window.removeEventListener("message", cb, false);
          try{
            window.detachEvent("message", cb, false);        
          }catch (error){

          }       
          iframeContainer.style.display = "none"
          if(event['data']['func']=='ErrorOccured'){       
            exitfunction("Scanner was not work able to process this image, please try again.");
            return
          }
          if(event['data']['func']=='closeScannerIframe'){     
            exitfunction()
            return
          }
          resultCallback(event['data']['file'])
        }
    }
    if (window.addEventListener) {
      window.addEventListener("message", cb, false);        
    } else if (window.attachEvent) {
      window.attachEvent("onmessage", cb, false);
    }
  }
  window.slplLoadDocScanner = slplLoadDocScanner
  // Scanner Code Ends Here