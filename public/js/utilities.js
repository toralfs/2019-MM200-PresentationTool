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