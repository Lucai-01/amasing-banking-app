import { BankingProvider } from "@/context/BankingContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

const SLIDE_UP_OPTIONS = {
  animation: "slide_from_bottom",
  gestureEnabled: true,
};

const POPUP_OPTIONS = {
  animation: "fade_from_bottom",
  gestureEnabled: true,
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <BankingProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          {/* Auth & KYC Onboarding Flow */}
          <Stack.Screen name="index" />
          <Stack.Screen name="register" />
          <Stack.Screen name="otp" />
          <Stack.Screen name="kyc" />
          <Stack.Screen name="passcode" />

          {/* Main Bottom Dock Tabs */}
          <Stack.Screen name="home" options={{ animation: "fade" }} />
          <Stack.Screen name="transactions" options={{ animation: "fade" }} />
          <Stack.Screen name="cards" options={{ animation: "fade" }} />
          <Stack.Screen name="profile" options={{ animation: "fade" }} />

          {/* Initial Action Sheets (Bottom-to-Top) */}
          <Stack.Screen name="qr" options={SLIDE_UP_OPTIONS} />
          <Stack.Screen name="deposit/index" options={SLIDE_UP_OPTIONS} />
          <Stack.Screen name="transfer/index" options={SLIDE_UP_OPTIONS} />
          <Stack.Screen name="withdraw/index" options={SLIDE_UP_OPTIONS} />
          <Stack.Screen name="loan/index" options={SLIDE_UP_OPTIONS} />

          {/* Sub-Screens (Standard Horizontal slide_from_right Push) */}
          <Stack.Screen name="deposit/local" />
          <Stack.Screen name="deposit/international" />
          <Stack.Screen name="deposit/amount" />

          <Stack.Screen name="transfer/local" />
          <Stack.Screen name="transfer/international" />
          <Stack.Screen name="transfer/recipient" />
          <Stack.Screen name="transfer/amount" />

          <Stack.Screen name="withdraw/partner" />

          {/* Receipts & Confirmation Popups */}
          <Stack.Screen name="transfer/success" options={POPUP_OPTIONS} />
          <Stack.Screen name="loan/success" options={POPUP_OPTIONS} />
          <Stack.Screen name="details/[id]" options={POPUP_OPTIONS} />
        </Stack>
      </BankingProvider>
    </SafeAreaProvider>
  );
}
