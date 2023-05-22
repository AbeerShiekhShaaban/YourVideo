import React, {useState , useEffect} from 'react';



function Reply(props) {

    const [showRepDelete , setShowRepDelete] = useState(false);

    useEffect(() => {
       ((props.repObj.user._id == props.userObj._id) ? 
        setShowRepDelete(true) : setShowRepDelete(false));
    } , [])

    return (
        <div className='singleRep'>
            <div className='replyInfo'>
                <img src={`http://localhost:4000/static/${props.repObj.user.image}`} className="repIMG" /> 
                <span> {props.repObj.user.userName} </span>
                <span> {(props.repObj.date).slice(0 , 10)} </span>
            </div>

            <div className='repContent'> {props.repObj.content} </div>
            {showRepDelete && <div className='replyDelete' 
                        onClick={() => props.deleteReply(props.repObj._id)}> Delete </div>}
        </div>
    )

}

export default Reply;