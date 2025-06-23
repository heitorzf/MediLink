import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Image } from 'react-native';
import { db } from '../controller';
import { collection, getDocs } from 'firebase/firestore';

export default function AgendarScreen({ navigation }) {
  const [medicos, setMedicos] = useState([]);

  useEffect(() => {
    const fetchMedicos = async () => {
      const querySnapshot = await getDocs(collection(db, "medicos"));
      setMedicos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchMedicos();
  }, []);

  return (
    <View style={{flex:1, padding:10}}>
      <Text style={styles.title}>Agendar</Text>
      <FlatList
        data={medicos}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            {item.foto && <Image source={{uri: item.foto}} style={{width:50, height:50, borderRadius:25}} />}
            <View style={{flex:1, marginLeft:10}}>
              <Text style={{fontWeight:'bold'}}>{item.nome}</Text>
              <Text>{item.especialidade}</Text>
            </View>
            <Button title="Agendar" onPress={() => navigation.navigate('CadastroConsulta', { medico: item })} />
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  title: { fontSize:24, fontWeight:'bold', marginBottom:10 },
  card: { flexDirection:'row', alignItems:'center', backgroundColor:'#eee', padding:10, borderRadius:8, marginBottom:10 }
}); 