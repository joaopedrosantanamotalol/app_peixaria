import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { db } from '../src/config/firebase';

export default function AddPeixeScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [origem, setOrigem] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nome || !especie || !preco || !quantidade || !origem) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const precoNum = parseFloat(preco.replace(',', '.'));
    const quantidadeNum = parseFloat(quantidade.replace(',', '.'));

    if (isNaN(precoNum) || precoNum <= 0) {
      Alert.alert('Erro', 'Preço inválido');
      return;
    }

    if (isNaN(quantidadeNum) || quantidadeNum <= 0) {
      Alert.alert('Erro', 'Quantidade inválida');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'peixes'), {
        nome,
        especie,
        preco: precoNum,
        quantidade: quantidadeNum,
        origem,
        createdAt: new Date(),
      });

      Alert.alert('Sucesso', 'Peixe adicionado com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Erro ao adicionar peixe:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o peixe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.label}>Nome do Peixe *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Salmão Fresco"
            value={nome}
            onChangeText={setNome}
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Espécie *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Salmo salar"
            value={especie}
            onChangeText={setEspecie}
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Preço (R$/kg) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 45.90"
            value={preco}
            onChangeText={setPreco}
            keyboardType="decimal-pad"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Quantidade (kg) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 50"
            value={quantidade}
            onChangeText={setQuantidade}
            keyboardType="decimal-pad"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Origem *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Oceano Atlântico"
            value={origem}
            onChangeText={setOrigem}
            placeholderTextColor="#94a3b8"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Salvando...' : '💾 Salvar Peixe'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#acb5caff',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#172b57ff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#b1c3edff',
    borderWidth: 1,
    borderColor: '#006cf8ff',
  },
  button: {
    backgroundColor: '#006cf8ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelText: {
    color: '#46a766ff',
    fontSize: 16,
    fontWeight: '600',
  },
});