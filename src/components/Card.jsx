import { StyleSheet, View } from "react-native";

export default function Card({ children, variant = "dark", style }) {
  return (
    <View
      style={[
        styles.card,
        variant === "light" ? styles.lightCard : styles.darkCard,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 22,
    padding: 18,
  },
  darkCard: {
    backgroundColor: "#1E1E1E",
  },
  lightCard: {
    backgroundColor: "#FFFFFF",
    elevation: 6,
  },
});
