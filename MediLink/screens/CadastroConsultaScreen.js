import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform, ScrollView, Alert } from 'react-native';
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
    Alert.alert('Sucesso', 'Consulta agendada com sucesso!');
    navigation.goBack();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Agendar Consulta</Text>
        <Text style={styles.medicoInfo}>Dr. {medico.nome} - {medico.especialidade}</Text>
      </View>
      
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Dados do Paciente</Text>
        
        <TextInput placeholder="CPF" value={cpf} onChangeText={setCpf} style={styles.input} keyboardType="numeric" />
        <TextInput placeholder="Nome completo" value={nome} onChangeText={setNome} style={styles.input} />
        <TextInput placeholder="Telefone" value={telefone} onChangeText={setTelefone} style={styles.input} keyboardType="phone-pad" />
        
        <View style={styles.row}>
          <TextInput placeholder="Sexo" value={sexo} onChangeText={setSexo} style={[styles.input, styles.halfInput]} />
          <TextInput placeholder="Idade" value={idade} onChangeText={setIdade} keyboardType="numeric" style={[styles.input, styles.halfInput]} />
        </View>
        
        <TextInput placeholder="Endereço completo" value={endereco} onChangeText={setEndereco} style={styles.input} />
        
        <Text style={styles.sectionTitle}>Data da Consulta</Text>
        
        <TouchableOpacity onPress={() => setShowDate(true)} style={styles.dateInput}>
          <Text style={styles.dateText}>{formatDate(dataAgendamento)}</Text>
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
        
        <Text style={styles.sectionTitle}>Informações Médicas</Text>
        
        <TextInput placeholder="Histórico médico, sintomas, medicamentos..." value={historicoMedico} onChangeText={setHistoricoMedico} style={[styles.input, styles.textArea]} multiline numberOfLines={4} />
        
        <TouchableOpacity style={styles.agendarButton} onPress={agendar}>
          <Text style={styles.agendarButtonText}>Confirmar Agendamento</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    paddingTop: 60,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#FFFFFF',
    marginBottom: 8,
  },
  medicoInfo: {
    fontSize: 16,
    color: '#E8F4FD',
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    marginTop: 8,
  },
  input: { 
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  dateInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  dateText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  agendarButton: {
    backgroundColor: '#27AE60',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  agendarButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});