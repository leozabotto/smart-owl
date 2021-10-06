import { CircularProgress } from "@material-ui/core";

import './index.css'

const LoadingProgress = () => {
  return (
    <div className="loading-container">
      <div className="loading-style">
        <div className="loading-bar">
          <CircularProgress />
        </div>
        <div className="loading-info">
          <h3>Carregando informações, aguarde um instante...</h3>
        </div>
      </div>
    </div>
  )
}

export default LoadingProgress;