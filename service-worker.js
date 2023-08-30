const API_KEY = "AIzaSyBv5-AM7qNAF8kdOmNr8zF1pLSkIQ7XWJA";
const DEFAULT_VALUE_RANGE = {
    "majorDimension" : "ROWS",
    "range" : "A1:G1",
    "values" : [
      [
        "Job ID",
        "Company",
        "Title",
        "Location",
        "Remote",
        "Date Applied",
        "Other Info."
      ]
    ]
};

let users = [];
let currentUser = "";
let sheetID = "";
let sheet = [];

const fetchAllUsers = () => {
    return new Promise((resolve) => {
        chrome.storage.sync.get(["users"], (obj) => {
            resolve(obj["users"] ? JSON.parse(obj["users"]) : [])
        })
    });
}

const getSheetID = (userID) => {
    return new Promise((resolve) => {
        chrome.storage.sync.get(userID, (obj) => {
            if(obj) {
                resolve(JSON.parse(obj[userID])["sheetID"]);
            } else {
                resolve("");
            }
        })
    });
}

const createNewSheet = (token) => {
    let fetchOptions = {
        method : "POST",
        async : true,
        headers: {
            "Authorization" : "Bearer " + token,
            "Accept" : "application/json",
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            properties: {
                title: "Job Application Tracker"
            }
        }),
        contentType: "json"
    };
    
    let fetchURL = `https://sheets.googleapis.com/v4/spreadsheets`
    fetch(fetchURL, fetchOptions)
    .then((response) => response.json())
    .then((obj) => {
        console.log(obj);
        sheetID = obj["spreadsheetId"];
            
        let fetchOptions = {
            method : "PUT",
            headers: {
                Authorization : 'Bearer ' + token,
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(DEFAULT_VALUE_RANGE)
        };
        
        let fetchURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/A1:G1?valueInputOption=RAW&key=${API_KEY}`;
        fetch(fetchURL, fetchOptions)
        .then((response) => response.json())
        .then((obj) => {
            console.log("updated " + obj);
        }); 
    });
}

const appendToSheet = (jobInfo) => {
    chrome.identity.getAuthToken( {interactive : true}, async (token) => {
        let valueRange = {
            "majorDimension" : "ROWS",
            "range" : "A1:G1",
            "values" : [
              [
                jobInfo.currentJob,
                jobInfo.company,
                jobInfo.title,
                jobInfo.location,
                jobInfo.remote,
                jobInfo.date
              ]
            ]
        };

        let fetchOptions = {
            method : "POST",
            headers: {
                Authorization : 'Bearer ' + token,
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(valueRange)
        };
        
        let fetchURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/A1:G1:append?valueInputOption=RAW&key=${API_KEY}`;
        fetch(fetchURL, fetchOptions)
        .then((response) => response.json())
        .then((obj) => console.log(obj));
    });
}

const getSheet = async () => {
    chrome.identity.getAuthToken( {interactive : true}, async (token) => {
        let fetchOptions = {
            method: "GET",
            headers : {
                Authorization: 'Bearer ' + token,
                Accept: "application/json"
            }
        }
        let fetchURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/Sheet1?key=${API_KEY}`
        
        fetch(fetchURL, fetchOptions)
        .then((response) => response.json())
        .then((obj) => {
            console.log(obj);
            sheet = obj["values"];
        });
    })
}

const deleteJob = (jobID) => {
    getSheet();
    console.log(sheet[1]);
    console.log(jobID)
    let rowIndexToDelete;
    for(let i = 0; i < sheet.length; i++) {
        if(sheet[i][0] === jobID) {
            rowIndexToDelete = i;
        }
    }
    console.log(rowIndexToDelete);
    chrome.identity.getAuthToken( {interactive : true}, async (token) => {
        let range = `A${rowIndexToDelete+1}:G${rowIndexToDelete+1}`;
        let valueRange = {
            "majorDimension" : "ROWS",
            "range" : range,
            "values" : [
              [ "", "", "", "", "", ""]
            ]
        };

        let fetchOptions = {
            method : "PUT",
            headers: {
                Authorization : 'Bearer ' + token,
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(valueRange)
        };
        
        let fetchURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${range}?valueInputOption=RAW&key=${API_KEY}`
        fetch(fetchURL, fetchOptions)
        .then((response) => response.json())
        .then((obj) => {
            console.log(obj);
        });
    })

    // Check if we need to rearrange rows below the one we are deleting
    // if(rowIndexToDelete < sheet[0].length - 1) {
    //     // Rearrange

    // }
}

chrome.webNavigation.onDOMContentLoaded.addListener(() => {
    chrome.identity.getAuthToken( {interactive : true}, async (token) => {
        console.log("token is " + token);
        
        chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, async (userInfo) => {
            console.log(userInfo.id);
            
            users = await fetchAllUsers();
            
            console.log(users);
            currentUser = userInfo.id;

            if(!users.includes(userInfo.id)) {
                users.push(userInfo.id);
                await chrome.storage.sync.set({ "users" : JSON.stringify(users) });
                createNewSheet(token);
                chrome.storage.sync.set( { [userInfo.id] : JSON.stringify({"sheetID": sheetID, "savedJobs": []})} );
            }

            sheetID = sheetID == "" ? await getSheetID(currentUser) : sheetID;
        });
    });
});

chrome.identity.onSignInChanged.addListener(async (accountInfo, signedIn) => {
    console.log("SIGN IN ACTIVITY");
    users = await fetchAllUsers();

    if(!users.includes(accountInfo.id)) {
        users.push(accountInfo.id);
        await chrome.storage.sync.set({ "users" : JSON.stringify(users) });
        chrome.identity.getAuthToken( {interactive : true}, async (token) => {
            createNewSheet(token);
        })
    }

    currentUser = accountInfo.id;

    chrome.tabs.query({ active : true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: "USER",
            userID: accountInfo.id,
            sheetID: sheetID
        });
    });
})

chrome.tabs.onUpdated.addListener((tabID, changeInfo, tab) => {
    if(tab.url && changeInfo.status === "complete" && tab.url.includes("linkedin.com/jobs/")) {
        const queryParameter = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameter);
        
        console.log(urlParameters.get("currentJobId"));
        let x = getSheet();
        console.log(x);
        chrome.tabs.sendMessage(tabID, {
            type: "NEW",
            user: currentUser,
            sheetID: sheetID,
            jobID: urlParameters.get("currentJobId")
        });
    }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if(request.type === "ADD-JOB") {
        console.log(request.jobInfo);
        appendToSheet(request.jobInfo);
    } else if(request.type === "DELETE-JOB") {
        deleteJob(request.jobID);
    }
                  
})

/*
    metrics tab
    5 last recently added tab
*/