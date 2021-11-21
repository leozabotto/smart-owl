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

import './index.css';
import ModalSolicitacaoMatricula from '../../../components/FormSolicitacaoMatricula';

const PainelCand = () => {
  const { user, role } = useContext(AuthContext);
  
  useEffect(() => {
    document.title = 'Dashboard | Smart Owl';
  }, [role]);

  const [inscricao, setInscricao] = useState([]);
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
            <p> Que tal dar uma olha no <Link to="/cursos">Catálogo de Cursos</Link>?</p>                  
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
                <p id="titulo"><b>Inscrição 201548 - Curso de C# (Tarde)</b></p>
                <p id="unidade"><b>Unidade:</b> Barra Funda - Av. Rudge, 452 - Barra Funda, São Paulo - SP - 06172-659</p>
                <p id="data"><b>Data de Inscrição:</b> 17/11/2021</p>
                {/*
                <p id="status" className="orange">PROVA PENDENTE</p>
                <p style={{ alignSelf: 'center'}}> Vá até a unidade escolhida no dia <b>20/11</b> às <b>13h</b> para realizar sua prova. </p>
                <p style={{ alignSelf: 'center'}}> Boa sorte! 😉</p>


                <p id="status" className="orange">AGUARDANDO RESULTADO</p>
                <p style={{ alignSelf: 'center'}}> Ele estará disponível em até <b>30/12</b>. 😊 </p> 


                <p id="status" className="red">NÃO APROVADO</p>
                <p style={{ alignSelf: 'center'}}>
                  Poxa! Não foi desta vez. ☹️                 
                </p>
                <p style={{ alignSelf: 'center'}}> Mas não desista, você poderá se inscrever em outro curso futuramente! </p>
                 <p id="status" className="green">APROVADO!</p>
                <p style={{ alignSelf: 'center'}}>Clique 
                <PrimaryButton onClick={() => setModalOpen(true)}>
                  AQUI
                </PrimaryButton> solicitar sua matrícula e garantir sua vaga! 😁</p>
                
               */}
               
                <p id="status" className="green">MATRÍCULA SOLICITADA!</p>
                <p style={{ alignSelf: 'center'}}>
                  Entraremos em contato com você para os próximos passos.
                </p>
                <p style={{ alignSelf: 'center'}}>
                  Seja bem-vindo(a)! 😊
                </p>
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