import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import NotesDashboardScreen from "../screens/NotesDashboardScreen";
import InsideNoteScreen from "../screens/InsideNoteScreen";
import CreateNoteScreen from "../screens/CreateNoteScreen";
import RecipesDashboardScreen from "../screens/RecipesDashboardScreen";
import InsideRecipeScreen from "../screens/InsideRecipeScreen";
import CreateRecipeScreen from "../screens/CreateRecipeScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName="LoginScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen
          name="NotesDashboardScreen"
          component={NotesDashboardScreen}
        />
        <Stack.Screen name="InsideNoteScreen" component={InsideNoteScreen} />
        <Stack.Screen name="CreateNoteScreen" component={CreateNoteScreen} />
        <Stack.Screen
          name="RecipesDashboardScreen"
          component={RecipesDashboardScreen}
        />
        <Stack.Screen name="InsideRecipeScreen" component={InsideRecipeScreen} />
        <Stack.Screen name="CreateRecipeScreen" component={CreateRecipeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
