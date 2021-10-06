import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import ptBR from 'date-fns/locale/pt-BR/index';

import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

const Calendar = ({...props}) => {
  return(
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
      <KeyboardDatePicker       
        openTo="year"
        format="dd/MM/yyyy"
        color="primary"
        views={["year", "month", "date"]}
        variant="inline"
        autoOk      
        invalidDateMessage="Insira uma data válida."
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
        {...props}
        />
    </MuiPickersUtilsProvider>
  )
}

export default Calendar;