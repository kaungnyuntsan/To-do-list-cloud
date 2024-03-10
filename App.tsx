import { HomeScreen } from "./screens/HomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { CreateAcScreen } from "./screens/CreateAcScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { app } from "./config/firebaseConfig";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./screens/LoginScreen";

// Initialize Firebase Authentication and get a reference to the service
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// });

// export const auth = getAuth(app);

const Stack = createNativeStackNavigator();

export default function App() {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    console.log("App.tsx useEffected called!");

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log("user exist!");
        setUserToken(user.uid);
      } else {
        console.log("user not found!");
        setUserToken(null);
      }
    });
  }, [auth]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="CreateAc" component={CreateAcScreen} />
          </>
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
