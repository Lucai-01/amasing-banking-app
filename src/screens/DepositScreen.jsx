import ScreenHeader from "@/components/ScreenHeader";
import { BankingContext } from "@/context/BankingContext";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { Building2, ChevronRight, Copy, Globe } from "lucide-react-native";
import { useContext } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DepositScreen() {
  const { user } = useContext(BankingContext);

  const handleCopy = async (label, value) => {
    await Clipboard.setStringAsync(value);
    Alert.alert("Copied", `${label} (${value}) copied to clipboard.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerPad}>
        <ScreenHeader title="Cash In & Deposit" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Account Details for Direct Transfers */}
        <Text style={styles.sectionLabel}>YOUR ACCOUNT DETAILS</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View>
              <Text style={styles.detailTitle}>AMABank Account Number</Text>
              <Text style={styles.detailValue}>
                {user.accountNumber || "9090 9123 4909"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.copyBtn}
              onPress={() =>
                handleCopy(
                  "Account Number",
                  user.accountNumber || "9090 9123 4909",
                )
              }
            >
              <Copy size={16} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View>
              <Text style={styles.detailTitle}>Institution / SWIFT Code</Text>
              <Text style={styles.detailValue}>
                {user.code || "AMAPH-2029"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.copyBtn}
              onPress={() => handleCopy("Bank Code", user.code || "AMAPH-2029")}
            >
              <Copy size={16} color="#1A1A1A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cash-In Channels */}
        <Text style={styles.sectionLabel}>CASH IN VIA BANK OR WALLET</Text>
        <TouchableOpacity
          style={styles.channelRow}
          activeOpacity={0.8}
          onPress={() => router.push("/deposit/local")}
        >
          <View style={styles.channelIcon}>
            <Building2 size={21} color="#1A1A1A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.channelTitle}>Local Bank & E-Wallets</Text>
            <Text style={styles.channelSub}>
              GCash, Maya, BDO, BPI, ChinaBank, UnionBank
            </Text>
          </View>
          <ChevronRight size={20} color="#737373" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.channelRow}
          activeOpacity={0.8}
          onPress={() => router.push("/deposit/international")}
        >
          <View style={styles.channelIcon}>
            <Globe size={21} color="#1A1A1A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.channelTitle}>International Bank</Text>
            <Text style={styles.channelSub}>PayPal, Western Union, Wise</Text>
          </View>
          <ChevronRight size={20} color="#737373" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerPad: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#737373",
    letterSpacing: 0.8,
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 22,
    padding: 20,
    gap: 14,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A3A3A3",
  },
  detailValue: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 2,
  },
  copyBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  channelRow: {
    backgroundColor: "#F7F7F7",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  channelIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  channelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  channelSub: {
    fontSize: 12,
    color: "#737373",
    marginTop: 2,
  },
});
