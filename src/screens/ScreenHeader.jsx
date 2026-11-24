import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ScreenHeader({
  title,
  showBack = true,
  onBack,
  rightIcon = null,
  onRightPress,
}) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home");
    }
  };

  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#1A1A1A" strokeWidth={2.2} />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {rightIcon ? (
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onRightPress}
          activeOpacity={0.7}
        >
          {rightIcon}
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  spacer: {
    width: 38,
    height: 38,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginHorizontal: 8,
  },
});
