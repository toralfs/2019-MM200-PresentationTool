function PresentationClient(){

    //----------------------------
    this.createPresentation = async function(url, name, ownerID, theme){

        let updata = {
            name: name,
            ownerID: ownerID,
            theme: theme
        }

        let cfg = {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(updata)
        }

        try {
            let resp = await fetch(url, cfg);
            let data = await resp.json();
            return data;
            
        }
        catch (err) {
            console.log(err);
        }
        
    }

    //----------------------------
    this.deletePresentation = async function (result, url){
        
        let cfg = {
            method: "DELETE",
            headers: {"Content-Type":"application/json"}
        }

        try{
            let resp = await fetch(url, cfg);
            let data = await resp.json();
            result.innerHTML = data.msg;
            
        }
        catch(err){
            console.log(err);
        }
    }

    //----------------------------
    this.updatePresentation = async function (result, url, name, theme){

        let updata = {
            name: name,
            theme: theme
        }
        
        let cfg = {
            method: "DELETE",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(updata)
        }

        try{
            let resp = await fetch(url, cfg);
            let data = await resp.json();
            result.innerHTML = data.msg;
            
        }
        catch(err){
            console.log(err);
        }
    }

    this.getPresentations = async function (url) {
        try {
            let res = await fetch(url);
            let data = await res.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }

        // ------------------ Slides ----------------------
        this.getSlides = async function(url, presID) {
            try {
                let resp = await fetch(url + presID);
                let data = await resp.json();
                return data;
            } catch (error) {
                console.error(error);
            }
        }
    
    
    
        // ------------------ Sharing ---------------------
        this.setPublicStatus = async function(url, status){
            let updata = {
                public: status
            };
            let cfg = {
                method: "PUT",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(updata)
            }
            try{
                let resp = await fetch(url, cfg);
                let data = resp.json();
                return data;
            }
            catch(error){
                console.log(error);
            }
        }
        this.shareWithUser = async function(url, username){
            let updata = {
                username: username
            };
            let cfg = {
                method: "PUT",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(updata)
            }
            try{
                let resp = await fetch(url, cfg);
                let data = resp.json();
                return data;
            }
            catch(error){
                console.log(error);
            }
        }
            
    this.unshareWithUser = async function(url, userID){
        let updata = {
            userID: userID
        };
        let cfg = {
            method: "PUT",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(updata)
        }
        try{
            let resp = await fetch(url, cfg);
            let data = resp.json();
            return data;
        }
        catch(error){
            console.log(error);
        }
    }
    
    this.getPublicPresentations = async function (url) {
        try {
            let resp = await fetch(url);
            let data = await resp.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    this.getSharedWithMePresentations = async function (url) {
        try {
            let resp = await fetch(url);
            let data = await resp.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    this.splitTime = function(timestamp) {
        let splitTimestamp = timestamp.split(/[T,.,]+/);
        let time = {
            date: splitTimestamp[0],
            clock: splitTimestamp[1]
        }
        return time;
    }
    
}