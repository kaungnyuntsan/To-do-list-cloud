import { HomeScreen } from "./screens/HomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { CreateAcScreen } from "./screens/CreateAcScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./screens/LoginScreen";
import { ForgotPasswordScreen } from "./screens/ForgotPasswordScreen";
import { logout } from "./screens/HomeScreen";
import { StatusBar } from "expo-status-bar";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    console.log("App.tsx useEffected called!");

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log("user exist!");
        setUserToken(user.uid);
        setIsLoading(false);
      } else {
        console.log("user not found!");
        setUserToken(null);
        setIsLoading(false);
        // setUserToken("fake_token");
      }
    });
  }, [auth]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 20 }}> Loading... </Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="CreateAc" component={CreateAcScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
          </>
        ) : (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerRight: () => (
                <Pressable onPress={logout}>
                  <View>
                    <Text style={{ color: "red", fontSize: 15 }}>
                      {" "}
                      Log Out{" "}
                    </Text>
                  </View>
                </Pressable>
              ),
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
