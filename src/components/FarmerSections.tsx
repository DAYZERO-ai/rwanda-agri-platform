import { useMemo, useState, type FormEvent } from "react";
import {
  Bell,
  CalendarBlank,
  CaretRight,
  CheckCircle,
  CloudRain,
  CloudSun,
  Drop,
  MagnifyingGlass,
  Minus,
  Receipt,
  Sun,
  Thermometer,
  TrendDown,
  TrendUp,
  Wallet,
  Wind,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CROPS, DISTRICTS, MARKETS, passwordForPhone } from "@/data/mockData";
import { PLAN_AMOUNT, useApp } from "@/context/AppContext";
import type { MarketPrice, WeatherKind } from "@/types";

type Trend = "rising" | "stable" | "falling";

const TREND_META: Record<Trend, { key: string; tip: string; tone: string }> = {
  rising: { key: "mkt.rising", tip: "mkt.tip1", tone: "text-emerald-700 dark:text-emerald-400" },
  stable: { key: "mkt.stable", tip: "mkt.tip2", tone: "text-amber-600 dark:text-amber-400" },
  falling: { key: "mkt.falling", tip: "mkt.tip3", tone: "text-rose-600 dark:text-rose-400" },
};

const trendOf = (p: MarketPrice): Trend =>
  p.retail > p.previous ? "rising" : p.retail < p.previous ? "falling" : "stable";

const KIND_ICON: Record<WeatherKind, typeof Sun> = {
  sun: Sun,
  cloud: CloudSun,
  rain: CloudRain,
  storm: CloudRain,
};

const CONDITION_KEY: Record<WeatherKind, string> = {
  sun: "cond.sun",
  cloud: "cond.cloud",
  rain: "cond.rain",
  storm: "cond.storm",
};

const rwf = (n: number) => `${Math.round(n).toLocaleString()} RWF`;

function Picker({
  value,
  onChange,
  options,
  all,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
  all: string;
  label: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full rounded-md border bg-background px-3 text-sm"
    >
      <option value="all">{all}</option>
      {options.map((o) => (
        <option key={o.v} value={o.v}>
          {o.l}
        </option>
      ))}
    </select>
  );
}

