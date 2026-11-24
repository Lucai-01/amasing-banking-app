import NumericKeypad from "@/components/NumericKeypad";
import ScreenHeader from "@/components/ScreenHeader";
import { API_URL } from "@/config/api";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const [phoneDigits, setPhoneDigits] = useState("");

  const handleKeyPress = (digit) => {
    if (phoneDigits.length >= 10) return;
    setPhoneDigits((prev) => prev + digit);
  };

  const handleDelete = () => {
    setPhoneDigits((prev) => prev.slice(0, -1));
  };

  const handleSendOTP = async () => {
    if (phoneDigits.length !== 10 || !phoneDigits.startsWith("9")) {
      Alert.alert(
        "Invalid Mobile Number",
        "Please enter a valid 10-digit PH mobile number starting with 9 (e.g., 9171234567).",
      );
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/check-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneDigits }),
      });
      const data = await res.json();

      if (!res.ok) {
        Alert.alert(
          "Number Unavailable",
          data.detail || "Number already registered.",
        );
        return;
      }

      router.push({
        pathname: "/otp",
        params: { mode: "register", phone: phoneDigits },
      });
    } catch (err) {
      Alert.alert(
        "Connection Error",
        "Could not reach the FastAPI server. Make sure it is running.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Open Account" onBack={() => router.replace("/")} />

      <View style={styles.topText}>
        <Text style={styles.stepTag}>STEP 1 OF 3 • MOBILE VERIFICATION</Text>
        <Text style={styles.promptTitle}>Enter your mobile number</Text>
        <Text style={styles.subtitle}>
          We will send a 6-digit One-Time PIN to verify your number.
        </Text>
      </View>

      <View style={styles.phoneRow}>
        <Text style={styles.countryCode}>+63</Text>
        <View style={styles.underlineBox}>
          <Text style={styles.phoneText}>{phoneDigits}</Text>
        </View>
      </View>

      <NumericKeypad
        onKeyPress={handleKeyPress}
        onDelete={handleDelete}
        showConfirm
        confirmReady={phoneDigits.length === 10}
        onConfirm={handleSendOTP}
      />

      <TouchableOpacity
        style={styles.footerGroup}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.coralLink}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  topText: {
    alignItems: "center",
    gap: 6,
  },
  stepTag: {
    fontSize: 11,
    fontWeight: "700",
    color: "#737373",
    letterSpacing: 1,
  },
  promptTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#DF5A56",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#525252",
    textAlign: "center",
    paddingHorizontal: 12,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 20,
  },
  countryCode: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1A1A1A",
    borderBottomWidth: 2,
    borderBottomColor: "#1A1A1A",
    paddingBottom: 4,
  },
  underlineBox: {
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: "#1A1A1A",
    paddingBottom: 4,
    minHeight: 34,
  },
  phoneText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1A1A1A",
    letterSpacing: 1.5,
  },
  footerGroup: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  coralLink: {
    color: "#DF5A56",
    fontWeight: "700",
  },
});
