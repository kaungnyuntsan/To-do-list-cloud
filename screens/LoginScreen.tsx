import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
// skip firebaseConfig files to git
import { app } from "../config/firebaseConfig";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Initialize Firebase Authentication and get a reference to the service
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loginEmailPassword = async () => {
    if (email === "" || password === "") {
      setErrorMessage("email and password cannot be blank.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // console.log(userCredential.user);
    } catch (error) {
      console.log(typeof error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}> Login Screen</Text>
      <TextInput
        autoCapitalize="none"
        style={styles.input}
        placeholder="email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="off"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry
      />
      <Text
        style={{ textAlign: "center", color: "red", fontSize: 15, padding: 5 }}
      >
        {errorMessage}
      </Text>
      <Button title="log in" onPress={loginEmailPassword} />
      <Text></Text>
      {/* <Text style={{ textAlign: "center", fontSize: 18 }}>
        {" "}
        Forgot password?{" "}
      </Text> */}
      <Button
        title="Forgot password?"
        onPress={() =>
          navigation.navigate("ForgotPassword", {
            currentEmail: email,
          })
        }
      />
      <Button
        title="create new account"
        onPress={() => navigation.navigate("CreateAc")}
      />
      {/* <Button
        title="console current user"
        onPress={() => console.log(auth.currentUser)}
      /> */}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
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
