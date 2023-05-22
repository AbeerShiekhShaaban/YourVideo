


function Video(props){

    const videoClick = (id) => {
        window.location.href = 'http://localhost:3000/' + id
    }
   
    return (
        <div className="video" onClick={() => {videoClick(props.vidObj._id);}}>
            <div className="title"> {props.vidObj.title} </div>
            <img src={`/static/${props.vidObj.thumbnail}`}
                                     onClick={() => {}}
                                     className="vidIMG" 
            />
            <div className="vidInfo">
                <div className="vidUser"> by: {props.vidObj.user.userName} </div>
                <div className="vidVeiws"> views: {props.vidObj.veiws} </div>
                <div className="vidDate"> {(props.vidObj.date).slice(0 , 10)} </div>
            </div>
        </div>
    )
}

export default Video;