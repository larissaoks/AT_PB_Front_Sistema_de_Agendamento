import React, { useContext, useEffect, useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import api from '../service/Service';
import { verifyToken } from '../VerifyToken';

function NavigationBar(){
  const history = useNavigate();
  const [user, setUser] = useState('')
  const [tipoUser, setTipoUser] = useState('')

  const auth = async () => {
    const result = await verifyToken();
    if(result.valid_token){
      setUser(result.user)
      setTipoUser(result.tipoUser)
    } else{
      localStorage.removeItem('token');
      history('/');
    }
  }

  function verificaTokenVazio(){ 
    const token = localStorage.getItem("token")
      if(token === null || token === undefined){
        return true
      }
      else{
        auth()
        return false
      }
  }

  function verificaTipoUser(){
    if(tipoUser=="admin"){
      return true
    } else if(tipoUser=="cliente"){
      return false
    }
  }

  function deslogar() {
    localStorage.removeItem('token');
    history('/');
  }

    return(
    <div> 
      <Navbar bg="light" variant="light" >
      {verificaTokenVazio() ? (
        <>
        <Navbar.Brand style={{marginLeft:"1%"}}>Sistema de Agendamento</Navbar.Brand>
        <Navbar.Collapse
              style={{ marginRight: '0.3%' }}
              className="justify-content-end"
            >
              <Nav.Link onClick={() => history('/admin')}>Área Administrativa</Nav.Link>
            </Navbar.Collapse>
        </>
          
      ) : ( 
          verificaTipoUser() ? (
            <>
            <Navbar.Brand href="/homeAdmin" style={{marginLeft:"1%"}}>Sistema de Agendamento</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="homeAdmin">Início</Nav.Link>
              <Nav.Link href="cadastroServico">Cadastro de profissional</Nav.Link>
            </Nav>
            <Navbar.Toggle />
            
            
            <Navbar.Collapse
              style={{ marginRight: '0.3%' }}
              className="justify-content-end"
            >
              <Navbar.Text style={{ marginRight: '1%' }}>
                Bem vindo, {user}
              </Navbar.Text>
              <Nav.Link onClick={() => deslogar()}>Deslogar</Nav.Link>
            </Navbar.Collapse>
          </>  
          ): (
            <>
            <Navbar.Brand href="/home" style={{marginLeft:"1%"}}>Sistema de Agendamento</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="home">Início</Nav.Link>
              <Nav.Link href="agendamento">Agendar Serviço</Nav.Link>
            </Nav>
            <Navbar.Toggle />
            
            
            <Navbar.Collapse
              style={{ marginRight: '0.3%' }}
              className="justify-content-end"
            >
              <Navbar.Text style={{ marginRight: '1%' }}>
                Bem vindo, {user}
              </Navbar.Text>
              <Nav.Link onClick={() => deslogar()}>Deslogar</Nav.Link>
            </Navbar.Collapse>
          </>  )     
        )
      }
      </Navbar>
    </div>
    )
}
export default NavigationBar