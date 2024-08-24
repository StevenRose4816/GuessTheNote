import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { AppStackParams } from "./types"; // Ensure AppStackParams is defined properly
import App from "../App";
import Routes from "./routes";

const Stack = createNativeStackNavigator<AppStackParams>();

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={Routes.home} component={App} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
