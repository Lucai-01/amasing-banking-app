import AppButton from "@/components/AppButton";
import { BankingContext } from "@/context/BankingContext";
import { LOAN_TERMS } from "@/data/dummyData";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import { ArrowLeft, Pencil } from "lucide-react-native";
import { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoanScreen() {
  const { addTransaction } = useContext(BankingContext);
  const [requestedAmount, setRequestedAmount] = useState(25000);
  const [selectedMonths, setSelectedMonths] = useState(12);

  // Processing fee calculation (5% one-time fee)
  const processingFee = Math.round(requestedAmount * 0.05);
  const netDisbursement = requestedAmount - processingFee;

  const handleRequestCash = () => {
    addTransaction({
      status: "Received",
      recipient: "AMABank",
      accountRef: `LOAN-${selectedMonths}MO`,
      amount: netDisbursement,
      fee: processingFee,
      total: netDisbursement,
      note: `${selectedMonths}-month Get Cash loan disbursement`,
      type: "credit",
    });

    router.replace({
      pathname: "/loan/success",
      params: {
        amount: String(netDisbursement),
        months: String(selectedMonths),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={26} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Get Cash</Text>
          <View style={{ width: 26 }} />
        </View>

        <Text style={styles.questionText}>
          How much would you like to{"\n"}request?
        </Text>

        {/* Coral Amount Display */}
        <View style={styles.amountRow}>
          <Text style={styles.coralAmount}>
            ₱{requestedAmount.toLocaleString()}.00
          </Text>
          <Pencil size={20} color="#1A1A1A" fill="#1A1A1A" />
        </View>

        <Text style={styles.availableLabel}>
          Available to request: ₱50,000.00
        </Text>

        {/* Interactive Slider */}
        <Slider
          style={styles.slider}
          minimumValue={1500}
          maximumValue={50000}
          step={500}
          value={requestedAmount}
          onValueChange={setRequestedAmount}
          minimumTrackTintColor="#1A1A1A"
          maximumTrackTintColor="#1A1A1A"
          thumbTintColor="#1A1A1A"
        />

        <View style={styles.limitsRow}>
          <Text style={styles.limitText}>Min: ₱1,500.00</Text>
          <Text style={styles.limitText}>Max: ₱50,000.00</Text>
        </View>

        <View style={styles.sectionDivider} />

        {/* Monthly Term 2x2 Grid */}
        <Text style={styles.termHeading}>Select monthly payment</Text>
        <View style={styles.termsGrid}>
          {LOAN_TERMS.map((months) => {
            const active = selectedMonths === months;
            return (
              <TouchableOpacity
                key={months}
                style={[styles.termCard, active && styles.termCardActive]}
                onPress={() => setSelectedMonths(months)}
              >
                <Text style={styles.termText}>{months} Months</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Net Disbursement Summary Box */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Today, you'll get</Text>
          <Text style={styles.summaryAmount}>
            ₱{netDisbursement.toLocaleString()}.00
          </Text>

          <View style={styles.summaryDivider} />

          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>One time processing fee</Text>
            <Text style={styles.feeValue}>
              ₱{processingFee.toLocaleString()}.00
            </Text>
          </View>
        </View>
      </View>

      <AppButton title="Next" onPress={handleRequestCash} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  topSection: {
    marginTop: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  questionText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    lineHeight: 23,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  coralAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#DF5A56",
  },
  availableLabel: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 4,
  },
  slider: {
    width: "100%",
    height: 36,
    marginTop: 6,
  },
  limitsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  limitText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  sectionDivider: {
    height: 1.5,
    backgroundColor: "#525252",
    marginVertical: 12,
  },
  termHeading: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  termsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 14,
  },
  termCard: {
    width: "48%",
    backgroundColor: "#1E1E1E",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  termCardActive: {
    borderColor: "#DF5A56",
  },
  termText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  summaryBox: {
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    padding: 18,
  },
  summaryLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  summaryAmount: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 2,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#888888",
    marginVertical: 12,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  feeLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  feeValue: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});
