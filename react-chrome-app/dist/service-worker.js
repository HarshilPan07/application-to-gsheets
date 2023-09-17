const API_KEY="AIzaSyBv5-AM7qNAF8kdOmNr8zF1pLSkIQ7XWJA",DEFAULT_VALUE_RANGE={majorDimension:"ROWS",range:"A1:G1",values:[["Job ID","Company","Title","Location","Remote","Date Applied","Other Info."]]};let users=[],currentUser="",sheet=null,sheetID="";const fetchAllUsers=()=>new Promise((e=>{chrome.storage.sync.get(["users"],(t=>{e(t.users?JSON.parse(t.users):[])}))})),getSheetID=e=>new Promise((t=>{chrome.storage.sync.get(e,(s=>{t(s?JSON.parse(s[e]).sheetID:"")}))})),createNewSheet=async e=>{let t={method:"POST",async:!0,headers:{Authorization:"Bearer "+e,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({properties:{title:"Job Application Tracker"}}),contentType:"json"};fetch("https://sheets.googleapis.com/v4/spreadsheets",t).then((e=>e.json())).then((t=>{console.log(t),sheetID=t.spreadsheetId;let s={method:"PUT",headers:{Authorization:"Bearer "+e,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(DEFAULT_VALUE_RANGE)};fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/A1:G1?valueInputOption=RAW&key=${API_KEY}`,s).then((e=>e.json())).then((e=>{console.log("updated "+e)}))}))},getSheet=async()=>new Promise((e=>{chrome.identity.getAuthToken({interactive:!0},(async t=>{let s={method:"GET",headers:{Authorization:"Bearer "+t,Accept:"application/json"}},o=`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/Sheet1?key=${API_KEY}`;return await fetch(o,s).then((e=>e.json())).then((t=>{console.log(t),e(t.values)}))}))})),appendToSheet=e=>{chrome.identity.getAuthToken({interactive:!0},(async t=>{let s={majorDimension:"ROWS",range:"A1:G1",values:[[e.currentJob,e.company,e.title,e.location,e.remote,e.date]]},o={method:"POST",headers:{Authorization:"Bearer "+t,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(s)};fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/A1:G1:append?valueInputOption=RAW&key=${API_KEY}`,o).then((e=>e.json())).then((e=>{sheet.push(s.values[0]),console.log(e)}))}))},deleteJob=async e=>{let t;console.log("just before deleting:",sheet),console.log(e);for(let s=0;s<sheet.length;s++)sheet[s][0]===e&&(t=s);console.log(t),chrome.identity.getAuthToken({interactive:!0},(async s=>{if(t<sheet.length-1){let o=[];for(let e=t;e<sheet.length;e++){let t={range:`A${e+1}:G${e+1}`,majorDimension:"ROWS"};e===sheet.length-1?t.values=[["","","","","",""]]:t.values=[sheet[e+1]],o.push(t)}let n={valueInputOption:"RAW",data:o},a=`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values:batchUpdate?key=${API_KEY}`,i={method:"POST",headers:{Authorization:"Bearer "+s,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(n)};console.log(n),fetch(a,i).then((e=>e.json())).then((t=>{console.log(t),sheet=sheet.filter((t=>t[0]!==e))}))}else{let o=`A${t+1}:G${t+1}`,n={majorDimension:"ROWS",range:o,values:[["","","","","",""]]},a={method:"PUT",headers:{Authorization:"Bearer "+s,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(n)};fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${o}?valueInputOption=RAW&key=${API_KEY}`,a).then((e=>e.json())).then((t=>{console.log(t),sheet=sheet.filter((t=>t[0]!==e))}))}}))},getTodaysJobs=async()=>{null===sheet&&await initializeUserInfo();const e=new Date,t=(e.getMonth(),e.getMonth(),e.getDate(),e.getFullYear(),[]);for(let e=0;e<sheet.length;e++)"09/2/2023"===sheet[e][5]&&t.push(sheet[e]);return t},initializeUserInfo=async()=>{chrome.identity.getAuthToken({interactive:!0},(async e=>{console.log("token is "+e),chrome.identity.getProfileUserInfo({accountStatus:"ANY"},(async t=>{var s;console.log(t.id),users=await fetchAllUsers(),console.log(users),currentUser=t.id,users.includes(t.id)||(users.push(t.id),await chrome.storage.sync.set({users:JSON.stringify(users)}),await createNewSheet(e),await chrome.storage.sync.set({[t.id]:JSON.stringify({sheetID:sheetID,savedJobs:[]})})),sheetID=""===sheetID?await(s=currentUser,new Promise((e=>{chrome.storage.sync.get(s,(t=>{e(t?JSON.parse(t[s]).sheetID:"")}))}))):sheetID,sheet=""===sheetID?[]:await getSheet()}))}))};chrome.webNavigation.onDOMContentLoaded.addListener((()=>{chrome.tabs.query({active:!0},(async e=>{e[0].url.includes("linkedin.com")&&await initializeUserInfo()}))})),chrome.identity.onSignInChanged.addListener((async(e,t)=>{console.log("SIGN IN ACTIVITY"),users=await fetchAllUsers(),users.includes(e.id)||(users.push(e.id),await chrome.storage.sync.set({users:JSON.stringify(users)}),chrome.identity.getAuthToken({interactive:!0},(async e=>{createNewSheet(e)}))),currentUser=e.id,chrome.tabs.query({active:!0},(t=>{chrome.tabs.sendMessage(t[0].id,{type:"USER",userID:e.id,sheetID:sheetID})}))})),chrome.tabs.onUpdated.addListener(((e,t,s)=>{if(s.url&&"complete"===t.status&&s.url.includes("linkedin.com/jobs/")){const t=s.url.split("?")[1],o=new URLSearchParams(t);console.log(o.get("currentJobId")),console.log("inside tabsupdated",sheet),chrome.tabs.sendMessage(e,{type:"NEW",user:currentUser,sheetID:sheetID,jobID:o.get("currentJobId")})}})),chrome.runtime.onMessage.addListener(((e,t,s)=>{var o;return console.log(t.tab?"from a content script:"+t.tab.url:"from the extension"),"ADD-JOB"===e.type?(console.log(e.jobInfo),o=e.jobInfo,chrome.identity.getAuthToken({interactive:!0},(async e=>{let t={majorDimension:"ROWS",range:"A1:G1",values:[[o.currentJob,o.company,o.title,o.location,o.remote,o.date]]},s={method:"POST",headers:{Authorization:"Bearer "+e,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)};fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/A1:G1:append?valueInputOption=RAW&key=${API_KEY}`,s).then((e=>e.json())).then((e=>{sheet.push(t.values[0]),console.log(e)}))}))):"DELETE-JOB"===e.type?deleteJob(e.jobID):"GET-TODAYS-JOBS"===e.type&&(async()=>{const e=await getTodaysJobs();s({todaysJobs:e})})(),!0}));