(() => {
    let linkedInBtnBar;
    let currentJob = "";

    chrome.runtime.onMessage.addListener((obj, sender, res) => {

        const { type, jobID } = obj;

        if(type === "NEW") {
            currentJob = jobID;
            newJobLoaded();
        }
    });

    const newJobLoaded = () => {
        const addJobBtnExists = document.getElementsByClassName("add-job-btn")[0];

        console.log(addJobBtnExists);
        if(!addJobBtnExists) {
            const addJobBtn = document.createElement("img");

            addJobBtn.src = chrome.runtime.getURL("images/job-btn.png");
            addJobBtn.className = "add-job-btn";
            addJobBtn.title = "Click to add to google sheets";

            linkedInBtnBar = document.getElementsByClassName('mt5')[2];
            console.log(linkedInBtnBar);
            if(linkedInBtnBar.firstElementChild) {
                linkedInBtnBar.firstElementChild.appendChild(addJobBtn);
            }
        }
    }

})();


/*
mt5
if div with display flex => can do it
*/