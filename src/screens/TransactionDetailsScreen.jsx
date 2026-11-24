import ScreenHeader from "@/components/ScreenHeader";
import { BankingContext } from "@/context/BankingContext";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import { Check, Copy, Pencil, Trash2 } from "lucide-react-native";
import { useContext, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { transactions, updateTransactionNote, deleteTransaction } =
    useContext(BankingContext);

  const tx = transactions.find((item) => String(item.id) === String(id));

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteInput, setNoteInput] = useState(tx?.note || "");

  if (!tx) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerPad}>
          <ScreenHeader title="Receipt Details" />
        </View>
        <View style={styles.missingBox}>
          <Text style={styles.missingText}>Transaction receipt not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCredit = tx.type === "credit";
  const formattedAmount = Number(tx.amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleCopyRef = async () => {
    await Clipboard.setStringAsync(tx.referenceNo || "");
    Alert.alert("Copied", `Reference ID ${tx.referenceNo} copied.`);
  };

  const handleSaveNote = () => {
    updateTransactionNote(tx.id, noteInput.trim());
    setIsEditingNote(false);
    Alert.alert("Updated", "Transaction note saved.");
  };

  const handleDelete = () => {
    deleteTransaction(tx.id, () => {
      router.back();
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerPad}>
        <ScreenHeader
          title="Receipt Details"
          rightIcon={<Trash2 size={19} color="#DF5A56" strokeWidth={2.2} />}
          onRightPress={handleDelete}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Amount Summary Card */}
        <View style={styles.heroCard}>
          <View
            style={[
              styles.badge,
              isCredit ? styles.badgeCredit : styles.badgeDebit,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                isCredit ? styles.badgeTextCredit : styles.badgeTextDebit,
              ]}
            >
              {isCredit ? "MONEY IN" : "MONEY OUT"} • {tx.status.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.heroAmount}>
            {isCredit ? `+₱${formattedAmount}` : `-₱${formattedAmount}`}
          </Text>
          <Text style={styles.heroRecipient}>{tx.recipient}</Text>
          <Text style={styles.heroDate}>{tx.date}</Text>
        </View>

        {/* Reference ID Box */}
        <View style={styles.refCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.refLabel}>REFERENCE ID</Text>
            <Text style={styles.refValue}>{tx.referenceNo}</Text>
          </View>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopyRef}>
            <Copy size={16} color="#FFFFFF" />
            <Text style={styles.copyBtnText}>Copy</Text>
          </TouchableOpacity>
        </View>

        {/* Breakdown Rows */}
        <View style={styles.detailsCard}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>From</Text>
            <Text style={styles.rowValue}>{tx.from}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Institution</Text>
            <Text style={styles.rowValue}>{tx.bank || "AMABank"}</Text>
          </View>
          <View style={styles.divider} />

          {tx.accountRef ? (
            <>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Account / Ref</Text>
                <Text style={styles.rowValue}>{tx.accountRef}</Text>
              </View>
              <View style={styles.divider} />
            </>
          ) : null}

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Transaction Fee</Text>
            <Text style={styles.rowValue}>
              ₱{Number(tx.fee || 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Total</Text>
            <Text style={styles.rowValueBold}>
              ₱
              {Number(tx.total ?? tx.amount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>

        {/* Editable Note Section (PATCH) */}
        <View style={styles.noteCard}>
          <View style={styles.noteHeader}>
            <Text style={styles.noteTitle}>Transaction Note</Text>
            {isEditingNote ? (
              <TouchableOpacity
                style={styles.noteActionBtn}
                onPress={handleSaveNote}
              >
                <Check size={15} color="#FFFFFF" />
                <Text style={styles.noteActionText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.noteEditBtn}
                onPress={() => setIsEditingNote(true)}
              >
                <Pencil size={14} color="#1A1A1A" />
                <Text style={styles.noteEditText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditingNote ? (
            <TextInput
              value={noteInput}
              onChangeText={setNoteInput}
              placeholder="Add a memo for this transaction..."
              placeholderTextColor="#8C8C8C"
              style={styles.noteInput}
              autoFocus
            />
          ) : (
            <Text style={styles.noteDisplay}>
              {tx.note ? tx.note : "No note attached."}
            </Text>
          )}
        </View>
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
    paddingBottom: 36,
    gap: 14,
  },
  missingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  missingText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#737373",
  },
  heroCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  badgeCredit: {
    backgroundColor: "rgba(22, 163, 74, 0.25)",
  },
  badgeDebit: {
    backgroundColor: "rgba(223, 90, 86, 0.25)",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  badgeTextCredit: {
    color: "#4ADE80",
  },
  badgeTextDebit: {
    color: "#FCA5A5",
  },
  heroAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  heroRecipient: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E5E5E5",
  },
  heroDate: {
    fontSize: 12,
    color: "#A3A3A3",
  },
  refCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  refLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#737373",
    letterSpacing: 0.6,
  },
  refValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1A1A1A",
    marginTop: 2,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  copyBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  detailsCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#737373",
  },
  rowValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  rowValueBold: {
    fontSize: 15,
    fontWeight: "800",
    color: "#DF5A56",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  noteCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    padding: 18,
    gap: 10,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  noteEditBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E5E5E5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  noteEditText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  noteActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DF5A56",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  noteActionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  noteInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#D4D4D4",
  },
  noteDisplay: {
    fontSize: 13,
    color: "#525252",
    fontStyle: "italic",
  },
});
