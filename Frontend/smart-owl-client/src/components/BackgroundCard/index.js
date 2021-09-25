import React from 'react';

import './index.css';

const BackgroundCard = (props) => {

  return (
   <>
    <div className="background-card">
      {props.children}
    </div>
   </>
  );
};


export default BackgroundCard;