import NumericKeypad from "@/components/NumericKeypad";
import { API_URL } from "@/config/api";
import { BankingContext } from "@/context/BankingContext";
import { router } from "expo-router";
import { Zap } from "lucide-react-native";
import { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { setUser, setBalance } = useContext(BankingContext);
  const [phoneDigits, setPhoneDigits] = useState("");

  const handleKeyPress = (digit) => {
    if (phoneDigits.length >= 10) return;
    setPhoneDigits((prev) => prev + digit);
  };

  const handleDelete = () => {
    setPhoneDigits((prev) => prev.slice(0, -1));
  };

  const handleContinue = async () => {
    if (phoneDigits.length !== 10) {
      Alert.alert("Invalid Number", "Please enter a 10-digit mobile number.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneDigits }),
      });
      const data = await res.json();

      if (!res.ok) {
        Alert.alert(
          "Account Not Found",
          data.detail || "Please register an account first.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Register", onPress: () => router.push("/register") },
          ],
        );
        return;
      }

      setUser({
        ...data.user,
        phone: data.user.maskedPhone,
      });
      setBalance(data.user.balance);
      // Direct to MPIN passcode screen (no OTP needed on login)
      router.push("/passcode");
    } catch (err) {
      Alert.alert(
        "Connection Error",
        "Could not reach the FastAPI server. Make sure it is running.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.brandTitle}>AMABank</Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Demo Login",
              "Enter your registered 10-digit number (or default 9171233387) and tap the check button.",
            )
          }
        >
          <Zap size={22} color="#1A1A1A" fill="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <Text style={styles.promptTitle}>Enter your number</Text>

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
        onConfirm={handleContinue}
      />

      <View style={styles.footerGroup}>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text style={styles.coralLink}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  brandTitle: { fontSize: 22, fontWeight: "700", color: "#1A1A1A" },
  promptTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#DF5A56",
    textAlign: "center",
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
  footerGroup: { alignItems: "center", gap: 8 },
  footerText: { fontSize: 14, fontWeight: "600", color: "#1A1A1A" },
  coralLink: { color: "#DF5A56", fontSize: 14, fontWeight: "700" },
});
