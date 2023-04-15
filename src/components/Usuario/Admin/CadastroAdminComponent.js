import React, { useState, useEffect } from 'react'
import api from '../../../service/Service'
import { verifyToken } from '../../../VerifyToken';
import {Button, Form, Alert} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function CadastroComponent (){
  const history = useNavigate()

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('')
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() =>{
    const auth = async () => {
      const result = await verifyToken();
      if(!result.valid_token || result.tipoUser != 'admin'){
        localStorage.removeItem('token');
        history('/unauthorized');
      } 
    }
    auth()
},[])

  const onChangeNome = (e) => setNome(e.target.value);
  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangeSenha = (e) => setSenha(e.target.value);
  const onChangeTelefone = (e) => setTelefone(e.target.value);
  const onChangeCargo = (e) => setCargo(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('usuario/addAdmin', {
        nome,
        email,
        senha,
        telefone,
        cargo
      });
      if(res.status === 200){
        setMessage("Cadastro realizado com sucesso!")
        setTimeout(() => {

          history('/admin');
        }, 1000);
      }
    } catch (err) {
      if(err.response && err.response.status === 400){
        setErrorMessage("Preencha o(s) campo(s) vazio(s)!")
      } else {
        setErrorMessage("Erro interno do servidor. Contate o Administrador da página")
      }
    }
  }
    return(
        <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
          <Form onSubmit={handleSubmit} style={{width:"30%", height:"50%", marginTop:"5%"}}>
            <h2>Cadastro</h2>
            {errorMessage && <Alert variant={'danger'}>{errorMessage}</Alert>}
            {message && <Alert variant={'success'}>{message}</Alert>}
            <Form.Group controlId="formBasicName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={nome}
                onChange={onChangeNome}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control value={email}
              onChange={onChangeEmail}
              type="email" placeholder="email@example.com" />
            </Form.Group>
  
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Senha</Form.Label>
              <Form.Control 
              value={senha}
              onChange={onChangeSenha}
              type="password" placeholder="Senha" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control value={telefone}
              onChange={onChangeTelefone}
              type="text" placeholder="(xx) xxxxx-xxxx" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCargo">
              <Form.Label>Cargo</Form.Label>
              <Form.Control value={cargo}
              onChange={onChangeCargo}
              type="text" placeholder="Cargo" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Cadastrar
            </Button>
            <Button variant='light' onClick={() => history(-1)}>Voltar</Button>
          </Form>
        </div>
    )
}
export default CadastroComponent