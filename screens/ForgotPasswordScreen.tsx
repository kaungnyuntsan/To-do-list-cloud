import { StatusBar } from "expo-status-bar";
import { auth } from "./LoginScreen";
import { sendPasswordResetEmail } from "firebase/auth";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { useState } from "react";

export const ForgotPasswordScreen = ({ route, navigation }) => {
  const { currentEmail } = route.params;
  const [email, setEmail] = useState(currentEmail);

  const forgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log(" Password reset email sent!");
      Alert.alert("Password Reset", "Please check email for password reset!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="email"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="off"
        autoCorrect={false}
      />
      <Button title="Send Reset Email" onPress={forgotPassword} />
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
