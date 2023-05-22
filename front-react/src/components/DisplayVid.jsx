import { useState , useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import VideoInformation from "./VideoInformation";
import CommentsAll from "./CommentsAll";
import reverseArr from "./reverse";


function DisplayVid(propsAppJS) {

    const {vidId} = useParams();
    const [vidInfo , setVidInfo] = useState('');
    const [vidOwner , setVidOwner] = useState('');
    const [commArr , setCommArr] = useState([]);


    useEffect(() => {
        axios({
            method: 'get',
            url:`/all/${vidId}` , 
        })
        .then(function(res){
          console.log(res)
          const video = {...res.data}
          setVidInfo(video)
          setVidOwner(video.user)
          const arr = reverseArr(video.comments);
          setCommArr(arr);
          //console.log('ff' , vidInfo);
        })
        .catch(function(err){
          console.log(err)
        })
    } , [vidId])



    const update = (vid) => {   // https://www.youtube.com/watch?v=zW-uSq9Gha8
        setVidInfo({...vid});
        setCommArr(reverseArr(vid.comments));
    }


    return (
        <div className="vidDisplay">
            <video controls key={`/static/${vidInfo.videoUrl}`}> {/* reactjs video tag video not working when src is dynamic ..... https://stackoverflow.com/questions/41303012/updating-source-url-on-html5-video-with-react */}
                <source src={`/static/${vidInfo.videoUrl}`} type="video/mp4"/>
            </video>

            <div className="vidTitle"> {vidInfo.title} </div>

            <VideoInformation vidInfo={vidInfo} VidOwner={vidOwner} vidId={vidId} update={update} />
            <CommentsAll vidId={vidId} userObj={{...propsAppJS.userObj}} commArr={commArr} update={update} />         
        </div>
    )

}

export default DisplayVid;

// <video width="750" height="500" controls >
//<source src={`/static/videoUploaded/Yummy Chocolate Cake Decorating Tutorials - short video.mp4`} type="video/mp4"/>
//</video> 

// {_id:'' , comments:'' , date:'' , likes:'' , private:'' , thumbnail:'' , title:'' , user:'' , veiws:'' , videoUrl:''}