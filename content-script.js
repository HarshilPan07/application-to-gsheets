(() => {
    let linkedInBtnBar;
    let currentJob = "";
    let user = null;
    let sheetID = "xyz";
    let allJobs = [];

    const fetchAllJobs = () => {
        console.log(user);
        return new Promise((resolve) => {
            chrome.storage.sync.get(user, (obj) => {
                if(obj) {
                    resolve(JSON.parse(obj[user])["savedJobs"]);
                } else {
                    resolve([]);
                }
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
            allJobs.push(currentJob);
            
            let newObject = {
                "sheetID" : sheetID,
                "savedJobs" : allJobs
            };

            chrome.storage.sync.set({ [user] : JSON.stringify(newObject) });
        } 
        else {
            addJobBtn.src = chrome.runtime.getURL("images/job-btn.png");
            addJobBtn.className = "job-btn add-job-btn";
            addJobBtn.title = "Click to add to Google Sheets";

            allJobs = await fetchAllJobs();
            allJobs = allJobs.filter((job) => {
                return job !== currentJob;
            });
        
            let newObject = { 
                "sheetID" : sheetID, 
                "savedJobs" : allJobs
            };

            chrome.storage.sync.set({ [user] : JSON.stringify(newObject) });
        }
    }

    chrome.runtime.onMessage.addListener((obj, sender, res) => {
        if(obj.type === "NEW") {
            user = obj.user;
            currentJob = obj.jobID;
            // sheetID = obj.sheetID;
            console.log('1st');
            newJobLoaded();    
        } else if(obj.type === "USER") {
            console.log('2nd');
            user = obj.userID;
        }
    });

    const newJobLoaded = async () => {
        const addJobBtnExists = document.getElementsByClassName("job-btn")[0];
        let x = await chrome.storage.sync.get();
        console.log(x);
        
        allJobs = await fetchAllJobs();
        console.log("all jobs\n");
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
    2.1 user logs in + authorizes:
        2.1.1 check if login already used before. if so:
            2.1.2 retrieve data, set user val as that token, get sheet using api
            2.1.3 save new user token data, use api to create new sheet for user
    2.2 in oauth.js, extension retrieves info -> retrieve sheet data from storage

3. 

"userid" : {
    "sheetID" : ""
    "savedJobs" : []
}

*/