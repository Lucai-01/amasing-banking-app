import BottomNav from "@/components/BottomNav";
import ScreenHeader from "@/components/ScreenHeader";
import TransactionItem from "@/components/TransactionItem";
import { BankingContext } from "@/context/BankingContext";
import { router } from "expo-router";
import { Search, X } from "lucide-react-native";
import { useContext, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "in", label: "Money In" },
  { key: "out", label: "Money Out" },
];

export default function TransactionsScreen() {
  const { transactions } = useContext(BankingContext);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const counts = useMemo(() => {
    const moneyIn = transactions.filter((tx) => tx.type === "credit").length;
    const moneyOut = transactions.filter((tx) => tx.type === "debit").length;
    return {
      all: transactions.length,
      in: moneyIn,
      out: moneyOut,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return transactions.filter((tx) => {
      if (activeFilter === "in" && tx.type !== "credit") return false;
      if (activeFilter === "out" && tx.type !== "debit") return false;

      if (!query) return true;

      const refMatch = (tx.referenceNo || "").toLowerCase().includes(query);
      const recipientMatch = (tx.recipient || "").toLowerCase().includes(query);
      const noteMatch = (tx.note || "").toLowerCase().includes(query);

      return refMatch || recipientMatch || noteMatch;
    });
  }, [transactions, activeFilter, searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <ScreenHeader title="Transactions" showBack={false} />

        {/* Reference ID / Recipient Search Bar */}
        <View style={styles.searchBox}>
          <Search size={18} color="#737373" strokeWidth={2.2} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search Reference ID (e.g. REF...) or name"
            placeholderTextColor="#8C8C8C"
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="search"
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={18} color="#525252" />
            </TouchableOpacity>
          )}
        </View>

        {/* All / Money In / Money Out Filter Tabs */}
        <View style={styles.filterRow}>
          {FILTERS.map((tab) => {
            const isSelected = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => setActiveFilter(tab.key)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isSelected && styles.filterTextSelected,
                  ]}
                >
                  {tab.label} ({counts[tab.key]})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Filtered Transactions List */}
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TransactionItem
              item={item}
              onPressDetails={() =>
                router.push({
                  pathname: "/details/[id]",
                  params: { id: String(item.id) },
                })
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No matching transactions</Text>
              <Text style={styles.emptySub}>
                {searchQuery
                  ? `No records found for "${searchQuery}".`
                  : "Transactions for this category will appear here."}
              </Text>
            </View>
          }
        />
      </View>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  filterPillSelected: {
    backgroundColor: "#1E1E1E",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#525252",
  },
  filterTextSelected: {
    color: "#FFFFFF",
  },
  listContent: {
    gap: 10,
    paddingBottom: 120,
  },
  emptyBox: {
    alignItems: "center",
    marginTop: 54,
    paddingHorizontal: 24,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  emptySub: {
    fontSize: 13,
    color: "#737373",
    textAlign: "center",
  },
});
