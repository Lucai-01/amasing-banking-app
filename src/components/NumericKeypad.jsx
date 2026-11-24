import { Check, Delete, ScanFace } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NumericKeypad({
  onKeyPress,
  onDelete,
  showBiometric = false,
  onBiometric,
  showConfirm = false,
  confirmReady = false,
  onConfirm,
}) {
  const rows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
  ];

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((digit) => (
            <TouchableOpacity
              key={digit}
              style={styles.key}
              activeOpacity={0.75}
              onPress={() => onKeyPress(digit)}
            >
              <Text style={styles.keyText}>{digit}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <View style={styles.row}>
        {showBiometric ? (
          <TouchableOpacity style={styles.iconKey} onPress={onBiometric}>
            <ScanFace size={34} color="#1A1A1A" strokeWidth={1.8} />
          </TouchableOpacity>
        ) : showConfirm ? (
          <TouchableOpacity
            style={[styles.confirmKey, confirmReady && styles.confirmKeyReady]}
            activeOpacity={0.8}
            onPress={onConfirm}
          >
            <Check size={28} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyKey} />
        )}

        <TouchableOpacity
          style={styles.key}
          activeOpacity={0.75}
          onPress={() => onKeyPress("0")}
        >
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconKey} onPress={onDelete}>
          <Delete size={32} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 18,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    gap: 28,
  },
  key: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
  },
  keyText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
  },
  confirmKey: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#737373",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmKeyReady: {
    backgroundColor: "#DF5A56",
  },
  iconKey: {
    width: 74,
    height: 74,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyKey: {
    width: 74,
    height: 74,
  },
});
