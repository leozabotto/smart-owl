import React from 'react';
import './index.css';

const CardCurso = (props) => {

  return (  
    <div className="card-curso">
      <h1>{props.nome}</h1>
      <span>{props.descricaoCurta}</span>
    </div>                
  )
}

export default CardCurso;