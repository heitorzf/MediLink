import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db, auth } from '../controller';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function ConsultasScreen() {
  const [consultas, setConsultas] = useState([]);

  useEffect(() => {
    const fetchConsultas = async () => {
      const q = query(collection(db, "consultas"), where("userId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      setConsultas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchConsultas();
  }, []);

  return (
    <View style={{flex:1, padding:10}}>
      <Text style={styles.title}>Consultas</Text>
      <FlatList
        data={consultas}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={{fontWeight:'bold'}}>Médico: {item.medicoId}</Text>
            <Text>Data: {new Date(item.dataAgendamento).toLocaleDateString()}</Text>
            <Text>Paciente: {item.nome}</Text>
            <Text>Histórico: {item.historicoMedico}</Text>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  title: { fontSize:24, fontWeight:'bold', marginBottom:10 },
  card: { backgroundColor:'#eee', padding:10, borderRadius:8, marginBottom:10 }
}); 