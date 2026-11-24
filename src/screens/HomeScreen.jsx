import BottomNav from "@/components/BottomNav";
import TransactionItem from "@/components/TransactionItem";
import { BankingContext } from "@/context/BankingContext";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import {
  ArrowDownLeft,
  Banknote,
  Bell,
  Copy,
  Eye,
  EyeOff,
  HandCoins,
  Lock,
  LogOut,
  Send,
  Wifi,
} from "lucide-react-native";
import { useContext, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDE_WIDTH = SCREEN_WIDTH - 40;

export default function HomeScreen() {
  const { user, balance, transactions } = useContext(BankingContext);
  const [activeSlide, setActiveSlide] = useState(0);
  const [hideBalance, setHideBalance] = useState(false);
  const [revealCard, setRevealCard] = useState(false);

  const rawCardNumber = user.cardNumber || "4532 8910 3412 4909";
  const last4 = rawCardNumber.slice(-4);
  const maskedCardNumber = `4532  ••••  ••••  ${last4}`;

  const formattedBalance = Number(balance || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleSlideScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SLIDE_WIDTH);
    setActiveSlide(index);
  };

  const handleCopyAccount = async () => {
    const acct = user.accountNumber || "9090 9123 4909";
    await Clipboard.setStringAsync(acct);
    Alert.alert("Copied", `Account number (${acct}) copied.`);
  };

  const handleCopyCard = async () => {
    await Clipboard.setStringAsync(rawCardNumber.replace(/\s+/g, ""));
    Alert.alert(
      "Card Copied",
      `Virtual card number (${rawCardNumber}) copied.`,
    );
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to lock your session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  const openReceipt = (txId) => {
    router.push({
      pathname: "/details/[id]",
      params: { id: String(txId) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greetingSub}>Welcome back,</Text>
            <Text style={styles.greetingName}>{user.firstName || "User"}</Text>
          </View>

          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() =>
                Alert.alert(
                  "Notifications",
                  user.cardFrozen
                    ? "Security Alert: Your AMABank Primary card is currently frozen."
                    : "Your account is verified and active.",
                )
              }
            >
              <Bell size={20} color="#1A1A1A" strokeWidth={2.2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
              <LogOut size={20} color="#DF5A56" strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Horizontal Swipe Carousel: Slide 1 = Balance | Slide 2 = Virtual Card */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleSlideScroll}
          decelerationRate="fast"
          snapToInterval={SLIDE_WIDTH}
          style={styles.carousel}
        >
          {/* SLIDE 1: Total Available Balance */}
          <View style={[styles.slideCard, styles.balanceSlide]}>
            <View style={styles.slideTopRow}>
              <View style={styles.pillDark}>
                <Text style={styles.pillDarkText}>AMABank Savings</Text>
              </View>
              <TouchableOpacity
                style={styles.eyeDarkBtn}
                onPress={() => setHideBalance((prev) => !prev)}
              >
                {hideBalance ? (
                  <EyeOff size={16} color="#FFFFFF" />
                ) : (
                  <Eye size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>

            <View>
              <Text style={styles.balLabel}>Total Available Balance</Text>
              <Text style={styles.balValue}>
                {hideBalance ? "₱ ••••••" : `₱${formattedBalance}`}
              </Text>
            </View>

            <View style={styles.slideBottomRow}>
              <TouchableOpacity
                style={styles.acctCopyRow}
                onPress={handleCopyAccount}
              >
                <Text style={styles.acctNumText}>
                  Acct: {user.accountNumber || "9090 9123 4909"}
                </Text>
                <Copy size={13} color="#D4D4D4" />
              </TouchableOpacity>
              <Text style={styles.swipeHint}>Swipe for Card →</Text>
            </View>
          </View>

          {/* SLIDE 2: Virtual Debit Card */}
          <View
            style={[
              styles.slideCard,
              styles.virtualCardSlide,
              user.cardFrozen && styles.virtualCardFrozen,
            ]}
          >
            <View style={styles.slideTopRow}>
              <View style={styles.brandRow}>
                <Text style={styles.cardBrand}>AMABank</Text>
                {user.cardFrozen && (
                  <View style={styles.frozenBadge}>
                    <Lock size={10} color="#FFFFFF" />
                    <Text style={styles.frozenBadgeText}>FROZEN</Text>
                  </View>
                )}
              </View>

              <View style={styles.cardActionPills}>
                <TouchableOpacity
                  style={styles.copyChipBtn}
                  onPress={() => setRevealCard((prev) => !prev)}
                >
                  {revealCard ? (
                    <EyeOff size={13} color="#FFFFFF" />
                  ) : (
                    <Eye size={13} color="#FFFFFF" />
                  )}
                  <Text style={styles.copyChipText}>
                    {revealCard ? "Mask" : "Show"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.copyChipBtn}
                  onPress={handleCopyCard}
                >
                  <Copy size={13} color="#FFFFFF" />
                </TouchableOpacity>

                <Wifi
                  size={18}
                  color="rgba(255,255,255,0.85)"
                  style={{ transform: [{ rotate: "90deg" }] }}
                />
              </View>
            </View>

            <Text style={styles.cardNumberText}>
              {revealCard ? rawCardNumber : maskedCardNumber}
            </Text>

            <View style={styles.cardBottomRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardMetaLabel}>CARDHOLDER</Text>
                <Text style={styles.cardMetaValue} numberOfLines={1}>
                  {(user.fullName || "AMABANK USER").toUpperCase()}
                </Text>
              </View>

              <View style={styles.cardMetaGroup}>
                <View>
                  <Text style={styles.cardMetaLabel}>VALID THRU</Text>
                  <Text style={styles.cardMetaValue}>
                    {user.cardExpiry || "08/29"}
                  </Text>
                </View>
                <View>
                  <Text style={styles.cardMetaLabel}>CVV</Text>
                  <Text style={styles.cardMetaValue}>
                    {revealCard ? user.cardCvv || "614" : "•••"}
                  </Text>
                </View>
                <Text style={styles.visaLogo}>VISA</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Carousel Pagination Dots */}
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, activeSlide === 0 && styles.dotActive]} />
          <View style={[styles.dot, activeSlide === 1 && styles.dotActive]} />
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push("/deposit")}
          >
            <View style={[styles.actionCircle, styles.actionCoral]}>
              <ArrowDownLeft size={22} color="#FFFFFF" strokeWidth={2.3} />
            </View>
            <Text style={styles.actionLabel}>Cash In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push("/transfer")}
          >
            <View style={styles.actionCircle}>
              <Send size={20} color="#FFFFFF" strokeWidth={2.2} />
            </View>
            <Text style={styles.actionLabel}>Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push("/withdraw")}
          >
            <View style={styles.actionCircle}>
              <Banknote size={21} color="#FFFFFF" strokeWidth={2.2} />
            </View>
            <Text style={styles.actionLabel}>Withdraw</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push("/loan")}
          >
            <View style={styles.actionCircle}>
              <HandCoins size={21} color="#FFFFFF" strokeWidth={2.2} />
            </View>
            <Text style={styles.actionLabel}>Get Loan</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions Section */}
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.replace("/transactions")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No transactions yet</Text>
            <Text style={styles.emptySub}>
              Your balance is ₱0.00. Fund your account using Cash In to start
              making transfers.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push("/deposit")}
            >
              <Text style={styles.emptyBtnText}>+ Cash In Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.txList}>
            {transactions.slice(0, 4).map((item) => (
              <TransactionItem
                key={String(item.id)}
                item={item}
                onPressDetails={() => openReceipt(item.id)}
                onPress={() => openReceipt(item.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 120,
  },
  topBar: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  greetingSub: {
    fontSize: 12,
    fontWeight: "600",
    color: "#737373",
  },
  greetingName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  topActions: {
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  carousel: {
    width: SLIDE_WIDTH,
  },
  slideCard: {
    width: SLIDE_WIDTH,
    height: 205,
    borderRadius: 24,
    padding: 20,
    justifyContent: "space-between",
  },
  balanceSlide: {
    backgroundColor: "#1A1A1A",
  },
  virtualCardSlide: {
    backgroundColor: "#DF5A56",
  },
  virtualCardFrozen: {
    backgroundColor: "#404040",
  },
  slideTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pillDark: {
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  pillDarkText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  eyeDarkBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
  },
  balLabel: {
    color: "#A3A3A3",
    fontSize: 12,
    fontWeight: "600",
  },
  balValue: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 2,
  },
  slideBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  acctCopyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  acctNumText: {
    color: "#D4D4D4",
    fontSize: 12,
    fontWeight: "600",
  },
  swipeHint: {
    color: "#DF5A56",
    fontSize: 11,
    fontWeight: "700",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardBrand: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  frozenBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  frozenBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  cardActionPills: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  copyChipBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.22)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },
  copyChipText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  cardNumberText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
  },
  cardMetaGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 14,
  },
  cardMetaLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  cardMetaValue: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  visaLogo: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    fontStyle: "italic",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    marginBottom: 20,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#D4D4D4",
  },
  dotActive: {
    width: 20,
    backgroundColor: "#DF5A56",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionItem: {
    alignItems: "center",
    gap: 7,
    flex: 1,
  },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
  },
  actionCoral: {
    backgroundColor: "#DF5A56",
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#DF5A56",
  },
  txList: {
    gap: 10,
  },
  emptyCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  emptySub: {
    fontSize: 12,
    color: "#525252",
    textAlign: "center",
    lineHeight: 18,
  },
  emptyBtn: {
    marginTop: 6,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
  },
  emptyBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
