let presToEdit = document.getElementById("presToEdit"); //Do I need this?
let presName = document.getElementById("presName");

let txtResultSharing = document.getElementById("txtResultSharing");

// --------------------------------------------------------------
const HTTP_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409
}

const WAIT_TO_UPDATE = 5;

// ---------------- Presentations ---------------------------
let userPresentations = [];
let updateTimer = {
    value: 0,
    interval: null
}
let updateTasks = [];

let currentPres = {
    ID: null,
    name: "",
    owner: "",
    theme: ""
}

let selectedSlide = {
    slideid: null,
    data: {}
}

const restAPI = {
    createPresentation: async function (name, ownerID, theme) {

        let updata = {
            name: name,
            ownerID: ownerID,
            theme: theme
        }

        let cfg = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updata)
        }

        try {
            let resp = await fetch(`/presentation/`, cfg);
            let data = await resp.json();
            return data;
        }
        catch (err) {
            console.log(err);
        }

    },

    //----------------------------
    deletePresentation: async function (presID) {

        let cfg = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        }

        try {
            let resp = await fetch(`/presentation/${presID}`, cfg);
            let data = await resp.json();
            return data;

        }
        catch (err) {
            console.log(err);
        }
    },

    //----------------------------
    updatePresentation: async function (presID, name, theme) {

        let updata = {
            name: name,
            theme: theme
        }

        let cfg = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updata)
        }

        try {
            let resp = await fetch(`/presentation/${presID}`, cfg);
            let data = await resp.json();
            return data;

        }
        catch (err) {
            console.log(err);
        }
    },

    getPresentations: async function (ownerID) {
        try {
            let res = await fetch(`/presentation/${ownerID}`);
            let data = await res.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    },
    // ------------------ Slides ----------------------
    getSlides: async function (presID) {
        try {
            let resp = await fetch(`/presentation/slide/${presID}`);
            let data = await resp.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    },

    updateSlide: async function (slideID, slideData) {

        let updata = {
            data: slideData
        }

        let cfg = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updata)
        }

        try {
            let resp = await fetch(`/presentation/slide/${slideID}`, cfg);
            let data = await resp.json();
            return data;

        }
        catch (err) {
            console.log(err);
        }
    },

    // ------------------ Sharing ---------------------
    setPublicStatus: async function (presID, status) {
        let updata = {
            public: status
        };

        let cfg = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updata)
        }

        try {
            let resp = await fetch(`/presentation/${presID}/public`, cfg);
            let data = resp.json();
            return data;
        }
        catch (error) {
            console.log(error);
        }
    },

    shareWithUser: async function (presID, username) {
        let updata = {
            username: username
        };

        let cfg = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updata)
        }

        try {
            let resp = await fetch(`/presentation/${presID}/share`, cfg);
            let data = resp.json();
            return data;
        }
        catch (error) {
            console.log(error);
        }
    },

    unshareWithUser: async function (presID, userID) {
        let updata = {
            userID: userID
        };

        let cfg = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updata)
        }

        try {
            let resp = await fetch(`/presentation/${presID}/unshare`, cfg);
            let data = resp.json();
            return data;
        }
        catch (error) {
            console.log(error);
        }
    },

    getPublicPresentations: async function (userID) {
        try {
            let resp = await fetch(`/presentation/${userID}/public`);
            let data = await resp.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    },

    getSharedWithMePresentations: async function (userID) {
        try {
            let resp = await fetch(`/presentation/${userID}/shared-with-me`);
            let data = await resp.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }
}


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
        presContainer.innerHTML = `Error ${presentations.code}, ${presentations.msg}`; //Should be a describing error message
    }

}

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
        presContainer.innerHTML = `Error ${presentations.code}, ${presentations.msg}`;
    }

}

async function createPresentation() {
    let createdPres = await restAPI.createPresentation("New presentation", currentUser.ID, "default");
    console.log(createdPres);
    if (createdPres.code === HTTP_CODES.CREATED) {
        loadEditView();
    }
}

