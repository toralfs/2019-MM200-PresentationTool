function splitTime(timestamp) {
    let splitTimestamp = timestamp.split(/[T,.,]+/);
    let time = {
        date: splitTimestamp[0],
        clock: splitTimestamp[1]
    }
    return time;
}

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

function setSaveText(state) {
    savingText.innerText = state;
}

function clearDiv(div) {
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

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

function removeCSSFile(id){
    let file = document.getElementById(id);
    if(file){
        document.getElementsByTagName("head")[0].removeChild(file);
    }
    
}