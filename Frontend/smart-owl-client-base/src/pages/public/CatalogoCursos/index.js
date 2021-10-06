import React from 'react';
import './index.css';

import { Link } from 'react-router-dom';

import SmartOwlLogo from '../../../assets/img/smart-owl-logo.png';
import CardCurso from '../../../components/CardCurso';

const CatalogoCursos = (props) => {

  return (
    <div className="catalogo-cursos-container">

      <div className="cabecalho">
        <img src={SmartOwlLogo} />
        <h1> Cursos Disponíveis </h1>     
      </div>


      <div className="cursos">                 
        <CardCurso 
          nome="Python Básico"
          descricaoCurta="Aprenda a programar em Python!"
        />

        <CardCurso 
          nome="Python Básico"
          descricaoCurta="Aprenda a programar em Python!"
        />

        <CardCurso 
          nome="Python Básico"
          descricaoCurta="Aprenda a programar em Python!"
        />

        <CardCurso 
          nome="Python Básico"
          descricaoCurta="Aprenda a programar em Python!"
        />

        <CardCurso 
          nome="Python Básico"
          descricaoCurta="Aprenda a programar em Python!"
        />

        <CardCurso 
          nome="Python Básico"
          descricaoCurta="Aprenda a programar em Python!"
        />

      </div>
    </div>
  )
}

export default CatalogoCursos;