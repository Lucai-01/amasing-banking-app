import { ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TransactionItem({ item, onPressDetails, onPress }) {
  const isCredit = item.type === "credit";
  const handlePress = onPressDetails || onPress;

  const formattedAmount = Number(item.amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <View
        style={[
          styles.iconCircle,
          isCredit ? styles.iconCredit : styles.iconDebit,
        ]}
      >
        {isCredit ? (
          <ArrowDownLeft size={20} color="#16A34A" strokeWidth={2.4} />
        ) : (
          <ArrowUpRight size={20} color="#DF5A56" strokeWidth={2.4} />
        )}
      </View>

      <View style={styles.infoCol}>
        <Text style={styles.recipientText} numberOfLines={1}>
          {item.recipient}
        </Text>
        <Text style={styles.refText} numberOfLines={1}>
          {item.referenceNo || "REF000000000000"}
        </Text>
        <Text style={styles.dateText} numberOfLines={1}>
          {item.date}
        </Text>
      </View>

      <View style={styles.rightCol}>
        <Text
          style={[
            styles.amountText,
            isCredit ? styles.amountCredit : styles.amountDebit,
          ]}
        >
          {isCredit ? `+₱${formattedAmount}` : `-₱${formattedAmount}`}
        </Text>

        <View style={styles.detailsPill}>
          <Text style={styles.detailsLabel}>Receipt</Text>
          <ChevronRight size={13} color="#525252" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F7F7F7",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCredit: {
    backgroundColor: "#DCFCE7",
  },
  iconDebit: {
    backgroundColor: "#FEE2E2",
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  recipientText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  refText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#525252",
    letterSpacing: 0.3,
  },
  dateText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#737373",
  },
  rightCol: {
    alignItems: "flex-end",
    gap: 5,
  },
  amountText: {
    fontSize: 15,
    fontWeight: "800",
  },
  amountCredit: {
    color: "#16A34A",
  },
  amountDebit: {
    color: "#1A1A1A",
  },
  detailsPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#EAEAEA",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  detailsLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#404040",
  },
});
