import { HomeScreen } from "./screens/HomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { CreateAcScreen } from "./screens/CreateAcScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { app } from "./config/firebaseConfig";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
} from "firebase/auth";

// Initialize Firebase Authentication and get a reference to the service
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// });

export const auth = getAuth(app);

const Stack = createNativeStackNavigator();

// let userToken = null;

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in
//     console.log("user exist!");
//     userToken = user.uid;
//   } else {
//     console.log("user not found!");
//     userToken = null;
//   }
// });

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAc" component={CreateAcScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
