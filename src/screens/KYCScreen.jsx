import AppButton from "@/components/AppButton";
import AppInput from "@/components/AppInput";
import ScreenHeader from "@/components/ScreenHeader";
import { API_URL } from "@/config/api";
import { router, useLocalSearchParams } from "expo-router";
import { ShieldCheck } from "lucide-react-native";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ID_RULES = {
  "National ID": {
    length: 16,
    unit: "digits",
    numericOnly: true,
    placeholder: "16-Digit National ID Number",
  },
  "Driver's License": {
    length: 11,
    unit: "characters",
    numericOnly: false,
    placeholder: "11-Character License Number",
  },
  Passport: {
    length: 9,
    unit: "characters",
    numericOnly: false,
    placeholder: "9-Character Passport Number",
  },
  UMID: {
    length: 12,
    unit: "digits",
    numericOnly: true,
    placeholder: "12-Digit UMID Number",
  },
};

const ID_TYPES = Object.keys(ID_RULES);

export default function KYCScreen() {
  const { phone = "" } = useLocalSearchParams();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [idType, setIdType] = useState("National ID");
  const [idNumber, setIdNumber] = useState("");
  const [passcode, setPasscode] = useState("");

  const currentRule = ID_RULES[idType];

  const handleSelectIdType = (type) => {
    setIdType(type);
    const rule = ID_RULES[type];
    setIdNumber((prev) => {
      const cleaned = rule.numericOnly
        ? prev.replace(/[^0-9]/g, "")
        : prev.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
      return cleaned.slice(0, rule.length);
    });
  };

  const handleIdNumberChange = (text) => {
    const cleaned = currentRule.numericOnly
      ? text.replace(/[^0-9]/g, "")
      : text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    setIdNumber(cleaned.slice(0, currentRule.length));
  };

  const handleSubmitKYC = async () => {
    if (fullName.trim().length < 3) {
      Alert.alert("Invalid Name", "Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (address.trim().length < 8) {
      Alert.alert(
        "Invalid Address",
        "Please enter your complete residential address.",
      );
      return;
    }

    if (idNumber.length !== currentRule.length) {
      Alert.alert(
        "Invalid ID Number",
        `${idType} requires exactly ${currentRule.length} ${currentRule.unit}.`,
      );
      return;
    }

    if (passcode.length !== 6) {
      Alert.alert("Invalid MPIN", "Please create a 6-digit security MPIN.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          address: address.trim(),
          idType,
          idNumber,
          phone: String(phone),
          passcode,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert(
          "Verification Failed",
          data.detail || "Unable to register.",
        );
        return;
      }

      Alert.alert(
        "Identity Verified",
        `Welcome to AMABank, ${data.user.firstName}! Please log in with +63${phone} and your MPIN.`,
        [
          {
            text: "Proceed to Login",
            onPress: () => router.replace("/"),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Connection Error",
        "Could not reach the FastAPI server. Make sure it is running.",
      );
    }
  };

  const isIdComplete = idNumber.length === currentRule.length;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.headerPad}>
          <ScreenHeader title="Identity Verification" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.banner}>
            <ShieldCheck size={24} color="#DF5A56" strokeWidth={2.2} />
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTag}>STEP 3 OF 3 • KYC DETAILS</Text>
              <Text style={styles.bannerText}>
                Verified Number: +63 {phone}
              </Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Full Name</Text>
            <AppInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full Name"
            />

            <Text style={styles.label}>Email Address</Text>
            <AppInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Residential Address</Text>
            <AppInput
              value={address}
              onChangeText={setAddress}
              placeholder="Residential Address"
            />

            <Text style={styles.label}>Government ID Type</Text>
            <View style={styles.idTypeGrid}>
              {ID_TYPES.map((type) => {
                const selected = idType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.idPill, selected && styles.idPillSelected]}
                    onPress={() => handleSelectIdType(type)}
                  >
                    <Text
                      style={[
                        styles.idPillText,
                        selected && styles.idPillTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.idLabelRow}>
              <Text style={styles.label}>
                {idType} ({currentRule.length} {currentRule.unit})
              </Text>
              <Text
                style={[
                  styles.counterText,
                  isIdComplete && styles.counterComplete,
                ]}
              >
                {idNumber.length} / {currentRule.length}
              </Text>
            </View>
            <AppInput
              value={idNumber}
              onChangeText={handleIdNumberChange}
              placeholder={currentRule.placeholder}
              keyboardType={currentRule.numericOnly ? "number-pad" : "default"}
              autoCapitalize="characters"
              maxLength={currentRule.length}
            />

            <Text style={styles.label}>Create 6-Digit MPIN</Text>
            <AppInput
              value={passcode}
              onChangeText={(t) =>
                setPasscode(t.replace(/[^0-9]/g, "").slice(0, 6))
              }
              placeholder="6-Digit MPIN"
              keyboardType="number-pad"
              secureTextEntry
            />
          </View>

          <AppButton
            title="Submit & Verify Account"
            onPress={handleSubmitKYC}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerPad: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 18,
  },
  banner: {
    backgroundColor: "#1A1A1A",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepTag: {
    fontSize: 10,
    fontWeight: "700",
    color: "#A3A3A3",
    letterSpacing: 1,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 2,
  },
  formCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 22,
    padding: 18,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#262626",
    marginTop: 6,
  },
  idLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  counterText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DF5A56",
  },
  counterComplete: {
    color: "#16A34A",
  },
  idTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 4,
  },
  idPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#E5E5E5",
  },
  idPillSelected: {
    backgroundColor: "#1A1A1A",
  },
  idPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#262626",
  },
  idPillTextSelected: {
    color: "#FFFFFF",
  },
});
