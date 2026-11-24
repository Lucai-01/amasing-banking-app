import NumericKeypad from "@/components/NumericKeypad";
import ScreenHeader from "@/components/ScreenHeader";
import { BankingContext } from "@/context/BankingContext";
import { router, useLocalSearchParams } from "expo-router";
import { Zap } from "lucide-react-native";
import { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OTPScreen() {
  const { user } = useContext(BankingContext);
  const { mode = "login", phone = "" } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);

  const isRegister = mode === "register";
  const displayPhone = phone
    ? `+63********${String(phone).slice(-4)}`
    : user.phone;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (digit) => {
    if (otp.length >= 6) return;
    setOtp((prev) => prev + digit);
  };

  const handleDelete = () => {
    setOtp((prev) => prev.slice(0, -1));
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      Alert.alert(
        "Incomplete OTP",
        "Please enter the 6-digit verification code.",
      );
      return;
    }

    if (isRegister) {
      router.push({
        pathname: "/kyc",
        params: { phone: String(phone) },
      });
    } else {
      router.push("/passcode");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="AMABank"
        rightIcon={<Zap size={20} color="#1A1A1A" fill="#1A1A1A" />}
        onRightPress={() =>
          Alert.alert(
            "OTP Demo",
            "Enter any 6 digits and tap the check button.",
          )
        }
      />

      <View style={styles.subHeader}>
        {isRegister && (
          <Text style={styles.stepTag}>STEP 2 OF 3 • OTP VERIFICATION</Text>
        )}
        <Text style={styles.promptTitle}>Enter your OTP</Text>
        <Text style={styles.subtitle}>We sent it to {displayPhone}</Text>
        <Text style={styles.subtitle}>(Ref: PA6Q)</Text>
      </View>

      <View style={styles.slotsRow}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <View key={index} style={styles.slot}>
            <Text style={styles.slotDigit}>{otp[index] || ""}</Text>
          </View>
        ))}
      </View>

      <NumericKeypad
        onKeyPress={handleKeyPress}
        onDelete={handleDelete}
        showConfirm
        confirmReady={otp.length === 6}
        onConfirm={handleVerifyOTP}
      />

      <TouchableOpacity
        style={styles.footerLink}
        onPress={() => {
          setOtp("");
          setTimer(30);
          Alert.alert("OTP Resent", "A new verification code was sent.");
        }}
      >
        <Text style={styles.coralLink}>
          {timer > 0 ? `Get a new OTP (${timer}s)` : "Get a new OTP"}
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
  subHeader: {
    alignItems: "center",
    gap: 4,
  },
  stepTag: {
    fontSize: 11,
    fontWeight: "700",
    color: "#737373",
    letterSpacing: 1,
    marginBottom: 4,
  },
  promptTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#DF5A56",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  slotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
  },
  slot: {
    width: 28,
    height: 36,
    borderBottomWidth: 2,
    borderBottomColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  slotDigit: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  footerLink: {
    alignItems: "center",
  },
  coralLink: {
    color: "#DF5A56",
    fontSize: 14,
    fontWeight: "600",
  },
});
