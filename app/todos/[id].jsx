import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useContext, useState } from 'react';
import { Inter_500Medium, useFonts } from '@expo-google-fonts/inter';
import { ThemeContext } from '@/context/ThemeContext';

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const [todo, setTodo] = useState({});
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const router = useRouter();

  const [loaded, error] = useFonts({ Inter_500Medium });

  return (
    <View>
      <Text>{id}</Text>
    </View>
  );
}
