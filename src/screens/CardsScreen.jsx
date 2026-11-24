import BottomNav from "@/components/BottomNav";
import ScreenHeader from "@/components/ScreenHeader";
import { BankingContext } from "@/context/BankingContext";
import * as Clipboard from "expo-clipboard";
import {
    Copy,
    Eye,
    EyeOff,
    Globe,
    Lock,
    ShieldCheck,
    ShoppingBag,
    Unlock,
    Wifi,
} from "lucide-react-native";
import { useContext, useRef, useState } from "react";
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 40;

export default function CardsScreen() {
  const { user, updateUserProfile } = useContext(BankingContext);
  const carouselRef = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [revealDetails, setRevealDetails] = useState(false);

  const [extraFrozen, setExtraFrozen] = useState({
    rewards: false,
    travel: false,
  });

  const [cardControls, setCardControls] = useState({
    primary: { online: true, intl: false },
    rewards: { online: true, intl: false },
    travel: { online: true, intl: true },
  });

  const cards = [
    {
      id: "primary",
      title: "AMABank Primary",
      network: "VISA",
      number: user.cardNumber || "4532 8910 3412 4909",
      expiry: user.cardExpiry || "08/29",
      cvv: user.cardCvv || "614",
      color: "#DF5A56",
      frozen: Boolean(user.cardFrozen),
      limit: "₱50,000.00 / month",
    },
    {
      id: "rewards",
      title: "AMABank Rewards",
      network: "MASTERCARD",
      number: "5412 7730 1948 8821",
      expiry: "11/28",
      cvv: "392",
      color: "#1E1E1E",
      frozen: extraFrozen.rewards,
      limit: "₱100,000.00 / month",
    },
    {
      id: "travel",
      title: "AMABank Travel",
      network: "VISA",
      number: "4532 6019 8824 3104",
      expiry: "04/30",
      cvv: "847",
      color: "#2B2B2B",
      frozen: extraFrozen.travel,
      limit: "₱150,000.00 / month",
    },
  ];

  const activeCard = cards[selectedIndex] || cards[0];
  const activeControls = cardControls[activeCard.id];

  const handleSelectCard = (index) => {
    setSelectedIndex(index);
    carouselRef.current?.scrollTo({
      x: index * CARD_WIDTH,
      animated: true,
    });
  };

  const handleCarouselScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CARD_WIDTH);
    const clampedIndex = Math.max(0, Math.min(cards.length - 1, index));
    setSelectedIndex(clampedIndex);
  };

  const handleCopyCard = async () => {
    await Clipboard.setStringAsync(activeCard.number.replace(/\s+/g, ""));
    Alert.alert("Copied", `${activeCard.title} number copied to clipboard.`);
  };

  const handleToggleFreeze = async () => {
    if (activeCard.id === "primary") {
      const nextFrozen = !user.cardFrozen;
      await updateUserProfile({ cardFrozen: nextFrozen });
      Alert.alert(
        nextFrozen ? "Card Frozen" : "Card Active",
        nextFrozen
          ? "AMABank Primary is now frozen across Home and payments."
          : "AMABank Primary is now active.",
      );
    } else {
      setExtraFrozen((prev) => ({
        ...prev,
        [activeCard.id]: !prev[activeCard.id],
      }));
    }
  };

  const toggleControl = (key) => {
    setCardControls((prev) => ({
      ...prev,
      [activeCard.id]: {
        ...prev[activeCard.id],
        [key]: !prev[activeCard.id][key],
      },
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerPad}>
        <ScreenHeader title="Virtual Cards" showBack={false} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Card Switcher Pills (Synced with Swipe) */}
        <View style={styles.switcherRow}>
          {cards.map((card, idx) => {
            const active = idx === selectedIndex;
            return (
              <TouchableOpacity
                key={card.id}
                style={[styles.switchPill, active && styles.switchPillActive]}
                onPress={() => handleSelectCard(idx)}
              >
                <Text
                  style={[styles.switchText, active && styles.switchTextActive]}
                >
                  {card.title.replace("AMABank ", "")}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Swipeable Horizontal Card Carousel */}
        <View>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleCarouselScrollEnd}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH}
            style={styles.carousel}
          >
            {cards.map((card) => {
              const maskedNumber = `${card.number.slice(
                0,
                4,
              )}  ••••  ••••  ${card.number.slice(-4)}`;

              return (
                <View
                  key={card.id}
                  style={[
                    styles.cardVisual,
                    {
                      backgroundColor: card.frozen ? "#525252" : card.color,
                    },
                  ]}
                >
                  <View style={styles.cardTopRow}>
                    <View style={styles.brandRow}>
                      <Text style={styles.cardBrand}>{card.title}</Text>
                      {card.frozen && (
                        <View style={styles.frozenBadge}>
                          <Lock size={10} color="#FFFFFF" />
                          <Text style={styles.frozenText}>FROZEN</Text>
                        </View>
                      )}
                    </View>
                    <Wifi
                      size={20}
                      color="rgba(255,255,255,0.85)"
                      style={{ transform: [{ rotate: "90deg" }] }}
                    />
                  </View>

                  <View style={styles.emvChip}>
                    <View style={styles.emvLine} />
                  </View>

                  <Text style={styles.cardNumberText}>
                    {revealDetails ? card.number : maskedNumber}
                  </Text>

                  <View style={styles.cardBottomRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.metaLabel}>CARDHOLDER</Text>
                      <Text style={styles.metaValue} numberOfLines={1}>
                        {(user.fullName || "AMABANK USER").toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.metaGroup}>
                      <View>
                        <Text style={styles.metaLabel}>EXPIRES</Text>
                        <Text style={styles.metaValue}>{card.expiry}</Text>
                      </View>
                      <View>
                        <Text style={styles.metaLabel}>CVV</Text>
                        <Text style={styles.metaValue}>
                          {revealDetails ? card.cvv : "•••"}
                        </Text>
                      </View>
                      <Text style={styles.networkLogo}>{card.network}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Pagination Dots */}
          <View style={styles.dotsRow}>
            {cards.map((card, idx) => (
              <TouchableOpacity
                key={card.id}
                onPress={() => handleSelectCard(idx)}
                style={[styles.dot, idx === selectedIndex && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        {/* Quick Card Actions (Applies to Currently Swiped Card) */}
        <View style={styles.quickBar}>
          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => setRevealDetails((prev) => !prev)}
          >
            {revealDetails ? (
              <EyeOff size={18} color="#1A1A1A" />
            ) : (
              <Eye size={18} color="#1A1A1A" />
            )}
            <Text style={styles.quickBtnText}>
              {revealDetails ? "Hide Details" : "Reveal Details"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickBtn} onPress={handleCopyCard}>
            <Copy size={18} color="#1A1A1A" />
            <Text style={styles.quickBtnText}>Copy Number</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.quickBtn,
              activeCard.frozen && styles.quickBtnFrozen,
            ]}
            onPress={handleToggleFreeze}
          >
            {activeCard.frozen ? (
              <Unlock size={18} color="#FFFFFF" />
            ) : (
              <Lock size={18} color="#DF5A56" />
            )}
            <Text
              style={[
                styles.quickBtnText,
                activeCard.frozen && { color: "#FFFFFF" },
              ]}
            >
              {activeCard.frozen ? "Unfreeze" : "Freeze Card"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card Security & Limits (Per-Card Settings) */}
        <Text style={styles.sectionLabel}>
          {activeCard.title.toUpperCase()} SECURITY & LIMITS
        </Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <ShoppingBag size={18} color="#1A1A1A" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Online & E-Commerce</Text>
                <Text style={styles.settingSub}>
                  Allow online checkout transactions
                </Text>
              </View>
            </View>
            <Switch
              value={activeControls.online}
              onValueChange={() => toggleControl("online")}
              trackColor={{ false: "#D4D4D4", true: "#DF5A56" }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Globe size={18} color="#1A1A1A" />
              </View>
              <View>
                <Text style={styles.settingTitle}>International Usage</Text>
                <Text style={styles.settingSub}>
                  Foreign currency & overseas merchants
                </Text>
              </View>
            </View>
            <Switch
              value={activeControls.intl}
              onValueChange={() => toggleControl("intl")}
              trackColor={{ false: "#D4D4D4", true: "#DF5A56" }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <ShieldCheck size={18} color="#1A1A1A" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Monthly Spending Limit</Text>
                <Text style={styles.settingSub}>{activeCard.limit}</Text>
              </View>
            </View>
            <Text style={styles.activeTag}>Active</Text>
          </View>
        </View>
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
  headerPad: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 16,
  },
  switcherRow: {
    flexDirection: "row",
    gap: 8,
  },
  switchPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  switchPillActive: {
    backgroundColor: "#1A1A1A",
  },
  switchText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#525252",
  },
  switchTextActive: {
    color: "#FFFFFF",
  },
  carousel: {
    width: CARD_WIDTH,
  },
  cardVisual: {
    width: CARD_WIDTH,
    borderRadius: 24,
    padding: 22,
    height: 215,
    justifyContent: "space-between",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardBrand: {
    color: "#FFFFFF",
    fontSize: 17,
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
  frozenText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  emvChip: {
    width: 38,
    height: 26,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.32)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
  },
  emvLine: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  cardNumberText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1.6,
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
  },
  metaGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 14,
  },
  metaLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 9,
    fontWeight: "700",
  },
  metaValue: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  networkLogo: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    fontStyle: "italic",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
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
  quickBar: {
    flexDirection: "row",
    gap: 8,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    gap: 6,
  },
  quickBtnFrozen: {
    backgroundColor: "#DF5A56",
  },
  quickBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#737373",
    letterSpacing: 0.8,
    marginTop: 4,
  },
  settingsCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    padding: 16,
    gap: 14,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  settingSub: {
    fontSize: 11,
    color: "#737373",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  activeTag: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16A34A",
  },
});
