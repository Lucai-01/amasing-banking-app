import AppButton from "@/components/AppButton";
import AppInput from "@/components/AppInput";
import BottomNav from "@/components/BottomNav";
import ScreenHeader from "@/components/ScreenHeader";
import { BankingContext } from "@/context/BankingContext";
import {
  BadgeCheck,
  CreditCard,
  Lock,
  ShieldCheck,
  Unlock,
  User,
} from "lucide-react-native";
import { useContext, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, updateUserProfile } = useContext(BankingContext);

  const [fullName, setFullName] = useState(user.fullName || "");
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [email, setEmail] = useState(user.email || "");
  const [address, setAddress] = useState(user.address || "");
  const [passcode, setPasscode] = useState(user.passcode || "");

  const [extraCards, setExtraCards] = useState([
    {
      id: "rewards",
      name: "AMABank Rewards",
      network: "Mastercard",
      number: "5412 •••• •••• 8821",
      expiry: "11/28",
      frozen: false,
    },
    {
      id: "travel",
      name: "AMABank Travel",
      network: "Visa",
      number: "4532 •••• •••• 3104",
      expiry: "04/30",
      frozen: false,
    },
  ]);

  const primaryLast4 = (user.cardNumber || "4532 8910 3412 4909").slice(-4);

  const handleTogglePrimaryFreeze = async () => {
    const nextFrozen = !user.cardFrozen;
    await updateUserProfile({ cardFrozen: nextFrozen });
    Alert.alert(
      nextFrozen ? "Card Frozen" : "Card Active",
      nextFrozen
        ? "Your AMABank Primary card is now frozen across Home and payments."
        : "Your AMABank Primary card has been unfrozen.",
    );
  };

  const toggleExtraFreeze = (cardId) => {
    setExtraCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, frozen: !c.frozen } : c)),
    );
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim() || passcode.length !== 6) {
      Alert.alert(
        "Invalid Details",
        "Please enter your full name and a 6-digit MPIN.",
      );
      return;
    }

    const derivedFirst = firstName.trim() || fullName.trim().split(" ")[0];
    setFirstName(derivedFirst);

    await updateUserProfile({
      fullName: fullName.trim(),
      firstName: derivedFirst,
      email: email.trim(),
      address: address.trim(),
      passcode,
    });

    Alert.alert("Saved", "Your profile and security details were updated.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerPad}>
        <ScreenHeader title="Profile & Cards" showBack={false} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Dark Profile Banner */}
        <View style={styles.profileBanner}>
          <View style={styles.avatarCircle}>
            <User size={30} color="#FFFFFF" strokeWidth={2.2} />
          </View>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerName} numberOfLines={1}>
              {user.fullName || "Account Holder"}
            </Text>
            <Text style={styles.bannerEmail} numberOfLines={1}>
              {user.email || "Email Address"}
            </Text>
            <View style={styles.verifiedRow}>
              <BadgeCheck size={13} color="#DF5A56" />
              <Text style={styles.bannerMeta}>
                {user.tier || "Verified Account"} •{" "}
                {user.idType || "National ID"}
              </Text>
            </View>
          </View>
        </View>

        {/* Virtual Cards Section */}
        <View style={styles.sectionHeader}>
          <CreditCard size={18} color="#DF5A56" strokeWidth={2.2} />
          <Text style={styles.sectionTitle}>Virtual Cards</Text>
        </View>

        <View style={styles.cardsList}>
          {/* Synced Primary Card */}
          <View
            style={[styles.cardRow, user.cardFrozen && styles.cardRowFrozen]}
          >
            <View>
              <Text style={styles.cardName}>AMABank Primary</Text>
              <Text style={styles.cardMeta}>
                Visa •••• {primaryLast4} • Exp {user.cardExpiry || "08/29"}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.freezeBtn,
                user.cardFrozen && styles.freezeBtnActive,
              ]}
              onPress={handleTogglePrimaryFreeze}
              activeOpacity={0.8}
            >
              {user.cardFrozen ? (
                <Unlock size={14} color="#FFFFFF" />
              ) : (
                <Lock size={14} color="#FFFFFF" />
              )}
              <Text style={styles.freezeText}>
                {user.cardFrozen ? "Unfreeze" : "Freeze"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Secondary Virtual Cards */}
          {extraCards.map((card) => (
            <View
              key={card.id}
              style={[styles.cardRow, card.frozen && styles.cardRowFrozen]}
            >
              <View>
                <Text style={styles.cardName}>{card.name}</Text>
                <Text style={styles.cardMeta}>
                  {card.network} •••• {card.number.slice(-4)} • Exp{" "}
                  {card.expiry}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.freezeBtn,
                  card.frozen && styles.freezeBtnActive,
                ]}
                onPress={() => toggleExtraFreeze(card.id)}
                activeOpacity={0.8}
              >
                {card.frozen ? (
                  <Unlock size={14} color="#FFFFFF" />
                ) : (
                  <Lock size={14} color="#FFFFFF" />
                )}
                <Text style={styles.freezeText}>
                  {card.frozen ? "Unfreeze" : "Freeze"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Personal Info & MPIN Form */}
        <View style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <ShieldCheck size={19} color="#1A1A1A" strokeWidth={2.2} />
            <Text style={styles.sectionTitle}>Personal Info & MPIN</Text>
          </View>

          <Text style={styles.inputLabel}>Full Name</Text>
          <AppInput
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              setFirstName(text.trim().split(" ")[0] || "");
            }}
            placeholder="Full Name"
          />

          <View style={styles.twoColRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Display First Name</Text>
              <AppInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>6-Digit MPIN</Text>
              <AppInput
                value={passcode}
                onChangeText={(t) =>
                  setPasscode(t.replace(/[^0-9]/g, "").slice(0, 6))
                }
                keyboardType="number-pad"
                secureTextEntry
                placeholder="6-Digit MPIN"
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Email Address</Text>
          <AppInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Email Address"
          />

          <Text style={styles.inputLabel}>Residential Address</Text>
          <AppInput
            value={address}
            onChangeText={setAddress}
            placeholder="Residential Address"
          />

          <View style={{ marginTop: 14 }}>
            <AppButton title="Save Changes" onPress={handleSaveProfile} />
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
  },
  profileBanner: {
    backgroundColor: "#1A1A1A",
    borderRadius: 22,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 22,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#DF5A56",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerInfo: {
    flex: 1,
    gap: 3,
  },
  bannerName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  bannerEmail: {
    color: "#D4D4D4",
    fontSize: 12,
    fontWeight: "500",
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  bannerMeta: {
    color: "#A3A3A3",
    fontSize: 11,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  cardsList: {
    gap: 10,
    marginBottom: 22,
  },
  cardRow: {
    backgroundColor: "#1E1E1E",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardRowFrozen: {
    backgroundColor: "#525252",
  },
  cardName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  cardMeta: {
    color: "#D4D4D4",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 3,
  },
  freezeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#363636",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  freezeBtnActive: {
    backgroundColor: "#DF5A56",
  },
  freezeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  formCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 22,
    padding: 18,
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#404040",
    marginTop: 6,
  },
  twoColRow: {
    flexDirection: "row",
    gap: 12,
  },
});
