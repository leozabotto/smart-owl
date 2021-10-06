import React, { useContext, useEffect } from 'react';

import Box from '@material-ui/core/Box';

import BackgroundCard from '../../../components/BackgroundCard';
import AccountingDrawer from '../../../components/AccountingDrawer';
import { HeaderTitle } from '../../../components/HeaderTitle';
import { AuthContext } from '../../../contexts/AuthContext';

import './index.css';

const AccountingDashboard = () => {
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    document.title = 'Dashboard | GestFacil';
  }, [])

  return (
    <AccountingDrawer title="Dashboard">
      <BackgroundCard>
        <div className="master-dashboard">
          <HeaderTitle
            title={`Olá, ${user.name}!`}
          />
          <Box
            display="flex"
            flexWrap="wrap"
            flexDirection="row"
            justifyContent="left"
            alignItems="left"
            css={{ marginTop: 20 }}
          >
      
          </Box>
        </div>
      </BackgroundCard>
    </AccountingDrawer>

  );
};

export default AccountingDashboard;