
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

    createSlide: async function (slideData, presID) {
        let updata = {
            data: slideData,
            presentationID: presID
        }
        let cfg = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updata)
        }
        try {
            let resp = await fetch(`/presentation/slide`, cfg);
            let data = await resp.json();
            return data;
        } catch (err) {
            console.log(err);
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

    removeSlide: async function (slideID, presID) {
        let updata = {
            presentationID: presID
        }
        let cfg = {
            method: "DELETE",
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
        };
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
        };
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
        };
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
        } 
        catch (error) {
            console.error(error);
        }
    },

    getSharedWithMePresentations: async function (userID) {
        try {
            let resp = await fetch(`/presentation/${userID}/shared-with-me`);
            let data = await resp.json();
            return data;
        } 
        catch (error) {
            console.error(error);
        }
    }
}