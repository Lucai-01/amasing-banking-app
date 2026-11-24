import Constants from "expo-constants";
import { Platform } from "react-native";

const getBaseUrl = () => {
  // On Expo Web, localhost works directly
  if (Platform.OS === "web") {
    return "http://127.0.0.1:8000";
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(":")[0];
    return `http://${ip}:8000`;
  }

  // Android Studio Emulator fallback
  return "http://10.0.2.2:8000";
};

export const API_URL = getBaseUrl();
