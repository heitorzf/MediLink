import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { db, auth } from '../controller';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';

export default function ConsultasScreen() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        // Verifica se o usuário está logado
        if (!auth.currentUser) {
          setLoading(false);
          return;
        }

        const q = query(collection(db, "consultas"), where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const consultasData = [];
        
        for (const consultaDoc of querySnapshot.docs) {
          const consultaData = { id: consultaDoc.id, ...consultaDoc.data() };
          
          const medicoDoc = await getDoc(doc(db, "medicos", consultaData.medicoId));
          if (medicoDoc.exists()) {
            consultaData.medico = medicoDoc.data();
          }
          
          consultasData.push(consultaData);
        }
        
        // Ordena por data
        consultasData.sort((a, b) => new Date(a.dataAgendamento) - new Date(b.dataAgendamento));
        setConsultas(consultasData);
      } catch (error) {
        console.error("Erro ao buscar consultas:", error);
        Alert.alert("Erro", "Não foi possível carregar as consultas");
      } finally {
        setLoading(false);
      }
    };
    
    fetchConsultas();
  }, []);

  const cancelarConsulta = async (consultaId) => {
    try {
      await deleteDoc(doc(db, "consultas", consultaId));
      // Remove da lista local
      setConsultas(consultas.filter(consulta => consulta.id !== consultaId));
      console.log("Consulta cancelada com sucesso!");
    } catch (error) {
      console.error("Erro ao cancelar:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateWithDay = (dateString) => {
    const date = new Date(dateString);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    return {
      day: date.getDate(),
      month: months[date.getMonth()],
      weekDay: days[date.getDay()]
    };
  };

  const getStatusColor = (dateString) => {
    const today = new Date();
    const consultaDate = new Date(dateString);
    
    if (consultaDate < today) {
      return '#95A5A6'; // Cinza para consultas passadas
    } else if (consultaDate.toDateString() === today.toDateString()) {
      return '#E74C3C'; // Vermelho para hoje
    } else {
      return '#27AE60'; // Verde para futuras
    }
  };

  const getStatusText = (dateString) => {
    const today = new Date();
    const consultaDate = new Date(dateString);
    
    if (consultaDate < today) {
      return 'Realizada';
    } else if (consultaDate.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else {
      return 'Agendada';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Carregando consultas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Consultas</Text>
        <Text style={styles.subtitle}>
          {consultas.length} {consultas.length === 1 ? 'consulta agendada' : 'consultas agendadas'}
        </Text>
      </View>

      {consultas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>Nenhuma consulta agendada</Text>
          <Text style={styles.emptyText}>Vá para "Agendar" para marcar sua primeira consulta</Text>
        </View>
      ) : (
        <FlatList
          data={consultas}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            const dateInfo = formatDateWithDay(item.dataAgendamento);
            const statusColor = getStatusColor(item.dataAgendamento);
            const statusText = getStatusText(item.dataAgendamento);
            
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateDay}>{dateInfo.day}</Text>
                    <Text style={styles.dateMonth}>{dateInfo.month}</Text>
                    <Text style={styles.dateWeekDay}>{dateInfo.weekDay}</Text>
                  </View>
                  
                  <View style={styles.consultaInfo}>
                    <Text style={styles.medicoNome}>
                      Dr. {item.medico?.nome || 'Médico não encontrado'}
                    </Text>
                    <Text style={styles.especialidade}>
                      {item.medico?.especialidade || ''}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                      <Text style={styles.statusText}>{statusText}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.cardContent}>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>👤 {item.nome}</Text>
                    <Text style={styles.patientDetails}>📞 {item.telefone}</Text>
                    <Text style={styles.patientDetails}>📍 {item.endereco}</Text>
                  </View>
                  
                  {item.historicoMedico && (
                    <View style={styles.historicoContainer}>
                      <Text style={styles.historicoLabel}>📋 Histórico:</Text>
                      <Text style={styles.historicoText}>{item.historicoMedico}</Text>
                    </View>
                  )}

                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => cancelarConsulta(item.id)}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E8F4FD',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  dateContainer: {
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    minWidth: 70,
  },
  dateDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  dateMonth: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  dateWeekDay: {
    fontSize: 11,
    color: '#95A5A6',
    marginTop: 2,
  },
  consultaInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  medicoNome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  especialidade: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 20,
    paddingTop: 0,
  },
  patientInfo: {
    marginBottom: 16,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 6,
  },
  patientDetails: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  historicoContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  historicoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 8,
  },
  historicoText: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 20,
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});