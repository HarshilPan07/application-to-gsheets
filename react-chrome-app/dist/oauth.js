let users=[];window.onload=()=>{chrome.identity.getAuthToken({interactive:!0},(async e=>{console.log("token is "+e),chrome.identity.getProfileUserInfo({accountStatus:"ANY"},(async s=>{console.log(s.id),users=await fetchAllUsers(),console.log(users),users.includes(s.id)||(users.push(s.id),await chrome.storage.sync.set({users:JSON.stringify(users)}),createNewSheet(e)),currentUser=s.id,sheetID=""==sheetID?await getSheetID(currentUser):sheetID}))}))};