function displaySlide() {
    clearDiv(divSelectedSlide);
    slideType = selectedSlide.data.type;
    let tmp1 = document.getElementById(`temp-slide${slideType}`).content.cloneNode(true);
    switch (slideType) {
        case "A":
            tmp1.querySelector(".title").value = selectedSlide.data.text;
            tmp1.querySelector(".title").addEventListener("input", (e) => {
                changeSlideText(selectedSlide, e.target.value);
            });
            divSelectedSlide.appendChild(tmp1);
            break;
        case "B":
            tmp1.querySelector(".slide__text").value = selectedSlide.data.text;
            tmp1.querySelector(".slide__text").addEventListener("input", (e) => {
                changeSlideText(selectedSlide, e.target.value);
            });

            tmp1.querySelector(".image__link").value = selectedSlide.data.image;
            tmp1.querySelector(".slide__image").src = selectedSlide.data.image;
            tmp1.querySelector(".image__link").addEventListener("change", (e) => {
                changeSlideImage(selectedSlide, e.target.parentNode.children[3], e.target.value); //doesn't look the cleanest but works
            });

            divSelectedSlide.appendChild(tmp1);
            break;
        case "C":
            let counter = 0;
            for (let point of selectedSlide.data.list) {
                let tmp2 = document.getElementById("temp-listObject").content.cloneNode(true);
                let id = counter;
                tmp2.querySelector(".slide__listText").value = point;
                tmp2.querySelector(".slide__listText").addEventListener("input", (e) => {
                    changeSlideList(selectedSlide, e.target, id);
                });

                tmp2.querySelector(".slide__deleteListObj").addEventListener("click", (e) => {
                    removeBulletPoint(e, id);
                });

                tmp1.querySelector(".slide__list").appendChild(tmp2);
                counter++;
            }
            divSelectedSlide.appendChild(tmp1);
            break;
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
    loadEditView(currentPres.ID);
}

async function loadEditView() {
    window.location.href = "#editview";
    showEditView();
    presName.value = currentPres.name;
    document.getElementById('sharing').value="";

    let slides = await restAPI.getSlides(currentPres.ID);
    if (slides.code === HTTP_CODES.OK) {
        if (slides.data.length > 0) {
            for (let slide of slides.data) {
                let tmp1 = document.getElementById("edit-slideoverview-temp").content.cloneNode(true);
                let slideObject = tmp1.querySelector(".edit-slideoverview");
                slideObject.innerText = `# ${slide.slideid}`;
                slideObject.addEventListener("click", (e) => {
                    let index = slides.data.map(function (e) {
                        return e.slideid;
                    }).indexOf(parseInt(e.currentTarget.innerHTML.split(" ")[1]));

                    selectedSlide = slides.data[index];
                    displaySlide();
                });
                slideList.appendChild(tmp1);
            }
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

function splitTime(timestamp) {
    let splitTimestamp = timestamp.split(/[T,.,]+/);
    let time = {
        date: splitTimestamp[0],
        clock: splitTimestamp[1]
    }
    return time;
}

function changeTheme(presentation, selectedTheme) {
    presentation.theme = selectedTheme;
}

function changeBgColor(slide, selectedColor) {
    slide.data.bgColor = selectedColor;
}

function changeSlideText(slideToChange, slideText) {
    slideToChange.data.text = slideText;
    runUpdateTimer();
}

function changeSlideImage(slideToChange, slideImage, imageLink) {
    slideToChange.data.image = imageLink;
    slideImage.src = imageLink;
    runUpdateTimer();
}

function changeSlideList(slideToChange, listObj, listObjID) {
    slideToChange.data.list[listObjID] = listObj.value;
    runUpdateTimer();
}

function addBulletPoint() {
    let tmp1 = document.getElementById("temp-listObject").content.cloneNode(true);
    let list = divSelectedSlide.querySelector(".slide__list");
    selectedSlide.data.list.push(list.value);

    let count = selectedSlide.data.list.length - 1;
    let id = count;

    tmp1.querySelector(".slide__listText").addEventListener("input", (e) => {
        changeSlideList(selectedSlide, e.target, id);
    });

    tmp1.querySelector(".slide__deleteListObj").addEventListener("click", (e) => {
        removeBulletPoint(e, id);
    });
    list.appendChild(tmp1);
}

function removeBulletPoint(e, id) {
    selectedSlide.data.list.splice(id, 1);
    runUpdateTimer();
    displaySlide();
}

function hideAllPages(pages, divs) {
    for (let page of pages) {
        page.style.display = "none";
    }
    for (let div of divs) {
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
    }
}

function clearDiv(div) {
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

function changePresName() {
    currentPres.name = presName.value;
    runUpdateTimer()
}

function runUpdateTimer() {
    updateTimer.value = 0;
    updateTasks.push({currentPres, selectedSlide});
    clearInterval(updateTimer.interval);
    updateTimer.interval = setInterval(() => {
        updateTimer.value++;
        console.log(updateTimer.value);
        if (updateTimer.value === WAIT_TO_UPDATE) {
            updatePresentation();
            clearInterval(updateTimer.interval);
        }
    }, 1000);
}

async function updatePresentation() {
    let presIDsToUpdate = [...new Set(updateTasks.map(item => item.currentPres.ID))];
    let slideIDStoUpdate = [...new Set(updateTasks.map(item => item.selectedSlide.slideid))];
    let presUpdateList = [];
    let slideUpdateList = [];
    for(id of presIDsToUpdate) {
        let item = updateTasks.find(obj => {
            return obj.currentPres.ID === id;
        });
        presUpdateList.push(item);
    }

    for(id of slideIDStoUpdate) {
        let item = updateTasks.find(obj => {
            return obj.selectedSlide.slideid === id;
        });
        slideUpdateList.push(item);
    }

    for (let task of presUpdateList) {
        let presUpd = await restAPI.updatePresentation(task.currentPres.ID, task.currentPres.name, task.currentPres.theme);
        let slideUpd = {};
        if (task.selectedSlide.slideid === null) {
            slideUpd.code = HTTP_CODES.OK;
        } else {
            for(let slide of slideUpdateList) {
                slideUpd = await restAPI.updateSlide(slide.selectedSlide.slideid, slide.selectedSlide.data);
            }
        }
        if (presUpd.code === HTTP_CODES.OK && slideUpd.code === HTTP_CODES.OK) {
            //Tell user pres has saved
            console.log("Signal to user that presentation is updated");
        } else {
            //tell user that changes are only local
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