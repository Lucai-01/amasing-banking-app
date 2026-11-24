import { router } from "expo-router";
import { ArrowLeft, ChevronRight } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BankSelectSheet({
  title,
  banks,
  targetPath = "/transfer/recipient",
}) {
  const [search, setSearch] = useState("");

  const filteredBanks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return banks;
    return banks.filter((bank) => bank.toLowerCase().includes(q));
  }, [banks, search]);

  const handleSelectBank = (bankName) => {
    router.push({
      pathname: targetPath,
      params: { provider: bankName },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Top White Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#1A1A1A" strokeWidth={2.2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.spacer} />
      </View>

      {/* Dark Rounded Sheet */}
      <View style={styles.darkSheet}>
        <View style={styles.searchPill}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
            placeholderTextColor="#525252"
            style={styles.searchInput}
          />
        </View>

        <Text style={styles.subLabel}>Bank Accounts</Text>

        <FlatList
          data={filteredBanks}
          keyExtractor={(item) => item}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isLast = index === filteredBanks.length - 1;
            return (
              <TouchableOpacity
                style={[styles.bankRow, !isLast && styles.bankRowDivider]}
                activeOpacity={0.75}
                onPress={() => handleSelectBank(item)}
              >
                <Text style={styles.bankName}>{item}</Text>
                <ChevronRight size={20} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No matching bank found.</Text>
          }
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
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
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
  darkSheet: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  searchPill: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    height: 44,
    paddingHorizontal: 18,
    justifyContent: "center",
    marginBottom: 20,
  },
  searchInput: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  subLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    paddingLeft: 4,
  },
  bankRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 6,
  },
  bankRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.35)",
  },
  bankName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  emptyText: {
    color: "#A3A3A3",
    textAlign: "center",
    marginTop: 28,
    fontSize: 14,
  },
});
