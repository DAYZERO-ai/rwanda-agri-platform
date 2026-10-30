import { useMemo, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  CaretRight,
  ChartBar,
  Check,
  CurrencyCircleDollar,
  MagnifyingGlass,
  Megaphone,
  PencilSimple,
  Play,
  Plant,
  Plus,
  Trash,
  Users,
  X,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CROPS, DISTRICTS, MARKETS } from "@/data/mockData";
import AdminInputsManager from "@/components/AdminInputsManager";
import { useApp } from "@/context/AppContext";
import type { Farmer, Guide } from "@/types";

type AdminTab = "overview" | "farmers" | "payments" | "publisher" | "content" | "inputs" | "broadcast";

const rwf = (n: number) => `${Math.round(n).toLocaleString()} RWF`;
const today = () => new Date().toISOString().slice(0, 10);

export default function AdminPortal() {
  const { t, adminName, farmers, payments, prices, records } = useApp();
  const [tab, setTab] = useState<AdminTab>("overview");

  const revenue = useMemo(
    () => records.filter((r) => r.type === "income").reduce((s, r) => s + r.amount, 0),
    [records],
  );
  const approved = farmers.filter((f) => f.status === "approved").length;
  const pending = payments.filter((p) => p.status === "pending").length;

  const tabs: { id: AdminTab; label: string }[] = [
    { id: "overview", label: t("adm.analytics") },
    { id: "farmers", label: t("adm.farmerMgmt") },
    { id: "payments", label: t("adm.verify") },
    { id: "publisher", label: t("adm.publisher") },
    { id: "content", label: t("adm.content") },
  { id: "inputs", label: t("adm.inputs") },
    { id: "broadcast", label: t("adm.broadcast") },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{t("adm.title")}</p>
          <h1 className="text-3xl font-bold tracking-tight">{adminName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="gap-1.5 bg-amber-500/15 text-amber-700 dark:text-amber-400">
            <Megaphone size={13} weight="bold" />
            {t("nav.adminRole")}
          </Badge>
          {pending > 0 && (
            <Badge className="gap-1.5 bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <Bell size={13} weight="bold" />
              {pending} · {t("adm.pendingPayments")}
            </Badge>
          )}
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label={t("adm.farmers")} value={String(farmers.length)} icon={Users} />
        <Stat label={t("adm.activeSubs")} value={String(approved)} icon={Check} />
        <Stat label={t("adm.revenue")} value={rwf(revenue)} icon={CurrencyCircleDollar} />
        <Stat label={t("adm.reports")} value={String(prices.length)} icon={ChartBar} />
      </div>

      <div className="mt-7 flex flex-wrap gap-2 border-b pb-3">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
              tab === item.id
                ? "bg-emerald-700 text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-7">
        {tab === "overview" && <Analytics />}
        {tab === "farmers" && <FarmerMgmt />}
        {tab === "payments" && <PaymentVerification />}
        {tab === "publisher" && <PricePublisher />}
        {tab === "content" && <ContentManager />}
        {tab === "inputs" && <AdminInputsManager />}
        {tab === "broadcast" && <BroadcastPanel />}
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Users }) {
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
            <Icon size={19} weight="bold" className="text-emerald-700 dark:text-emerald-400" />
          </div>
          <p className="mt-3 text-2xl font-bold">{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Analytics() {
  const { t, records, farmers, cropName, prices } = useApp();

  const byDistrict = useMemo(() => {
    const map = new Map<string, number>();
    records
      .filter((r) => r.type === "income")
      .forEach((r) => {
        const district = farmers.find((f) => f.id === r.farmerId)?.district ?? "Other";
        map.set(district, (map.get(district) ?? 0) + r.amount);
      });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [records, farmers]);

  const byCrop = useMemo(() => {
    const map = new Map<string, number>();
    prices.forEach((p) => map.set(p.cropId, Math.max(map.get(p.cropId) ?? 0, p.retail)));
    return Array.from(map.entries())
      .map(([cropId, retail]) => ({ cropId, retail }))
      .sort((a, b) => b.retail - a.retail)
      .slice(0, 5);
  }, [prices]);

  const max = byDistrict[0]?.[1] ?? 1;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("adm.revenue")} · {t("common.district")}
          </h2>
          <ul className="mt-5 space-y-4">
            {byDistrict.map(([district, amount]) => (
              <li key={district}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{district}</span>
                  <span className="text-muted-foreground">{rwf(amount)}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-500"
                    style={{ width: `${Math.max(6, (amount / max) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("mkt.retail")} · {t("common.crop")}
          </h2>
          <ul className="mt-5 divide-y">
            {byCrop.map((row) => (
              <li key={row.cropId} className="flex items-center justify-between py-3 text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: CROPS.find((c) => c.id === row.cropId)?.color }}
                  />
                  {cropName(row.cropId)}
                </span>
                <span className="font-semibold">{row.retail.toLocaleString()} RWF/kg</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">{t("landing.footer")}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function FarmerMgmt() {
  const { t, farmers, cropName, setFarmerStatus, addFarmer, updateFarmer, deleteFarmer, grantSubscription } =
    useApp();
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Farmer | null>(null);
  const rows = farmers.filter(
    (f) =>
      f.fullName.toLowerCase().includes(q.toLowerCase()) ||
      f.district.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <MagnifyingGlass size={16} className="absolute left-3 top-3 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder={t("common.search")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Button size="sm" className="gap-1.5 bg-emerald-700 hover:bg-emerald-800" onClick={() => setAddOpen(true)}>
          <Plus size={15} weight="bold" />
          {t("adm.addFarmer")}
        </Button>
      </div>

      <FarmerDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={(data) => addFarmer({ ...data, status: "approved" })}
      />
      <FarmerDialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        farmer={editing ?? undefined}
        onSave={(data) => {
          if (editing) updateFarmer({ ...editing, ...data });
          setEditing(null);
        }}
      />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">{t("common.name")}</th>
                <th className="px-4 py-3">{t("common.district")}</th>
                <th className="px-4 py-3">{t("common.crop")}</th>
                <th className="px-4 py-3">{t("common.phone")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
                <th className="px-4 py-3 text-right">{t("common.filter")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    {t("common.noData")}
                  </td>
                </tr>
              ) : (
                rows.map((f) => (
                  <tr key={f.id} className="hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <span className="block font-medium">{f.fullName}</span>
                      <span className="block text-xs text-muted-foreground">{f.email}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {f.district} · {f.sector}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{cropName(f.cropId)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{f.phone}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          f.status === "approved"
                            ? "bg-emerald-700/10 text-emerald-800 dark:text-emerald-400"
                            : f.status === "pending"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                              : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                        }
                      >
                        {t(
                          f.status === "approved"
                            ? "adm.approve"
                            : f.status === "pending"
                              ? "sub.pending"
                              : "adm.reject",
                        )}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {f.status !== "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => setFarmerStatus(f.id, "approved")}
                          >
                            <Check size={14} weight="bold" />
                            {t("adm.approve")}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          onClick={() => grantSubscription(f.id, f.fullName)}
                        >
                          <CurrencyCircleDollar size={14} weight="bold" />
                          {t("adm.grantSub")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1.5"
                          onClick={() => setEditing(f)}
                        >
                          <PencilSimple size={14} weight="bold" />
                          {t("common.edit")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1.5 text-destructive hover:text-destructive"
                          onClick={() => deleteFarmer(f.id)}
                        >
                          <Trash size={14} weight="bold" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function PaymentVerification() {
  const { t, payments, decidePayment } = useApp();
  const ordered = [...payments].sort((a, b) => (a.status === "pending" ? -1 : b.status === "pending" ? 1 : 0));

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">{t("common.name")}</th>
              <th className="px-4 py-3">{t("sub.pay")}</th>
              <th className="px-4 py-3">{t("adm.txn")}</th>
              <th className="px-4 py-3 text-right">{t("common.amount")}</th>
              <th className="px-4 py-3">{t("common.status")}</th>
              <th className="px-4 py-3 text-right">{t("common.view")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {ordered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  {t("common.noData")}
                </td>
              </tr>
            ) : (
              ordered.map((p) => (
                <tr key={p.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <span className="block font-medium">{p.farmerName}</span>
                    <span className="block text-xs text-muted-foreground">{p.submitted}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.method === "momo" ? t("sub.momo") : t("sub.airtel")}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.txnId}</td>
                  <td className="px-4 py-3 text-right font-semibold">{rwf(p.amount)}</td>
                  <td className="px-4 py-3">
                    <Badge
                      className={
                        p.status === "approved"
                          ? "bg-emerald-700/10 text-emerald-800 dark:text-emerald-400"
                          : p.status === "pending"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                            : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      }
                    >
                      {t(
                        p.status === "approved"
                          ? "sub.active"
                          : p.status === "pending"
                            ? "sub.pending"
                            : "sub.expired",
                      )}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="gap-1.5 bg-emerald-700 hover:bg-emerald-800"
                        disabled={p.status === "approved"}
                        onClick={() => decidePayment(p.id, "approved")}
                      >
                        <Check size={14} weight="bold" />
                        {t("adm.approve")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-destructive"
                        disabled={p.status === "rejected"}
                        onClick={() => decidePayment(p.id, "rejected")}
                      >
                        <X size={14} weight="bold" />
                        {t("adm.reject")}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function PricePublisher() {
  const { t, prices, cropName, publishPrice, deletePrice } = useApp();
  const [cropId, setCropId] = useState(CROPS[0].id);
  const [district, setDistrict] = useState(DISTRICTS[0] as string);
  const [retail, setRetail] = useState("");
  const [wholesale, setWholesale] = useState("");
  const [error, setError] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const r = Number(retail) || 0;
    const w = Number(wholesale) || Math.round(r * 0.86);
    if (r <= 0) {
      setError(t("auth.errFields"));
      return;
    }
    setError("");
    const id = `mp-${cropId}-${district.toLowerCase()}`;
    const existing = prices.find((p) => p.id === id);
    publishPrice({
      id,
      cropId,
      district,
      market: MARKETS[district] ?? district,
      retail: r,
      wholesale: w,
      previous: existing?.retail ?? r,
      unit: "RWF/kg",
      date: today(),
      published: true,
    });
    setRetail("");
    setWholesale("");
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("adm.publisher")}
          </h2>
          <form onSubmit={submit} className="mt-4 space-y-4">
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
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("common.district")}</Label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t("mkt.retail")}</Label>
                <Input value={retail} onChange={(e) => setRetail(e.target.value)} inputMode="numeric" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t("mkt.wholesale")}</Label>
                <Input
                  value={wholesale}
                  onChange={(e) => setWholesale(e.target.value)}
                  inputMode="numeric"
                />
              </div>
            </div>
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full gap-2 bg-emerald-700 hover:bg-emerald-800">
              <Plus size={16} weight="bold" />
              {t("adm.publish")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="max-h-[26rem] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted/80 text-left text-xs uppercase tracking-wide text-muted-foreground backdrop-blur">
              <tr>
                <th className="px-4 py-3">{t("common.crop")}</th>
                <th className="px-4 py-3">{t("common.district")}</th>
                <th className="px-4 py-3 text-right">{t("mkt.retail")}</th>
                <th className="px-4 py-3 text-right">{t("mkt.wholesale")}</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {prices.slice(0, 40).map((p) => (
                <tr key={p.id} className="hover:bg-muted/40">
                  <td className="px-4 py-2.5 font-medium">{cropName(p.cropId)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{p.district}</td>
                  <td className="px-4 py-2.5 text-right">{p.retail.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">
                    {p.wholesale.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 gap-1.5 text-destructive hover:text-destructive"
                      onClick={() => deletePrice(p.id)}
                    >
                      <Trash size={14} weight="bold" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ContentManager() {
  const { t, guides, cropName, addGuide } = useApp();
  const [title, setTitle] = useState("");
  const [titleRw, setTitleRw] = useState("");
  const [cropId, setCropId] = useState(CROPS[0].id);
  const [summary, setSummary] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [wallpaperUrl, setWallpaperUrl] = useState("");
  const [error, setError] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !titleRw.trim()) {
      setError(t("auth.errFields"));
      return;
    }
    setError("");
    addGuide({
      id: `g-${Date.now()}`,
      cropId,
      title: title.trim(),
      titleRw: titleRw.trim(),
      summary: summary.trim() || t("lrn.guides"),
      summaryRw: summary.trim() || t("lrn.guides"),
      season: t("lrn.season"),
      duration: "6 min",
      video: "demo",
      youtubeUrl: youtubeUrl.trim() || undefined,
      wallpaperUrl: wallpaperUrl.trim() || undefined,
      steps: [],
    });
    setTitle("");
    setTitleRw("");
    setSummary("");
    setYoutubeUrl("");
    setWallpaperUrl("");
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("adm.addGuide")}
          </h2>
          <form onSubmit={submit} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Title (EN)</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Umutwe (RW)</Label>
              <Input value={titleRw} onChange={(e) => setTitleRw(e.target.value)} />
            </div>
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
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("common.notes")}</Label>
              <Input value={summary} onChange={(e) => setSummary(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">YouTube video link</Label>
              <Input
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Wallpaper image URL</Label>
              <Input
                value={wallpaperUrl}
                onChange={(e) => setWallpaperUrl(e.target.value)}
                placeholder="https://.../crop-wallpaper.webp"
              />
            </div>
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full gap-2 bg-emerald-700 hover:bg-emerald-800">
              <Plus size={16} weight="bold" />
              {t("adm.addGuide")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("adm.content")}
          </h2>
          <ul className="mt-4 divide-y">
            {guides.map((g) => (
              <li key={g.id} className="flex items-center justify-between py-3 text-sm">
                <span>
                  <span className="block font-medium">{g.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {cropName(g.cropId)} · {g.duration}
                  </span>
                </span>
                <Badge variant="secondary" className="gap-1.5">
                  <BookOpen size={12} weight="bold" />
                  {t("lrn.guides")}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

type FarmerForm = {
  fullName: string;
  email: string;
  phone: string;
  district: string;
  sector: string;
  cropId: string;
  password?: string;
};

function FarmerDialog({
  open,
  onOpenChange,
  farmer,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  farmer?: Farmer;
  onSave: (data: FarmerForm) => void;
}) {
  const { t } = useApp();
  const [form, setForm] = useState<FarmerForm>({
    fullName: "",
    email: "",
    phone: "",
    district: DISTRICTS[0] as string,
    sector: "",
    cropId: CROPS[0].id,
    password: "",
  });
  const [error, setError] = useState("");

  // Sync form when opening for a specific farmer.
  const key = farmer?.id ?? "new";
  useMemo(() => {
    setForm(
      farmer
        ? {
            fullName: farmer.fullName,
            email: farmer.email,
            phone: farmer.phone,
            district: farmer.district,
            sector: farmer.sector,
            cropId: farmer.cropId,
            password: "",
          }
        : {
            fullName: "",
            email: "",
            phone: "",
            district: DISTRICTS[0] as string,
            sector: "",
            cropId: CROPS[0].id,
            password: "",
          },
    );
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, open]);

  const set = <K extends keyof FarmerForm>(k: K, v: FarmerForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim()) {
      setError(t("auth.errFields"));
      return;
    }
    onSave({ ...form, password: form.password?.trim() || undefined });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{farmer ? t("adm.editFarmer") : t("adm.addFarmer")}</DialogTitle>
          <DialogDescription>{t("adm.farmerMgmt")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t("common.name")}</Label>
            <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("common.email")}</Label>
              <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("common.phone")}</Label>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("common.district")}</Label>
              <select
                value={form.district}
                onChange={(e) => set("district", e.target.value)}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("common.sector")}</Label>
              <Input value={form.sector} onChange={(e) => set("sector", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t("common.crop")}</Label>
            <select
              value={form.cropId}
              onChange={(e) => set("cropId", e.target.value)}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              {CROPS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-xs font-medium text-destructive">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" className="gap-2 bg-emerald-700 hover:bg-emerald-800">
              <Check size={16} weight="bold" />
              {t("adm.saveFarmer")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BroadcastPanel() {
  const { t, sendBroadcast, notifications } = useApp();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    sendBroadcast(title.trim(), body.trim(), "info");
    setTitle("");
    setBody("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
      <Card>
        <CardContent className="p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Megaphone size={15} weight="bold" />
            {t("adm.broadcast")}
          </h2>
          <form onSubmit={submit} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("adm.broadcastTitle")}</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("adm.broadcastBody")}</Label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            {sent && <p className="text-xs font-medium text-emerald-700">{t("toast.saved")}</p>}
            <Button type="submit" className="w-full gap-2 bg-emerald-700 hover:bg-emerald-800">
              <Megaphone size={16} weight="bold" />
              {t("adm.sendNotice")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("nav.notifications")}
          </h2>
          <ul className="mt-4 divide-y">
            {notifications.length === 0 ? (
              <li className="py-6 text-center text-sm text-muted-foreground">{t("common.noData")}</li>
            ) : (
              notifications.slice(0, 8).map((n) => (
                <li key={n.id} className="flex items-start gap-3 py-3">
                  <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-700">
                    <Bell size={13} weight="bold" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{n.titleKey}</span>
                    <span className="block text-xs text-muted-foreground">{n.bodyKey}</span>
                  </span>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export function LearningSection() {
  const { t, lang, cropName, guides, addGuide, deleteGuide } = useApp();
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<Guide | null>(null);
  const rows = guides.filter((g) => filter === "all" || g.cropId === filter);

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("lrn.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("lrn.guides")}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            addGuide({
              id: `g-${Date.now()}`,
              cropId: filter === "all" ? CROPS[0].id : filter,
              title: "Saved guide",
              titleRw: "Inama yabitswe",
              summary: t("lrn.videoNote"),
              summaryRw: t("lrn.videoNote"),
              season: t("lrn.season"),
              duration: "5 min",
              video: "demo",
              steps: [],
            })
          }
        >
          <Plus size={14} weight="bold" />
          {t("common.save")}
        </Button>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
            filter === "all" ? "border-emerald-700 bg-emerald-700 text-white" : "hover:bg-muted"
          }`}
        >
          {t("common.all")}
        </button>
        {CROPS.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              filter === c.id ? "border-emerald-700 bg-emerald-700 text-white" : "hover:bg-muted"
            }`}
          >
            {cropName(c.id)}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
          >
            <Card className="flex h-full flex-col overflow-hidden">
              {g.wallpaperUrl ? (
                <div className="relative aspect-video w-full overflow-hidden">
                  <img src={g.wallpaperUrl} alt="" className="absolute inset-0 size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 to-transparent" />
                  <span className="absolute bottom-2 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-0.5 text-[11px] font-semibold text-white">
                    <Play size={11} weight="fill" />
                    {g.duration}
                  </span>
                </div>
              ) : null}
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="gap-1.5">
                    <Plant size={13} weight="bold" />
                    {cropName(g.cropId)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{g.duration}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold">{lang === "rw" ? g.titleRw : g.title}</h3>
                <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                  {lang === "rw" ? g.summaryRw : g.summary}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => setActive(g)}>
                    <Play size={14} weight="fill" />
                    {t("lrn.watch")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-destructive hover:text-destructive"
                    onClick={() => deleteGuide(g.id)}
                  >
                    <Trash size={14} weight="bold" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{active ? (lang === "rw" ? active.titleRw : active.title) : ""}</DialogTitle>
            <DialogDescription>{t("lrn.videoNote")}</DialogDescription>
          </DialogHeader>
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-900 to-emerald-700">
            {active?.youtubeUrl ? (
              <iframe
                src={active.youtubeUrl}
                title={active.title}
                className="absolute inset-0 size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                {active?.wallpaperUrl ? (
                  <img
                    src={active.wallpaperUrl}
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-50"
                  />
                ) : null}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(229,169,60,0.35),transparent)]" />
                <div className="relative text-center text-white">
                  <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-white/15">
                    <Play size={30} weight="fill" />
                  </span>
                  <p className="mt-3 text-sm font-medium">{t("lrn.duration")}: {active?.duration}</p>
                </div>
              </>
            )}
          </div>
          {active && active.steps.length > 0 && (
            <div>
              <p className="text-sm font-semibold">{t("lrn.steps")}</p>
              <ol className="mt-2 space-y-2">
                {active.steps.map((s, i) => (
                  <li key={s.en} className="flex gap-3 text-sm">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-[11px] font-bold text-white">
                      {i + 1}
                    </span>
                    {lang === "rw" ? s.rw : s.en}
                  </li>
                ))}
              </ol>
            </div>
          )}
          <div className="flex items-center justify-between border-t pt-4">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <CaretRight size={13} weight="bold" />
              {t("landing.trust")}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                addGuide({
                  id: `g-${Date.now()}`,
                  cropId: active?.cropId ?? CROPS[0].id,
                  title: active?.title ?? "Guide",
                  titleRw: active?.titleRw ?? "Inama",
                  summary: active?.summary ?? "",
                  summaryRw: active?.summaryRw ?? "",
                  season: active?.season ?? "",
                  duration: active?.duration ?? "",
                  video: "demo",
                  steps: [],
                });
                setActive(null);
              }}
            >
              <Plus size={14} weight="bold" />
              {t("common.save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}