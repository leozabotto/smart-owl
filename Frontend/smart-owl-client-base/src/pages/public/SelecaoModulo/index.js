import React from 'react';
import './index.css';

import { Link } from 'react-router-dom';

const SelecaoModulo = (props) => {

  return (<>
    <h1>Seleção Módulo</h1>
    <Link to="/cursos">Cursos Disponíveis</Link> <br />
    <Link to="/login?type=canditato">Área do Candidato</Link> <br />
    <Link to="/login?type=adm">Administração</Link> <br />
  </>)
}

export default SelecaoModulo;