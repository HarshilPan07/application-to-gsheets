let users = [];

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
