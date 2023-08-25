(() => {
    let currentJob = "";

    chrome.runtime.onMessage.addListener((obj, sender, res) => {
        const { type, jobID } = obj;

        if(type === "NEW") {
            currentJob = jobID;
            newJobLoaded();
        }
    })})