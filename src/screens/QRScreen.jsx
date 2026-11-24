import AppButton from "@/components/AppButton";
import ScreenHeader from "@/components/ScreenHeader";
import { BankingContext } from "@/context/BankingContext";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Camera as CameraIcon, Copy, ImagePlus } from "lucide-react-native";
import { useContext, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QRScreen() {
  const { user } = useContext(BankingContext);
  const [activeTab, setActiveTab] = useState("scan"); // 'scan' | 'myqr'
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [uploadedUri, setUploadedUri] = useState(null);

  const accountNumber = user.accountNumber || "9090 9123 4909";
  const accountHolder = user.fullName || "AMABank User";
  const qrPayload = `AMABANK|${accountHolder}|${accountNumber}`;

  const handleDecodedQR = (rawData) => {
    setScanned(true);

    // Parse "AMABANK|Name|Account" or any generic QR text
    let provider = "AMABank QR";
    let accountRef = rawData;

    if (rawData.startsWith("AMABANK|")) {
      const parts = rawData.split("|");
      provider = parts[1] || "AMABank User";
      accountRef = parts[2] || accountNumber;
    }

    Alert.alert(
      "QR Code Scanned",
      `Recipient: ${provider}\nAccount: ${accountRef}`,
      [
        {
          text: "Scan Again",
          style: "cancel",
          onPress: () => setScanned(false),
        },
        {
          text: "Send Money",
          onPress: () => {
            setScanned(false);
            router.replace({
              pathname: "/transfer/amount",
              params: {
                provider,
                accountRef,
                note: "QR Payment",
              },
            });
          },
        },
      ],
    );
  };

  const handlePickQRImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (result.canceled || !result.assets?.length) return;

    const imageUri = result.assets[0].uri;
    setUploadedUri(imageUri);

    try {
      if (Camera.scanFromURLAsync) {
        const results = await Camera.scanFromURLAsync(imageUri, ["qr"]);
        if (results && results.length > 0 && results[0].data) {
          handleDecodedQR(results[0].data);
          return;
        }
      }
      Alert.alert(
        "QR Image Loaded",
        "No embedded QR data was detected in this image, or proceed as a demo QR transfer?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Proceed to Transfer",
            onPress: () =>
              router.replace({
                pathname: "/transfer/amount",
                params: {
                  provider: "AMABank Merchant",
                  accountRef: "9090 8841 2201",
                  note: "Uploaded QR Payment",
                },
              }),
          },
        ],
      );
    } catch (err) {
      Alert.alert("Image Selected", "Proceed with this uploaded QR payment?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          onPress: () =>
            router.replace({
              pathname: "/transfer/amount",
              params: {
                provider: "AMABank Merchant",
                accountRef: "9090 8841 2201",
                note: "Uploaded QR Payment",
              },
            }),
        },
      ]);
    }
  };

  const handleCopyQRPayload = async () => {
    await Clipboard.setStringAsync(accountNumber);
    Alert.alert("Copied", `Account number (${accountNumber}) copied.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="QR Pay" />

      {/* Top Mode Switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabPill, activeTab === "scan" && styles.tabPillActive]}
          onPress={() => {
            setScanned(false);
            setActiveTab("scan");
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "scan" && styles.tabTextActive,
            ]}
          >
            Scan QR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabPill, activeTab === "myqr" && styles.tabPillActive]}
          onPress={() => setActiveTab("myqr")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "myqr" && styles.tabTextActive,
            ]}
          >
            My QR
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "scan" ? (
        <View style={styles.scanSection}>
          <View style={styles.cameraBox}>
            {!permission ? (
              <Text style={styles.camMsg}>Checking camera permissions...</Text>
            ) : !permission.granted ? (
              <View style={styles.permBox}>
                <CameraIcon size={36} color="#DF5A56" />
                <Text style={styles.permTitle}>Camera Access Needed</Text>
                <Text style={styles.permSub}>
                  Allow camera access to scan AMABank and InstaPay QR codes.
                </Text>
                <AppButton title="Enable Camera" onPress={requestPermission} />
              </View>
            ) : (
              <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={
                  scanned
                    ? undefined
                    : ({ data }) => {
                        if (data) handleDecodedQR(data);
                      }
                }
              >
                <View style={styles.overlay}>
                  <View style={styles.reticle} />
                  <Text style={styles.overlayHint}>
                    Align QR code inside the frame
                  </Text>
                </View>
              </CameraView>
            )}
          </View>

          {uploadedUri && (
            <View style={styles.previewRow}>
              <Image source={{ uri: uploadedUri }} style={styles.thumb} />
              <Text style={styles.previewText} numberOfLines={1}>
                Last uploaded QR image ready
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.uploadBtn}
            activeOpacity={0.85}
            onPress={handlePickQRImage}
          >
            <ImagePlus size={20} color="#FFFFFF" />
            <Text style={styles.uploadBtnText}>Upload QR from Gallery</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.myQrSection}>
          <View style={styles.qrCard}>
            <Text style={styles.qrBrand}>AMABank</Text>
            <Text style={styles.qrSub}>Scan to pay or transfer</Text>

            <View style={styles.qrFrame}>
              <QRCode
                value={qrPayload}
                size={195}
                color="#1A1A1A"
                backgroundColor="#FFFFFF"
              />
            </View>

            <Text style={styles.qrHolder}>{accountHolder}</Text>
            <Text style={styles.qrAcct}>{accountNumber}</Text>
          </View>

          <TouchableOpacity
            style={styles.copyBtn}
            onPress={handleCopyQRPayload}
          >
            <Copy size={18} color="#FFFFFF" />
            <Text style={styles.copyBtnText}>Copy Account Number</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 4,
    marginBottom: 18,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 13,
    alignItems: "center",
  },
  tabPillActive: {
    backgroundColor: "#1E1E1E",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#525252",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  scanSection: {
    flex: 1,
    justifyContent: "space-between",
    gap: 14,
  },
  cameraBox: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  camMsg: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  permBox: {
    padding: 24,
    alignItems: "center",
    gap: 10,
  },
  permTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  permSub: {
    color: "#A3A3A3",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.28)",
    gap: 16,
  },
  reticle: {
    width: 220,
    height: 220,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#DF5A56",
    backgroundColor: "transparent",
  },
  overlayHint: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 14,
  },
  thumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  previewText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#404040",
  },
  uploadBtn: {
    backgroundColor: "#1E1E1E",
    borderRadius: 26,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  uploadBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  myQrSection: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  qrCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 26,
    padding: 26,
    alignItems: "center",
    gap: 10,
  },
  qrBrand: {
    color: "#DF5A56",
    fontSize: 20,
    fontWeight: "800",
  },
  qrSub: {
    color: "#A3A3A3",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  qrFrame: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 20,
    marginVertical: 6,
  },
  qrHolder: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 6,
  },
  qrAcct: {
    color: "#D4D4D4",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
  },
  copyBtn: {
    backgroundColor: "#DF5A56",
    borderRadius: 26,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  copyBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
