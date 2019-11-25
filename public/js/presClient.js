//Displays own and/or "shared with me" presentation overview
async function loadPresOverview(isShared) {
    showPresentationOverview();

    userPresentations = [];
    let presentations = null;
    if (isShared) {
        presentations = await presServerReq.getSharedWithMePresentations(currentUser.ID);
        presOverview.querySelector("h1").innerHTML = "Shared with me"
        document.getElementById("overview-create-pres-btn").style = "display:none";
    } else {
        presentations = await presServerReq.getPresentations(currentUser.ID);
        presOverview.querySelector("h1").innerHTML = "My Presentations"
        document.getElementById("overview-create-pres-btn").style = "display:auto";
    }
    if (presentations.code === HTTP_CODES.OK) {
        for (let presentation of presentations.presentations) {
            userPresentations.push(presentation);
            let tmp1 = document.getElementById('overviewTemp').content.cloneNode(true);

            tmp1.querySelector("div").addEventListener("click", function (e) {
                initEditPresentation(e);
            });
            tmp1.querySelector(".overview-presname").innerText = presentation.name;
            tmp1.querySelector(".overview-slides").innerText += presentation.slides.length;
            tmp1.querySelector(".overview-theme").innerText += presentation.theme;
            tmp1.querySelector(".overview-hiddenid").innerText = presentation.presentationid;
            if (presentation.public == true) {
                tmp1.querySelector(".overview-public-status").innerText += "Public";
            }
            else {
                tmp1.querySelector(".overview-public-status").innerText += "Private";
            }
            let lastUpdated = splitTime(presentation.last_updated);
            tmp1.querySelector(".overview-last-updated").innerText += `${lastUpdated.date}, ${lastUpdated.clock}`;
            if (isShared) {
                tmp1.querySelector(".overview-delete-button").style = "display:none";
            }
            else {
                tmp1.querySelector(".overview-delete-button").onclick = async function (evt) {
                    await presServerReq.deletePresentation(presentation.presentationid);
                    loadPresOverview();
                }
            }
            presContainer.appendChild(tmp1);
        }
    } else {
        presContainer.innerHTML = `${presentations.msg}`;
    }

}

//List public presentations
async function loadPublicPresentations() {
    showPublicPresPage();
    userPresentations = [];
    let presentations = await presServerReq.getPublicPresentations(currentUser.ID);
    presOverview.querySelector("h1").innerHTML = "Public Presentations"
    document.getElementById("overview-create-pres-btn").style = "display:none";
    if (presentations.code === HTTP_CODES.OK) {
        for (let presentation of presentations.presentations) {
            userPresentations.push(presentation);
            let tmp1 = document.getElementById('overviewTemp').content.cloneNode(true);

            tmp1.querySelector("div").addEventListener("click", function (e) {
                initEditPresentation(e);
            });
            tmp1.querySelector(".overview-presname").innerText = presentation.name;
            tmp1.querySelector(".overview-slides").innerText += presentation.slides.length;
            tmp1.querySelector(".overview-theme").innerText += presentation.theme;
            tmp1.querySelector(".overview-hiddenid").innerText = presentation.presentationid;
            tmp1.querySelector(".overview-public-status").innerText += "Public";
            tmp1.querySelector(".overview-delete-button").style = "display:none";
            console.log(document.getElementById('sharing').value);
            let lastUpdated = splitTime(presentation.last_updated);
            tmp1.querySelector(".overview-last-updated").innerText += `${lastUpdated.date}, ${lastUpdated.clock}`;
            presContainer.appendChild(tmp1);
        }
    } else {
        presContainer.innerHTML = `${presentations.msg}`;
    }

}

async function createPresentation() {
    let createdPres = await presServerReq.createPresentation("New presentation", currentUser.ID, "default");
    console.log(createdPres);
    if (createdPres.code === HTTP_CODES.CREATED) {
        loadPresOverview();
    }
}

function initEditPresentation(e) {
    let presID = parseInt(e.currentTarget.querySelector("div").innerText);

    let index = userPresentations.map(function (e) {
        return e.presentationid;
    }).indexOf(presID);

    currentPres.ID = userPresentations[index].presentationid;
    currentPres.name = userPresentations[index].name;
    currentPres.owner = userPresentations[index].ownerid;
    currentPres.theme = userPresentations[index].theme;
    currentPres.last_updated = userPresentations[index].last_updated;
    loadEditView(currentPres.ID);
}

