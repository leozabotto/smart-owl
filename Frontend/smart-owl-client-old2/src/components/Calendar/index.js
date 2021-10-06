import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

const Calendar = ({...props}) => {
  return(
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
      <DatePicker
        disableFuture
        openTo="year"
        format="dd/MM/yyyy"
        color="primary"
        views={["year", "month", "date"]}
        variant="inline"
        autoOk
        {...props}
        />
    </MuiPickersUtilsProvider>
  )
}

export default Calendar;