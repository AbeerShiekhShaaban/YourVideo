import React, {useState , useEffect} from 'react';
import axios from 'axios';
import {Route , Routes} from "react-router-dom"; 
import AllVideos from "./components/AllVideos";
import Register from "./components/Register";
import LogIn from "./components/LogIn";
import UploadVideo from "./components/UploadVideo";
import Nav from "./components/Nav";
import DisplayVid from "./components/DisplayVid";

function App() {

  const [auth , setAuth] = useState(true);
  const [user , setUser] = useState(null);

  useEffect(() => {
      axios({
          method: 'get' ,
          url: '/authentication'
      })
      .then(function(res){
          //console.log(res);
          setAuth(res.data.a);
          const currentUser = {...res.data.userInfo};
          setUser(currentUser);
      })
      .catch(function(err){
          console.log(err);
      })
  } , []);

  const signOut = () => {
      axios({
          method: "get" ,
          url: '/logout'
      })
      .then(function(res){
          //console.log(res);
          window.location.href = 'http://localhost:3000/';
      })
      .catch(function(err){
          console.log(err);
      })
  }


  return (
    <div className="App">
      <Nav auth={auth} userObj={{...user}} signOut={signOut} />

      <Routes>
        <Route path={"/"} element={<AllVideos />} />
        <Route path={"/register"} element={<Register />} />
        <Route path={"/login"} element={<LogIn />} />
        <Route path={"/upload"} element={<UploadVideo />} />
        <Route path={"/:vidId"} element={<DisplayVid userObj={{...user}} />} />
      </Routes>

    </div>
  );
}

export default App;
