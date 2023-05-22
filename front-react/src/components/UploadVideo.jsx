import React, {useState} from 'react';
import axios from 'axios';

function UploadVideo() {
    const [videoInfo , setVideoInfo] = useState({titlee:''});
    const [thumb , setThumb] = useState('');
    const [video , setVideo] = useState('');
    const [errorVideo , setErrorVideo] = useState({});

    const onChangeVideoInfo = e => {
        const vid = {...videoInfo};
        vid[e.currentTarget.name] = e.currentTarget.value;
        setVideoInfo(vid);
    }

    const onThumbChange = e => {
        //console.log(e.target.files[0]);
        setThumb(e.target.files[0]);
    }

    const onVideoChange = e => {
        //console.log(e.target.files[0]);
        setVideo(e.target.files[0]);
    }

    const uploadButton = () => {
        const errVid = {...errorVideo};
        errVid.emptyTitle = false;
        errVid.notAllowedThumbExtensions = false;
        errVid.notAllowedVideoExtensions = false;
        setErrorVideo(errVid);

        const allowedThumbExtensionsPattern = /(\.jpg|\.jpeg|\.png)$/i
        const allowedVideoExtensionsPattern = /(\.avi|\.wmv|\.mp4)$/i

        if(videoInfo.titlee == ''){
            errVid.emptyTitle = true;
            setErrorVideo(errVid);
        }
        else if(!allowedThumbExtensionsPattern.exec(thumb.name) || thumb==''){
            console.log(thumb);
            errVid.notAllowedThumbExtensions = true;
            setErrorVideo(errVid);
        }
        else if(!allowedVideoExtensionsPattern.exec(video.name) || video==''){
            errVid.notAllowedVideoExtensions = true;
            setErrorVideo(errVid);
        }
        else{
            console.log(thumb);
            console.log(video);
            let vidData = new FormData();
            vidData.append('titlee' , videoInfo.titlee);
            vidData.append('f2Thumb' , thumb);
            vidData.append('f3Vid' , video);
            console.log(vidData)

            axios({
                method: 'post',
                url: '/uploadVid' ,
                data: vidData 
            })
            .then(function(res){
                console.log('uploaded' , res);
                window.location.href = 'http://localhost:3000/';
            })
            .catch(function(err){
                console.log('not uploaded' , err);
            });
        }
    }

    return (
        <div className='formContainer'>     
            <label htmlFor="tit"> Video Title </label>
            <input type="text" id="tit" name="titlee" onChange={onChangeVideoInfo} maxLength="30" className='m'/>
            {errorVideo.emptyTitle && <p className='error'> Title is required </p>}                             
            <br/><br/>                                

            <label htmlFor="thumbnail">Upload Video Thumbnail:</label>
            <input type="file" id="thumbnail" onChange={onThumbChange} accept="image/*" ></input>
            {errorVideo.notAllowedThumbExtensions && <p className='error'> Please upload file having extensions .jpeg/.jpg/.png/.gif only. </p>}
            <br/><br/><br/>  

            <label htmlFor="vid">Upload Video:</label>
            <input type="file" id="vid" onChange={onVideoChange} accept="video/*" ></input> 
            {errorVideo.notAllowedVideoExtensions && <p className='error'> Please upload file having extensions .avi/.wmv/.mp4 only. </p>} 
            <br/><br/><br/>   

            <button onClick={uploadButton}> Upload </button>     
        </div>
    )
}

export default UploadVideo;
