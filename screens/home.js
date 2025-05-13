import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import axios from 'axios'; // Importando o axios

const API_URL = 'http://192.168.x.x:8080/colecao'; // Substitua pelo IP do seu computador na rede local

export default function HomeScreen() {
  const [esmaltes, setEsmaltes] = useState([]);
  const [busca, setBusca] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [esmalteAtual, setEsmalteAtual] = useState({});
  const [confirmarDelete, setConfirmarDelete] = useState(false);

  // Função para buscar todos os esmaltes
  const fetchEsmaltes = async () => {
    try {
      const response = await axios.get(API_URL); // Fazendo a requisição GET para o backend
      setEsmaltes(response.data); // Atualiza o estado com os dados da resposta
    } catch (error) {
      console.error('Erro ao buscar esmaltes', error); // Lida com erro
    }
  };

  // Função para adicionar ou editar o esmalte
  const salvarEsmalte = async () => {
    try {
      if (modoEdicao) {
        await axios.put(`${API_URL}/editar/${esmalteAtual.id}`, esmalteAtual); // Fazendo requisição PUT para editar
      } else {
        await axios.post(`${API_URL}/criar`, esmalteAtual); // Fazendo requisição POST para adicionar
      }
      setModalVisivel(false);
      setEsmalteAtual({});
      fetchEsmaltes(); // Recarrega os esmaltes
    } catch (error) {
      console.error('Erro ao salvar esmalte', error);
    }
  };

  // Função para excluir o esmalte
  const excluirEsmalte = async () => {
    try {
      await axios.delete(`${API_URL}/excluir/${esmalteAtual.id}`); // Fazendo requisição DELETE para excluir
      setConfirmarDelete(false);
      setEsmalteAtual({});
      fetchEsmaltes(); // Recarrega os esmaltes
    } catch (error) {
      console.error('Erro ao excluir esmalte', error);
    }
  };

  useEffect(() => {
    fetchEsmaltes(); // Carrega os esmaltes quando a tela é carregada
  }, []);

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar na coleção"
          placeholderTextColor="#999"
          value={busca}
          onChangeText={setBusca}
          style={styles.searchInput}
        />
      </View>

      {/* Botão adicionar esmalte */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setModoEdicao(false);
          setEsmalteAtual({ nome: '', marca: '', cor: '', imagem: '' });
          setModalVisivel(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Adicionar esmalte</Text>
      </TouchableOpacity>

      {/* Lista de esmaltes */}
      <FlatList
        data={esmaltes.filter(e =>
          e.nome.toLowerCase().includes(busca.toLowerCase())
        )}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.nome}</Text>
            <Text>{item.marca}</Text>
            <TouchableOpacity onPress={() => {
              setModoEdicao(true);
              setEsmalteAtual(item);
              setModalVisivel(true);
            }}>
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setEsmalteAtual(item);
              setConfirmarDelete(true);
            }}>
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal de criação/edição */}
      <Modal visible={modalVisivel} animationType="slide">
        <View style={styles.modal}>
          <TextInput
            placeholder="URL da imagem"
            value={esmalteAtual.imagem}
            onChangeText={texto =>
              setEsmalteAtual({ ...esmalteAtual, imagem: texto })
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Nome"
            value={esmalteAtual.nome}
            onChangeText={texto =>
              setEsmalteAtual({ ...esmalteAtual, nome: texto })
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Marca"
            value={esmalteAtual.marca}
            onChangeText={texto =>
              setEsmalteAtual({ ...esmalteAtual, marca: texto })
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Cor"
            value={esmalteAtual.cor}
            onChangeText={texto =>
              setEsmalteAtual({ ...esmalteAtual, cor: texto })
            }
            style={styles.input}
          />
          <View style={styles.modalBotoes}>
            <TouchableOpacity onPress={() => setModalVisivel(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={salvarEsmalte}>
              <Text style={styles.salvar}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal confirmar exclusão */}
      <Modal visible={confirmarDelete} transparent animationType="fade">
        <View style={styles.modalExcluir}>
          <Text>Deseja excluir esse esmalte?</Text>
          <View style={styles.modalBotoes}>
            <TouchableOpacity onPress={() => setConfirmarDelete(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={excluirEsmalte}>
              <Text style={styles.excluir}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    margin: 12,
    backgroundColor: '#FFF',
    borderRadius: 35,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0B0FF',
  },
  searchInput: {
    flex: 1,
    height: 36,
  },
  addButton: {
    backgroundColor: '#BA68C8',
    marginHorizontal: 60,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 6,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  editText: {
    color: '#BA68C8',
    marginTop: 10,
  },
  deleteText: {
    color: 'red',
    marginTop: 5,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 6,
    padding: 10,
    marginVertical: 5,
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 70,
  },
  cancelar: {
    color: '#999',
  },
  salvar: {
    color: '#6A1B9A',
    fontWeight: 'bold',
  },
  excluir: {
    color: 'red',
    fontWeight: 'bold',
  },
  modalExcluir: {
    backgroundColor: '#FFF',
    padding: 20,
    margin: 50,
    borderRadius: 10,
    alignItems: 'center',
  },
});
