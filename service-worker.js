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
    var fetchOptions = {
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
    
    var fetchURL = `https://sheets.googleapis.com/v4/spreadsheets`
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
        
        var fetchURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/A1:G1?valueInputOption=RAW&key=${API_KEY}`;
        fetch(fetchURL, fetchOptions)
        .then((response) => response.json())
        .then((obj) => {
            console.log("updated " + obj);
        }); 
    });
}

window.onload = () => {
    chrome.identity.getAuthToken( {interactive : true}, async (token) => {
        console.log("token is " + token);
        
        chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, async (userInfo) => {
            console.log(userInfo.id);
            
            users = await fetchAllUsers();
            
            console.log(users);

            if(!users.includes(userInfo.id)) {
                users.push(userInfo.id);
                await chrome.storage.sync.set({ "users" : JSON.stringify(users) });
                createNewSheet(token);
            } 
            
            // createNewSheet(token);
            currentUser = userInfo.id;
            sheetID = sheetID == "" ? await getSheetID(currentUser) : sheetID;
        });
    });
};

chrome.identity.onSignInChanged.addListener(async (accountInfo, signedIn) => {
    console.log("SIGN IN ACTIVITY");
    chrome.storage.sync.get("users").then((res) => {
        users = JSON.parse(res["users"]);
    })

    if(!users.includes(accountInfo.id)) {
        users.push(accountInfo.id);
        await chrome.storage.sync.set({ "users" : JSON.stringify(users) });
    }

    currentUser = accountInfo.id;

    chrome.tabs.query({ active : true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: "USER",
            userID: accountInfo.id
        });
    });
})

chrome.tabs.onUpdated.addListener((tabID, changeInfo, tab) => {
    if(tab.url && changeInfo.status === "complete" && tab.url.includes("linkedin.com/jobs/")) {
        const queryParameter = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameter);
        
        console.log(urlParameters.get("currentJobId"));

        chrome.tabs.sendMessage(tabID, {
            type: "NEW",
            user: currentUser,
            sheetID: sheetID,
            jobID: urlParameters.get("currentJobId")
        });
    }
})


/*
    metrics tab
    5 last recently added tab
*/