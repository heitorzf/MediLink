import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, Alert, StyleSheet, Platform } from 'react-native';
import { db, auth } from '../controller';
import { collection, addDoc } from 'firebase/firestore';

export default function CadastroConsultaScreen({ route, navigation }) {
  const { medico } = route.params;
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [sexo, setSexo] = useState('');
  const [idade, setIdade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [horaAgendamento, setHoraAgendamento] = useState('');
  const [historicoMedico, setHistoricoMedico] = useState('');

  const agendar = async () => {
    const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    const horaRegex = /^\d{2}:\d{2}$/;
    if (!dataRegex.test(dataAgendamento) || !horaRegex.test(horaAgendamento)) {
      Alert.alert('Erro', 'Preencha a data e hora corretamente (DD/MM/AAAA e HH:mm).');
      return;
    }
    const [dia, mes, ano] = dataAgendamento.split('/').map(Number);
    const [hora, minuto] = horaAgendamento.split(':').map(Number);
    const dataHora = new Date(ano, mes - 1, dia, hora, minuto);
    const now = new Date();
    if (isNaN(dataHora.getTime()) || dataHora <= now) {
      Alert.alert('Erro', 'Selecione uma data e hora futura para o agendamento.');
      return;
    }
    await addDoc(collection(db, "consultas"), {
      cpf, nome, telefone, sexo, idade: Number(idade), endereco,
      dataAgendamento: dataHora.toISOString(),
      historicoMedico,
      medicoId: medico.id,
      userId: auth.currentUser.uid
    });
    Alert.alert('Sucesso', 'Consulta agendada com sucesso!');
    navigation.goBack();
  };

  const formatDateTime = (date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    if (!(date instanceof Date) || isNaN(date)) return '';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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
        <TextInput
          placeholder="DD/MM/AAAA"
          value={dataAgendamento}
          onChangeText={text => {
            let cleaned = text.replace(/[^0-9]/g, '');
            let masked = '';
            if (cleaned.length > 0) masked += cleaned.substring(0, 2);
            if (cleaned.length > 2) masked += '/' + cleaned.substring(2, 4);
            if (cleaned.length > 4) masked += '/' + cleaned.substring(4, 8);
            setDataAgendamento(masked);
          }}
          style={styles.input}
          keyboardType="numeric"
          maxLength={10}
        />
        <TextInput
          placeholder="HH:mm"
          value={horaAgendamento}
          onChangeText={text => {
            let cleaned = text.replace(/[^0-9]/g, '');
            let masked = '';
            if (cleaned.length > 0) masked += cleaned.substring(0, 2);
            if (cleaned.length > 2) masked += ':' + cleaned.substring(2, 4);
            setHoraAgendamento(masked);
          }}
          style={styles.input}
          keyboardType="numeric"
          maxLength={5}
        />
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
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  medicoInfo: {
    fontSize: 18,
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