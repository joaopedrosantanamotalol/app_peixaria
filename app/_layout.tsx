import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0891b2' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="home" 
        options={{ title: '🐟 Peixaria' }} 
      />
      <Stack.Screen 
        name="add-peixe" 
        options={{ title: 'Adicionar Peixe' }} 
      />
      <Stack.Screen 
        name="edit-peixe/[id]" 
        options={{ title: 'Editar Peixe' }} 
      />
    </Stack>
  );
}