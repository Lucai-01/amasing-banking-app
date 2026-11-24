import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransferRecipientScreen() {
  const { provider = "PayPal" } = useLocalSearchParams();
  const [accountRef, setAccountRef] = useState("");
  const [note, setNote] = useState("");

  const handleNext = () => {
    Keyboard.dismiss();

    if (accountRef.trim().length < 5) {
      Alert.alert(
        "Invalid Account Number",
        `Please enter a valid ${provider} account number or ID.`,
      );
      return;
    }

    router.push({
      pathname: "/transfer/amount",
      params: {
        provider: String(provider),
        accountRef: accountRef.trim(),
        note: note.trim(),
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color="#1A1A1A" strokeWidth={2.2} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Transfer to</Text>
            <View style={styles.spacer} />
          </View>

          {/* Account Number Input */}
          <View style={styles.fieldBlock}>
            <Text style={styles.centerLabel}>Account Number</Text>
            <TextInput
              value={accountRef}
              onChangeText={setAccountRef}
              autoCapitalize="none"
              returnKeyType="next"
              style={styles.underlineInput}
            />
          </View>

          {/* Dark Destination Card */}
          <View style={styles.providerCard}>
            <Text style={styles.providerText}>Transfer to {provider}</Text>
          </View>

          {/* Note Input (Optional) */}
          <View style={styles.fieldBlock}>
            <Text style={styles.centerLabel}>Note</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              style={styles.underlineInput}
            />
            <Text style={styles.optionalLabel}>Optional</Text>
          </View>
        </View>

        {/* Bottom Next Pill Button */}
        <TouchableOpacity
          style={styles.nextBtn}
          activeOpacity={0.85}
          onPress={handleNext}
        >
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 28,
  },
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  spacer: {
    width: 36,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  fieldBlock: {
    alignItems: "center",
    marginBottom: 18,
  },
  centerLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  underlineInput: {
    width: "100%",
    borderBottomWidth: 1.5,
    borderBottomColor: "#1A1A1A",
    fontSize: 17,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
    paddingVertical: 6,
  },
  providerCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 22,
    marginBottom: 18,
  },
  providerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  optionalLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 6,
  },
  nextBtn: {
    backgroundColor: "#1E1E1E",
    borderRadius: 28,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
