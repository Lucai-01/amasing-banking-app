import AppButton from "@/components/AppButton";
import { router, useLocalSearchParams } from "expo-router";
import { ReceiptText } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransferSuccessScreen() {
  const { id, provider = "PayPal", amount = "1000" } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContent}>
        <ReceiptText size={76} color="#0A0A0A" strokeWidth={2.2} />
        <Text style={styles.headline}>
          Paid{" "}
          <Text style={styles.coralAmount}>
            ₱{Number(amount).toLocaleString()}
          </Text>
        </Text>
        <Text style={styles.headline}>to {provider}</Text>
      </View>

      <AppButton
        title="See Details"
        onPress={() => router.replace(`/details/${id}`)}
      />
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
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  headline: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  coralAmount: {
    color: "#DF5A56",
  },
});
