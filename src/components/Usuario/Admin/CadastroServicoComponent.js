import React, { useState, useEffect } from 'react'
import api from '../../../service/Service'
import {Button, Form, Alert} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../../../VerifyToken';

function CadastroServicoComponent (){
  const history = useNavigate()

  const [nomeServico, setNomeServico] = useState('');
  const [nomeProfissional, setNomeProfissional] = useState('');
  const [valor, setValor] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() =>{
    const auth = async () => {
      const result = await verifyToken();
      if(!result.valid_token || result.tipoUser != 'admin'){
        localStorage.removeItem('token');
        history('/admin');
      } 
    }
    auth()
},[])

  const onChangeServico = (e) => setNomeServico(e.target.value);
  const onChangeProfissional = (e) => setNomeProfissional(e.target.value);
  const onChangeValor = (e) => setValor(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('servico/criarServico', {
        nomeServico,
        nomeProfissional,
        valor
      });
      if(res.status === 200){
        setMessage("Cadastro realizado com sucesso!")
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
              <Form.Label>Servico</Form.Label>
              <Form.Control
                type="text"
                value={nomeServico}
                onChange={onChangeServico}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Profissional</Form.Label>
              <Form.Control value={nomeProfissional}
              onChange={onChangeProfissional}
              type="text" />
            </Form.Group>
  
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Valor</Form.Label>
              <Form.Control 
              value={valor}
              onChange={onChangeValor}
              type="float" placeholder="R$0,00" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Cadastrar
            </Button>
            <Button variant='light' onClick={() => history(-1)}>Voltar</Button>
          </Form>
        </div>
    )
}
export default CadastroServicoComponent