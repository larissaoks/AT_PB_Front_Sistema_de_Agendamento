import React, { useEffect, useContext, useState } from "react";
import api from '../../../service/Service';
import {Button, Alert} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../../VerifyToken";

function ListServicosComponent(){
    const history = useNavigate();
    const [listaServicos, setListaServicos] = useState([])
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

    useEffect(() => {
        const getServicos = async() => {
            try {
                const res = await api.get('servico/listarServicos')
                if(res.status === 200){
                    setListaServicos(res.data.servicos)
                }
            }
            catch(err){
                if(err.response && err.response.status === 204){
                    setErrorMessage("Não há serviços registrados.")
                } else{
                    setErrorMessage("Erro interno do servidor. Contate o Administrador da página")
                }
            }
            
        }
        getServicos()
    },[])

    async function cancelarServico(idServico){
        try{
            const res = await api.delete("servico/cancelarServico/" + idServico)
            if(res.status === 200){
                setListaServicos([...listaServicos])
                setMessage("Serviço apagado com sucesso!")
            }
        }
        catch(err){
            if(err.response && err.response.status === 204){
                setErrorMessage("Esse serviço não existe.")
            } else{
                setErrorMessage("Erro interno do servidor. Contate o Administrador da página")
            }
        }
    }

    return(
        <div>
            <h1>Serviços cadastrados</h1>
             <br></br>
                 <div className = "row">
                    {errorMessage && <Alert variant={'danger'}>{errorMessage}</Alert>}
                    {message && <Alert variant={'success'}>{message}</Alert>}
                        <table className = "table table-striped table-bordered">

                            <thead>
                                <tr>
                                    <th> Serviço</th>
                                    <th> Profissional</th>
                                    <th> Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listaServicos.map(
                                        (list) => 
                                        <tr key = {list.idServico}>
                                             <td> {list.nomeServico} </td>
                                             <td> {list.nomeProfissional} </td>
                                             <td>
                                                 R${list.valor.toFixed(2)}
                                             </td>
                                             <td>
                                                 <Button variant="outline-danger" onClick={() => cancelarServico(list.idServico)}>Remover</Button>
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

export default ListServicosComponent;