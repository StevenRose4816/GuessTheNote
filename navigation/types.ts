import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Routes from "./routes";

export type NavPropAny = NativeStackNavigationProp<any, any>;

export type AppStackParams = {
  [Routes.home]: undefined;
};
