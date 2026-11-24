import BankSelectSheet from "@/components/BankSelectSheet";

export default function LocalBankTransferRoute() {
  return (
    <BankSelectSheet
      title="Local Bank"
      banks={["BDO", "BPI", "ChinaBank", "UnionBank", "Metrobank"]}
    />
  );
}
