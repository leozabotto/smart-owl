import api from "../../services/api";

const accCategoryReducer = async (state, action) => {
  
  let res = [];
  
  switch(action.type) {
    case 'list':
      res = await api.get
      return
    default:
      return state
  }
}

export default accCategoryReducer;