export const isValidEmail = (email) => {
 const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 return regex.test(email);
};

export const isValidMobile = (mobile) => {
 if(mobile.length==10){
    return true;
 }
 else{
    return false
 }
};

export const isStrongPassword = (password) => {
    if(password.length>8){
       return true;
    }
    else{
       return false
    }
};