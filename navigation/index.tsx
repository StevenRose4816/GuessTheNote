import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { AppStackParams } from "./types";
import Routes from "./routes";
import Home from "../screens/Home";
import Welcome from "../screens/Welcome";

const Stack = createNativeStackNavigator<AppStackParams>();

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={Routes.welcome}
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Routes.home}
          component={Home}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
