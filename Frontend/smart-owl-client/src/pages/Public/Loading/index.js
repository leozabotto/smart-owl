import React, { useEffect } from 'react';

import mainLogo from '../../../assets/img/mainLogo.png';

import './index.css'

const Loading = () => {
  
  useEffect(() => {
    document.title = 'Smart Owl'
  }, [])


  return (
    <div className="loading pulse">
      <img className="responsive-logo" src={mainLogo} alt="Smart Owl" />
    </div>
  )
}

export default Loading;