import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";

export const LoginScreen = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.text}> Login Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="email"
        value={loginEmail}
        onChangeText={setLoginEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="password"
        value={loginPassword}
        onChangeText={setLoginPassword}
        secureTextEntry
      />
      <Button title="log in" onPress={() => {}} />
      <Text style={{ textAlign: "center", fontSize: 18 }}>
        {" "}
        Forgot password?{" "}
      </Text>
      <Button title="create new account" onPress={() => {}} />
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
