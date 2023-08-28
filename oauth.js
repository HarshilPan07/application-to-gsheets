let users = [];

window.onload = () => {
    chrome.identity.getAuthToken( {interactive : true}, async (token) => {
        console.log("token is " + token);
        await chrome.storage.sync.set({ "user" : token });
        
        chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, async (user_info) => {
            console.log(user_info.id);
            
            await chrome.storage.sync.get("users").then( (res) => {
                users = JSON.parse(res["users"]);
            });
            
            console.log(users);

            if(!users.includes(user_info.id)) {
                users.push(user_info.id);
                await chrome.storage.sync.set({ "users" : JSON.stringify(users) });
            }

            // chrome.tabs.query({active:true}, function(tabs){
            //     // send the message to the content script
            //     chrome.tabs.sendMessage(tabs[0].id, {
            //         type: "USER",
            //         userID: user_info.id
            //     });               
            // });
            // chrome.runtime.sendMessage({
            //     type: "USER",
            //     userID: user_info.id
            // });
        });
    });
  };



/*
  "users" : ["userid1", "userid2", ...]
  "userid1": ["jobID1", "jobID2", ...]
  "userid2" : ...
     .
     .
     .


    {
    "106555378533970919969": "[\"106555378533970919969\"]",
    "user": "ya29.a0AfB_byBELs652EphefdZZZ56C-OrTCp2XGXni7lfW5Wzqkg2G0dve7Qg58ZlZRmxdmBHi1GudPdyWZCGl92kWCvMBU2fqo01nnK6PD6UG9x4txuwmYbO37Xz8hVRhHuD-2YepDNxDY6hhLhExSY9c91SOeRD6u1365QpIPfBAy0LxH0aCgYKAXUSARASFQHsvYlszksxxGfB1pjBH7hJ7W1yrw0182"
}
*/