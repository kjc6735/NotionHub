
const originalFetch = window.fetch;

window.fetch = async function (...args) {
    if(args[0] != '/api/v3/getTasks'){
        return originalFetch.apply(this, args);
    }

    const response = await originalFetch.apply(this, args);
    const clonedResponse = response.clone();
    const data = await clonedResponse.json();
    window.postMessage({ type: 'FETCH_INTERCEPTED', data: data }, '*');
    
    return response;
};

