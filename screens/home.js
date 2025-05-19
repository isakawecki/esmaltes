import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';

const API_URL = 'https://10.105.71.144:8080/colecao';

export default function HomeScreen() {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [esmalteAtual, setEsmalteAtual] = useState({
    nome: '',
    marca: '',
    cor: '',
    imgUrl: '',
  });

  // Função para salvar ou editar esmalte
  const salvarEsmalte = async () => {
    console.log('Esmalte a salvar:', esmalteAtual);
    try {
      const method = modoEdicao ? 'PUT' : 'POST'; // Define o método dependendo do modo de edição
      const url = modoEdicao 
        ? `${API_URL}/editar/${esmalteAtual.id}` 
        : `${API_URL}/criar`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(esmalteAtual), // Corpo com dados do esmalte
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar esmalte');
      }

      // Limpa o modal e os dados após salvar
      setModalVisivel(false);
      setEsmalteAtual({ nome: '', marca: '', cor: '', imgUrl: '' });
    } catch (error) {
      console.error('Erro ao salvar esmalte', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botão para adicionar novo esmalte */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setModoEdicao(false);
          setEsmalteAtual({ nome: '', marca: '', cor: '', imgUrl: '' });
          setModalVisivel(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Adicionar esmalte</Text>
      </TouchableOpacity>

      {/* Modal para adicionar ou editar esmalte */}
      <Modal visible={modalVisivel} animationType="slide">
        <View style={styles.modal}>
          <TextInput
            placeholder="Imagem (URL)"
            value={esmalteAtual.imgUrl || ''}
            onChangeText={texto =>
              setEsmalteAtual({ ...esmalteAtual, imgUrl: texto })
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Nome"
            value={esmalteAtual.nome || ''}
            onChangeText={texto =>
              setEsmalteAtual({ ...esmalteAtual, nome: texto })
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Marca"
            value={esmalteAtual.marca || ''}
            onChangeText={texto =>
              setEsmalteAtual({ ...esmalteAtual, marca: texto })
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Cor"
            value={esmalteAtual.cor || ''}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5',
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
});
