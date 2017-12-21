import { AppRegistry } from "react-native";

import App from "./app/app";
import { register } from "./app/components/notificationHandler";

const toto = async () => {
  console.log("toto", "test");
};
AppRegistry.registerHeadlessTask("NotificationService", () => register);
AppRegistry.registerComponent("Slifer", () => App);
