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
        "contentType": "json"
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
    
    fetch("https://sheets.googleapis.com/v4/spreadsheets/", fetchOptions)
    .then((response) => response.json())
    .then((obj) => {
        sheetID = obj["spreadsheetId"];
        let valueRange = {
            "range": "Sheet1!A1:G1",
            "majorDimension": "ROWS",
            "values": [
                ["Job ID","Company","Title", "Location", "Remote", "Date Applied", "Other Info."],
            ]
        };
        
        let fetchOptions = {
            method : "PUT",
            headers: {
                Authorization: 'Bearer ' + token,
            },
            body: valueRange
        };
        var fetchURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/A1:G1?key=${API_KEY}`;
        fetch(fetchURL, fetchOptions);
        console.log(obj);
    });

    {
    "spreadsheetId": "1ezIE7nqHcDBKydWYw0PW_fOF-UvBGUXCts8_BL6FHj4",
    "properties": {
        "title": "Untitled spreadsheet",
        "locale": "en_US",
        "autoRecalc": "ON_CHANGE",
        "timeZone": "Etc/GMT",
        "defaultFormat": {
            "backgroundColor": {
                "red": 1,
                "green": 1,
                "blue": 1
            },
            "padding": {
                "top": 2,
                "right": 3,
                "bottom": 2,
                "left": 3
            },
            "verticalAlignment": "BOTTOM",
            "wrapStrategy": "OVERFLOW_CELL",
            "textFormat": {
                "foregroundColor": {},
                "fontFamily": "arial,sans,sans-serif",
                "fontSize": 10,
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "foregroundColorStyle": {
                    "rgbColor": {}
                }
            },
            "backgroundColorStyle": {
                "rgbColor": {
                    "red": 1,
                    "green": 1,
                    "blue": 1
                }
            }
        },
        "spreadsheetTheme": {
            "primaryFontFamily": "Arial",
            "themeColors": [
                {
                    "colorType": "TEXT",
                    "color": {
                        "rgbColor": {}
                    }
                },
                {
                    "colorType": "BACKGROUND",
                    "color": {
                        "rgbColor": {
                            "red": 1,
                            "green": 1,
                            "blue": 1
                        }
                    }
                },
                {
                    "colorType": "ACCENT1",
                    "color": {
                        "rgbColor": {
                            "red": 0.25882354,
                            "green": 0.52156866,
                            "blue": 0.95686275
                        }
                    }
                },
                {
                    "colorType": "ACCENT2",
                    "color": {
                        "rgbColor": {
                            "red": 0.91764706,
                            "green": 0.2627451,
                            "blue": 0.20784314
                        }
                    }
                },
                {
                    "colorType": "ACCENT3",
                    "color": {
                        "rgbColor": {
                            "red": 0.9843137,
                            "green": 0.7372549,
                            "blue": 0.015686275
                        }
                    }
                },
                {
                    "colorType": "ACCENT4",
                    "color": {
                        "rgbColor": {
                            "red": 0.20392157,
                            "green": 0.65882355,
                            "blue": 0.3254902
                        }
                    }
                },
                {
                    "colorType": "ACCENT5",
                    "color": {
                        "rgbColor": {
                            "red": 1,
                            "green": 0.42745098,
                            "blue": 0.003921569
                        }
                    }
                },
                {
                    "colorType": "ACCENT6",
                    "color": {
                        "rgbColor": {
                            "red": 0.27450982,
                            "green": 0.7411765,
                            "blue": 0.7764706
                        }
                    }
                },
                {
                    "colorType": "LINK",
                    "color": {
                        "rgbColor": {
                            "red": 0.06666667,
                            "green": 0.33333334,
                            "blue": 0.8
                        }
                    }
                }
            ]
        }
    },
    "sheets": [
        {
            "properties": {
                "sheetId": 0,
                "title": "Sheet1",
                "index": 0,
                "sheetType": "GRID",
                "gridProperties": {
                    "rowCount": 1000,
                    "columnCount": 26
                }
            }
        }
    ],
    "spreadsheetUrl": "https://docs.google.com/spreadsheets/d/1ezIE7nqHcDBKydWYw0PW_fOF-UvBGUXCts8_BL6FHj4/edit"
}
*/