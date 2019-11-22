let startPage = document.getElementById('startPage');
let userPage = document.getElementById('userPage');

let presOverview = document.getElementById("overview");
let editView = document.getElementById("editview");
let pageList = [presOverview, editView, startPage, userPage];

// ------------ divs that should auto clear -----------------
let divSelectedSlide = document.getElementById("selectedSlide");
let presContainer = document.getElementById("presContainer");
let slideList = document.getElementById("slide__list");
let divList = [divSelectedSlide, presContainer, slideList];

//Functions to switch between pages--------------------------
function showUserPage() {
    emptyTxtResult();
    hideAllPages(pageList, divList);
    userPage.style = "display:flex";
    document.querySelector("header").style = "display:flex";
}

function showStartPage() {
    emptyTxtResult();
    hideAllPages(pageList, divList);
    startPage.style = "display:flex";
    document.querySelector("header").style = "display:none";
}

function showPresentationOverview(){
    emptyTxtResult();
    hideAllPages(pageList, divList);
    presOverview.style = "display:flex";
    document.querySelector("header").style = "display:flex";
}

function showEditView(){
    emptyTxtResult();
    emptyInputs();
    hideAllPages(pageList, divList);
    editView.style = "display:flex";
    divSelectedSlide.style = "display:flex";
}

function showPublicPresPage(){
    emptyTxtResult();
    hideAllPages(pageList, divList);
    presOverview.style = "display:flex";
    document.querySelector("header").style = "display:flex";
}

//-----------------------
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
    txtResultSharing.innerHTML = "";
}