export function MarketSection({ district }: { district: string }) {
  const { t, cropName, prices } = useApp();
  const [crop, setCrop] = useState("all");
  const [dist, setDist] = useState(district);
  const [market, setMarket] = useState("all");
  const [q, setQ] = useState("");

  const rows = useMemo(
    () =>
      prices.filter(
        (p) =>
          (crop === "all" || p.cropId === crop) &&
          (dist === "all" || p.district === dist) &&
          (market === "all" || p.market === market) &&
          (q === "" ||
            cropName(p.cropId).toLowerCase().includes(q.toLowerCase()) ||
            p.market.toLowerCase().includes(q.toLowerCase())),
      ),
    [prices, crop, dist, market, q, cropName],
  );

  const topTrend = rows.length ? trendOf(rows[0]) : "stable";
  const marketOptions = Array.from(new Set(DISTRICTS.map((d) => MARKETS[d])));

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("mkt.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("mkt.updated")}: {prices[0]?.date}
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Bell size={15} weight="bold" />
          {t("mkt.setAlert")}
        </Button>
      </header>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="flex items-start gap-3 p-4">
          <span className={`mt-0.5 ${TREND_META[topTrend].tone}`}>
            {topTrend === "rising" ? (
              <TrendUp size={20} weight="bold" />
            ) : topTrend === "falling" ? (
              <TrendDown size={20} weight="bold" />
            ) : (
              <Minus size={20} weight="bold" />
            )}
          </span>
          <div>
            <p className="text-sm font-semibold">
              {t("mkt.tip")} · {t(TREND_META[topTrend].key)}
            </p>
            <p className="text-sm text-muted-foreground">{t(TREND_META[topTrend].tip)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <MagnifyingGlass size={16} className="absolute left-3 top-3 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder={t("common.search")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Picker
          label={t("common.crop")}
          all={t("common.all")}
          value={crop}
          onChange={setCrop}
          options={CROPS.map((c) => ({ v: c.id, l: cropName(c.id) }))}
        />
        <Picker
          label={t("common.district")}
          all={t("common.all")}
          value={dist}
          onChange={setDist}
          options={DISTRICTS.map((d) => ({ v: d, l: d }))}
        />
        <Picker
          label={t("mkt.market")}
          all={t("common.all")}
          value={market}
          onChange={setMarket}
          options={marketOptions.map((m) => ({ v: m, l: m }))}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">{t("common.crop")}</th>
                <th className="px-4 py-3">{t("common.district")}</th>
                <th className="px-4 py-3">{t("mkt.market")}</th>
                <th className="px-4 py-3 text-right">{t("mkt.retail")}</th>
                <th className="px-4 py-3 text-right">{t("mkt.wholesale")}</th>
                <th className="px-4 py-3">{t("mkt.trend")}</th>
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
                rows.map((p) => {
                  const trend = trendOf(p);
                  return (
                    <tr key={p.id} className="hover:bg-muted/40">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 font-medium">
                          <span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: CROPS.find((c) => c.id === p.cropId)?.color }}
                          />
                          {cropName(p.cropId)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.district}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.market}</td>
                      <td className="px-4 py-3 text-right font-semibold">{p.retail.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {p.wholesale.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`flex items-center gap-1 text-xs font-semibold ${TREND_META[trend].tone}`}
                        >
                          {trend === "rising" ? (
                            <TrendUp size={14} weight="bold" />
                          ) : trend === "falling" ? (
                            <TrendDown size={14} weight="bold" />
                          ) : (
                            <Minus size={14} weight="bold" />
                          )}
                          {t(TREND_META[trend].key)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}

export function WeatherSection({ district }: { district: string }) {
  const { t, weatherFor, lang } = useApp();
  const weather = weatherFor(district);
  const NowIcon = KIND_ICON[weather.kind];

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">{t("wth.title")}</h2>
        <p className="text-sm text-muted-foreground">{district}, Rwanda</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Card className="border-emerald-800/20 bg-gradient-to-br from-emerald-800 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-80">{t("wth.now")}</p>
                <p className="mt-1 text-5xl font-bold">{weather.temp}°C</p>
                <p className="mt-1 text-sm opacity-90">{t(CONDITION_KEY[weather.kind])}</p>
              </div>
              <NowIcon size={64} weight="fill" className="text-amber-300" />
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                { i: Drop, l: t("wth.rain"), v: `${weather.rainChance}%` },
                { i: Thermometer, l: t("wth.humidity"), v: `${weather.humidity}%` },
                { i: Wind, l: t("wth.wind"), v: `${weather.wind} km/h` },
              ].map(({ i: Icon, l, v }) => (
                <div key={l} className="rounded-xl bg-white/10 p-3">
                  <Icon size={18} weight="fill" className="mx-auto" />
                  <dd className="mt-1 text-base font-semibold">{v}</dd>
                  <dt className="text-[11px] opacity-85">{l}</dt>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t("wth.forecast")}
            </h3>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {weather.days.map((d) => {
                const Icon = KIND_ICON[d.kind];
                return (
                  <div key={d.label} className="rounded-xl border p-2 text-center">
                    <p className="text-xs font-medium">{lang === "rw" ? d.labelRw : d.label}</p>
                    <Icon
                      size={22}
                      weight="fill"
                      className="mx-auto my-1.5 text-emerald-700 dark:text-emerald-400"
                    />
                    <p className="text-xs font-semibold">{d.max}°</p>
                    <p className="text-[11px] text-muted-foreground">{d.min}°</p>
                    <p className="text-[11px] text-sky-600 dark:text-sky-400">{d.rain}%</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("wth.advice")}
          </h3>
          <ul className="mt-4 space-y-3">
            {["wth.a1", "wth.a2", "wth.a3"].map((a) => (
              <li key={a} className="flex items-start gap-3 rounded-xl bg-muted/50 p-3 text-sm">
                <CaretRight
                  size={16}
                  weight="bold"
                  className="mt-0.5 text-emerald-700 dark:text-emerald-400"
                />
                {t(a)}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">{t("wth.source")}</p>
        </CardContent>
      </Card>
    </section>
  );
}

export function BillingSection() {
  const { t, subscription, payments, currentFarmer, submitPayment } = useApp();
  const [method, setMethod] = useState<"momo" | "airtel">("momo");
  const [txn, setTxn] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");

  const history = payments.filter((p) => p.farmerId === currentFarmer?.id);
  const statusKey =
    subscription.status === "active"
      ? "sub.active"
      : subscription.status === "pending"
        ? "sub.pending"
        : "sub.expired";

  function submit(e: FormEvent) {
    e.preventDefault();
    if (txn.trim().length < 6) {
      setError(t("auth.errFields"));
      return;
    }
    if (!confirmPwd.trim()) {
      setError(t("auth.errFields"));
      return;
    }
    setError("");
    const ok = submitPayment(method, txn.trim().toUpperCase(), confirmPwd.trim());
    if (ok) {
      setTxn("");
      setConfirmPwd("");
    } else {
      setError(t("auth.errPassword"));
    }
  }

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold tracking-tight">{t("sub.title")}</h2>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <Card className="border-emerald-800/20 bg-gradient-to-br from-emerald-800 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium opacity-90">
                <Wallet size={18} weight="bold" />
                {t("sub.plan")}
              </span>
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold">
                {t(statusKey)}
              </span>
            </div>
            <p className="mt-5 flex items-end gap-2">
              <span className="text-4xl font-bold">{PLAN_AMOUNT.toLocaleString()}</span>
              <span className="pb-1 text-sm opacity-90">RWF / {t("landing.perMonth")}</span>
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/10 p-3">
                <dt className="text-xs opacity-85">{t("sub.renews")}</dt>
                <dd className="mt-1 font-semibold">{subscription.renews}</dd>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <dt className="text-xs opacity-85">{t("common.status")}</dt>
                <dd className="mt-1 flex items-center gap-1.5 font-semibold">
                  {subscription.status === "active" ? (
                    <CheckCircle size={15} weight="fill" />
                  ) : (
                    <CalendarBlank size={15} weight="fill" />
                  )}
                  {t(statusKey)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Receipt size={16} weight="bold" />
              {t("sub.pay")}
            </h3>
            <form onSubmit={submit} className="mt-4 space-y-4">
              <div className="flex gap-2">
                {(
                  [
                    { v: "momo", l: t("sub.momo") },
                    { v: "airtel", l: t("sub.airtel") },
                  ] as const
                ).map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setMethod(o.v)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      method === o.v
                        ? "border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300"
                        : "hover:bg-muted"
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t("sub.txn")}</Label>
                <Input value={txn} onChange={(e) => setTxn(e.target.value)} placeholder="MOMO8841203" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t("sub.confirmPassword")}</Label>
                <Input
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder={currentFarmer ? passwordForPhone(currentFarmer.phone) : "rwanda2026"}
                />
                <p className="text-[11px] text-muted-foreground">{t("sub.passwordRule")}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-sm">
                <span className="text-muted-foreground">{t("common.amount")}</span>
                <span className="font-semibold">{rwf(PLAN_AMOUNT)}</span>
              </div>
              {error && <p className="text-xs font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800">
                {t("sub.submitPayment")}
              </Button>
            </form>

            <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t("sub.history")}
            </h3>
            <ul className="mt-3 divide-y">
              {history.length === 0 ? (
                <li className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                  <Minus size={16} />
                  {t("common.noData")}
                </li>
              ) : (
                history.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                    <span>
                      <span className="block font-medium">{p.txnId}</span>
                      <span className="block text-xs text-muted-foreground">
                        {p.submitted} · {p.method === "momo" ? t("sub.momo") : t("sub.airtel")}
                      </span>
                    </span>
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
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}