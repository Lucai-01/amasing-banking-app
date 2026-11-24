import { StyleSheet, TextInput } from "react-native";

export default function AppInput({
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  style,
  ...rest
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9A9A9A"
      keyboardType={keyboardType}
      style={[styles.input, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderBottomWidth: 1.5,
    borderBottomColor: "#2B2B2B",
    paddingVertical: 10,
    fontSize: 16,
    color: "#1A1A1A",
    textAlign: "center",
  },
});
