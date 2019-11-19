let presToEdit = document.getElementById("presToEdit"); //Do I need this?
let presName = document.getElementById("presName");

// --------------------------------------------------------------
const HTTP_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409
}

// ---------------- Presentations ---------------------------
let userPresentations = [];
let updateTimer = {
    value: 0,
    interval: null
}

let currentPres = {
    ID: "",
    name: "",
    owner: "",
    theme: ""
}

let selectedSlide = {
    ID: "",
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
            presContainer.appendChild(tmp1);
        }
    } else {
        presContainer.innerHTML = `Error ${presentations.code}, ${presentations.msg}`; //Should be a describing error message
    }

}

async function loadPublicPresentations(){
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
            if (presentation.public == true) {
                tmp1.querySelector(".overview-public-status").innerText += "Public";
            }
            else {
                tmp1.querySelector(".overview-public-status").innerText += "Private";
            }

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
        //Load edit view with created presentation
    }
}

function displaySlide() {
    let tmp1 = document.getElementById(`temp-slide${selectedSlide.data.type}`).content.cloneNode(true);
    let slideTitle = tmp1.querySelector(".title");
    slideTitle.value = selectedSlide.data.title
    slideTitle.addEventListener("input", (e) => {
        selectedSlide.data.title = slideTitle.value;
        runUpdateTimer();
    });
    divSelectedSlide.appendChild(slideTitle);
    console.log(slideTitle);
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
                    console.log(selectedSlide);
                    displaySlide();
                });
                slideList.appendChild(tmp1);
            }
            selectedSlide.ID = slides.data[0].slideid;
            selectedSlide.data = slides.data[0].data;

            displaySlide();
        } else {
            divSelectedSlide.innerHTML = "You have no slides yet";
        }
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

function updateSlide() {
    restAPI.updateSlide(selectedSlide.ID, selectedSlide.data);
}

function changePresName() {
    currentPres.name = presName.value;
    runUpdateTimer()
}

function runUpdateTimer() {
    updateTimer.value = 0;
    clearInterval(updateTimer.interval);
    updateTimer.interval = setInterval(() => {
        updateTimer.value++;
        console.log(updateTimer.value);
        if (updateTimer.value === 5) {
            updatePresentation();
            clearInterval(updateTimer.interval);
        }
    }, 1000);

}

async function updatePresentation() {
    //Tell user that pres is saving
    let presUpd = await restAPI.updatePresentation(currentPres.ID, currentPres.name, currentPres.theme);
    let slideUpd = await restAPI.updateSlide(selectedSlide.ID, selectedSlide.data);
    if(presUpd.code === HTTP_CODES.OK && slideUpd.code === HTTP_CODES.OK) {
        //Tell user pres has saved
        console.log("Signal to user that presentation is updated");
    } else {
        //tell user that changes are only local
        console.log("signal to user that presentation did not update?")
    }
}