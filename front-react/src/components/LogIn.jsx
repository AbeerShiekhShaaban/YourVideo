import React, {useState} from 'react';
import axios from 'axios';

function LogIn() {
    const [userLog , setUserLog] = useState({emaill:'' , passwordd:''});
    const [errorLog , setErrorLog] = useState({});

    const onChangeLog = e => {
        const userrLog = {...userLog};
        userrLog[e.currentTarget.name] = e.currentTarget.value;
        setUserLog(userrLog);
    }

    const logButton = () => {
        let dataLog = new FormData();

        for(let key in userLog){
            dataLog.append(key , userLog[key]);
        }
        //dataLog.append('emaill' , userLog.emaill);
        //dataLog.append('passwordd' , userLog.passwordd);
        //console.log(dataLog)
        axios({
            method: 'post',
            url:'/logIn' , 
            data: dataLog ,
            headers: { 'Content-Type': 'application/json' } // without this header req.body is empty: https://stackoverflow.com/questions/66828444/request-body-is-empty-on-post-request-when-using-formdata
            //withCredentials: true
        })
        .then(function(res) {
                console.log(res);
                //console.log(dataLog) 

                if(res.data==''){
                    console.log('authenticate'); 
                    const errServer= {...errorLog}
                    errServer.wrong = false;
                    setErrorLog(errServer);    
                    window.location.href = 'http://localhost:3000/';                    
                }
                else if(res.data == 'WrongPassword'){
                    console.log("WrongPassword");
                    const errServer= {...errorLog}
                    errServer.wrong = true;
                    setErrorLog(errServer);
                }
                else if(res.data == 'Email does not exist'){
                    console.log("Email does not exist");
                    const errServer= {...errorLog}
                    errServer.wrong = true;
                    setErrorLog(errServer);
                }
        })
        .catch(function(errorr) {
                console.log(errorr);
                console.log("no");
        });
    }

    return (
        <div className='formContainer'>     
            <label htmlFor="e-mail"> Email </label>
            <input type="email" id="e-mail" name="emaill" onChange={onChangeLog} className='m'/>

            <label htmlFor="passw"> Password </label>
            <input type="password" id="passw" name="passwordd" onChange={onChangeLog} className='m'/>
            
            <button onClick={logButton}> Log in </button>  
            {errorLog.wrong && <p className='error'> Wrong email or password </p>}    
        </div>
    )
}

export default LogIn;