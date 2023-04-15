import React, { useEffect, useContext, useState } from 'react'
import api from '../../service/Service'
import {Button, Form, Alert} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { verifyToken } from '../../VerifyToken';

function AgendamentoComponent(){
const history = useNavigate();
const [dataAgendamento, setDataAgendamento] = useState('');
const [horarioAgendamento, setHorarioAgendamento] = useState('')
const [idServico, setIdServico] = useState(0)
const [servicos, setServicos] = useState([])
const [errorMessage, setErrorMessage] = useState(null);
const [message, setMessage] = useState(null);
const [horarioValido, setHorarioValido] = useState(true)

useEffect(() =>{
  const auth = async () => {
    const result = await verifyToken();
    if(!result.valid_token || result.tipoUser != 'cliente'){
      localStorage.removeItem('token');
      history('/unauthorized');
    } 
  }
  auth()
},[])

useEffect(() => {
  const getServicos = async() => {
    const res = await api.get('servico/listarServicos')
    setServicos(res.data.servicos)
  }
  getServicos();
},[])

function getMinDate() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? 2 : 1;
  today.setDate(today.getDate() + diff);
  return today.toISOString().substr(0, 10);
}

function getMaxDate() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 1 ? 6 : 7 - dayOfWeek;
  today.setDate(today.getDate() + diff);
  return today.toISOString().substr(0, 10);
}

const onChangeDate = (e) => {
  setDataAgendamento(e.target.value);
};

const onChangeTime = (e) => {
  const horaSelecionada = e.target.value;
    const horaMinima = '09:00';
    const horaMaxima = '19:00';

    if (horaSelecionada >= horaMinima && horaSelecionada <= horaMaxima) {
      setHorarioAgendamento(horaSelecionada);
      setHorarioValido(true);
    } else {
      setHorarioValido(false);
    }
};

const onChangeServico = (e) => {
  setIdServico(e.target.value)
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token")
  try{
    const res = await api.post('agenda/marcarServico',
    {
      dataAgendamento,
      horarioAgendamento,
      idServico
    },{
      headers: { Authorization: `Bearer ${token}` }}
    )
    if(res.status === 201){
      setMessage("Serviço agendado com sucesso!")
      setDataAgendamento('')
      setHorarioAgendamento('')
      setIdServico(0)
    }
  }
  catch(err){
    if(err.response && err.response.status === 204){
      setErrorMessage("Preencha o(s) campo(s) vazio(s)!")
    } else if(err.response && err.response.status === 409) {
      setErrorMessage("Esse serviço não pode ser agendado devido à conflito de agenda do profissional. Escolha outro dia ou horário")
    }
    else {
      setErrorMessage("Erro interno do servidor. Contate o Administrador da página")
    }
  }
}

return(
    <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
        
      <Form onSubmit={handleSubmit} style={{width:"30%", height:"50%", marginTop:"5%"}}>
        <h2>Agendamento</h2>
        {errorMessage && <Alert variant={'danger'}>{errorMessage}</Alert>}
        {message && <Alert variant={'success'}>{message}</Alert>}
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Data</Form.Label>
          <Form.Control value={dataAgendamento} onChange={onChangeDate} type="date" placeholder="YYYY-MM-DD" min={new Date().toISOString().split('T')[0]}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Hora</Form.Label>
          <Form.Control
            value={horarioAgendamento}
            onChange={onChangeTime}
            type="time"
            step={3600}
            placeholder="HH:MM"
            className={horarioValido ? '' : 'is-invalid'}
          />
          {!horarioValido && (
            <div className="invalid-feedback">
              Por favor, selecione um horário entre 09:00 e 19:00.
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Serviço</Form.Label>
          <Form.Select aria-label="Default select example" onChange={onChangeServico} value={idServico}>
            <option defaultChecked>Selecione o serviço</option>
            {servicos.map(servico => 
            <option key={servico.idServico} value={servico.idServico}>{servico.nomeServico} - {servico.nomeProfissional}</option>
              )}
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">
          Salvar
        </Button>
      </Form>
    </div>
)
}
export default AgendamentoComponent;