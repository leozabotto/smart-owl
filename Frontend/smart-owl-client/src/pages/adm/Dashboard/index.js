import React, { useContext, useEffect } from 'react';

import Box from '@material-ui/core/Box';

import BackgroundCard from '../../../components/BackgroundCard';
import AdmDrawer from '../../../components/AdmDrawer';
import { HeaderTitle } from '../../../components/HeaderTitle';
import { AuthContext } from '../../../contexts/AuthContext';

import './index.css';

const AdmDashboard = () => {
  const { user, role } = useContext(AuthContext);
  
  useEffect(() => {
    document.title = 'Dashboard | Smart Owl';
  }, [role])

  return (
    <AdmDrawer title="Dashboard">
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
    </AdmDrawer>
  );
};

export default AdmDashboard;