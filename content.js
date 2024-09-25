
function injectFetchInterceptor() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('interceptor.js');
    script.onload = function() {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
}
  
  injectFetchInterceptor();
  
window.addEventListener('message', function(event) {
    if (event.source !== window || event.data.type !== 'FETCH_INTERCEPTED') {
        return;
    }

    if(event.data.data.results[0].state == "in_progress") return ;

    chrome.runtime.sendMessage({ type: 'FETCH_INTERCEPTED', data: event.data.data });
});