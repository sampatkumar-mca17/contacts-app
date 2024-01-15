import {EMAIL_REGEX} from '../constants/constants.js';

/* 
    Validates the data inside the dialog box 
    for Ex: email should be in a proper format
*/
const validate = (name, number, email, place, errors) => {
    let isValid = true
    if(!name.trim()){
        isValid = false
        errors.name = "please provide a name"
    }
    else{
        errors.name = ""
    }
    if(!place.trim()){
        isValid = false
        errors.place = "please provide a place"
    }
    else{
        errors.place =""
    }
    if(!email.trim()){
        isValid = false;
        errors.email = "please provide an email";
    }
    else if(!email.match(EMAIL_REGEX)){
        isValid = false;
        errors.email = "email format is invalid";
    }
    else{
        errors.email =""
    }

    if(!number.trim()){
        isValid = false;
        errors.number = "please provide a phone number"
    }
    else if(!Number(number)){
        isValid = false
        errors.number = "phone number invalid"
    }
    else if(number.length !== 10){
        isValid = false
        errors.number = "please enter 10 digit valid phone number"
    }
    else{
        errors.number =""
    }
    return isValid
}

/* 
    Resets the errors , that is when save or update is called all validation checks passed,
*/
function resetErrors(errors){
    errors.name = ''
    errors.email = ''
    errors.place = ''
    errors.number = ''
}

export {resetErrors, validate}