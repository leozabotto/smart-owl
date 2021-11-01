import React, { useContext, useEffect } from 'react';

import Box from '@material-ui/core/Box';

import BackgroundCard from '../../../components/BackgroundCard';
import AdmDrawer from '../../../components/AdmDrawer';
import { HeaderTitle } from '../../../components/HeaderTitle';
import { AuthContext } from '../../../contexts/AuthContext';

import './index.css';

const PainelAdm = () => {
  const { user, role } = useContext(AuthContext);
  
  useEffect(() => {
    document.title = 'Dashboard | Smart Owl';
  }, [role])

  return (
    <AdmDrawer title="Painel Administrativo">
      <BackgroundCard>
        <div className="master-dashboard">
          <HeaderTitle
            title={`Olá, ${user.nome}!`}  
            subtitle={"Bem-vindo ao Smart Owl"}        
          />
          <Box
            display="flex"
            flexWrap="wrap"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="50vh"
            css={{ marginTop: 20 }}
          >    
            <p> [ DASHBOARD ] </p>                    
          
            {/* <CardLink link="/cli/payable_accounts" icon={<AccountBalanceWallet />}>
              Contas a Pagar
            </CardLink> 
            <CardLink link="/cli/receivable_accounts" icon={<MonetizationIcon />}>
              Contas a Receber
            </CardLink>  
            <CardLink link="/cli/statement" icon={<DescriptionOutlinedIcon />}>
              Extrato
            </CardLink> 
            <CardLink link="/cli/account_posting" icon={<PublishIcon />}>
              Lançamento
            </CardLink>        */}
          </Box>
        </div>
      </BackgroundCard>
    </AdmDrawer>
  );
};

export default PainelAdm;