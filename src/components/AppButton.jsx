import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function AppButton({
  title,
  children,
  variant = "dark",
  onPress,
  disabled = false,
  style,
  textStyle,
}) {
  const isLight = variant === "light";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        isLight ? styles.lightButton : styles.darkButton,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {children ? (
        children
      ) : (
        <Text
          style={[
            styles.text,
            isLight ? styles.lightText : styles.darkText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 54,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  darkButton: {
    backgroundColor: "#1A1A1A",
  },
  lightButton: {
    backgroundColor: "#FFFFFF",
  },
  disabledButton: {
    opacity: 0.45,
  },
  text: {
    fontSize: 17,
    fontWeight: "600",
  },
  darkText: {
    color: "#FFFFFF",
  },
  lightText: {
    color: "#1A1A1A",
  },
});
