import React, {useState , useEffect} from 'react';
import axios from 'axios';
import Comment from './Comment';

function CommentsAll(props){

    const [comm , setComm] = useState('');
    const [guest , setGuest] = useState(true);

    useEffect(() => {

        ((props.userObj._id == undefined) ? 
         setGuest(true) : setGuest(false));

    } , [props]);


    const onChangeComm = e => {
        const comment = e.currentTarget.value;
        setComm(comment);
    }

    const commButton = () => {
        //console.log(props)
        let dataComm = new FormData();
        dataComm.append("newComm" , comm);

        axios({
            method: 'post',
            url:`/comment/${props.vidId}` , 
            data: dataComm ,
            headers: { 'Content-Type': 'application/json' } // without this header req.body is empty: https://stackoverflow.com/questions/66828444/request-body-is-empty-on-post-request-when-using-formdata
            //withCredentials: true
        })
        .then(function(res){
            //console.log(res);
            const newVid = {...res.data};
            //console.log(newVid);
            props.update(newVid);
            setComm(''); 
        })
        .catch(function(err){
            console.log(err);
        })

    }



    return (
        <div className='allComm'>
            {!guest &&  <div className='newComm'>
                            <input name='newComm' onChange={onChangeComm} className='comInput' value={comm} />  
                            <div className='button' onClick={commButton}> Add </div>
                        </div>}
            
            <div className='allComms'>
                {props.commArr.map( comm => <Comment
                                        key={comm._id} 
                                        commObj={comm} 
                                        userObj={props.userObj}
                                        update={props.update}
                                        guest={guest}
                                        />)}
            </div>
        </div>
    )

}

export default CommentsAll;