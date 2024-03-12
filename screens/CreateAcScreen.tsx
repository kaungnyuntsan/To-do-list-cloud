import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { useState } from "react";
import { auth } from "./LoginScreen";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const CreateAcScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const createAccount = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential.user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}> Create Ac Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        autoCapitalize="none"
        secureTextEntry
      />

      <Button title="create account" onPress={createAccount} />
      {/* <Button title="pass" onPress={() => console.log(password)} />
      <Button title="Cpass" onPress={() => console.log(confirmPassword)} /> */}
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
