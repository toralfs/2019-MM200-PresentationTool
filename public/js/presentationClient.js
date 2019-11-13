function PresentationClient(){

    //----------------------------
    this.createPresentation = async function(result, url, name, ownerID, theme){

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
            result.innerHTML = data.msg;
            
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
<<<<<<< HEAD

    this.getPresentations = async function (url) {
        try {
            console.log(url);
            let res = await fetch(url);
            let data = await res.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }
=======
>>>>>>> 187253e0d458921bd78a422617267e27c43a7e48
    
}