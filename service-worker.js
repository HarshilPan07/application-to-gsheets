const API_KEY = "";
let user_signed_in = false;

chrome.identity.onSignInChanged.addListener((account_id, signedIn) => {
    user_signed_in = signedIn ? true : false;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

});

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