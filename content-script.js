(() => {
    let linkedInBtnBar;
    let currentJob = "";
    let user = null;
    let allJobs = [];

    const fetchAllJobs = () => {
        console.log(user);
        return new Promise((resolve) => {
            chrome.storage.sync.get([user], (obj) => {
                resolve(obj[user] ? JSON.parse(obj[user]) : []);
            });
        });
    }

    const addNewJobEventHandler = async () => {
        const addJobBtn = document.getElementsByClassName("job-btn")[0];

        if(!allJobs.includes(currentJob)) {
            addJobBtn.src = chrome.runtime.getURL("images/job-added-btn.png");
            addJobBtn.className = "job-btn job-added-btn";
            addJobBtn.title = "Click to remove from Google Sheets";
            
            allJobs = await fetchAllJobs();

            chrome.storage.sync.set({
                [user]: JSON.stringify([...allJobs, currentJob])
            });
        } else {
            addJobBtn.src = chrome.runtime.getURL("images/job-btn.png");
            addJobBtn.className = "job-btn add-job-btn";
            addJobBtn.title = "Click to add to Google Sheets";

            allJobs = await fetchAllJobs();            
            allJobs = allJobs.filter((job) => {
                return job !== currentJob;
            });

            chrome.storage.sync.set({
                [user]: JSON.stringify([allJobs])
            })
        }
    }

    chrome.runtime.onMessage.addListener((obj, sender, res) => {
        
        const { type, jobID } = obj;

        if(type === "NEW") {
            currentJob = jobID;
            newJobLoaded();
        }
    });

    const newJobLoaded = async () => {
        const addJobBtnExists = document.getElementsByClassName("job-btn")[0];
        
        if(!user) {
            await chrome.storage.sync.get(["user"]).then((res) => {
                user = res["user"];
            });
        }
        
        allJobs = await fetchAllJobs();
        console.log(allJobs);

        if(!allJobs.includes(currentJob) && !addJobBtnExists) {
            const btnDiv = document.createElement("div");
            const addJobBtn = document.createElement("img");

            addJobBtn.src = chrome.runtime.getURL("images/job-btn.png");
            addJobBtn.className = "job-btn add-job-btn";
            addJobBtn.title = "Click to add to Google Sheets";
            
            btnDiv.className = "inline-flex btn-container";
            btnDiv.appendChild(addJobBtn);

            linkedInBtnBar = document.getElementsByClassName('mt5')[2];

            if(linkedInBtnBar && linkedInBtnBar.firstElementChild) {
                linkedInBtnBar.firstElementChild.appendChild(btnDiv);
            }
            
            addJobBtn.addEventListener("click", addNewJobEventHandler);
        } else if (allJobs.includes(currentJob) && addJobBtnExists) {
            const addJobBtn = document.getElementsByClassName("job-btn")[0];

            addJobBtn.src = chrome.runtime.getURL("images/job-added-btn.png");
            addJobBtn.className = "job-btn job-added-btn";
            addJobBtn.title = "Click to remove from Google Sheets";
        } else if (addJobBtnExists) {
            const addJobBtn = document.getElementsByClassName("job-btn")[0];

            addJobBtn.src = chrome.runtime.getURL("images/job-btn.png");
            addJobBtn.className = "job-btn add-job-btn";
            addJobBtn.title = "Click to add to Google Sheets";
        }
    }
})();


/*

extension/browser opens:

1. check if user already authorized
2. depending on above, do either: 
    2.1 user logs in + authorizes -> save auth data, create sheet, save to storage
    2.2 extension retrieves info -> retrieve sheet data from storage
3. 



*/