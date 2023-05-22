import React, {useState , useEffect} from 'react';
import axios from 'axios';
import reverseArr from './reverse';
import Reply from './Reply';



function RepliesAll(props) {

    const [reply , setReply] = useState('');
    const [repliesArr , setRepliesArr] = useState([]);
    


    useEffect(() => {
        setRepliesArr(reverseArr(props.commObj.replies));
    } , [])


    const onChangeReply = e => {
        const rep = e.currentTarget.value;
        setReply(rep);
        console.log(props.commObj)
    }

    const repButton = () => {
        //console.log(props)
        let dataRep= new FormData();
        dataRep.append("newReply" , reply);

        axios({
            method: 'post',
            url:`/replyComm/${props.commObj._id}` , 
            data: dataRep ,
            headers: { 'Content-Type': 'application/json' } 
        })
        .then(function(res){
            console.log(res);
            setRepliesArr(reverseArr(res.data));
            setReply('');
        })
        .catch(function(err){
            console.log(err);
        })

    }

    const deleteReply = (replyId) => {
        axios({
            method: 'delete',
            url:`/deleteRep/${props.commObj._id}/${replyId}` , 
        })
        .then(function(res){
            console.log(res);
            setRepliesArr(reverseArr(res.data));
        })
        .catch(function(err){
            console.log(err);
        });
    }



    return (
        <div className='reply'>
            {props.replyShow && <input className='replyInput' onChange={onChangeReply} value={reply} />}
            {props.replyShow && <div className='buttonRep' onClick={repButton}> Add Reply </div>}
            {props.replyShow && <span className='cancelReply' onClick={props.repCancel}> Cancel </span>}

            <div className='repliesAll'>
                {repliesArr.map( rep => <Reply repObj={{...rep}} userObj={props.userObj}
                                               deleteReply={deleteReply} key={rep._id}/>)}   
            </div>
        </div>
    )
}

export default RepliesAll;
