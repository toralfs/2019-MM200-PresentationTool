function UserClient(){

    this.createUser = async function(result, url, username, email, password){

        let updata = {
            name: username,
            email: email,
            password: password            
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
            return data;            
        }
        catch (err) {
            console.log(err);
        }
    }

    this.loginUser = async function(result, url, username, password){

        let updata = {
            name: username,
            password: password            
        }

        let cfg = {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(updata)
        }

        try{
            let resp = await fetch(url, cfg);
            let data = await resp.json();
            result.innerHTML = data.msg;
            return data;
            
        }
        catch(err){
            console.log(err);
        }
    }

    this.updateUser = async function(result, url, username, email, password){ 
        
        let updata = {
            name: username,
            email: email,
            password: password
        }

        let cfg = {
            method: "PUT",
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

    this.deleteUser = async function(result, url){
        let cfg = {
            method: "DELETE",
            headers: {"Content-Type":"application/json"},
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

}