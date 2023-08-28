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
        });
    });
};

chrome.tabs.onUpdated.addListener((tabID, changeInfo, tab) => {
    if(tab.url && changeInfo.status === "complete" && tab.url.includes("linkedin.com/jobs/")) {
        const queryParameter = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameter);
        
        console.log(urlParameters.get("currentJobId"));

        chrome.tabs.sendMessage(tabID, {
            type: "NEW",
            jobID: urlParameters.get("currentJobId")
        });
    }
})