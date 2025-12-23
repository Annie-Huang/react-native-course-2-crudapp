import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { Inter_500Medium, useFonts } from '@expo-google-fonts/inter';
import { ThemeContext } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Octicons } from '@expo/vector-icons';

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
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Edit todo'
          placeholderTextColor='gray'
          value={todo?.title || ''}
          // the 2nd one is better
          // onChangeText={(text) => setTodo({ ...todo, title: text })}
          onChangeText={(text) => setTodo((prev) => ({ ...prev, title: text }))}
        />
        <Pressable
          onPress={() =>
            setColorScheme(colorScheme === 'light' ? 'dark' : 'light')
          }
          style={{ marginLeft: 10 }}
        >
          <Octicons
            name={colorScheme === 'dark' ? 'moon' : 'sun'}
            size={36}
            color={theme.text}
            selectable={undefined}
            style={{ width: 36 }}
          />
        </Pressable>
      </View>
      <View style={styles.inputContainer}>
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/')}
          style={[styles.saveButton, { backgroundColor: 'red' }]}
        >
          <Text style={[styles.saveButtonText, { color: 'white' }]}>
            Cancel
          </Text>
        </Pressable>
      </View>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
