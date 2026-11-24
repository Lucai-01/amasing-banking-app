import AppButton from "@/components/AppButton";
import { BankingContext } from "@/context/BankingContext";
import { router, useLocalSearchParams } from "expo-router";
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

export default function TransferAmountScreen() {
  const {
    provider = "PayPal",
    accountRef = "",
    note = "",
  } = useLocalSearchParams();
  const { balance, addTransaction } = useContext(BankingContext);
  const [amountInput, setAmountInput] = useState("");

  const handleConfirmTransfer = () => {
    Keyboard.dismiss();
    const numericAmount = parseFloat(amountInput);

    if (!numericAmount || numericAmount <= 0) {
      Alert.alert(
        "Invalid Amount",
        "Please enter an amount greater than ₱0.00.",
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

    const createdTx = addTransaction({
      status: "Paid",
      recipient: String(provider),
      accountRef: String(accountRef),
      amount: numericAmount,
      fee: 0.0,
      total: numericAmount,
      note: String(note),
      type: "debit",
    });

    router.replace({
      pathname: "/transfer/success",
      params: {
        id: createdTx.id,
        provider: String(provider),
        amount: String(numericAmount),
      },
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
            <Text style={styles.headerTitle}>To {provider}</Text>
            <View style={{ width: 26 }} />
          </View>

          <View style={styles.balanceHeaderRow}>
            <View>
              <Text style={styles.balLabel}>Available Balance</Text>
              <Text style={styles.balValue}>₱{balance.toLocaleString()}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.balLabel}>Available Balance</Text>
              <Text style={styles.balValue}>₱{balance.toLocaleString()}</Text>
            </View>
          </View>

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

          <View style={styles.providerBanner}>
            <Text style={styles.providerText}>Transfer to {provider}</Text>
          </View>
        </View>

        <AppButton title="Next" onPress={handleConfirmTransfer} />
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
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  balanceHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  balLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  balValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 2,
  },
  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#525252",
    paddingBottom: 6,
    marginHorizontal: 10,
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
  providerBanner: {
    width: "100%",
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 24,
    marginTop: 14,
  },
  providerText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "600",
  },
});
