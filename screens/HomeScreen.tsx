import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  Switch,
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
      setTasks((tasks) => [
        ...tasks,
        { key: data.key, task: data.val().task, isDone: data.val().isDone },
      ]);
    });

    onChildChanged(userReference, (data) => {
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
      <Button
        title="console current user"
        onPress={() => console.log(auth.currentUser)}
      />
      <Button title="sign out" onPress={logout} />
      <ScrollView>
        {tasks.map((task) => {
          return (
            <View key={task.key} style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: 20,
                  textDecorationLine: task.isDone ? "line-through" : "none",
                }}
              >
                {" "}
                {task.task}
              </Text>
              <Switch
                value={task.isDone}
                onValueChange={() => toggleSwitch(task.isDone, task.key)}
              />
              <Button title="delete" onPress={() => deleteTask(task.key)} />
            </View>
          );
        })}
      </ScrollView>
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
