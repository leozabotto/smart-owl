import React from 'react';
import { DataGrid } from '@material-ui/data-grid';

import './index.css';

const DataGridWithTitle = (props) => {

  return (
    <div className="datagrid-container">
      <h2 className="datagrid-title">{props.title}</h2>
      <hr />
      <div className="datagrid-table">        
        <DataGrid  
          pageSize={props.pageSize} 
          disableColumnMenu 
          disableSelectionOnClick 
          rows={props.rows}
          columns={props.columns}
        />
      </div>
    </div>
  )
}

export default DataGridWithTitle;