(() => {
    let linkedInBtnBar;
    let currentJob = "";
    let user = null;
    let sheetID = "";
    let allJobs = [];
    let API_KEY = "AIzaSyBv5-AM7qNAF8kdOmNr8zF1pLSkIQ7XWJA";

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

    const getJobInformation = () => {
        const infoContainer = document.getElementsByClassName("jobs-unified-top-card__primary-description")[0];
        const infoText = infoContainer.children[0].textContent;
        
        const dotIndex = infoText.indexOf("·");
        const leftPIndex = infoText.indexOf("(");
        const rightPIndex = infoText.indexOf(")");

        const title = document.getElementsByClassName("t-24 t-bold jobs-unified-top-card__job-title")[0].textContent.trim();
        const company = infoText.substring(0, dotIndex).trim();
        const location = infoText.substring(dotIndex + 1, leftPIndex).trim();
        const remote = infoText.substring(leftPIndex + 1, rightPIndex).trim();
        
        const dateObj = new Date();
        const date = `${dateObj.getMonth()+1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
        // console.log(`date = ${date}, title = ${title}, company = ${company}, location = ${location}, remote = ${remote}`);
        return { currentJob, company, title, location, remote, date };
    }
    
    const addNewJobEventHandler = async () => {
        const addJobBtn = document.getElementsByClassName("job-btn")[0];
        const jobInfo = getJobInformation();

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

            await chrome.storage.sync.set({ [user] : JSON.stringify(newObject) });
            console.log(jobInfo);
            await chrome.runtime.sendMessage({ type: "ADD-JOB", jobInfo: jobInfo});
        } else {
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

            await chrome.storage.sync.set({ [user] : JSON.stringify(newObject) });
            await chrome.runtime.sendMessage({ type: "DELETE-JOB", jobID: jobInfo.currentJob });
            /*
                to delete:
                get spreadsheet object
                search for jobID to delete
                check if anything below
                    if so, move all of it up
                    batch update
            */
        }
    }

    chrome.runtime.onMessage.addListener((obj, sender, res) => {
        if(obj.type === "NEW") {
            console.log('1st');
            user = obj.user;
            currentJob = obj.jobID;
            sheetID = obj.sheetID;
            newJobLoaded();
        } else if(obj.type === "USER") {
            console.log('2nd');
            user = obj.userID;
            sheetID = obj.sheetID;
        }
    });

    const newJobLoaded = async () => {
        const addJobBtnExists = document.getElementsByClassName("job-btn")[0];
        let x = await chrome.storage.sync.get();
        console.log(x);
        
        allJobs = await fetchAllJobs();
        console.log("all jobs\n");
        console.log(allJobs);
        getJobInformation();
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