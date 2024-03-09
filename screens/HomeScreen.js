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
import { getDatabase, ref, set, push, onChildAdded } from "firebase/database";

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

const userId = "jim";
const userReference = ref(database, "users/" + userId);

const addTask = (task) => {
  const newTaskReference = push(userReference);
  set(newTaskReference, {
    task,
    isDone: false,
  });
};

export const HomeScreen = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    console.log("useEffet run!");
    onChildAdded(userReference, (data) => {
      setTasks((tasks) => [
        ...tasks,
        { key: data.key, task: data.val().task, isDone: data.val().isDone },
      ]);
    });

    return () => {
      setTasks([]);
      console.log("cleanup called!");
    };
  }, [userReference]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}> Home Screen</Text>
      <TextInput
        style={styles.input}
        value={task}
        onChangeText={setTask}
        placeholder="add to-do list..."
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
        title="tasks"
        onPress={() => {
          console.log(tasks);
        }}
      />
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
              <Button title="delete" onPress={() => deleteData(task.key)} />
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
