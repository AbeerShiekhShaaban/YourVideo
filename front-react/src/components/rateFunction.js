

function rateFunc(vidRating , userRate , userOrGuest , setFunc) {

    const newClassObj = {class_1: '' , class_2: '' , class_3: '' , class_4: '' , class_5: ''};

    if(userOrGuest == 'userRate' || userOrGuest == 'checkedRed userRate'){
        for(let k in newClassObj){
            newClassObj[k] = 'userRate';
        }
        setFunc(newClassObj);
    }
    else if(userOrGuest == 'guestRate'){
        for(let k in newClassObj){
            newClassObj[k] = 'guestRate';
        }
        setFunc(newClassObj);
    }

    /////////////////////////////////////////////////////////////////

    if(vidRating >= 20 && vidRating < 40){
        newClassObj.class_1 = 'checkedOrange' + ' ' + newClassObj.class_1;
        setFunc(newClassObj);
    }
    else if(vidRating >= 40 && vidRating < 60){
        newClassObj.class_1 = 'checkedOrange' + ' ' + newClassObj.class_1;
        newClassObj.class_2 = 'checkedOrange' + ' ' + newClassObj.class_2;
        setFunc(newClassObj);
    }
    else if(vidRating >= 60 && vidRating < 80){
        newClassObj.class_1 = 'checkedOrange' + ' ' + newClassObj.class_1;
        newClassObj.class_2 = 'checkedOrange' + ' ' + newClassObj.class_2;
        newClassObj.class_3 = 'checkedOrange' + ' ' + newClassObj.class_3;
        setFunc(newClassObj);
    }
    else if(vidRating >= 80 && vidRating < 100){
        newClassObj.class_1 = 'checkedOrange' + ' ' + newClassObj.class_1;
        newClassObj.class_2 = 'checkedOrange' + ' ' + newClassObj.class_2;
        newClassObj.class_3 = 'checkedOrange' + ' ' + newClassObj.class_3;
        newClassObj.class_4 = 'checkedOrange' + ' ' + newClassObj.class_4;
        setFunc(newClassObj);
    }
    else if(vidRating == 100){
        for(let k in newClassObj){
            newClassObj[k] = 'checkedOrange' + ' ' + newClassObj[k];
        }
        setFunc(newClassObj);
    }
    else if(vidRating == 0){
        if(userOrGuest == 'userRate' || userOrGuest == 'checkedRed userRate'){
            for(let k in newClassObj){
                newClassObj[k] = 'userRate';
            }
            setFunc(newClassObj);           
        }
        else if(userOrGuest == 'guestRate'){
            for(let k in newClassObj){
                newClassObj[k] = 'guestRate';
            }
            setFunc(newClassObj); 
        }
    }
    
    ///////////////////////////////////////////////////////////////////////

    if(userRate == 20) { // ratVal
        newClassObj.class_1 = 'checkedRed' + ' ' + newClassObj.class_1;
        setFunc(newClassObj);  
    }
    else if(userRate == 40) {
        newClassObj.class_2 = 'checkedRed' + ' ' + newClassObj.class_2;
        setFunc(newClassObj);
    }
    else if(userRate == 60) {
        newClassObj.class_3 = 'checkedRed' + ' ' + newClassObj.class_3;
        setFunc(newClassObj);
    }
    else if(userRate == 80) {
        newClassObj.class_4 = 'checkedRed' + ' ' + newClassObj.class_4;
        setFunc(newClassObj);
    }
    else if(userRate == 100) {
        newClassObj.class_5 = 'checkedRed' + ' ' + newClassObj.class_5;
        setFunc(newClassObj);
    }
    else if(userRate == 0) {
        setFunc(newClassObj);
    }
}

export default rateFunc;