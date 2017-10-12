import { AppRegistry } from "react-native";

import App from "./app/app";
import { register } from "./app/components/notificationHandler";

AppRegistry.registerComponent("mobile", () => App);
AppRegistry.registerHeadlessTask("NotificationService", () => register);
