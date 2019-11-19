let inpNameCreate = document.getElementById('inpNameCreate');
let inpEmailCreate = document.getElementById('inpEmailCreate');
let inpPasswordCreate = document.getElementById('inpPasswordCreate');
let txtResultCreate = document.getElementById('txtResultCreate');

let inpNameLogin = document.getElementById('inpNameLogin');
let inpPasswordLogin = document.getElementById('inpPasswordLogin');
let txtResultLogin = document.getElementById('txtResultLogin');

let inpNameUpdate = document.getElementById('inpNameUpdate');
let inpEmailUpdate = document.getElementById('inpEmailUpdate');
let inpPasswordUpdate = document.getElementById('inpPasswordUpdate');
let txtResultUpdate = document.getElementById('txtResultUpdate');

let currentUser = {};

// --------------------------------------------------------------
const restAPIUser = {

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

//Store user credentials in Local Storage-------------------------------
function saveCredentials() {
    localStorage.setItem("userCredentials", JSON.stringify(currentUser));
}

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

//------------------------------------------
async function createUser() {
    if (inputValidation.validName(txtResultCreate, inpNameCreate) && inputValidation.validEmail(txtResultCreate, inpEmailCreate)
        && inputValidation.validPassword(txtResultCreate, inpPasswordCreate)) {
        let currentData = await restAPIUser.createUser(txtResultCreate, "/user", inpNameCreate.value, inpEmailCreate.value, inpPasswordCreate.value);
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

//----------------------------------------
async function loginUser() {
    let currentData = await restAPIUser.loginUser(txtResultLogin, "/user/auth", inpNameLogin.value, inpPasswordLogin.value);
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

//---------------------------------------
async function updateUser() {
    if (inputValidation.validName(txtResultUpdate, inpNameUpdate) && inputValidation.validEmail(txtResultUpdate, inpEmailUpdate)
        && inputValidation.validPassword(txtResultUpdate, inpPasswordUpdate)) {
        let currentData = await restAPIUser.updateUser(txtResultUpdate, `/user/${currentUser.ID}`, inpNameUpdate.value, inpEmailUpdate.value, inpPasswordUpdate.value);
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

//------------------------------------------
function deleteUser() {
    if (window.confirm("Are you sure you want to delete this account?")) {
        let del = restAPIUser.deleteUser(`/user/${currentUser.ID}`);
        if (del.code == HTTP_CODES.OK) {
            currentUser = {};
            emptyInputs();
            showStartPage();
            localStorage.clear();
        }
    }
}

//-----------------------------------------
function logoutUser() {
    currentUser = {};
    emptyInputs();
    showStartPage();
    localStorage.clear();
}

//-----------------------
function emptyInputs() {
    let inputs = document.querySelectorAll("input");
    for (let i of inputs) {
        i.value = "";
    }
}

//----------------------
function emptyTxtResult() {
    txtResultCreate.innerHTML = "";
    txtResultLogin.innerHTML = "";
    txtResultUpdate.innerHTML = "";
}