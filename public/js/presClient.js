//Own presentations / "shared with me" presentation overview
async function loadPresOverview(isShared) {
    showPresentationOverview();

    userPresentations = [];
    let presentations = null;
    if (isShared) {
        presentations = await restAPI.getSharedWithMePresentations(currentUser.ID);
        presOverview.querySelector("h1").innerHTML = "Shared with me"
        document.getElementById("overview-create-pres-btn").style = "display:none";
    } else {
        presentations = await restAPI.getPresentations(currentUser.ID);
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
                    await restAPI.deletePresentation(presentation.presentationid);
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
    let presentations = await restAPI.getPublicPresentations(currentUser.ID);
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
    let createdPres = await restAPI.createPresentation("New presentation", currentUser.ID, "default");
    console.log(createdPres);
    if (createdPres.code === HTTP_CODES.CREATED) {
        loadEditView();
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
    let last_updated_time = splitTime(currentPres.last_updated);
    setSaveText(`Last updated: ${last_updated_time.clock}`);

    let slides = await restAPI.getSlides(currentPres.ID);
    helperSlides = slides;
    if (slides.code === HTTP_CODES.OK) {
        if (slides.data.length > 0) {
            /*for (let slide of slides.data) {
                let tmp1 = document.getElementById("edit-slideoverview-temp").content.cloneNode(true);
                let slideObject = tmp1.querySelector(".edit-slideoverview");
                slideObject.innerText = `# ${slide.slideid}`;
                slideObject.addEventListener("click", (e) => {
                    let index = slides.data.map(function (e) {
                        return e.slideid;
                    }).indexOf(parseInt(e.currentTarget.innerHTML.split(" ")[1]));

                    selectedSlide = slides.data[index];
                    setSlideType(selectedSlide.data.type)
                    displaySlide();
                });
                slideList.appendChild(tmp1);
            }*/
            selectedSlide.slideid = slides.data[0].slideid;
            selectedSlide.data = slides.data[0].data;
            setSlideType(selectedSlide.data.type)
            displaySlide();
        } else {
            console.log("show text");
        }
    } else if (slides.code === HTTP_CODES.NOT_FOUND) {
        divSelectedSlide.innerHTML = "This presentation has no slides yet";
    }
}

function changeTheme(presentation, selectedTheme) {
    presentation.theme = selectedTheme;
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
        let presUpd = await restAPI.updatePresentation(task.currentPres.ID, task.currentPres.name, task.currentPres.theme);
        let slideUpd = {};
        if (task.selectedSlide.slideid === null) {
            slideUpd.code = HTTP_CODES.OK;
        } else {
            for (let slide of slideUpdateList) {
                slideUpd = await restAPI.updateSlide(slide.selectedSlide.slideid, slide.selectedSlide.data);
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
async function setStatus(){
    let status = document.getElementById('sharing').value;
    if(status == "public"){
        let data = await restAPI.setPublicStatus(currentPres.ID, "true");
        txtResultSharing.innerHTML = data.msg;
    }
    else if(status == "private"){
        let data = await restAPI.setPublicStatus(currentPres.ID, "false");
        txtResultSharing.innerHTML = data.msg;
    }
    else if(status == "individual"){
        document.getElementById('sharing').value = "";
        let user = window.prompt("Insert the username of the user you want to share the presenation with");
        if(user && user != ""){
            let data = await restAPI.shareWithUser(currentPres.ID, user);
            txtResultSharing.innerHTML = data.msg;
        }
    }
}