
const userServerReq = {

    //------------------------
    createUser: async function(result, url, username, email, password){

        let updata = {
            name: username,
            email: email,
            password: password            
        }

        let cfg = {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(updata)
        }

        try {
            let resp = await fetch(url, cfg);
            let data = await resp.json();
            result.innerHTML = data.msg;
            return data;            
        }
        catch (err) {
            console.log(err);
        }
    },

    //------------------------
    loginUser: async function(result, url, username, password){

        let updata = {
            name: username,
            password: password            
        }

        let cfg = {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(updata)
        }

        try{
            let resp = await fetch(url, cfg);
            let data = await resp.json();
            result.innerHTML = data.msg;
            return data;
            
        }
        catch(err){
            console.log(err);
        }
    },

    //------------------------
    updateUser: async function(result, url, username, email, password){ 
        
        let updata = {
            name: username,
            email: email,
            password: password
        }

        let cfg = {
            method: "PUT",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(updata)
        }

        try{
            let resp = await fetch(url, cfg);
            let data = await resp.json();
            result.innerHTML = data.msg;
            return data;
            
        }
        catch(err){
            console.log(err);
        }
    },

    //------------------------
    deleteUser: async function(url){
        let cfg = {
            method: "DELETE",
            headers: {"Content-Type":"application/json"},
        }

        try{
            let resp = await fetch(url, cfg);
            let data = await resp.json();
            return data;
            
        }
        catch(err){
            console.log(err);
        }
    }
}

//Automatically login if the user did not logout from the previous session
retrieveCredentials();

//Store user credentials in Local Storage -------------------------------
function saveCredentials() {
    localStorage.setItem("userCredentials", JSON.stringify(currentUser));
}

// Gets the user credentials from Local Storage (if they exist) ---------
function retrieveCredentials() {
    let data = localStorage.getItem("userCredentials");
    if (data) {
        currentUser = JSON.parse(data);
        showPresentationOverview();
        loadPresOverview();
    }
    else {
        currentUser.ID = "";
        currentUser.username = "";
        currentUser.email = "";
    }
}

// Creates a new user ------------------
async function createUser() {
    if (inputValidation.validName(txtResultCreate, inpNameCreate) && inputValidation.validEmail(txtResultCreate, inpEmailCreate)
        && inputValidation.validPassword(txtResultCreate, inpPasswordCreate)) {
        let currentData = await userServerReq.createUser(txtResultCreate, "/user", inpNameCreate.value, inpEmailCreate.value, inpPasswordCreate.value);
        if (currentData.code == HTTP_CODES.CREATED) {
            currentUser.ID = currentData.userID;
            currentUser.username = currentData.userName;
            currentUser.email = currentData.userEmail;
            inpNameUpdate.value = currentUser.username;
            inpEmailUpdate.value = currentUser.email;
            saveCredentials();
            showPresentationOverview();
            loadPresOverview();
        }
    }
}

// Logs in user based on username and password ------------
async function loginUser() {
    let currentData = await userServerReq.loginUser(txtResultLogin, "/user/auth", inpNameLogin.value, inpPasswordLogin.value);
    if (currentData.code == HTTP_CODES.OK) {
        currentUser.ID = currentData.userID;
        currentUser.username = currentData.userName;
        currentUser.email = currentData.userEmail;
        inpNameUpdate.value = currentUser.username;
        inpEmailUpdate.value = currentUser.email;
        saveCredentials();
        showPresentationOverview();
        loadPresOverview();
    }
}

// Updates user credentials in DB --------------------
async function updateUser() {
    if (inputValidation.validName(txtResultUpdate, inpNameUpdate) && inputValidation.validEmail(txtResultUpdate, inpEmailUpdate)
        && inputValidation.validPassword(txtResultUpdate, inpPasswordUpdate)) {
        let currentData = await userServerReq.updateUser(txtResultUpdate, `/user/${currentUser.ID}`, inpNameUpdate.value, inpEmailUpdate.value, inpPasswordUpdate.value);
        if (currentData.code == HTTP_CODES.OK) {
            currentUser.username = currentData.userName;
            currentUser.email = currentData.userEmail;
            inpNameUpdate.value = currentUser.username;
            inpEmailUpdate.value = currentUser.email;
            saveCredentials();
        }
        inpPasswordUpdate.value = "";
    }
}

// Deletes the user from the DB -------------------
async function deleteUser() {
    if (window.confirm("Are you sure you want to delete this account?")) {
        delPresByUser(currentUser.ID);
        removeUserFromShared(currentUser.ID);
        let del = await userServerReq.deleteUser(`/user/${currentUser.ID}`);
        if (del.code == HTTP_CODES.OK) {
            currentUser = {};
            emptyInputs();
            showStartPage();
            localStorage.clear();
        }
    }
}

//Delete presentations created by a specific user ---------------
async function delPresByUser(userID){
    let pres = await presServerReq.getPresentations(userID);
    if(pres.code == HTTP_CODES.OK){
        for (presentation of pres.presentations){
            await presServerReq.deletePresentation(presentation.presentationid);
        }
    }
}

// Remove user from the sharedusers array of all presentations shared with him ------------
async function removeUserFromShared(userID){
    let pres = await presServerReq.getSharedWithMePresentations(userID);
    if(pres.code == HTTP_CODES.OK){
        for (presentation of pres.presentations){
            await presServerReq.unshareWithUser(presentation.presentationid, userID);
        }
    }
}

// Logs out user ---------------------------------
function logoutUser() {
    currentUser = {};
    emptyInputs();
    showStartPage();
    localStorage.clear();
}