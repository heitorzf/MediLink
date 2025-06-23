import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image } from 'react-native';
import { auth } from '../controller';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigation.replace('Tabs');
    } catch (e) {
      setErro('Usuário ou senha inválidos');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon.png')} style={{width:100, height:100, marginBottom:20}} />
      <TextInput placeholder="Usuário" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry style={styles.input} />
      {erro ? <Text style={{color:'red'}}>{erro}</Text> : null}
      <View style={{flexDirection:'row', justifyContent:'space-between', width:'80%'}}>
        <Button title="Login" onPress={login} />
        <Button title="Cadastro" onPress={() => navigation.navigate('Signup')} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'center' },
  input: { width:'80%', borderWidth:1, borderRadius:8, padding:10, marginBottom:10 }
}); 