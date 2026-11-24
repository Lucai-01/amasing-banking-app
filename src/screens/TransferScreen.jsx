import ScreenHeader from "@/components/ScreenHeader";
import { BankingContext } from "@/context/BankingContext";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { Building2, ChevronRight, Copy, Globe, Zap } from "lucide-react-native";
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

export default function TransferScreen() {
  const { user, balance } = useContext(BankingContext);

  const formattedBalance = Number(balance || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleCopy = async (label, value) => {
    await Clipboard.setStringAsync(value);
    Alert.alert("Copied", `${label} (${value}) copied to clipboard.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerPad}>
        <ScreenHeader title="Send & Transfer" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Instant Transfer Action Card (Matches Instant Cash-In) */}
        <TouchableOpacity
          style={styles.instantCard}
          activeOpacity={0.85}
          onPress={() => router.push("/transfer/instant")}
        >
          <View style={styles.instantIconBox}>
            <Zap size={24} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.instantTitle}>Instant Transfer</Text>
            <Text style={styles.instantSub}>
              Send via InstaPay, GCash, Maya, or AMABank
            </Text>
          </View>
          <ChevronRight size={22} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Source Account Summary Card */}
        <Text style={styles.sectionLabel}>SOURCE ACCOUNT DETAILS</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View>
              <Text style={styles.detailTitle}>Available Balance</Text>
              <Text style={styles.detailValue}>₱{formattedBalance}</Text>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Zero Fee</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View>
              <Text style={styles.detailTitle}>Sending From Account</Text>
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
        </View>

        {/* Bank Transfer Channels (Matches DepositScreen) */}
        <Text style={styles.sectionLabel}>BANK TRANSFER CHANNELS</Text>
        <TouchableOpacity
          style={styles.channelRow}
          activeOpacity={0.8}
          onPress={() => router.push("/transfer/local")}
        >
          <View style={styles.channelIcon}>
            <Building2 size={20} color="#1A1A1A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.channelTitle}>Local Philippine Banks</Text>
            <Text style={styles.channelSub}>
              BDO, BPI, UnionBank, Metrobank
            </Text>
          </View>
          <ChevronRight size={20} color="#737373" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.channelRow}
          activeOpacity={0.8}
          onPress={() => router.push("/transfer/international")}
        >
          <View style={styles.channelIcon}>
            <Globe size={20} color="#1A1A1A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.channelTitle}>International Remittance</Text>
            <Text style={styles.channelSub}>PayPal, Wise, Western Union</Text>
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
  instantCard: {
    backgroundColor: "#DF5A56",
    borderRadius: 22,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 6,
  },
  instantIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  instantTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  instantSub: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#737373",
    letterSpacing: 0.8,
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#737373",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A1A1A",
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: "#16A34A",
    fontSize: 11,
    fontWeight: "700",
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
    backgroundColor: "#E5E5E5",
  },
  channelRow: {
    backgroundColor: "#F7F7F7",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  channelIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  channelTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  channelSub: {
    fontSize: 12,
    color: "#737373",
    marginTop: 2,
  },
});
