import React from 'react';
import { Link } from 'react-router-dom';

import './index.css';


const SelecaoModulo = () => {

  return (
    <>
    <h1>Seleção de Módulo</h1>
    <Link to="/cursos">Cursos</Link><br />
    <Link to="/login?type=canditado">Área do Candidato</Link> <br /> 
    <Link to="/login?type=adm">Administração</Link> <br />
    </>
  )
}

export default SelecaoModulo;