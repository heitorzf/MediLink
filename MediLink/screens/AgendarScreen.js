import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { db } from '../controller';
import { collection, getDocs } from 'firebase/firestore';

export default function AgendarScreen({ navigation }) {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "medicos"));
        setMedicos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Erro ao buscar médicos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicos();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Carregando médicos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha um Médico</Text>
      <Text style={styles.subtitle}>Selecione um profissional para agendar sua consulta</Text>
      
      <FlatList
        data={medicos}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('CadastroConsulta', { medico: item })}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.doctorImageContainer}>
                {item.foto ? (
                  <Image source={{uri: item.foto}} style={styles.doctorImage} />
                ) : (
                  <View style={styles.doctorImagePlaceholder}>
                    <Text style={styles.doctorInitial}>
                      {item.nome ? item.nome.charAt(0).toUpperCase() : 'M'}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>Dr. {item.nome}</Text>
                <Text style={styles.doctorSpecialty}>{item.especialidade}</Text>
                {item.experiencia && (
                  <Text style={styles.doctorExperience}>
                    {item.experiencia} anos de experiência
                  </Text>
                )}
              </View>
              
              <View style={styles.agendarButton}>
                <Text style={styles.agendarButtonText}>Agendar</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7F8C8D',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  doctorImageContainer: {
    marginRight: 16,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ECF0F1',
  },
  doctorImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  doctorInfo: {
    flex: 1,
    marginRight: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 2,
  },
  doctorExperience: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  agendarButton: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  agendarButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});