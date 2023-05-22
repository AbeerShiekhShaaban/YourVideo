import React, {useState , useEffect} from 'react';
import axios from 'axios';
import RepliesAll from './RepliesAll';



function Comment(proppss) {

    const [showCommBottuns , setShowCommBottons] = useState(false);
    const [editShow , setEditShow] = useState(false);
    const [edit , setEdit] = useState('');
    const [replyShow , setReplyShow] = useState(false);

    console.log(proppss);

    useEffect(() => {
        ((proppss.commObj.user._id == proppss.userObj._id) ? 
         setShowCommBottons(true) : setShowCommBottons(false));
    } , []);
   
 

    const commEdit = () => {
        if(editShow == false){
            setEditShow(true);
            //console.log(proppss.commObj.content)
            setEdit(proppss.commObj.content); //problem
        }
    }

    const cancelEdit = () => {
        if(editShow == true){
            setEditShow(false);
        }
    }

    const repShowInput = () => {
        if(replyShow == false){
            setReplyShow(true);
        }
    }

    const repCancel = () => {
        if(replyShow == true){
            setReplyShow(false);
        }
    }

    const onChangeEdit = e => {
        const edited = e.currentTarget.value;
        setEdit(edited);
    }

    const editSave = () => {
        
        let dataEdit = new FormData();
        dataEdit.append("updated" , edit);

        axios({
            method: 'put',
            url:`/updateComm/${proppss.commObj._id}` , 
            data: dataEdit ,
            headers: { 'Content-Type': 'application/json' } 
        })
        .then(function(res){
            //console.log(res);
            proppss.update(res.data);
            setEditShow(false);
        })
        .catch(function(err){
            console.log(err);
        })
    }

    const deleteComm = () => {

        axios({
            method: 'delete',
            url:`/del/${proppss.commObj._id}/${proppss.commObj.parentVideo}` 
        })
        .then(function(res){
            //console.log(res);
            proppss.update(res.data);
        })
        .catch(function(err){
            console.log(err);
        })
    }



    return (
        <div className="comm">
            <div className="commInfo"> 
                <img src={`http://localhost:4000/static/${proppss.commObj.user.image}`} className="comIMG" /> 
                <span> {proppss.commObj.user.userName} </span>
                <span> {(proppss.commObj.date).slice(0 , 10)} </span>
            </div>

            {!editShow && <div className="commContent"> {proppss.commObj.content} </div>}

            <div className="commButton">
                {showCommBottuns && <span onClick={commEdit} className='editReply'> Edit </span>} 
                {showCommBottuns && <span onClick={deleteComm}> Delete </span>}
                {!proppss.guest && <span className='newReply' onClick={repShowInput}> Reply </span>}                    
            </div>

            {editShow && <div>
                            <input className='editInput' onChange={onChangeEdit} value={edit} /> 
                            <div className="commButton">
                                <span className="save" onClick={editSave}> Save </span>
                                <span onClick={cancelEdit}> Cancel </span>
                            </div>
                         </div>}
            
            <RepliesAll replyShow={replyShow} repCancel={repCancel} 
                   commId={proppss.commObj._id} commObj={proppss.commObj} 
                   update={proppss.update} userObj={proppss.userObj} />
        </div>
    )
}

export default Comment;