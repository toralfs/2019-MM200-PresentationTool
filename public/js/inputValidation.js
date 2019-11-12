function InputValidation(){

    //------------------------------------------
    this.validName = function (txt,name){
        
        if(!name.value){
            txt.innerHTML = "Name is missing!";
            return false;
        }
        let validityState = name.validity;
        if(!validityState.valid){
            txt.innerHTML = "Invalid name! Name must be at least 3 characters long and contain only letters and digits.";
            return false;
        }
        else{
            txt.innerHTML = "";
        }
        return true;
    }

    //-----------------------------------------
    this.validEmail = function(txt,email){
        
        if(!email.value){
            txt.innerHTML = "Email is missing!";
            return false;
        }
        let validityState = email.validity;
        if(!validityState.valid){
            txt.innerHTML = "Invalid email format!";
            return false;
        }
        else{
            txt.innerHTML = "";
        }
        return true;
    }

    //--------------------------------------
    this.validPassword = function(txt,password){
        
        if(!password.value){
            txt.innerHTML = "Password is missing!";
            return false;
        }
        let validityState = password.validity;
        if(!validityState.valid){
            txt.innerHTML = "Invalid password! Password must be at least 4 characters long."
            return false;
        }
        else{
            txt.innerHTML = "";
        }
        return true;
    }
}