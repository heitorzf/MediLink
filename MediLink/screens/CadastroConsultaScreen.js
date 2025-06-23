import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { db, auth } from '../controller';
import { collection, addDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CadastroConsultaScreen({ route, navigation }) {
  const { medico } = route.params;
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [sexo, setSexo] = useState('');
  const [idade, setIdade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataAgendamento, setDataAgendamento] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [historicoMedico, setHistoricoMedico] = useState('');

  const agendar = async () => {
    await addDoc(collection(db, "consultas"), {
      cpf, nome, telefone, sexo, idade: Number(idade), endereco,
      dataAgendamento: dataAgendamento.toISOString(),
      historicoMedico,
      medicoId: medico.id,
      userId: auth.currentUser.uid
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro Consulta</Text>
      <TextInput placeholder="CPF" value={cpf} onChangeText={setCpf} style={styles.input} />
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Telefone" value={telefone} onChangeText={setTelefone} style={styles.input} />
      <View style={{flexDirection:'row', justifyContent:'space-between', width:'80%'}}>
        <TextInput placeholder="Sexo" value={sexo} onChangeText={setSexo} style={[styles.input, {width:'48%'}]} />
        <TextInput placeholder="Idade" value={idade} onChangeText={setIdade} keyboardType="numeric" style={[styles.input, {width:'48%'}]} />
      </View>
      <TextInput placeholder="Endereço" value={endereco} onChangeText={setEndereco} style={styles.input} />
      <TouchableOpacity onPress={() => setShowDate(true)} style={styles.input}>
        <Text>{dataAgendamento.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDate && (
        <DateTimePicker
          value={dataAgendamento}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowDate(false);
            if (date) setDataAgendamento(date);
          }}
        />
      )}
      <TextInput
        placeholder="Histórico Médico"
        value={historicoMedico}
        onChangeText={setHistoricoMedico}
        style={[styles.input, {height:80}]}
        multiline
      />
      <Button title="Agendar Consulta" onPress={agendar} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', padding:20 },
  title: { fontSize:24, fontWeight:'bold', marginBottom:10 },
  input: { width:'80%', borderWidth:1, borderRadius:8, padding:10, marginBottom:10 }
}); 