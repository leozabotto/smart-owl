import React, { useState } from 'react';
import api from '../services/api';

const usePopulate = () => {

  const [data, setData] = useState();

  const get = async (url, query) => {
    try {
      const res = await api.get(url, {...query});
      return res;
    } catch(err) {
      console.log(err)
    }
  }

  
  

  return [
    data,
    {
      get,
    }
  
  ];
  
}

export default usePopulate;