import BankSelectSheet from "@/components/BankSelectSheet";

export default function DepositInternationalBankRoute() {
  return (
    <BankSelectSheet
      title="International Bank"
      banks={["PayPal", "Western Union", "Wise"]}
      targetPath="/deposit/amount"
    />
  );
}
