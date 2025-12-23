import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { Inter_500Medium, useFonts } from '@expo-google-fonts/inter';
import { ThemeContext } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const [todo, setTodo] = useState({});
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const router = useRouter();

  const [loaded, error] = useFonts({ Inter_500Medium });

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const jsonValue = await AsyncStorage.getItem('TodoApp');
        const storageTodos = jsonValue !== null ? JSON.parse(jsonValue) : null;

        if (storageTodos && storageTodos.length) {
          const myTodo = storageTodos.find((todo) => todo.id.toString() === id);
          setTodo(myTodo);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData(id);
  }, [id]);

  if (!loaded && !error) return null;

  const handleSave = async () => {
    try {
      // Can only change the title
      const savedTodo = { ...todo, title: todo.title };

      const jsonValue = await AsyncStorage.getItem('TodoApp');
      const storageTodos = jsonValue !== null ? JSON.parse(jsonValue) : null;

      if (storageTodos && storageTodos.length) {
        const otherTodos = storageTodos.filter(
          (todo) => todo.id !== savedTodo.id,
        );

        // Put others in first, and the new edited one will put on to the top of the list.
        const allTodos = [...otherTodos, savedTodo];
        await AsyncStorage.setItem('TodoApp', JSON.stringify(allTodos));
      } else {
        await AsyncStorage.setItem('TodoApp', JSON.stringify([savedTodo]));
      }

      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>{id}</Text>
      </View>
    </SafeAreaView>
  );
}
