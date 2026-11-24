import AppButton from "@/components/AppButton";
import ScreenHeader from "@/components/ScreenHeader";
import { BankingContext } from "@/context/BankingContext";
import { router, useLocalSearchParams } from "expo-router";
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

const PRESETS = [500, 1000, 5000, 10000];

export default function CashInAmountScreen() {
  const { provider = "BPI" } = useLocalSearchParams();
  const { user, balance, addTransaction } = useContext(BankingContext);
  const [amountInput, setAmountInput] = useState("");

  const handleConfirmCashIn = () => {
    Keyboard.dismiss();
    const numericAmount = parseFloat(amountInput);

    if (!numericAmount || numericAmount < 50 || numericAmount > 100000) {
      Alert.alert(
        "Invalid Amount",
        "Please enter a cash-in amount between ₱50.00 and ₱100,000.00.",
      );
      return;
    }

    const createdTx = addTransaction({
      status: "Completed",
      recipient: String(provider),
      accountRef: user.accountNumber || "9090 9123 4909",
      amount: numericAmount,
      fee: 0.0,
      total: numericAmount,
      note: `Cash-In from ${provider}`,
      type: "credit",
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
        <View>
          <ScreenHeader title="Cash In Amount" />

          <View style={styles.sourceBanner}>
            <Text style={styles.sourceLabel}>CASH IN SOURCE</Text>
            <Text style={styles.sourceProvider}>{provider}</Text>
          </View>

          <Text style={styles.balSub}>
            Current Balance: ₱
            {Number(balance || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>

          <View style={styles.amountWrapper}>
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

          <View style={styles.presetsRow}>
            {PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset}
                style={styles.presetChip}
                onPress={() => setAmountInput(String(preset))}
              >
                <Text style={styles.presetText}>
                  +₱{preset.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <AppButton
          title={`Cash In from ${provider}`}
          onPress={handleConfirmCashIn}
        />
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
    paddingTop: 4,
  },
  sourceBanner: {
    backgroundColor: "#1E1E1E",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  sourceLabel: {
    color: "#A3A3A3",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  sourceProvider: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },
  balSub: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: "#737373",
    marginBottom: 18,
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#525252",
    paddingBottom: 6,
    marginHorizontal: 10,
  },
  currencyPrefix: {
    fontSize: 34,
    fontWeight: "700",
    color: "#DF5A56",
  },
  amountInput: {
    fontSize: 34,
    fontWeight: "700",
    color: "#DF5A56",
    minWidth: 120,
    textAlign: "center",
  },
  presetsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 18,
  },
  presetChip: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },
  presetText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A1A",
  },
});
