import { AppRegistry } from "react-native";

import App from "./app/app";
import { register } from "./app/components/notificationHandler";

AppRegistry.registerComponent("Slifer", () => App);
AppRegistry.registerHeadlessTask("NotificationService", () => register);
