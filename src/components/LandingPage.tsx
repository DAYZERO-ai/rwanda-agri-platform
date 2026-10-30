import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CaretRight,
  CheckCircle,
  CloudRain,
  EnvelopeSimple,
  MapPin,
  Phone,
  Plant,
  ShieldCheck,
  Translate,
  TrendUp,
  User,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CROPS, DISTRICTS } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import BackgroundSlideshow from "@/components/BackgroundSlideshow";

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

const FEATURES = [
  { icon: TrendingIcon, key: "f1" },
  { icon: TrendUp, key: "f2" },
  { icon: CloudRain, key: "f3" },
  { icon: BookOpen, key: "f4" },
];

function TrendingIcon(props: { size?: number; weight?: "regular" | "bold" | "fill" }) {
  return <Plant {...props} />;
}

export default function LandingPage({ onGoPortal }: { onGoPortal: () => void }) {
  const {
    t,
    lang,
    setLang,
    cropName,
    prices,
    registerFarmer,
    loginFarmer,
    farmers,
    loginAdmin,
    loginFarmerWithPassword,
  } = useApp();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    district: DISTRICTS[0] as string,
    sector: "",
    cropId: CROPS[0].id,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [login, setLogin] = useState({
    tab: "farmer" as "farmer" | "admin",
    email: "",
    password: "",
  });
  const [loginErr, setLoginErr] = useState("");

  async function doLogin(e: FormEvent) {
    e.preventDefault();
    setLoginErr("");
    if (login.tab === "admin") {
      if (loginAdmin(login.password)) onGoPortal();
      else setLoginErr(t("auth.errLogin"));
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(login.email)) {
      setLoginErr(t("auth.errEmail"));
      return;
    }
    const ok = await loginFarmerWithPassword(login.email, login.password);
    if (ok) onGoPortal();
    else setLoginErr(t("auth.errLogin"));
  }

  const ticker = prices.slice(0, 8);
  const demoFarmer = farmers.find((f) => f.status === "approved") ?? farmers[0];

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.fullName.trim() || !form.sector.trim()) next.fullName = t("auth.errFields");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = t("auth.errEmail");
    if (!/^(\+?25)?0?7[0-9]{8}$/.test(form.phone.replace(/\s/g, ""))) next.phone = t("auth.errPhone");
    setErrors(next);
    if (Object.keys(next).length) return;
    registerFarmer(form);
    onGoPortal();
  }

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_500px_at_15%_-10%,rgba(27,107,62,0.18),transparent),radial-gradient(900px_400px_at_95%_10%,rgba(229,169,60,0.22),transparent)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <motion.div {...fade} className="flex flex-wrap items-center gap-3">
              <Badge className="gap-1.5 rounded-full border-emerald-600/25 bg-emerald-600/10 text-emerald-800 dark:text-emerald-300">
                <ShieldCheck size={15} weight="fill" />
                {t("landing.trust")}
              </Badge>
              <div className="flex items-center gap-1 rounded-full border bg-card p-0.5">
                <Translate size={15} className="ml-2 text-muted-foreground" />
                {(["en", "rw"] as const).map((code) => (
                  <button
                    key={code}
                    onClick={() => setLang(code)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase transition ${
                      lang === code
                        ? "bg-emerald-700 text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.h1
              {...fade}
              className="mt-6 text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              {t("landing.heroTitle")}
            </motion.h1>
            <motion.p {...fade} className="mt-5 max-w-xl text-lg text-muted-foreground">
              {t("landing.heroSub")}
            </motion.p>

            <motion.div {...fade} className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="gap-2 bg-emerald-700 hover:bg-emerald-800" asChild>
                <a href="#register">
                  {t("landing.ctaStart")}
                  <ArrowRight size={18} weight="bold" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => {
                  if (demoFarmer) loginFarmer(demoFarmer.id);
                  onGoPortal();
                }}
              >
                <Plant size={18} weight="bold" />
                {t("landing.ctaDemo")}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="gap-2"
                onClick={() => {
                  document.getElementById("login")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <CaretRight size={16} weight="bold" />
                {t("landing.ctaAdmin")}
              </Button>
            </motion.div>

            <motion.dl {...fade} className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[
                { v: "12,400+", l: lang === "rw" ? "Abahinzi" : "Farmers" },
                { v: "30", l: lang === "rw" ? "Uturere" : "Districts" },
                { v: "6", l: lang === "rw" ? "Ibihingwa" : "Crops" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border bg-card/70 p-3">
                  <dt className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">{s.v}</dt>
                  <dd className="text-xs text-muted-foreground">{s.l}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Ticker / preview card */}
          <motion.div {...fade} className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-emerald-700/15 via-transparent to-amber-500/20 blur-2xl" />
            <div className="relative mb-5">
              <BackgroundSlideshow lang={lang} />
            </div>
            <Card className="overflow-hidden border-emerald-900/10 shadow-xl">
              <div className="flex items-center justify-between border-b bg-emerald-800 px-4 py-3 text-white">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <TrendUp size={16} weight="bold" />
                  {t("landing.ticker")}
                </span>
                <span className="text-xs opacity-80">{prices[0]?.date}</span>
              </div>
              <CardContent className="divide-y p-0">
                {ticker.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <span
                        className="size-2.5 rounded-full"
                        style={{
                          backgroundColor: CROPS.find((c) => c.id === p.cropId)?.color ?? "#1b6b3e",
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium">{cropName(p.cropId)}</p>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin size={12} />
                          {p.market}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{p.retail.toLocaleString()} RWF</p>
                      <p className="text-xs text-muted-foreground">{p.unit}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:py-20">
        <motion.h2 {...fade} className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("landing.featuresTitle")}
        </motion.h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: "easeOut" }}
            >
              <Card className="h-full transition hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="space-y-3 p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-emerald-700/10 text-emerald-800 dark:text-emerald-400">
                    <Icon size={22} weight="bold" />
                  </span>
                  <h3 className="text-lg font-semibold">{t(`landing.${key}`)}</h3>
                  <p className="text-sm text-muted-foreground">{t(`landing.${key}d`)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:py-20">
          <motion.h2 {...fade} className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("landing.howTitle")}
          </motion.h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {["step1", "step2", "step3"].map((step, i) => (
              <motion.div
                key={step}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" as const }}
                className="relative rounded-2xl border bg-card p-6"
              >
                <span className="absolute -top-3 left-6 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{t(`landing.${step}`)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(`landing.${step}d`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING + REGISTER */}
      <section id="register" className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2 lg:py-20">
        <motion.div {...fade}>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("landing.pricingTitle")}</h2>
          <div className="mt-8 rounded-2xl border border-emerald-800/20 bg-gradient-to-br from-emerald-800 to-emerald-600 p-8 text-white shadow-lg">
            <p className="text-sm font-medium uppercase tracking-widest opacity-80">
              {t("landing.plan")}
            </p>
            <p className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-bold">5,000</span>
              <span className="pb-1.5 text-sm opacity-90">RWF / {t("landing.perMonth")}</span>
            </p>
            <ul className="mt-6 space-y-3">
              {["priceF1", "priceF2", "priceF3", "priceF4"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-amber-300" />
                  {t(`landing.${f}`)}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs opacity-85">{t("landing.priceNote")}</p>
          </div>
        </motion.div>

        <motion.div {...fade}>
          <Card className="h-full">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold">{t("auth.signupTitle")}</h3>
              <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field className="sm:col-span-2" label={t("auth.name")} error={errors.fullName}>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Uwase Marie"
                    />
                  </div>
                </Field>
                <Field label={t("common.email")} error={errors.email}>
                  <div className="relative">
                    <EnvelopeSimple size={16} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="marie@example.rw"
                    />
                  </div>
                </Field>
                <Field label={t("common.phone")} error={errors.phone}>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+250 78..."
                    />
                  </div>
                </Field>
                <Field label={t("common.district")}>
                  <select
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value, sector: "" })}
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t("common.sector")}>
                  <Input
                    value={form.sector}
                    onChange={(e) => setForm({ ...form, sector: e.target.value })}
                    placeholder="Muhoza"
                  />
                </Field>
                <Field className="sm:col-span-2" label={t("auth.lastName")}>
                  <div className="flex flex-wrap gap-2">
                    {CROPS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setForm({ ...form, cropId: c.id })}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                          form.cropId === c.id
                            ? "border-emerald-700 bg-emerald-700 text-white"
                            : "hover:bg-muted"
                        }`}
                      >
                        {cropName(c.id)}
                      </button>
                    ))}
                  </div>
                </Field>
                <Button type="submit" className="sm:col-span-2 gap-2 bg-emerald-700 hover:bg-emerald-800">
                  {t("auth.createAccount")}
                  <ArrowRight size={17} weight="bold" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* SIGN IN */}
      <section id="login" className="mx-auto max-w-3xl px-5 py-16 lg:py-20">
        <Card className="overflow-hidden border-emerald-900/10 shadow-lg">
          <div className="flex border-b">
            {(["farmer", "admin"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setLogin({ ...login, tab });
                  setLoginErr("");
                }}
                className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
                  login.tab === tab
                    ? "bg-emerald-700 text-white"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab === "farmer" ? t("auth.farmerLogin") : t("auth.adminLogin")}
              </button>
            ))}
          </div>
          <CardContent className="p-8">
            <form onSubmit={doLogin} className="grid gap-4 sm:grid-cols-2">
              {login.tab === "farmer" ? (
                <Field className="sm:col-span-2" label={t("common.email")}>
                  <div className="relative">
                    <EnvelopeSimple size={16} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      type="email"
                      value={login.email}
                      onChange={(e) => setLogin({ ...login, email: e.target.value })}
                      placeholder="marie@example.rw"
                    />
                  </div>
                </Field>
              ) : (
                <p className="sm:col-span-2 text-sm text-muted-foreground">{t("auth.adminHint")}</p>
              )}
              <Field className="sm:col-span-2" label={t("auth.password")} error={loginErr}>
                <div className="relative">
                  <ShieldCheck size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    type="password"
                    value={login.password}
                    onChange={(e) => setLogin({ ...login, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </Field>
              <Button type="submit" className="sm:col-span-2 gap-2 bg-emerald-700 hover:bg-emerald-800">
                {t("auth.signIn")}
                <ArrowRight size={17} weight="bold" />
              </Button>
              {login.tab === "farmer" ? (
                <p className="sm:col-span-2 text-center text-xs text-muted-foreground">
                  {t("sub.passwordRule")}
                </p>
              ) : null}
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}