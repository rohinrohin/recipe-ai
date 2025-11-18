import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@clerk/clerk-expo";
import LoginScreen from "../screens/LoginScreen";
import NotesDashboardScreen from "../screens/NotesDashboardScreen";
import InsideNoteScreen from "../screens/InsideNoteScreen";
import CreateNoteScreen from "../screens/CreateNoteScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading screen while Clerk is initializing
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#0D87E1" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName={isSignedIn ? "NotesDashboardScreen" : "LoginScreen"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen
          name="NotesDashboardScreen"
          component={NotesDashboardScreen}
        />
        <Stack.Screen name="InsideNoteScreen" component={InsideNoteScreen} />
        <Stack.Screen name="CreateNoteScreen" component={CreateNoteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
