import AppButton from "@/components/AppButton";
import { BankingContext } from "@/context/BankingContext";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useContext, useState } from "react";
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

export default function WithdrawAmountScreen() {
  const { balance } = useContext(BankingContext);
  const [amountInput, setAmountInput] = useState("");

  const handleNext = () => {
    Keyboard.dismiss();
    const numericAmount = parseFloat(amountInput);

    if (!numericAmount || numericAmount < 100 || numericAmount > 50000) {
      Alert.alert(
        "Invalid Amount",
        "Please enter an amount between ₱100.00 and ₱50,000.00.",
      );
      return;
    }

    if (numericAmount > balance) {
      Alert.alert(
        "Insufficient Balance",
        `Your available balance is ₱${balance.toLocaleString()}.`,
      );
      return;
    }

    router.push({
      pathname: "/withdraw/partner",
      params: { amount: String(numericAmount) },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={26} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Withdraw</Text>
            <View style={{ width: 26 }} />
          </View>

          <Text style={styles.questionText}>
            How much do you want to{"\n"}withdraw?
          </Text>

          <View style={styles.amountInputWrapper}>
            <Text style={styles.currencyPrefix}>₱</Text>
            <TextInput
              value={amountInput}
              onChangeText={setAmountInput}
              placeholder="0.00"
              placeholderTextColor="#DF5A56"
              keyboardType="decimal-pad"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              style={styles.amountInput}
            />
          </View>

          <View style={styles.limitsRow}>
            <Text style={styles.limitText}>Min: ₱100.00</Text>
            <Text style={styles.limitText}>Max: ₱50,000.00</Text>
          </View>
        </View>

        <AppButton title="Next" onPress={handleNext} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  topSection: {
    marginTop: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    lineHeight: 25,
    marginBottom: 22,
  },
  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#525252",
    paddingBottom: 6,
    marginHorizontal: 8,
  },
  currencyPrefix: {
    fontSize: 32,
    fontWeight: "700",
    color: "#DF5A56",
  },
  amountInput: {
    fontSize: 32,
    fontWeight: "700",
    color: "#DF5A56",
    minWidth: 110,
    textAlign: "center",
  },
  limitsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  limitText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1A1A1A",
  },
});
