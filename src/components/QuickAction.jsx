import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QuickAction({ label, icon, onPress }) {
  return (
    <TouchableOpacity
      style={styles.actionItem}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.actionCircle}>{icon}</View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionItem: {
    alignItems: "center",
    gap: 6,
  },
  actionCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
});
