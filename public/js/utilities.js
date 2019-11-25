//Formats the timestamp --------------
function splitTime(timestamp) {
    let splitTimestamp = timestamp.split(/[T,.,]+/);
    let time = {
        date: splitTimestamp[0],
        clock: splitTimestamp[1]
    }
    return time;
}

//Calls updatePresentation() after WAIT_TO_UPDATE seconds elapse --------------
function runUpdateTimer() {
    updateTimer.value = 0;
    updateTasks.push({ currentPres, selectedSlide });
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

//Edits the saving text --------------
function setSaveText(state) {
    savingText.innerText = state;
}


//Clears a div --------------
function clearDiv(div) {
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

//Loads CSS file in the <head> of index.html --------------
function loadCSSFile(filename, id){
    let file=document.createElement("link")
    file.setAttribute("rel", "stylesheet")
    file.setAttribute("type", "text/css")
    file.setAttribute("href", filename)
    file.setAttribute("id", id)
    if (file && file.id!="undefined"){
        document.getElementsByTagName("head")[0].appendChild(file);
    }
}

//Removes file from <head> of index.html ---------------
function removeCSSFile(id){
    let file = document.getElementById(id);
    if(file){
        document.getElementsByTagName("head")[0].removeChild(file);
    }
    
}