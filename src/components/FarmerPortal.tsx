import { useMemo, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ChartBar,
  CurrencyCircleDollar,
  DownloadSimple,
  Leaf,
  Notepad,
  Plant,
  Plus,
  Printer,
  Trash,
  TrendDown,
  TrendUp,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BillingSection, MarketSection, WeatherSection } from "@/components/FarmerSections";
import { LearningSection } from "@/components/AdminPortal";
import InputsCalculator from "@/components/InputsCalculator";
import { CATEGORIES, CROPS, SECTORS } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import type { FarmRecord } from "@/types";

export type PortalTab =
  | "overview"
  | "books"
  | "market"
  | "inputs"
  | "weather"
  | "learn"
  | "billing";

const rwf = (n: number) => `${Math.round(n).toLocaleString()} RWF`;

export default function FarmerPortal({ tab }: { tab: PortalTab }) {
  const { currentFarmer, records, t, cropName } = useApp();
  const district = currentFarmer?.district ?? "Musanze";

  const mine = useMemo(
    () => (currentFarmer ? records.filter((r) => r.farmerId === currentFarmer.id) : []),
    [records, currentFarmer],
  );
  const totals = useMemo(() => {
    const income = mine.filter((r) => r.type === "income").reduce((s, r) => s + r.amount, 0);
    const expense = mine.filter((r) => r.type === "expense").reduce((s, r) => s + r.amount, 0);
    const profit = income - expense;
    return { income, expense, profit, margin: income > 0 ? Math.round((profit / income) * 100) : 0 };
  }, [mine]);

  if (!currentFarmer) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <Card>
          <CardContent className="p-12">
            <p className="text-sm font-semibold">{t("auth.loginTitle")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("auth.haveAccount")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{t("farmer.welcome")}</p>
          <h1 className="text-3xl font-bold tracking-tight">{currentFarmer.fullName}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {district} · {currentFarmer.sector} · {(SECTORS[district] ?? [""])[0]}
            <Badge variant="secondary" className="gap-1.5">
              <Leaf size={12} weight="bold" />
              {t("nav.farmer")}
            </Badge>
          </p>
        </div>
        <Badge
          className={
            currentFarmer.status === "approved"
              ? "bg-emerald-700/10 text-emerald-800 dark:text-emerald-400"
              : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
          }
        >
          {currentFarmer.status === "approved" ? t("sub.active") : t("sub.pending")}
        </Badge>
      </header>

      {tab === "overview" && (
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat
              label={t("farmer.income")}
              value={rwf(totals.income)}
              icon={ArrowUp}
              tone="text-emerald-700 dark:text-emerald-400"
            />
            <Stat
              label={t("farmer.expense")}
              value={rwf(totals.expense)}
              icon={ArrowDown}
              tone="text-rose-600 dark:text-rose-400"
            />
            <Stat
              label={t("farmer.profit")}
              value={rwf(totals.profit)}
              icon={CurrencyCircleDollar}
              tone="text-amber-600 dark:text-amber-400"
            />
            <Stat
              label={t("farmer.margin")}
              value={`${totals.margin}%`}
              icon={ChartBar}
              tone="text-sky-600 dark:text-sky-400"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("farmer.recent")}
                </h2>
                <ul className="mt-4 divide-y">
                  {mine.length === 0 && (
                    <li className="py-8 text-center text-sm text-muted-foreground">{t("common.noData")}</li>
                  )}
                  {mine.slice(0, 6).map((r) => (
                    <li key={r.id} className="flex items-center justify-between py-3">
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex size-9 items-center justify-center rounded-lg ${
                            r.type === "income"
                              ? "bg-emerald-700/10 text-emerald-700 dark:text-emerald-400"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {r.type === "income" ? (
                            <TrendUp size={17} weight="bold" />
                          ) : (
                            <TrendDown size={17} weight="bold" />
                          )}
                        </span>
                        <span>
                          <span className="block text-sm font-medium">{cropName(r.cropId)}</span>
                          <span className="block text-xs text-muted-foreground">
                            {r.date} · {r.party}
                          </span>
                        </span>
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          r.type === "income"
                            ? "text-emerald-700 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {r.type === "income" ? "+" : "−"}
                        {rwf(r.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="space-y-5">
              <Card className="border-emerald-800/20 bg-emerald-700/5">
                <CardContent className="flex items-start gap-3 p-6">
                  <Plant size={22} weight="bold" className="mt-0.5 text-emerald-700 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm font-semibold">{t("farmer.seasonTip")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t("wth.a3")}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {tab === "books" && <Bookkeeping />}
      {tab === "inputs" && <InputsCalculator />}
      {tab === "market" && <MarketSection district={district} />}
      {tab === "weather" && <WeatherSection district={district} />}
      {tab === "learn" && <LearningSection />}
      {tab === "billing" && <BillingSection />}
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof Plant;
  tone: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <Icon size={19} weight="bold" className={tone} />
          </div>
          <p className="mt-3 text-2xl font-bold">{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Bookkeeping() {
  const { t, records, currentFarmer, cropName, addRecord, deleteRecord } = useApp();
  const [type, setType] = useState<FarmRecord["type"]>("income");
  const [cropId, setCropId] = useState(currentFarmer?.cropId ?? CROPS[0].id);
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0] as string);
  const [party, setParty] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [filterType, setFilterType] = useState<"all" | FarmRecord["type"]>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");

  const mine = records.filter((r) => r.farmerId === currentFarmer?.id);
  const rows = mine.filter(
    (r) =>
      (filterType === "all" || r.type === filterType) &&
      (!from || r.date >= from) &&
      (!to || r.date <= to),
  );
  const balance = rows.reduce((s, r) => s + (r.type === "income" ? r.amount : -r.amount), 0);

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = Number(quantity) || 0;
    const price = Number(unitPrice) || 0;
    const amount = q > 0 && price > 0 ? q * price : price || q;
    if (!amount || !party.trim()) {
      setError(t("auth.errFields"));
      return;
    }
    setError("");
    addRecord({
      type,
      cropId,
      quantity: q,
      unitPrice: price,
      amount,
      category: type === "expense" ? category : "",
      party: party.trim(),
      notes,
      date,
    });
    setQuantity("");
    setUnitPrice("");
    setParty("");
    setNotes("");
  }

  function exportCsv() {
    const head = ["date", "type", "crop", "quantity", "unit_price", "amount", "category", "party", "notes"];
    const body = rows.map((r) =>
      [r.date, r.type, cropName(r.cropId), r.quantity, r.unitPrice, r.amount, r.category, r.party, r.notes]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[head.join(","), ...body].join(String.fromCharCode(10))], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rwanda-agri-records-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">{t("book.title")}</h2>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.6fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-2">
              {(["income", "expense"] as FarmRecord["type"][]).map((v) => (
                <button
                  key={v}
                  onClick={() => setType(v)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    type === v ? "border-emerald-700 bg-emerald-700 text-white" : "hover:bg-muted"
                  }`}
                >
                  {t(v === "income" ? "book.incomeType" : "book.expenseType")}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t("common.crop")}</Label>
                <select
                  value={cropId}
                  onChange={(e) => setCropId(e.target.value)}
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                >
                  {CROPS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {cropName(c.id)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{t("common.quantity")}</Label>
                  <Input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    inputMode="numeric"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{t("mkt.priceKg")}</Label>
                  <Input
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    inputMode="numeric"
                    placeholder="0"
                  />
                </div>
              </div>

              {type === "expense" && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{t("book.category")}</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {t(c)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t("book.party")}</Label>
                <Input
                  value={party}
                  onChange={(e) => setParty(e.target.value)}
                  placeholder="Musanze cooperative"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{t("common.date")}</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{t("common.notes")}</Label>
                  <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>

              {error && <p className="text-xs font-medium text-destructive">{error}</p>}

              <Button type="submit" className="w-full gap-2 bg-emerald-700 hover:bg-emerald-800">
                <Plus size={16} weight="bold" />
                {t(type === "income" ? "book.addIncome" : "book.addExpense")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="flex flex-wrap items-end gap-3 p-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t("book.type")}</Label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as "all" | FarmRecord["type"])}
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="all">{t("common.all")}</option>
                  <option value="income">{t("book.incomeType")}</option>
                  <option value="expense">{t("book.expenseType")}</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t("book.from")}</Label>
                <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t("book.to")}</Label>
                <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40" />
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={exportCsv}>
                  <DownloadSimple size={15} weight="bold" />
                  {t("book.exportCsv")}
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
                  <Printer size={15} weight="bold" />
                  {t("book.print")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3">
              <span className="text-sm font-semibold">{t("common.total")}</span>
              <span
                className={`text-sm font-bold ${
                  balance >= 0
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {rwf(balance)}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5">{t("common.date")}</th>
                    <th className="px-4 py-2.5">{t("common.crop")}</th>
                    <th className="px-4 py-2.5">{t("book.party")}</th>
                    <th className="px-4 py-2.5 text-right">{t("common.amount")}</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                        <Notepad size={22} className="mx-auto mb-2" />
                        {t("common.noData")}
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/40">
                        <td className="px-4 py-2.5 text-muted-foreground">{r.date}</td>
                        <td className="px-4 py-2.5 font-medium">{cropName(r.cropId)}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{r.party}</td>
                        <td
                          className={`px-4 py-2.5 text-right font-semibold ${
                            r.type === "income"
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {r.type === "income" ? "+" : "−"}
                          {rwf(r.amount)}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <button
                            onClick={() => deleteRecord(r.id)}
                            aria-label={t("common.delete")}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash size={15} weight="bold" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}