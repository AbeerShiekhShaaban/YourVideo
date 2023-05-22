import { useState , useEffect } from "react";
import axios from 'axios';
import rateFunc from "./rateFunction";

function VideoInformation(props) {

    const [canLike , setCanLike] = useState('rateIcon');
    const [classObj , setClassObj] = useState({class_1: '' , class_2: '' , class_3: '' , class_4: '' , class_5: ''});

    //console.log('above' , props); // props are ok :)

    useEffect(() => {
  
        //console.log('dd' , props); // props are empty undefined inside useEffect :( //https://stackoverflow.com/questions/68420421/react-props-is-undefined-in-useeffect
        axios({
            method: 'get',
            url:`/isLiked/${props.vidId}` , 
        })
        .then(function(res){
            setCanLike(res.data.likeActivation);
        })
        .catch(function(err){
          console.log(err)
        });
        ////////////////////////////////////////
        axios({
            method: 'get',
            url:`/isRated/${props.vidId}`, 
        })
        .then(function(res){
            //console.log('rating' , res);
            rateFunc(props.vidInfo.rating , res.data.userRateVal , res.data.rateActivation , setClassObj);
        })
        .catch(function(err){
          console.log(err)
        });


    } , [props])

    const like = () => {
        
        axios({
            method: 'get',
            url:`/like/${props.vidId}` 
        })
        .then(function(res){
          //console.log(res)
          if(res.data.likeActivation != 'guestLike') {
            const video = {...res.data.vid}
            console.log(video)
            props.update(video);
          }
          setCanLike(res.data.likeActivation);
        })
        .catch(function(err){
          console.log(err)
        })
    }

/////////////////////////////////////////////////////////////////////////////////////

    const rate = (ratVal) => {
        axios({
            method: 'get',
            url: `/rate/${props.vidId}/${ratVal}`
        })
        .then(function(res){
            console.log(res);
            if(res.data.rateActivation == 'guestRate'){
                rateFunc(props.vidInfo.rating , res.data.yourRate , res.data.rateActivation , setClassObj);
            }
            else{
                const video = {...res.data.vid}
                props.update(video);
                rateFunc(res.data.vid.rating , res.data.yourRate , res.data.rateActivation , setClassObj);
            }
            //console.log(classObj);
        })
        .catch(function(err){
            console.log(err)
        })
    }

    return (
        <div className="vidInfom">
            <div className="vidUser"> by: {props.VidOwner.userName} </div>
            <div className="vidViews"> {props.vidInfo.veiws} views </div>
            <div className="vidDateUp"> {props.vidInfo.date} </div>
            <div className="vidLikes">
                 <i className={`fa fa-thumbs-up ${canLike}`} onClick={like}></i>
                 {props.vidInfo.likes}
            </div>

            <div className="vidRate">
                <span className={`fa fa-star ${classObj.class_1}`} onClick={() => rate(20)}></span>
                <span className={`fa fa-star ${classObj.class_2}`} onClick={() => rate(40)}></span>
                <span className={`fa fa-star ${classObj.class_3}`} onClick={() => rate(60)}></span>
                <span className={`fa fa-star ${classObj.class_4}`} onClick={() => rate(80)}></span>
                <span className={`fa fa-star ${classObj.class_5}`} onClick={() => rate(100)}></span>
                <p> {props.vidInfo.rating}% </p> 
            </div>
        </div>
    ) 
}

export default VideoInformation;