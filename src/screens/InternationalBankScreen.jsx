import { INTERNATIONAL_BANKS } from "@/data/dummyData";
import { router } from "expo-router";
import { ArrowLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InternationalBankScreen() {
  const [search, setSearch] = useState("");

  const filteredBanks = INTERNATIONAL_BANKS.filter((bank) =>
    bank.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>International Bank</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.darkSheet}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search"
          placeholderTextColor="#525252"
          style={styles.searchPill}
        />

        <Text style={styles.sectionLabel}>Bank Accounts</Text>

        <FlatList
          data={filteredBanks}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bankRow}
              onPress={() =>
                router.push({
                  pathname: "/transfer",
                  params: { provider: item.name },
                })
              }
            >
              <Text style={styles.bankName}>{item.name}</Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No matching providers found.</Text>
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
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    paddingHorizontal: 6,
  },
  bankRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#A3A3A3",
  },
  bankName: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "600",
  },
  emptyText: {
    color: "#A3A3A3",
    textAlign: "center",
    marginTop: 24,
  },
});
