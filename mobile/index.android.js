import { AppRegistry } from "react-native";

import App from "./app/app";
import { register } from "./app/components/notificationHandler";

AppRegistry.registerComponent("Aicom", () => App);
AppRegistry.registerHeadlessTask("NotificationService", () => register);
