window.onload = () => {
    chrome.identity.getAuthToken( {interactive : true}, async (token) => {
        console.log("token is " + token);
        await chrome.storage.sync.set({ "user" : token })
        chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, function (user_info) {
            console.log(user_info.email);
        });
        
        // let fetch_options = {
        //     method: 'GET',
        //     async: true,
        //     headers: {
        //       Authorization: 'Bearer ' + token,
        //       'Content-Type': 'application/json'
        //     },
        //     'contentType': 'json'
        //   };
        //   fetch(
        //       "https://sheets.googleapis.com/v4/spreadsheets/1Io34OGN4Vl051rq_PpXdpyRrnE8mxozdiAfGJm_FQKg",
        //       fetch_options)
        //       .then((response) => response.json())
        //       .then(function(data) {
        //         console.log(data)
        //       });
    });
  };


  // https://www.googleapis.com/auth/userinfo.emai