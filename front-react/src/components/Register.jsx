import React, {useState} from 'react';
import axios from 'axios';

function Register() {
    const [user , setUser] = useState({userNamee:'' , emaiil:'' , passworrd:'' , confirmPassworrd:''});
    const [img , setImg] = useState('');
    const [error , setError] = useState({});

    const onChange = e => {
        const userr = {...user};
        userr[e.currentTarget.name] = e.currentTarget.value;
        setUser(userr);
    }

    const onImgChange = e => {
        console.log(e.target.files[0]);
        setImg(e.target.files[0]);
    }
    
    const registerButton = () => {
        const err = {...error};
        err.emailFormat = false;
        err.confPass = false;
        err.passwordLength = false;
        err.emptyField = false;
        err.repeatedUserr = false;
        err.notAllowedExtensions = false;
        setError(err);
        //console.log(error);

        const allowedExtensionsPattern = /(\.jpg|\.jpeg|\.png|\.gif)$/i //https://www.codexworld.com/file-type-extension-validation-javascript/

        if( !(/[^@\s]+@[^@\s]+\.[^@\s]+/.test(user.emaiil)) ){ //answer49: //https://stackoverflow.com/questions/5601647/html5-email-input-pattern-attribute
            err.emailFormat = true;
            setError(err);
        }
        else if(user.passworrd !== user.confirmPassworrd){
            err.confPass = true;
            setError(err);
        }
        else if(user.passworrd.length < 6){
            err.passwordLength = true;
            setError(err);
        }
        else if(user.userNamee=='' || user.emaiil=='' || user.passworrd=='' || img==''){
            err.emptyField = true;
            setError(err);
        }
        else if(!allowedExtensionsPattern.exec(img.name)){
            //console.log(img);
            err.notAllowedExtensions = true;
            setError(err);
        }
        else{
            let data = new FormData();
            data.append('f1' , img);

            for(let key in user){
                data.append(key , user[key]);
            }

            axios({
                method: 'post' ,
                url: '/signUp' , 
                data: data
            })
            .then(function(res) {
                    console.log(res);
                    console.log("yes");
                    if(res.data === "repeatedUser"){
                        const errServer= {...err} //why err not error?
                        errServer.repeatedUserr = true;
                        setError(errServer);
                            
                        console.log("repeatedUser");
                        console.log(error.repeatedUserr);                          
                    }
                    else{
                        console.log("newUser");
                        const errServer= {...err}  //why err not error?
                        errServer.repeatedUserr = false;
                        setError(errServer);
                        window.location.href = 'http://localhost:3000/';
                    }
            })
            .catch(function(errorr) {
                    console.log(errorr);
                    console.log("no");
                    alert("fail");
            });
        }
    }

    return (
        <div className='formContainer'>     
            <label htmlFor="userName"> User Name </label>
            <input type="text" id="userName" name="userNamee" onChange={onChange} maxLength="30" className='m'/>          
                    
            <label htmlFor="e-mail"> Email </label>
            <input type="email" id="e-mail" name="emaiil" onChange={onChange} className='m'/>
            {error.emailFormat && <p className='error'> Invalid email format </p>}

            <label htmlFor="passw"> Password </label>
            <input type="password" id="passw" name="passworrd" onChange={onChange} maxLength="30" className='m'/>
            {error.passwordLength && <p className='error'> Password must be more than 6 characters </p>}

            <label htmlFor="confirm"> Confirm Password </label>
            <input type="password" id="confirm" name="confirmPassworrd" onChange={onChange} className='m'/> 
            {error.confPass && <p className='error'> Password does not match confirm password </p>}
            <br/><br/>                                

            <label htmlFor="imgFilee">Select an image:</label>
            <input type="file" id="imgFilee" onChange={onImgChange} accept="image/*" ></input> 
            {error.notAllowedExtensions && <p className='error'> Please upload file having extensions .jpeg/.jpg/.png/.gif only. </p>}

            <button onClick={registerButton}> Register </button> 
            {error.emptyField && <p className='error'> All fields are required </p>} 
            {error.repeatedUserr && <p className='error'> Email or user name already exists </p>}    
        </div>
    )
}

export default Register;
