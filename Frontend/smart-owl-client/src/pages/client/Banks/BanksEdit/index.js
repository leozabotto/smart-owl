import React, { useContext, useEffect, useState } from 'react';

import { TextField, MenuItem } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';

// Custom Components
import BackgroundCard from '../../../../components/BackgroundCard';
import Calendar from '../../../../components/FutureCalendar';
import ClientDrawer from '../../../../components/ClientDrawer';
import PrimaryButton from '../../../../components/Button';
import { HeaderTitle, HeaderSubtitle } from '../../../../components/HeaderTitle';
import { SnackContext } from '../../../../contexts/SnackContext';

import api from '../../../../services/api';

// Assets
import './index.css';
import BanksSelect from '../../../../components/BanksSelect';

const BanksEdit = () => {

  const { id } = useParams();

  const { setSnack } = useContext(SnackContext);

  const history = useHistory();

  const [bank, setBank] = useState("");
  const [ag, setAg] = useState("");
  const [cc, setCc] = useState("");
  const [title, setTitle] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [initialBalanceDate, setInitialDate] = useState(new Date());

  useEffect(() => {
    document.title = 'Edição de Conta Bancária | GestFacil';
    populateFields();
  }, []);

  const resetForm = () => {
    setBank("");
    setAg("");
    setCc("");
    setTitle("");
    setInitialBalance("");
    setInitialDate(new Date());
  }

  const handleBankChange = (e) => {
    setBank(e.target.value);
  }

  const handleAgChange = (e) => {
    setAg(e.target.value);
  }

  const handleCcChange = (e) => {
    setCc(e.target.value);
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }

  const handleBalanceChange = (e) => {
    let valor = e.target.value;

    valor = valor + '';
    valor = parseInt(valor.replace(/[\D]+/g, ''));
    valor = valor + '';
    valor = valor.replace(/([0-9]{2})$/g, ",$1");

    if (valor.length > 6) {
        valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }
    if(valor === 'NaN') return setInitialBalance('');
    setInitialBalance(valor);
  }

  const handleDateChange = (e) => {
    setInitialDate(e.target.value);
  }

  const populateFields = async () => {
    try {
      const response = await api.get(`/bank/${id}`);
      const bank_account = response.data.bank;

      setBank(bank_account.bank);
      setAg(bank_account.ag);
      setCc(bank_account.cc);
      setTitle(bank_account.title);
      setInitialBalance(bank_account.initialBalance);
      setInitialDate(bank_account.initialBalanceDate);

    } catch(err) {
      if(!err.response){       
        setSnack({ message: 'Encontramos um erro ao buscar a conta. Entre em contato com o suporte! ' + err, type: 'error', open: true})
        history.push("/cli/banks");
      }
      else {        
        let msg = err.response.data.err;
        setSnack({ message: `${msg}`, type: 'error', open: true });
        history.push("/cli/banks");
      }
    }  
  }

  async function handleEdit(e) {
    
    e.preventDefault();

    try {
      await api.put(`/bank/${id}`, {
        bank,
        ag,
        cc,
        title,
        initialBalance:  parseFloat((initialBalance).replace(".","").replace(",",".")),
        initialBalanceDate,
        active: 1,
      });
      setSnack({ message: 'Conta atualizada com sucesso!', type: 'success', open: true })
      resetForm();
      history.push("/cli/banks");

    } catch (err) {
      if(!err){       
        setSnack({ message: 'Encontramos um erro ao atualizar a conta. Entre em contato com o suporte! ' + err, type: 'error', open: true})
      }
      else {        
        let msg = err.response.data.err;
        setSnack({ message: `${msg}`, type: 'error', open: true });
      }
    }
  }

  return (
    <ClientDrawer title="Contas Bancárias / Edição">
      <BackgroundCard>
        <HeaderTitle
          title="Edição de Conta Bancária"
          subtitle="Atenção: preecha todos os campos obrigatórios (*) para o cadastro."
        />

        <div className="accounting-form-container">
          <form className="accounting-form" method="POST" onSubmit={handleEdit}>
            <HeaderSubtitle
              title="Dados da Conta"
            />           

            <div className="accounting-form-admin">
             <div className="input-block">
                <BanksSelect 
                  value={bank}
                  onChange={(value) => {handleBankChange(value)}}
                />
              </div>
              <div className="input-block">
                <TextField
                  name="ag"
                  label="Ag"
                  variant="outlined"
                  type="text"
                  autoComplete="off"
                  value={ag}
                  onChange={handleAgChange}                  
                  fullWidth
                  required="required"
                />
              </div>
              <div className="input-block">                
                <TextField
                  name="cc"
                  label="Cc"
                  variant="outlined"
                  type="text"
                  autoComplete="off"
                  value={cc}
                  onChange={handleCcChange}                  
                  fullWidth
                  required="required"
                />
              </div>
              <div className="input-block">
                <TextField
                  name="title"
                  label="Apelido"
                  variant="outlined"
                  type="text"
                  autoComplete="off"
                  value={title}
                  onChange={handleTitleChange}
                  required="required"                                
                  fullWidth
                />
              </div>
              <div className="input-block">
                <TextField
                  name="initialBalance"
                  label="Saldo Inicial"
                  variant="outlined"
                  type="text"
                  autoComplete="off"
                  value={initialBalance}
                  onChange={handleBalanceChange}
                  required="required"                                
                  fullWidth
                />
              </div>
              <div className="input-block">
                <Calendar 
                  name="initialBalanceDate"
                  label="Data de Saldo Inicial"
                  inputVariant="outlined"
                  autoComplete="off"
                  fullWidth
                  value={initialBalanceDate}
                  onChange={handleDateChange}
                />
              </div>
            </div>

            <div className="accounting-form-button">
              <PrimaryButton size="large" variant="contained" type="submit">Salvar</PrimaryButton>
            </div>
          </form>
        </div>
      </BackgroundCard>
    </ClientDrawer>
  );
};

export default BanksEdit;