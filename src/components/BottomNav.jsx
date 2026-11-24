import { router, usePathname } from "expo-router";
import {
  CreditCard,
  Home,
  QrCode,
  ReceiptText,
  User,
} from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname === "/home";
  const isTransactions = pathname === "/transactions";
  const isCards = pathname === "/cards";
  const isProfile = pathname === "/profile";

  const navigateTab = (targetPath) => {
    if (pathname === targetPath) return;
    router.replace(targetPath);
  };

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.dock}>
        {/* 1. Home */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.75}
          onPress={() => navigateTab("/home")}
        >
          <Home
            size={21}
            color={isHome ? "#DF5A56" : "#A3A3A3"}
            strokeWidth={isHome ? 2.4 : 2}
          />
          <Text style={[styles.tabLabel, isHome && styles.tabLabelActive]}>
            Home
          </Text>
          {isHome && <View style={styles.activeDot} />}
        </TouchableOpacity>

        {/* 2. History */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.75}
          onPress={() => navigateTab("/transactions")}
        >
          <ReceiptText
            size={21}
            color={isTransactions ? "#DF5A56" : "#A3A3A3"}
            strokeWidth={isTransactions ? 2.4 : 2}
          />
          <Text
            style={[styles.tabLabel, isTransactions && styles.tabLabelActive]}
          >
            History
          </Text>
          {isTransactions && <View style={styles.activeDot} />}
        </TouchableOpacity>

        {/* Center Floating Button: Scan QR */}
        <TouchableOpacity
          style={styles.centerWrapper}
          activeOpacity={0.85}
          onPress={() => router.push("/qr")}
        >
          <View style={styles.centerButton}>
            <QrCode size={23} color="#FFFFFF" strokeWidth={2.2} />
          </View>
          <Text style={styles.centerLabel}>Scan QR</Text>
        </TouchableOpacity>

        {/* 3. Cards */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.75}
          onPress={() => navigateTab("/cards")}
        >
          <CreditCard
            size={21}
            color={isCards ? "#DF5A56" : "#A3A3A3"}
            strokeWidth={isCards ? 2.4 : 2}
          />
          <Text style={[styles.tabLabel, isCards && styles.tabLabelActive]}>
            Cards
          </Text>
          {isCards && <View style={styles.activeDot} />}
        </TouchableOpacity>

        {/* 4. Profile */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.75}
          onPress={() => navigateTab("/profile")}
        >
          <User
            size={21}
            color={isProfile ? "#DF5A56" : "#A3A3A3"}
            strokeWidth={isProfile ? 2.4 : 2}
          />
          <Text style={[styles.tabLabel, isProfile && styles.tabLabelActive]}>
            Profile
          </Text>
          {isProfile && <View style={styles.activeDot} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    alignItems: "center",
  },
  dock: {
    width: "100%",
    height: 70,
    backgroundColor: "#1E1E1E",
    borderRadius: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#A3A3A3",
  },
  tabLabelActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#DF5A56",
    marginTop: 1,
  },
  centerWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -22,
    paddingHorizontal: 4,
  },
  centerButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#DF5A56",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  centerLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 3,
  },
});
