import React, { 
  useContext, 
  useEffect, 
  useState, 
  useReducer 
} from 'react';

import { useHistory } from 'react-router-dom';

import { 
  TextField, 
  FormLabel,
  RadioGroup,
  Radio,
  MenuItem, 
  CircularProgress,
  FormControl, 
  FormControlLabel, 
  Switch,
  Divider,
} from '@material-ui/core';

import PrimaryButton from '../Button';
import FutureCalendar from '../FutureCalendar';
import { HeaderTitle, HeaderSubtitle } from '../HeaderTitle';
import Modal from '../Modal';

import { SnackContext } from '../../contexts/SnackContext';

import './index.css';

const InstallmentForm = (props) => {

  const { setSnack } = useContext(SnackContext);
  const history = useHistory();  

  const formatBRL = (amount) => {
    let value = amount;
    value = value + '';
    value = parseInt(value.replace(/[\D]+/g, ''));
    value = value + '';
    value = value.replace(/([0-9]{2})$/g, ",$1");
    if (value.length > 6) {
        value = value.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }
    if(value == 'NaN') return '';
    return value;    
  }

  const [loading, setLoading] = useState(false);

  const [splited, setSplited] = useState(false);
  const [splitsNumber, setSplitsNumber] = useState(null);
  const [splitFields, setSplitFields] = useState([]);
  const [splitMode, setSplitMode] = useState();
  const total = props.total;
  const description = props.description;

  const handleSplitedChange = (value) => {
    return setSplited(value);
  }

  const handleSplitModeChange = (e) => {
    return setSplitMode(e.target.value);
  }

  const handleSplitsNumber = (value) => {
    return setSplitsNumber(value);
  }

  const handleSplitFields = (value) => {
    return setSplitFields([1, 2, 3, 4]);
  }

  useEffect(() => {
    
    setLoading(true);

    let fields = [];
    let value = 0;

    if (splitMode == "1") {
      value = Math.round(total/splitsNumber * 100) / 100;
    } else {
      value = total;
    }

    for (let i = 1; i <= splitsNumber; i++) {
      fields.push(
      {
        number: `${i}/${splitsNumber}`,
        value: value,
        dueDate: "2021-02-04",
        compDate: "2021-02-04",
        desc: `${description} ${i}/${splitsNumber}`
      });
    }
    setSplitFields(fields);
  }, [splitsNumber, splitMode, total, description]);

  useEffect(() => {
    setLoading(false);
  }, [splitFields]);

  return (
    <>     
      <HeaderSubtitle
        title="Parcelamento"
      />

      <div className="installment-form-container">      
        <div className="installment-form">
          <div className="input-block">
            <FormControlLabel control={
            <Switch 
              checked={splited}
              onChange={(e) => handleSplitedChange(e.target.checked)}
            />
            } label="Ativar Parcelamento" />           
          </div>
          {splited ?     
            <> 
            <FormControl component="fieldset">
              <FormLabel component="legend">Modo de Parcelamento</FormLabel>
              <RadioGroup aria-label="splitMode" name="splitMode" value={splitMode} onChange={handleSplitModeChange}>
                <FormControlLabel 
                  value="1" 
                  control={<Radio />} 
                  label="Dividir total entre parcelas" 
                />
                <FormControlLabel 
                  value="2" 
                  control={<Radio />} 
                  label="Aplicar o valor total para todas" 
                />             
              </RadioGroup>
            </FormControl>
            <div className="input-block">
              <TextField                
                name="splitsNumber"
                label="Em quantas vezes?"
                variant="outlined"
                value={splitsNumber}
                onChange={(e) => handleSplitsNumber(e.target.value)}
                type="number"
                autoComplete="off"                      
                fullWidth                 
                required
                max="400"
              />              
            </div>
            </>
            : ''
          }
        </div>
        {splited? 
          loading ? <CircularProgress /> 
          :           
          
          splitFields.map((split, i) => {
            return (<>

            <div style={{marginTop: '15px', marginBottom: '15px'}}>
              <h4>Parcela {split.number}</h4>
              <Divider />
            </div>
            <div className="installment-form-container">      
              <div className="installment-form">
                <div className="input-block">            
                  <TextField                  
                    name="value"
                    label="Valor"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={split.value}
                    // onChange={(e) => dispatch({
                    //   type: 'cgDescription',
                    //   value: e.target.value,
                    // })}                
                    fullWidth                 
                  />      
                </div>
                <div className="input-block">
                  <FutureCalendar
                    name="compDate"
                    label="Data de Vencimento"
                    inputVariant="outlined"
                    autoComplete="off"
                    // value={}
                    // onChange={}
                    fullWidth
                    required
                  />
                </div>
                <div className="input-block">
                  <FutureCalendar
                    name="compDate"
                    label="Data de Competência"
                    inputVariant="outlined"
                    autoComplete="off"
                    // value={}
                    // onChange={}
                    fullWidth
                    required
                  />
                </div>
                <div className="input-block">            
                  <TextField                  
                    name="description"
                    label="Descrição"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={split.desc}
                    InputProps={{
                      readOnly: true,
                    }}  
                    fullWidth          
                  />      
                </div>
              </div>
            </div>
                    
            
            </>)
          })
        : ''}     
      </div>

      
                    
       
    
      
                          
     
        
        {/*
        
        <div className="input-block">
          <FutureCalendar
            name="compDate"
            label="Data de Competência"
            inputVariant="outlined"
            autoComplete="off"
            value={compDate}
            onChange={setCompDate}
            fullWidth
            required
          />
        </div>
                      
       
       

        <div className="input-block">
          <FutureCalendar
            name="dueDate"
            label="Data de Vencimento"
            inputVariant="outlined"
            autoComplete="off"
            value={dueDate}
            onChange={setDueDate}
            fullWidth
            required
          />
        </div>                          

        <div className="input-block">            
          <TextField                  
            name="description"
            label="Descrição"
            variant="outlined"
            type="text"
            autoComplete="off"
            value={form.description}
            onChange={(e) => dispatch({
              type: 'cgDescription',
              value: e.target.value,
            })}
            error={null}
            fullWidth                 
          />                  */}
        {/*</div>*/}
     
    </>                
  );
};

export default InstallmentForm;