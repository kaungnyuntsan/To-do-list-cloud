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
  Keyboard,
} from "react-native";
import { useEffect, useReducer, useState } from "react";
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
  onValue,
  query,
  orderByKey,
  DataSnapshot,
  orderByChild,
} from "firebase/database";
import { auth } from "./LoginScreen";
import { signOut } from "firebase/auth";
import { Todolists } from "../features/Todolists";

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export const logout = async () => {
  await signOut(auth);
};

export const HomeScreen = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const sortCompareFn = (a, b) => {
    if (a.key < b.key) {
      return 1;
    }
    if (a.key > b.key) {
      return -1;
    }
    return 0;
  };

  useEffect(() => {
    console.log("HomeScreen useEffet run!");
    const userId = auth.currentUser?.uid;
    const userReference = ref(database, "users/" + userId);

    // onValue(
    //   userReference,
    //   (snapshot) => {
    //     console.log("onValue event called!");
    //     snapshot.forEach((data) => {
    //       setTasks((tasks) => [
    //         ...tasks,
    //         { key: data.key, task: data.val().task, isDone: data.val().isDone },
    //       ]);
    //     });
    //   },
    //   {
    //     onlyOnce: true,
    //   }
    // );

    onChildAdded(userReference, (data) => {
      // console.log("onChild Added event run!");
      // console.log(data);

      setTasks((tasks) => [
        ...tasks,
        { key: data.key, task: data.val().task, isDone: data.val().isDone },
      ]);

      setTasks((tasks) => {
        const newRefTasks = [...tasks];
        return newRefTasks.sort(sortCompareFn);
      });

      setIsLoading(false);
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
    // const key = newTaskReference.key;
    set(newTaskReference, {
      // key: newTaskReference.key,
      task,
      isDone: false,
    });
    // .then(() => {
    //   console.log("promise success called");
    //   setTasks((tasks) => [...tasks, { key, task, isDone: false }]);
    // })
    // .catch((error) => console.error(error));
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

  // const renderItem = ({ item }) => {
  //   // console.log(item);
  //   return (
  //     <View
  //       key={item.key}
  //       style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
  //     >
  //       <Switch
  //         value={item.isDone}
  //         onValueChange={() => toggleSwitch(item.isDone, item.key)}
  //       />

  //       <ScrollView horizontal>
  //         <Text
  //           style={{
  //             fontSize: 20,
  //             padding: 10,
  //             marginLeft: 10,
  //             height: 50,
  //             textDecorationLine: item.isDone ? "line-through" : "none",
  //           }}
  //         >
  //           {" "}
  //           {item.task}
  //         </Text>
  //       </ScrollView>

  //       <Button title="delete" onPress={() => deleteTask(item.key)} />
  //     </View>
  //   );
  // };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 20 }}> Loading... </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}> Home Screen</Text>
      <TextInput
        style={styles.input}
        value={task}
        onChangeText={setTask}
        placeholder="add to-do task..."
        onSubmitEditing={() => {
          addTask(task);
          setTask("");
          console.log("task added!");
        }}
      />
      <Button
        title="Add"
        onPress={() => {
          addTask(task);
          setTask("");
          Keyboard.dismiss();
          console.log("task added!");
        }}
      />
      {/* <Button title="console tasks" onPress={() => console.log(tasks)} /> */}

      {/* <FlatList data={tasks} renderItem={renderItem} /> */}
      {/* <Button title="sign out" onPress={logout} /> */}
      <Todolists
        tasks={tasks}
        toggleSwitch={toggleSwitch}
        deleteTask={deleteTask}
      />

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 5,
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
