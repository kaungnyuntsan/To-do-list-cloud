import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  Switch,
  FlatList,
} from "react-native";
import { useEffect, useState } from "react";
import { app } from "../config/firebaseConfig";
import {
  getDatabase,
  ref,
  set,
  push,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  remove,
  update,
  off,
} from "firebase/database";
import { auth } from "./LoginScreen";
import { signOut } from "firebase/auth";

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export const HomeScreen = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    console.log("HomeScreen useEffet run!");
    const userId = auth.currentUser?.uid;
    const userReference = ref(database, "users/" + userId);

    onChildAdded(userReference, (data) => {
      console.log("onChild Added event run!");
      // console.log(data);
      setTasks((tasks) => [
        ...tasks,
        { key: data.key, task: data.val().task, isDone: data.val().isDone },
      ]);
    });

    onChildChanged(userReference, (data) => {
      console.log("onChild change event run!");
      setTasks((tasks) =>
        tasks.map((task) => {
          if (task.key === data.key) {
            return {
              ...task,
              isDone: data.val().isDone,
            };
          } else {
            return task;
          }
        })
      );
    });

    onChildRemoved(userReference, (data) => {
      console.log("onChild remove event run!");
      setTasks((tasks) => tasks.filter((task) => task.key !== data.key));
    });

    return () => {
      off(userReference);
      setTasks([]);
      console.log("cleanup called!");
    };
  }, []);

  const addTask = (task) => {
    const userId = auth.currentUser?.uid;
    const userReference = ref(database, "users/" + userId);

    // console.log(userReference);
    const newTaskReference = push(userReference);
    set(newTaskReference, {
      task,
      isDone: false,
    });
  };

  const toggleSwitch = (currentIsDone, key) => {
    // console.log(key);

    const userId = auth.currentUser?.uid;

    const updateRef = ref(database, "users/" + userId + "/" + key);
    update(updateRef, {
      isDone: !currentIsDone,
    });
  };

  const deleteTask = (key) => {
    const userId = auth.currentUser?.uid;

    const delRef = ref(database, "users/" + userId + "/" + key);
    remove(delRef);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const renderItem = ({ item }) => {
    return (
      <View key={item.key} style={{ flexDirection: "row" }}>
        <Switch
          value={item.isDone}
          onValueChange={() => toggleSwitch(item.isDone, item.key)}
        />
        <ScrollView horizontal>
          <Text
            style={{
              fontSize: 20,
              textDecorationLine: item.isDone ? "line-through" : "none",
            }}
          >
            {" "}
            {item.task}
          </Text>
        </ScrollView>

        <Button title="delete" onPress={() => deleteTask(item.key)} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}> Home Screen</Text>
      <TextInput
        style={styles.input}
        value={task}
        onChangeText={setTask}
        placeholder="add to-do task..."
      />
      <Button
        title="Add"
        onPress={() => {
          addTask(task);
          setTask("");
          console.log("task added!");
        }}
      />
      {/* <Button
        title="console current user"
        onPress={() => console.log(auth.currentUser)}
      /> */}
      <Button title="sign out" onPress={logout} />
      <FlatList data={tasks} renderItem={renderItem} />

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  text: {
    fontSize: 20,
  },
  input: {
    height: 45,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
