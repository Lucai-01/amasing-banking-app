import { API_URL } from "@/config/api";
import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";

export const BankingContext = createContext(null);

export function BankingProvider({ children }) {
  const [user, setUser] = useState({
    id: 1,
    firstName: "User",
    fullName: "",
    email: "",
    address: "",
    idType: "National ID",
    idNumber: "",
    tier: "Verified Account",
    accountNumber: "9090 9123 4909",
    code: "AMAPH-2029",
    phone: "+63********3387",
    passcode: "",
    cardNumber: "4532 8910 3412 4909",
    cardExpiry: "08/29",
    cardCvv: "614",
    cardFrozen: false,
  });
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const fetchUserData = async (userId = user.id) => {
    try {
      const [userRes, txRes] = await Promise.all([
        fetch(`${API_URL}/users/${userId}`),
        fetch(`${API_URL}/transactions/${userId}`),
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser((prev) => ({
          ...prev,
          ...userData,
          phone: userData.maskedPhone || prev.phone,
        }));
        setBalance(userData.balance);
      }

      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData);
      }
    } catch (err) {
      console.log("FastAPI unreachable, using local state:", err.message);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserData(user.id);
    }
  }, [user?.id]);

  // UPDATE USER PROFILE / CARD FREEZE: PATCH /users/{id}
  const updateUserProfile = async (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));

    try {
      const res = await fetch(`${API_URL}/users/${user.id || 1}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser((prev) => ({
          ...prev,
          ...updatedUser,
          phone: updatedUser.maskedPhone || prev.phone,
        }));
      }
    } catch (err) {
      console.error("PATCH /users error:", err);
    }
  };

  // CREATE: POST /transactions
  const addTransaction = (tx) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })} at ${now.toTimeString().slice(0, 8)}`;

    const newTx = {
      id: String(Date.now()),
      userId: user.id || 1,
      referenceNo: `REF${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      date: formattedDate,
      from: user.fullName || "AMABank Account",
      bank: "AMABank",
      fee: 0.0,
      note: "",
      ...tx,
    };

    setTransactions((prev) => [newTx, ...prev]);
    if (tx.type === "credit") {
      setBalance((prev) => prev + Number(tx.amount));
    } else {
      const deduction = Number(tx.total ?? tx.amount);
      setBalance((prev) => Math.max(0, prev - deduction));
    }

    fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: newTx.id,
        userId: newTx.userId,
        status: newTx.status,
        recipient: newTx.recipient,
        accountRef: newTx.accountRef || "",
        amount: Number(newTx.amount),
        fee: Number(newTx.fee || 0),
        total: Number(newTx.total ?? newTx.amount),
        note: newTx.note || "",
        type: newTx.type,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.transaction) {
          setTransactions((prev) =>
            prev.map((item) =>
              item.id === newTx.id ? data.transaction : item,
            ),
          );
        }
        if (typeof data.balance === "number") {
          setBalance(data.balance);
        }
      })
      .catch((err) => console.error("POST /transactions error:", err));

    return newTx;
  };

  // UPDATE: PATCH /transactions/{id}
  const updateTransactionNote = (id, updatedNote) => {
    setTransactions((prev) =>
      prev.map((item) =>
        String(item.id) === String(id) ? { ...item, note: updatedNote } : item,
      ),
    );

    fetch(`${API_URL}/transactions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: updatedNote }),
    }).catch((err) => console.error("PATCH /transactions error:", err));
  };

  // DELETE: DELETE /transactions/{id}
  const deleteTransaction = (id, onSuccess) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to remove this receipt from your history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setTransactions((prev) =>
              prev.filter((item) => String(item.id) !== String(id)),
            );
            fetch(`${API_URL}/transactions/${id}`, {
              method: "DELETE",
            }).catch((err) =>
              console.error("DELETE /transactions error:", err),
            );

            if (onSuccess) onSuccess();
          },
        },
      ],
    );
  };

  return (
    <BankingContext.Provider
      value={{
        user,
        setUser,
        balance,
        setBalance,
        transactions,
        fetchUserData,
        updateUserProfile,
        addTransaction,
        updateTransactionNote,
        deleteTransaction,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
}
