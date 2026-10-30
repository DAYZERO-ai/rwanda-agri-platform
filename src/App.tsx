import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import {
  Bell,
  BookOpen,
  CaretDown,
  ChartBar,
  CloudRain,
  House,
  List,
  Moon,
  Notepad,
  SignOut,
  Sun,
  TrendUp,
  Wallet,
  X,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppProvider, useApp } from "@/context/AppContext";
import { AuthProvider } from "@/auth/AuthProvider";
import type { Lang } from "@/types";
import LandingPage from "@/components/LandingPage";
import BackgroundSlideshow from "@/components/BackgroundSlideshow";
import FarmerPortal, { type PortalTab } from "@/components/FarmerPortal";
import { Plant } from "@phosphor-icons/react";
import AdminPortal from "@/components/AdminPortal";

const FARMER_TABS: { id: PortalTab; key: string; icon: typeof House }[] = [
  { id: "overview", key: "nav.dashboard", icon: ChartBar },
  { id: "books", key: "nav.bookkeeping", icon: Notepad },
  { id: "market", key: "nav.market", icon: TrendUp },
  { id: "inputs", key: "nav.inputs", icon: Plant },
  { id: "weather", key: "nav.weather", icon: CloudRain },
  { id: "learn", key: "nav.learn", icon: BookOpen },
  { id: "billing", key: "nav.billing", icon: Wallet },
];

function LangToggle() {
  const { lang, setLang } = useApp();
  const options: Lang[] = ["en", "rw"];
  return (
    <div className="flex items-center rounded-full border p-0.5">
      {options.map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-label={code === "en" ? "English" : "Kinyarwanda"}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition ${
            lang === code ? "bg-emerald-700 text-white" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

function NotificationBell() {
  const { t, notifications, markAllRead } = useApp();
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t("nav.notifications")}
        className="relative rounded-lg border p-2 text-muted-foreground transition hover:text-foreground"
      >
        <Bell size={17} weight="bold" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <button
            aria-label={t("common.close")}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border bg-card p-2 shadow-xl">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-sm font-semibold">{t("nav.notifications")}</span>
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
              >
                {t("nav.markAllRead")}
              </button>
            </div>
            <ul className="mt-1 max-h-72 divide-y overflow-y-auto">
              {notifications.length === 0 && (
                <li className="px-2 py-6 text-center text-sm text-muted-foreground">
                  {t("common.noData")}
                </li>
              )}
              {notifications.map((n) => (
                <li key={n.id} className={`px-2 py-3 ${n.read ? "opacity-60" : ""}`}>
                  <p className="text-sm font-medium">{t(n.titleKey)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t(n.bodyKey)}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{n.date}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

function Shell() {
  const { t, session, logout, theme, toggleTheme, currentFarmer, adminName } = useApp();
  const [tab, setTab] = useState<PortalTab>("overview");
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (session?.role === "admin") setTab("overview");
  }, [session]);

  const isFarmer = session?.role === "farmer";
  const isAdmin = session?.role === "admin";

  const tabs = isFarmer
    ? FARMER_TABS
    : [{ id: "overview" as PortalTab, key: "nav.dashboard", icon: ChartBar }];

  return (
    <div className="relative min-h-screen text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(27,107,62,0.10),transparent),radial-gradient(900px_500px_at_95%_5%,rgba(229,169,60,0.12),transparent)]" />
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <House size={19} weight="fill" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-sm font-bold leading-tight">{t("app.name")}</span>
              <span className="block text-[11px] text-muted-foreground">{t("app.tagline")}</span>
            </span>
          </div>

          {session && (
            <nav className="ml-4 hidden items-center gap-1 lg:flex">
              {tabs.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      tab === item.id
                        ? "bg-emerald-700/10 text-emerald-800 dark:text-emerald-400"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon size={16} weight="bold" />
                    {t(item.key)}
                  </button>
                );
              })}
            </nav>
          )}

          <div className="ml-auto flex items-center gap-2">
            <a
              href="./rwanda_agriculture.html"
              target="_blank"
              rel="noreferrer"
              title="Standalone offline copy: works by double-clicking, no server or CORS needed"
              className="hidden rounded-lg border px-2.5 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground sm:block"
            >
              Offline copy
            </a>
            <LangToggle />
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? t("app.light") : t("app.dark")}
              className="rounded-lg border p-2 text-muted-foreground transition hover:text-foreground"
            >
              {theme === "dark" ? <Sun size={17} weight="bold" /> : <Moon size={17} weight="bold" />}
            </button>
            {session && <NotificationBell />}
            <Badge variant="secondary" className="hidden gap-1.5 sm:flex">
              {isAdmin ? t("nav.adminRole") : isFarmer ? t("nav.farmer") : t("nav.guest")}
            </Badge>
            {session ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-sm font-medium md:block">
                  {isAdmin ? adminName : currentFarmer?.fullName ?? t("nav.farmer")}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    logout();
                    setTab("overview");
                  }}
                >
                  <SignOut size={15} weight="bold" />
                  <span className="hidden sm:inline">{t("nav.logout")}</span>
                </Button>
              </div>
            ) : (
              <Badge className="hidden gap-1.5 bg-amber-500/15 text-amber-700 dark:text-amber-400 sm:flex">
                <CaretDown size={12} weight="bold" />
                {t("landing.ctaStart")}
              </Badge>
            )}
            {session && (
              <button
                onClick={() => setNavOpen((o) => !o)}
                aria-label={t("nav.home")}
                className="rounded-lg border p-2 text-muted-foreground lg:hidden"
              >
                {navOpen ? <X size={17} weight="bold" /> : <List size={17} weight="bold" />}
              </button>
            )}
          </div>
        </div>

        {navOpen && session && (
          <nav className="border-t px-5 pb-3 pt-2 lg:hidden">
            <div className="flex flex-wrap gap-2">
              {tabs.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTab(item.id);
                      setNavOpen(false);
                    }}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      tab === item.id
                        ? "bg-emerald-700 text-white"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon size={16} weight="bold" />
                    {t(item.key)}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      <main>
        {isAdmin ? (
          <AdminPortal />
        ) : isFarmer ? (
          <FarmerPortal tab={tab} />
        ) : (
          <LandingPage onGoPortal={() => setTab("overview")} />
        )}
      </main>

      <footer className="border-t bg-muted/40 px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-center text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span>
            © {new Date().getFullYear()} {t("app.name")} · {t("landing.footer")}
          </span>
          <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-end">
            <span>{t("landing.trust")}</span>
            <a
              href="./rwanda_agriculture.html"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
            >
              Standalone offline HTML
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Shell />
        <Toaster position="top-right" richColors />
      </AppProvider>
    </AuthProvider>
  );
}