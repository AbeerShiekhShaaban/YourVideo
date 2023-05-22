import { Link } from "react-router-dom";


function Nav(props){

    return (
        <div className="nav"> 
            <Link to="/" className="logo" onClick={()=> {window.location.href = 'http://localhost:3000'}}>
                <div className='red'>
                    <div className='triangle'></div>
                </div>
                <div className="YourVideo"> YourVideo </div>
            </Link>

            <div className="midEmpty"></div>

            <div className="links">
                {!props.auth && <Link to="/login" className="l"> Sign in </Link>}
                {!props.auth && <Link to="/register" className="l"> Sign up </Link>}
                {props.auth && <div className="l" onClick={props.signOut}> Log out </div>}
                {props.auth && <Link to="/upload" className="l"> Upload </Link>}
                {props.auth && <span className="profile">
                                        <img src={`http://localhost:4000/static/${props.userObj.image}`}
                                            onClick={() => {}}
                                            className="profileIMG" 
                                        />
                                        <div> {props.userObj.userName} </div>
                                </span>}
            </div>
        </div>
    )
}

export default Nav