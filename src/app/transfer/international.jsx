import BankSelectSheet from "@/components/BankSelectSheet";

export default function InternationalBankTransferRoute() {
  return (
    <BankSelectSheet
      title="International Bank"
      banks={["PayPal", "Western Union", "Wise"]}
    />
  );
}
