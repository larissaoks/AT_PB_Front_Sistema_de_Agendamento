import React, { useEffect, useContext, useState } from "react";
import {Button, Alert} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function Unauthorized(){
    const history = useNavigate();

    useEffect(() =>{
        const redirectToLogin = () => {
            setTimeout(() => {
                history('/');
              }, 5000);
        }
        redirectToLogin()
    },[])
    
return(
    <div>
        <div style={{marginTop: "5%"}}><h3>Você será redirecionado para a página de login</h3></div>
        <img src="error_401.webp"/>
    </div>
)
}

export default Unauthorized