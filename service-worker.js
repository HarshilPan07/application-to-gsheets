chrome.tabs.onUpdated.addListener((tabID, changeInfo, tab) => {
    if(tab.url && tab.url.includes("linkedin.com/jobs/search/")) {
        const queryParameter = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameter);

        chrome.tabs.sendMessage(tabID, {
            type: "NEW",
            jobID: urlParameters.get("currentJobId")
        })
    }
})