import AppButton from "@/components/AppButton";
import { BankingContext } from "@/context/BankingContext";
import { WITHDRAW_PARTNERS } from "@/data/dummyData";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useContext, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WithdrawPartnerScreen() {
  const { amount = "1000" } = useLocalSearchParams();
  const { addTransaction } = useContext(BankingContext);
  const [search, setSearch] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(
    "Robinsons Supermarket",
  );

  const filteredPartners = WITHDRAW_PARTNERS.filter((partner) =>
    partner.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleGenerateBarcode = () => {
    if (!selectedPartner) {
      Alert.alert("Select Outlet", "Please choose a withdrawal partner.");
      return;
    }

    const numericAmount = parseFloat(amount);
    const createdTx = addTransaction({
      status: "Withdrawn",
      recipient: selectedPartner,
      accountRef: `BARCODE-${Math.floor(100000 + Math.random() * 900000)}`,
      amount: numericAmount,
      fee: 0.0,
      total: numericAmount,
      note: "Over-the-counter barcode cash-out",
      type: "debit",
    });

    Alert.alert(
      "Cash-Out Barcode Ready",
      `Present code ${createdTx.accountRef} at ${selectedPartner} to claim ₱${numericAmount.toLocaleString()}.`,
      [
        {
          text: "View Receipt",
          onPress: () => router.replace(`/details/${createdTx.id}`),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdraw</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.darkSheet}>
        <View>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
            placeholderTextColor="#525252"
            style={styles.searchPill}
          />

          <Text style={styles.sectionLabel}>
            Where do you want to withdraw?
          </Text>

          <FlatList
            data={filteredPartners}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              const isSelected = selectedPartner === item.name;
              return (
                <TouchableOpacity
                  style={styles.partnerRow}
                  onPress={() => setSelectedPartner(item.name)}
                >
                  <Text style={styles.partnerName}>{item.name}</Text>
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleActive,
                    ]}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <AppButton
          title="Generate Barcode"
          variant="light"
          onPress={handleGenerateBarcode}
          style={{ marginBottom: 24 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  darkSheet: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 22,
    marginTop: 10,
    justifyContent: "space-between",
  },
  searchPill: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    height: 44,
    paddingHorizontal: 18,
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 18,
  },
  sectionLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    paddingHorizontal: 6,
  },
  partnerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#A3A3A3",
  },
  partnerName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#D4D4D4",
  },
  radioCircleActive: {
    backgroundColor: "#DF5A56",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});
