//Adds a new slide -----------------------
async function addSlide() {
    let addedSlide = await presServerReq.createSlide(SLIDE_TYPE_DEFAULT.A, currentPres.ID);
    if (addedSlide.code === HTTP_CODES.CREATED) {
        let currentIndex = helperSlides.data.map(function (e) {
            return e.slideid;
        }).indexOf(selectedSlide.slideid);
        selectedSlide.slideid = addedSlide.slideid;
        selectedSlide.data = SLIDE_TYPE_DEFAULT.A;
        if(helperSlides.data.length>0){            
            displaySlide();
            helperSlides.data.splice(currentIndex + 1, 0, {slideid: addedSlide.slideid, data: selectedSlide.data, presentationid: currentPres.ID});
        }
        else{
            loadEditView();
        }
        console.log("slide created");
    }
}

//Removes a slide -----------------------
async function removeSlide() {
    if(helperSlides.data.length>0){
        let removedSlide = await presServerReq.removeSlide(selectedSlide.slideid, currentPres.ID);
        if (removedSlide.code === HTTP_CODES.OK) {
            console.log("slide deleted");
            let currentIndex = helperSlides.data.map(function (e) {
                return e.slideid;
            }).indexOf(selectedSlide.slideid);
            let newIndex = null;
            if (currentIndex > 0) {
                newIndex = currentIndex - 1;
            } else {
                newIndex = currentIndex + 1;
            }
            try {
                helperSlides.data.splice(currentIndex,1);
                selectedSlide.slideid = helperSlides.data[newIndex].slideid;
                selectedSlide.data = helperSlides.data[newIndex].data;
                displaySlide();
            } catch {
                divSelectedSlide.innerHTML = "This presentation has no slides yet";
            }
        } else {
            console.error(removedSlide.code);
        }
    }    
}

//Displays the current slide -----------------------
function displaySlide() {
    clearDiv(divSelectedSlide);
    document.getElementById("slide-type-selection").value = "";
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
                changeSlideImage(selectedSlide, selectedSlide.data.image, e.target.value);
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
                    removeBulletPoint(id);
                });

                tmp1.querySelector(".slide__list").appendChild(tmp2);
                counter++;
            }
            divSelectedSlide.appendChild(tmp1);
            break;
        case "D":
            tmp1.querySelector(".youtube__link").value = selectedSlide.data.link;
            if(selectedSlide.data.link){
                tmp1.querySelector(".youtube__video").src += getYoutubeId(selectedSlide.data.link);
                tmp1.querySelector(".youtube__video").style = "display:auto";
            }
            tmp1.querySelector(".youtube__link").addEventListener("change", (e) => {
                changeSlideYoutubeLink(selectedSlide, e.target.value);
            });
            divSelectedSlide.appendChild(tmp1);
            break;
    }

}

//Changes the slide type -----------------------
function changeSlideType() {
    let newSlideType = document.getElementById("slide-type-selection").value;
    switch (newSlideType) {
        case "A":
            selectedSlide.data = SLIDE_TYPE_DEFAULT.A;
            break;
        case "B":
            selectedSlide.data = SLIDE_TYPE_DEFAULT.B;
            break;
        case "C":
            selectedSlide.data = SLIDE_TYPE_DEFAULT.C;
            break;
        case "D":
            selectedSlide.data = SLIDE_TYPE_DEFAULT.D;
    }
    displaySlide();
    runUpdateTimer();
}

//Changes the text on the slide -----------------------
function changeSlideText(slideToChange, slideText) {
    slideToChange.data.text = slideText;
    runUpdateTimer();
}

//Changes the image on the slide -----------------------
function changeSlideImage(slideToChange, slideImage, imageLink) {
    slideToChange.data.image = imageLink;
    slideImage.src = imageLink;
    runUpdateTimer();
    displaySlide();
}

//Changes the list on the slide -----------------------
function changeSlideList(slideToChange, listObj, listObjID) {
    slideToChange.data.list[listObjID] = listObj.value;
    runUpdateTimer();
}

//Changes the youtube link on the slide -----------------------
function changeSlideYoutubeLink(slideToChange, youtubeLink){
    slideToChange.data.link = youtubeLink;
    runUpdateTimer();
    displaySlide();
}

//Adds bullet point to the list -----------------------
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
        removeBulletPoint(id);
    });
    list.appendChild(tmp1);
}

// Removes a bullet point from the list -----------------------
function removeBulletPoint(id) {
    selectedSlide.data.list.splice(id, 1);
    runUpdateTimer();
    displaySlide();
}

// Gets the id of the link to the youtube video
function getYoutubeId(link){
    let id = link.split("=")[1].split("&")[0];
    return id;
}

// displays the slide before the current slide
function displayPreviousSlide(){
    if(helperSlides.data.length>0){
        let currentIndex = helperSlides.data.map(function (e) {
            return e.slideid;
        }).indexOf(selectedSlide.slideid);
        let newIndex = null;
        if (currentIndex > 0) {
            newIndex = currentIndex - 1;
        } else if(currentIndex == 0){
            newIndex = 0;
        }
        selectedSlide.slideid = helperSlides.data[newIndex].slideid;
        selectedSlide.data = helperSlides.data[newIndex].data;
        displaySlide(); 
    }
}

// displays the slide after the current slide
function displayNextSlide(){
    if(helperSlides.data.length>0){
        let currentIndex = helperSlides.data.map(function (e) {
            return e.slideid;
        }).indexOf(selectedSlide.slideid);
        let newIndex = null;
        if (currentIndex < helperSlides.data.length-1) {
            newIndex = currentIndex + 1;
        } else if (currentIndex == helperSlides.data.length-1){
            newIndex = helperSlides.data.length-1;
        }
        selectedSlide.slideid = helperSlides.data[newIndex].slideid;
        selectedSlide.data = helperSlides.data[newIndex].data;
        displaySlide();  
    }
}
