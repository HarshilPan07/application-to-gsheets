window.onload = () => {
    chrome.identity.getAuthToken( {interactive : true}, async (token) => {
        console.log("token is " + token);
        await chrome.storage.sync.set({ "user" : token });
    });
  };