import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { auth } from '../controller';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');

  const signup = async () => {
    if (senha !== confirmarSenha) {
      setErro('Senhas não coincidem');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      navigation.goBack();
    } catch (e) {
      setErro('Erro ao cadastrar');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="E-mail" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry style={styles.input} />
      <TextInput placeholder="Confirmar Senha" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry style={styles.input} />
      {erro ? <Text style={{color:'red'}}>{erro}</Text> : null}
      <Button title="Cadastrar-se" onPress={signup} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'center' },
  input: { width:'80%', borderWidth:1, borderRadius:8, padding:10, marginBottom:10 }
}); 