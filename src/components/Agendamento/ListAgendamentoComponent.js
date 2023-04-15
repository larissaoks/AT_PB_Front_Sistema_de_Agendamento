import React, { useEffect, useContext, useState } from "react";
import api from '../../service/Service'
import {Button, Alert} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../VerifyToken";

function ListAgendamentoComponent(){
    const history = useNavigate();
    const [listaAgendamento, setListaAgendamento] = useState([])
    const [errorMessage, setErrorMessage] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() =>{
        const auth = async () => {
          const result = await verifyToken();
          console.log("result: ", result)
          if(!result.valid_token || result.tipoUser != 'cliente'){
            localStorage.removeItem('token');
            history('/unauthorized');
          } 
        }
        auth()
    },[])

    useEffect(() => {
        const getAgenda = async() => {
            const token = localStorage.getItem("token")
            const res = await api.get('agenda/buscarAgendaPorCliente', {
                headers: { Authorization: `Bearer ${token}` }})
            if(res.status === 200){
                setListaAgendamento(res.data.agenda)
            }
        }
        getAgenda()
    },[])

    async function desmarcarServico(idAgenda){
        try{
            const res = await api.delete("agenda/desmarcarServico/" + idAgenda)
            if(res.status === 200){
                setListaAgendamento([...listaAgendamento])
                setMessage("Serviço desmarcado com sucesso!")
            }
        }
        catch(err){
            if(err.response && err.response.status === 204){
                setErrorMessage("Esse serviço não está marcado.")
            } else{
                setErrorMessage("Erro interno do servidor. Contate o Administrador da página")
            }
        }
    }

    return(
        <div>
            <h1>Minha agenda</h1>
             <br></br>
                 <div className = "row">
                    {errorMessage && <Alert variant={'danger'}>{errorMessage}</Alert>}
                    {message && <Alert variant={'success'}>{message}</Alert>}
                        <table className = "table table-striped table-bordered">

                            <thead>
                                <tr>
                                    <th> Serviço</th>
                                    <th> Profissional</th>
                                    <th> Data</th>
                                    <th> Hora</th>
                                    <th> Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listaAgendamento.map(
                                        (list) => 
                                        <tr key = {list.idAgenda}>
                                             <td> {list.servicos[0].nomeServico} </td>
                                             <td> {list.servicos[0].nomeProfissional} </td>   
                                             <td> {list.dataAgendamento}</td>
                                             <td> {list.horarioAgendamento}</td>
                                             <td>
                                                 R${list.servicos[0].valor.toFixed(2)}
                                             </td>
                                             <td>
                                                 <Button variant="outline-danger" onClick={() => desmarcarServico(list.idAgenda)}>Desmarcar</Button>
                                             </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>

                 </div> 
        </div>
        
    )
}

export default ListAgendamentoComponent;