async function loadEditView() {
    window.location.href = "#editview";
    showEditView();
    presName.value = currentPres.name;
    document.getElementById('sharing').value="";
    document.getElementById('slide-type-selection').value="";
    document.getElementById('theme-selection').value=currentPres.theme;
    loadTheme();
    let last_updated_time = splitTime(currentPres.last_updated);
    setSaveText(`Last updated: ${last_updated_time.clock}`);

    let slides = await presServerReq.getSlides(currentPres.ID);
    if (slides.code === HTTP_CODES.OK) {
        helperSlides.code = slides.code;
        helperSlides.data = slides.data;
        if (slides.data.length > 0) {
            selectedSlide.slideid = slides.data[0].slideid;
            selectedSlide.data = slides.data[0].data;
            displaySlide();
        } else {
            console.log("show text");
        }
    } else if (slides.code === HTTP_CODES.NOT_FOUND) {
        divSelectedSlide.innerHTML = "This presentation has no slides yet";
    }
}

function loadTheme(){
    if(currentPres.theme == "default"){
        loadCSSFile("css/themes/default-theme.css", "default-theme");
        removeCSSFile("orange-theme");
    }
    else if(currentPres.theme == "orange"){
        loadCSSFile("css/themes/orange-theme.css", "orange-theme");
        removeCSSFile("default-theme");
    }
}

async function setTheme(){
    let currentTheme = document.getElementById("theme-selection").value;
    if(currentTheme == "default"){
        currentPres.theme = "default";
        await presServerReq.updatePresentation(currentPres.ID, currentPres.name, currentPres.theme);
    }
    else if(currentTheme == "orange"){
        loadCSSFile("css/themes/orange-theme.css");
        currentPres.theme = "orange";
        await presServerReq.updatePresentation(currentPres.ID, currentPres.name, currentPres.theme);
    }
    loadTheme();
}

function changePresName() {
    currentPres.name = presName.value;
    runUpdateTimer()
}

async function updatePresentation() {
    let presIDsToUpdate = [...new Set(updateTasks.map(item => item.currentPres.ID))];
    let slideIDStoUpdate = [...new Set(updateTasks.map(item => item.selectedSlide.slideid))];
    let presUpdateList = [];
    let slideUpdateList = [];
    for (id of presIDsToUpdate) {
        let item = updateTasks.find(obj => {
            return obj.currentPres.ID === id;
        });
        presUpdateList.push(item);
    }

    for (id of slideIDStoUpdate) {
        let item = updateTasks.find(obj => {
            return obj.selectedSlide.slideid === id;
        });
        slideUpdateList.push(item);
    }

    for (let task of presUpdateList) {
        setSaveText("saving changes");
        let presUpd = await presServerReq.updatePresentation(task.currentPres.ID, task.currentPres.name, task.currentPres.theme);
        let slideUpd = {};
        if (task.selectedSlide.slideid === null) {
            slideUpd.code = HTTP_CODES.OK;
        } else {
            for (let slide of slideUpdateList) {
                slideUpd = await presServerReq.updateSlide(slide.selectedSlide.slideid, slide.selectedSlide.data);
            }
        }
        if (presUpd.code === HTTP_CODES.OK && slideUpd.code === HTTP_CODES.OK) {
            setSaveText("All changes saved");
            console.log("Signal to user that presentation is updated");
        } else {
            setSaveText("Changes not saved");
            console.log("signal to user that presentation did not update?")
        }
    }
    updateTasks = [];
}

//Sharing functions-----------------------------------
async function setStatus() {
    let status = document.getElementById('sharing').value;
    if (status == "public") {
        let data = await presServerReq.setPublicStatus(currentPres.ID, "true");
        txtResultSharing.innerHTML = data.msg;
    }
    else if (status == "private") {
        let data = await presServerReq.setPublicStatus(currentPres.ID, "false");
        txtResultSharing.innerHTML = data.msg;
    }
    else if(status == "individual-share"){
        document.getElementById('sharing').value = "";
        let user = window.prompt("Share with user: (insert username)");
        if(user && user != ""){
            let data = await presServerReq.shareWithUser(currentPres.ID, user);
            txtResultSharing.innerHTML = data.msg;
        }
    }
    else if(status == "individual-unshare"){
        document.getElementById('sharing').value = "";
        let user = window.prompt("Unshare with user: (insert username)");
        if(user && user != ""){
            let data = await presServerReq.unshareWithUser(currentPres.ID, user);
            txtResultSharing.innerHTML = data.msg;
        }
    }
}


function startFullScreen() {
        presToEdit.requestFullscreen(); 
};

document.body.addEventListener("keydown", function (evt) {

    if (evt.keyCode == 39) {
        displayNextSlide();
    } else if (evt.keyCode == 37) {
        displayPreviousSlide();
    }
});
