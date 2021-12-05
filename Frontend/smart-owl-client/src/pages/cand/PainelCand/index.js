import React, { 
  useContext, 
  useEffect,
  useState
} from 'react';
import { Link } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import BackgroundCard from '../../../components/BackgroundCard';
import CandDrawer from '../../../components/CandDrawer';
import { HeaderTitle } from '../../../components/HeaderTitle';
import { AuthContext } from '../../../contexts/AuthContext';
import PrimaryButton from '../../../components/Button';
import { SnackContext } from '../../../contexts/SnackContext';

import jwtDecode from 'jwt-decode';

import api from '../../../services/api';

import moment from 'moment';

import './index.css';
import ModalSolicitacaoMatricula from '../../../components/FormSolicitacaoMatricula';

const PainelCand = () => {
  const { user, role } = useContext(AuthContext);

  const { setSnack } = useContext(SnackContext);
  
  useEffect(() => {
    document.title = 'Dashboard | Smart Owl';

    async function getInscricao() {
      try {
        
        
        const token = jwtDecode(localStorage.getItem('token'));
        const candidatoId =  token.id;

        const inscricao = await api.get('/inscricao', {
          params: {
            candidatoId,
            encerrada: "0"
          }
        });
    
        if (inscricao.data.length === 0) {
          setInscricao(null) 
        } else {
          setInscricao(inscricao.data[0]);
        }
      } catch (err) {
        setSnack({ 
          message: 'Erro ao buscar informações. Contate-nos! ' + err.message , 
          type: 'error', 
          open: true
        });
      }
    }

    setTimeout(() => { getInscricao() }, 500);

  }, [role]);

  const [inscricao, setInscricao] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <CandDrawer title="Painel do Candidato">
      <BackgroundCard>
        <div className="master-dashboard">
          <HeaderTitle
            title={`Olá, ${user.nome}!`}  
            subtitle={"Bem-vindo ao Smart Owl 🙂"}        
          />
          {inscricao === null ?
            <Box
              display="flex"
              flexWrap="wrap"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="50vh"
              css={{ marginTop: 50 }}
            >    
              <p> No momento você não está participando de um processo seletivo. ☹️ </p>  
            <p> Que tal dar uma olhada no <Link to="/cursos_priv">Catálogo de Cursos</Link>?</p>                  
            </Box>
            :
            <Box
              display="flex"
              flexWrap="wrap"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="50vh"
              css={{ marginTop: 100 }}
            >   
              <div className="card-inscricao">
                <p id="titulo"><b>Inscrição {inscricao.id} - {inscricao.turma.curso.nome} ({inscricao.turma.periodo})</b></p>
                <p id="unidade"><b>Unidade:</b>  {inscricao.turma.unidade.nome} - {inscricao.turma.unidade.rua}, {inscricao.turma.unidade.numero_endereco} - {inscricao.turma.unidade.bairro}, {inscricao.turma.unidade.cidade} - {inscricao.turma.unidade.estado} - {inscricao.turma.unidade.cep}</p>
                <p id="data"><b>Data de Inscrição:</b> {moment(inscricao.createdAt).format("DD/MM/YYYY")}</p>
        
                
                {inscricao.status === "PROVA PENDENTE" ? <>
                  <p id="status" className="orange">PROVA PENDENTE</p>
                  <p style={{ alignSelf: 'center'}}> Vá até a unidade escolhida no dia <b>{moment(inscricao.turma.data_prova).format("DD/MM/YYYY")}</b> às <b>{inscricao.turma.hora_prova}</b> para realizar sua prova. </p>
                  <p style={{ alignSelf: 'center'}}> Boa sorte! 😉</p>
                </> : ''}

                {inscricao.status === "AGUARDANDO RESULTADO" ? <>
                  <p id="status" className="orange">AGUARDANDO RESULTADO</p>
                  <p style={{ alignSelf: 'center'}}> Ele estará disponível em até <b>{moment(inscricao.turma.data_resultado).format("DD/MM/YYYY")}</b>. 😊 </p> 
                </> : '' }
                
                {inscricao.status === "NÃO APROVADO" ? <>
                <p id="status" className="red">NÃO APROVADO</p>
                <p style={{ alignSelf: 'center'}}>
                  Poxa! Não foi desta vez. ☹️                 
                </p>
                <p style={{ alignSelf: 'center'}}> Mas não desista, você poderá se inscrever em outro curso futuramente! </p>
                </> : '' }
                
                {inscricao.status === "APROVADO" ? <>
                  <p id="status" className="green">APROVADO!</p>
                  <p style={{ alignSelf: 'center'}}>Clique 
                  <PrimaryButton onClick={() => setModalOpen(true)}>
                    AQUI
                  </PrimaryButton> solicitar sua matrícula e garantir sua vaga! 😁</p>
                </> : '' }
                
                {inscricao.status === "MATRÍCULA SOLICITADA" ? <>
                  <p id="status" className="green">MATRÍCULA SOLICITADA!</p>
                  <p style={{ alignSelf: 'center'}}>
                    Entraremos em contato com você para os próximos passos.
                  </p>
                  <p style={{ alignSelf: 'center'}}>
                    Seja bem-vindo(a)! 😊
                  </p>
                </> : '' }  
                           
              </div>             
             

            </Box>

          }
          
        </div>

        <ModalSolicitacaoMatricula 
          modalOpen={modalOpen}
          handleClose={() => setModalOpen(false)}
        />
      </BackgroundCard>
    </CandDrawer>
  );
};

export default PainelCand;