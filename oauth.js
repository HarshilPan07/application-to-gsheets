window.onload = () => {
    chrome.identity.getAuthToken( {interactive : true}, async (token) => {
        console.log("token is " + token);
        await chrome.storage.sync.set({ "user" : token })
        // .then(() => {
        //     let init = {
        //         method: 'GET',
        //         async: true,
        //         headers: {
        //             "Authorization": 'Bearer ' + token,
        //             "Content-Type": 'application/json'
        //             },
        //         "contentType": "json"
        //         };
         
        //     fetch("https://www.googleapis.com/auth/userinfo.email", init)
        //         .then((response) => response.json())
        //         .then((data) => {
        //         console.log(data);
        //         console.log('here');
        //     });
        // });
    });
  };


  // https://www.googleapis.com/auth/userinfo.emai