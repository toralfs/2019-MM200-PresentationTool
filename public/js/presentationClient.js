function PresentationClient() {

    //----------------------------
    this.createPresentation = async function (name, ownerID, theme) {

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

    }

    //----------------------------
    this.deletePresentation = async function (presID) {

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
    }

    //----------------------------
    this.updatePresentation = async function (presID, name, theme) {

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
    }

    this.getPresentations = async function (ownerID) {
        try {
            let res = await fetch(`/presentation/${ownerID}`);
            let data = await res.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    // ------------------ Slides ----------------------
    this.getSlides = async function (presID) {
        try {
            let resp = await fetch(`/presentation/slide/${presID}`);
            let data = await resp.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    this.updateSlide = async function (slideID, slideData) {

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
    }




    // ------------------ Sharing ---------------------
    this.setPublicStatus = async function (presID, status) {
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
    }

    this.shareWithUser = async function (presID, username) {
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
    }

    this.unshareWithUser = async function (presID, userID) {
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
    }

    this.getPublicPresentations = async function () {
        try {
            let resp = await fetch(`/presentation/public`);
            let data = await resp.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    this.getSharedWithMePresentations = async function (userID) {
        try {
            let resp = await fetch(`/presentation/${userID}/shared-with-me`);
            let data = await resp.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }


    // -------------------------------------------------

    this.splitTime = function (timestamp) {
        let splitTimestamp = timestamp.split(/[T,.,]+/);
        let time = {
            date: splitTimestamp[0],
            clock: splitTimestamp[1]
        }
        return time;
    }

    this.changeTheme = function(presentation,selectedTheme) {
        presentation.theme = selectedTheme;
    }

    this.changeBgColor = function(slide, selectedColor) {
        slide.data.bgColor = selectedColor;
    }

    this.hideAllPages = function(pages, divs) {
        for(let page of pages) {
            page.style.display = "none";
        }
        for (let div of divs) {
            while(div.firstChild) {
                div.removeChild(div.firstChild);
            }
        }
    }
}