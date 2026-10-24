
"use client";

import { useState } from "react";

const initialAccounts = [
  { id: "myfin", name: "MyFin", currency: "EUR", opening: 1001 },
  { id: "kraken-eur", name: "Kraken EUR", currency: "EUR", opening: 0 },
  { id: "kraken-usdt", name: "Kraken USDT", currency: "USDT", opening: 748.18 },
  { id: "binance-usdt", name: "Binance USDT", currency: "USDT", opening: 0 },
  { id: "cash-dzd", name: "النقد الفعلي", currency: "DZD", opening: 58500 },
];

const fmt = (n) =>
  Number(n).toLocaleString("fr-FR", { maximumFractionDigits: 4 });

export default function Home() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState("buyEUR");
  const [amount, setAmount] = useState("");
  const [counter, setCounter] = useState("");
  const [note, setNote] = useState("");

  function balance(account) {
    return account.opening + transactions.reduce((sum, tx) => {
      if (tx.status !== "Completed") return sum;
      if (tx.from === account.id) sum -= tx.amount + tx.fee;
      if (tx.to === account.id) sum += tx.received;
      return sum;
    }, 0);
  }

  function addTransaction(e) {
    e.preventDefault();
    const qty = Number(amount);
    const received = Number(counter);
    if (!(qty > 0) || !(received >= 0)) {
      alert("أدخل مبالغ صحيحة.");
      return;
    }

    const tx = {
      id: crypto.randomUUID(),
      type,
      amount: qty,
      received,
      fee: 0,
      status: "Completed",
      date: new Date().toISOString(),
      note,
      from: "",
      to: "",
    };

    if (type === "buyEUR") {
      tx.from = "cash-dzd";
      tx.to = "myfin";
      tx.received = qty;
      tx.amount = received;
    } else if (type === "transfer") {
      tx.from = "myfin";
      tx.to = "kraken-eur";
    } else {
      alert("هذا النوع يحتاج إلى إعداد الحسابات قبل التسجيل.");
      return;
    }

    setTransactions((old) => [tx, ...old]);
    setAmount("");
    setCounter("");
    setNote("");
  }

  return (
    <main dir="rtl">
      <header>
        <p className="eyebrow">PERSONAL FINANCE</p>
        <h1>دفتر رأس المال والتداول</h1>
        <p>متابعة الأرصدة والمعاملات المالية</p>
      </header>

      <section className="cards">
        {accounts.map((account) => (
          <article className="card" key={account.id}>
            <span>{account.name}</span>
            <h2>{fmt(balance(account))}</h2>
            <small>{account.currency}</small>
          </article>
        ))}
      </section>

      <section className="panel">
        <h2>إضافة معاملة</h2>
        <form onSubmit={addTransaction}>
          <label>
            نوع العملية
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="buyEUR">شراء EUR بالدينار</option>
              <option value="transfer">تحويل MyFin إلى Kraken</option>
            </select>
          </label>

          <label>
            {type === "buyEUR" ? "مبلغ DZD المدفوع" : "مبلغ EUR المحول"}
            <input
              type="number"
              min="0.000001"
              step="any"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>

          {type === "buyEUR" && (
            <label>
              كمية EUR المشتراة
              <input
                type="number"
                min="0.000001"
                step="any"
                required
                value={counter}
                onChange={(e) => setCounter(e.target.value)}
              />
            </label>
          )}

          <label>
            ملاحظات
            <input value={note} onChange={(e) => setNote(e.target.value)} />
          </label>

          <button type="submit">تسجيل المعاملة</button>
        </form>
      </section>

      <section className="panel">
        <h2>آخر المعاملات</h2>
        {transactions.length === 0 ? (
          <p>لا توجد معاملات مسجلة.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>التاريخ</th><th>النوع</th><th>المبلغ</th><th>الحالة</th></tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.date).toLocaleDateString("ar-DZ")}</td>
                    <td>{tx.type === "buyEUR" ? "شراء EUR" : "تحويل"}</td>
                    <td>{fmt(tx.amount)}</td>
                    <td>{tx.status === "Completed" ? "مكتملة" : "معلقة"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <footer>نسخة أولية قيد التطوير — لا تعتمد عليها لحساب الأرباح الحقيقية.</footer>
    </main>
  );
}
