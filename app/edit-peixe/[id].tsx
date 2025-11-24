import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../src/config/firebase';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function EditPeixeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const peixeId = Array.isArray(id) ? id[0] : id;

  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [origem, setOrigem] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPeixe();
  }, []);

  const loadPeixe = async () => {
    try {
      const docRef = doc(db, 'peixes', peixeId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setNome(data.nome);
        setEspecie(data.especie);
        setPreco(data.preco.toString());
        setQuantidade(data.quantidade.toString());
        setOrigem(data.origem);
      } else {
        Alert.alert('Erro', 'Peixe não encontrado');
        router.back();
      }
    } catch (error) {
      console.error('Erro ao carregar peixe:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
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

    setSaving(true);

    try {
      const docRef = doc(db, 'peixes', peixeId);
      await updateDoc(docRef, {
        nome,
        especie,
        preco: precoNum,
        quantidade: quantidadeNum,
        origem,
      });

      Alert.alert('Sucesso', 'Peixe atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Erro ao atualizar peixe:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o peixe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0891b2" />
      </View>
    );
  }

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
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleUpdate}
            disabled={saving}
          >
            <Text style={styles.buttonText}>
              {saving ? 'Salvando...' : '💾 Atualizar Peixe'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={saving}
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
    backgroundColor: '#f1f5f9',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
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
    color: '#0f172a',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  button: {
    backgroundColor: '#0891b2',
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
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
});