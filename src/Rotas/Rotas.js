import LoginComponent from "../components/Usuario/Cliente/LoginComponent";
import CadastroComponent from '../components/Usuario/Cliente/CadastroComponent';
import AgendamentoComponent from '../components/Agendamento/AgendamentoComponent'
import ListAgendamentoComponent from "../components/Agendamento/ListAgendamentoComponent";
import LoginAdminComponent from "../components/Usuario/Admin/LoginAdminComponent";
import CadastroServicoComponent from "../components/Usuario/Admin/CadastroServicoComponent";
import CadastroAdminComponent from '../components/Usuario/Admin/CadastroAdminComponent'
import { Routes, Route } from "react-router-dom";
import ListServicosComponent from "../components/Usuario/Admin/ListServicosComponent";

function Rotas(){

    return( 
      <Routes>       
        <Route path={"/"} element={<LoginComponent />}/>
        <Route path={"/cadastro"} element={<CadastroComponent />} />
        <Route path={"/agendamento"} element={<AgendamentoComponent/>}/>
        <Route path={"/home"} element={<ListAgendamentoComponent/>}/>
        <Route path={"/admin"} element={<LoginAdminComponent/>}/>
        <Route path={"/cadastroServico"} element={<CadastroServicoComponent/>}/>
        <Route path={"/cadastroAdmin"} element={<CadastroAdminComponent/>}/>
        <Route path={"/homeAdmin"} element={<ListServicosComponent/>}/>
      </Routes>
    )
}

export default Rotas