import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export const CreateAcScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}> Create Ac Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
  },
});
