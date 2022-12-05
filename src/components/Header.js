import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, } from "@mui/material";
import Box from "@mui/material/Box";
import React, {useState} from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";
// import { useSnackbar } from "notistack";

const Header = ({ children, hasHiddenAuthButtons }) => {
  // console.log(hasHiddenAuthButtons);
  // console.log(children);
  // const { enqueueSnackbar } = useSnackbar();
  // const [dummyState,setDummyState]=useState(true);
  const history=useHistory();

  const handleClick=(target)=>{
    if(target==="login"){
      history.push("/login");
    }
    if(target==="register"){
      history.push("/register");
    }
    if(target==="logout"){
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("balance");
    window.location.reload();    
    // setDummyState(false);
    // enqueueSnackbar("Logged out successfully", { variant: "success" });
    // history.push("/");
  }
    if(target==="backToExplore"){
      history.push("/");
    }
  }

  let username=localStorage.getItem("username");
  let elementToRender;
  if(hasHiddenAuthButtons){
    elementToRender=
    <Button
    onClick={(e)=>handleClick(e.target.name)}
    name="backToExplore"
    className="explore-button"
    startIcon={<ArrowBackIcon />}
    variant="text">
    Back to explore
    </Button>
  }else if(username){
    elementToRender=<Stack direction="row" spacing={2}>
          <Stack direction='row' alignItems='center' spacing={1}>
            <img className='avatar' src="avatar.png" alt={username} />
            <span className="username-text">{username}</span>
          </Stack>
          <Button role='button' name='logout' className="logout-button" variant="outlined" onClick={(e)=>handleClick(e.target.name)}>
            LOGOUT
          </Button>
    </Stack>
  }else{
    elementToRender=<Stack direction="row" spacing={1}>
      <Button onClick={(e)=>handleClick(e.target.name)} role='button' name='login' className="login-button" variant="outlined" >
        LOGIN
      </Button>
      <Button onClick={(e)=>handleClick(e.target.name)} role='button' name='register' className="register-button" variant="contained">
        REGISTER
      </Button>
  </Stack>
  }
    return (
      <Box className="header">
        <Box className="header-title">
            <img className="qkart-icon" src="Qkart-light.svg" alt="QKart-icon"></img>
        </Box>
        {children}
        {elementToRender}
      </Box>
    );
};

export default Header;
