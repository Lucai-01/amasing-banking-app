import BankSelectSheet from "@/components/BankSelectSheet";

export default function DepositLocalBankRoute() {
  return (
    <BankSelectSheet
      title="Local Bank"
      banks={["GCash", "Maya", "BDO", "BPI", "ChinaBank", "UnionBank"]}
      targetPath="/deposit/amount"
    />
  );
}
