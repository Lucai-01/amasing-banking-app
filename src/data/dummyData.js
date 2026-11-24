export const USER_PROFILE = {
  firstName: "FJ",
  fullName: "Fvienj Bennet Nopuente",
  tier: "Basic Account",
  accountNumber: "9090 9123 4909",
  code: "AMAPH-2029",
  phone: "+63********3387",
  passcode: "123456",
};

export const INITIAL_BALANCE = 124000;

export const LOCAL_BANKS = [
  { id: "1", name: "BDO", code: "BNORPHMM" },
  { id: "2", name: "BPI", code: "BOPIPHMM" },
  { id: "3", name: "ChinaBank", code: "CHBKPHMM" },
];

export const INTERNATIONAL_BANKS = [
  { id: "4", name: "PayPal", code: "PAYPAL" },
  { id: "5", name: "Western Union", code: "WU" },
  { id: "6", name: "Wise", code: "WISE" },
];

export const WITHDRAW_PARTNERS = [
  { id: "1", name: "Robinsons Supermarket" },
  { id: "2", name: "Shopwise" },
  { id: "3", name: "Spatio" },
];

export const LOAN_TERMS = [3, 6, 12, 24];

export const INITIAL_TRANSACTIONS = [
  {
    id: "1",
    status: "Paid",
    recipient: "PayPal",
    accountRef: "+44124354653GB",
    from: "Fvienj Bennet Nopuente",
    bank: "AMABank",
    amount: 1000,
    fee: 0.0,
    total: 1000,
    note: "",
    referenceNo: "REF676733467577",
    date: "November 11, 2026 at 21:32:57",
    type: "debit",
  },
];
