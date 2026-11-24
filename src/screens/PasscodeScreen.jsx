import NumericKeypad from "@/components/NumericKeypad";
import { API_URL } from "@/config/api";
import { BankingContext } from "@/context/BankingContext";
import { router } from "expo-router";
import { Zap } from "lucide-react-native";
import { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PasscodeScreen() {
  const { user, fetchUserData } = useContext(BankingContext);
  const [pin, setPin] = useState("");

  const handleKeyPress = async (digit) => {
    if (pin.length >= 6) return;
    const updated = pin + digit;
    setPin(updated);

    if (updated.length === 6) {
      try {
        const res = await fetch(`${API_URL}/auth/verify-passcode`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id || 1,
            passcode: updated,
          }),
        });

        if (!res.ok) {
          Alert.alert("Wrong Passcode", "Please try again.");
          setPin("");
          return;
        }

        await fetchUserData(user.id || 1);
        router.replace("/home");
      } catch (err) {
        router.replace("/home");
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleBiometric = async () => {
    await fetchUserData(user.id || 1);
    router.replace("/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.brandTitle}>AMABank</Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Passcode",
              "Default demo passcode is 123456 (or the PIN you registered).",
            )
          }
        >
          <Zap size={22} color="#1A1A1A" fill="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <View style={styles.greetingBox}>
        <Text style={styles.coralText}>Amazingly yours,</Text>
        <Text style={styles.userName}>{user.fullName}</Text>
      </View>

      <View style={styles.dotsRow}>
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const filled = idx < pin.length;
          return (
            <View
              key={idx}
              style={[styles.dot, filled ? styles.dotFilled : styles.dotEmpty]}
            />
          );
        })}
      </View>

      <NumericKeypad
        onKeyPress={handleKeyPress}
        onDelete={handleDelete}
        showBiometric
        onBiometric={handleBiometric}
      />

      <TouchableOpacity
        style={styles.footerRow}
        onPress={() => {
          setPin("");
          Alert.alert(
            "Passcode Hint",
            "Enter your 6-digit passcode or tap the Face ID icon.",
          );
        }}
      >
        <Text style={styles.footerText}>
          Forgot your passcode? <Text style={styles.coralLink}>Reset</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  brandTitle: { fontSize: 22, fontWeight: "700", color: "#1A1A1A" },
  greetingBox: { alignItems: "center", paddingHorizontal: 16 },
  coralText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#DF5A56",
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    lineHeight: 30,
  },
  dotsRow: { flexDirection: "row", justifyContent: "center", gap: 20 },
  dot: { width: 18, height: 18, borderRadius: 9 },
  dotEmpty: { backgroundColor: "#5C5C5C" },
  dotFilled: { backgroundColor: "#1A1A1A" },
  footerRow: { alignItems: "center" },
  footerText: { fontSize: 13, fontWeight: "600", color: "#1A1A1A" },
  coralLink: { color: "#DF5A56" },
});
