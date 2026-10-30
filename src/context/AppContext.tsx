import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  ADMIN_USER,
  ADMIN_PASSWORD,
  CROPS,
  DEFAULT_PASSWORD,
  DEMO_FARMERS,
  DEMO_NOTIFICATIONS,
  DEMO_PAYMENTS,
  DEMO_RECORDS,
  GUIDES,
  MARKET_PRICES,
  SECTORS,
  buildWeather,
  passwordForPhone,
} from "../data/mockData";
import { FARM_MATERIALS, FERTILIZERS } from "../data/cropInputs";
import {
  translate,
  type FarmMaterialItem,
  type FarmRecord,
  type Farmer,
  type FertilizerItem,
  type Guide,
  type Lang,
  type MarketPrice,
  type NotificationItem,
  type PaymentRequest,
  type Session,
  type Subscription,
} from "../types";

const KEY = "rwanda-agri-state-v1";
const PLAN_AMOUNT = 5000;

interface Persisted {
  lang: Lang;
  theme: "light" | "dark";
  session: Session | null;
  records: FarmRecord[];
  prices: MarketPrice[];
  guides: Guide[];
  farmers: Farmer[];
  payments: PaymentRequest[];
  notifications: NotificationItem[];
  fertilizers: FertilizerItem[];
  materials: FarmMaterialItem[];
}

function initial(): Persisted {
  return {
    lang: "en",
    theme: "light",
    session: null,
    records: DEMO_RECORDS,
    prices: MARKET_PRICES,
    guides: GUIDES,
    farmers: DEMO_FARMERS,
    payments: DEMO_PAYMENTS,
    notifications: DEMO_NOTIFICATIONS,
    fertilizers: FERTILIZERS,
    materials: FARM_MATERIALS,
  };
}

function load(): Persisted {
  const fallback = initial();
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

/* ---------- Supabase row mappers (snake_case <-> camelCase) ---------- */
const farmerToRow = (f: Farmer) => ({
  id: f.id,
  full_name: f.fullName,
  email: f.email,
  phone: f.phone,
  district: f.district,
  sector: f.sector,
  crop_id: f.cropId,
  status: f.status,
  joined: f.joined,
  revenue: f.revenue,
  password: f.password,
});
const rowToFarmer = (r: Record<string, unknown>): Farmer => ({
  id: String(r.id),
  fullName: String(r.full_name ?? ""),
  email: String(r.email ?? ""),
  phone: String(r.phone ?? ""),
  district: String(r.district ?? ""),
  sector: String(r.sector ?? ""),
  cropId: String(r.crop_id ?? ""),
  status: (r.status as Farmer["status"]) ?? "pending",
  joined: String(r.joined ?? ""),
  revenue: Number(r.revenue ?? 0),
  password: passwordForPhone(String(r.phone ?? "")),
});

const recordToRow = (x: FarmRecord) => ({
  id: x.id,
  farmer_id: x.farmerId,
  type: x.type,
  crop_id: x.cropId,
  quantity: x.quantity,
  unit_price: x.unitPrice,
  amount: x.amount,
  category: x.category,
  party: x.party,
  notes: x.notes,
  date: x.date,
});
const rowToRecord = (r: Record<string, unknown>): FarmRecord => ({
  id: String(r.id),
  farmerId: String(r.farmer_id ?? ""),
  type: (r.type as FarmRecord["type"]) ?? "income",
  cropId: String(r.crop_id ?? ""),
  quantity: Number(r.quantity ?? 0),
  unitPrice: Number(r.unit_price ?? 0),
  amount: Number(r.amount ?? 0),
  category: String(r.category ?? ""),
  party: String(r.party ?? ""),
  notes: String(r.notes ?? ""),
  date: String(r.date ?? ""),
});

const guideToRow = (g: Guide) => ({
  id: g.id,
  crop_id: g.cropId,
  title: g.title,
  title_rw: g.titleRw,
  summary: g.summary,
  summary_rw: g.summaryRw,
  season: g.season,
  duration: g.duration,
  youtube_url: g.youtubeUrl ?? null,
  wallpaper_url: g.wallpaperUrl ?? null,
  steps: g.steps,
});
const rowToGuide = (r: Record<string, unknown>): Guide => ({
  id: String(r.id),
  cropId: String(r.crop_id ?? ""),
  title: String(r.title ?? ""),
  titleRw: String(r.title_rw ?? ""),
  summary: String(r.summary ?? ""),
  summaryRw: String(r.summary_rw ?? ""),
  season: String(r.season ?? ""),
  duration: String(r.duration ?? ""),
  video: String(r.crop_id ?? ""),
  youtubeUrl: (r.youtube_url as string) ?? undefined,
  wallpaperUrl: (r.wallpaper_url as string) ?? undefined,
  steps: (r.steps as Guide["steps"]) ?? [],
});

const priceToRow = (p: MarketPrice) => ({
  id: p.id,
  crop_id: p.cropId,
  district: p.district,
  market: p.market,
  retail: p.retail,
  wholesale: p.wholesale,
  previous: p.previous,
  unit: p.unit,
  date: p.date,
  published: p.published,
});
const rowToPrice = (r: Record<string, unknown>): MarketPrice => ({
  id: String(r.id),
  cropId: String(r.crop_id ?? ""),
  district: String(r.district ?? ""),
  market: String(r.market ?? ""),
  retail: Number(r.retail ?? 0),
  wholesale: Number(r.wholesale ?? 0),
  previous: Number(r.previous ?? 0),
  unit: String(r.unit ?? "RWF/kg"),
  date: String(r.date ?? ""),
  published: Boolean(r.published ?? true),
});

const paymentToRow = (p: PaymentRequest) => ({
  id: p.id,
  farmer_id: p.farmerId,
  farmer_name: p.farmerName,
  method: p.method,
  amount: p.amount,
  txn_id: p.txnId,
  status: p.status,
  submitted: p.submitted,
});
const rowToPayment = (r: Record<string, unknown>): PaymentRequest => ({
  id: String(r.id),
  farmerId: String(r.farmer_id ?? ""),
  farmerName: String(r.farmer_name ?? ""),
  method: (r.method as PaymentRequest["method"]) ?? "momo",
  amount: Number(r.amount ?? 0),
  txnId: String(r.txn_id ?? ""),
  status: (r.status as PaymentRequest["status"]) ?? "pending",
  submitted: String(r.submitted ?? ""),
});

const fertilizerToRow = (f: FertilizerItem) => ({
  id: f.id,
  name: f.name,
  name_rw: f.nameRw,
  crop_ids: f.cropIds,
  kg_per_hectare: f.kgPerHectare,
  unit_price_frw: f.unitPriceFrw,
  image_url: f.imageUrl,
  description: f.description,
  description_rw: f.descriptionRw,
  application_stage: f.applicationStage,
});
const rowToFertilizer = (r: Record<string, unknown>): FertilizerItem => ({
  id: String(r.id),
  name: String(r.name ?? ""),
  nameRw: String(r.name_rw ?? ""),
  cropIds: (r.crop_ids as string[]) ?? [],
  kgPerHectare: Number(r.kg_per_hectare ?? 0),
  unitPriceFrw: Number(r.unit_price_frw ?? 0),
  imageUrl: String(r.image_url ?? ""),
  description: String(r.description ?? ""),
  descriptionRw: String(r.description_rw ?? ""),
  applicationStage: String(r.application_stage ?? ""),
});

const materialToRow = (m: FarmMaterialItem) => ({
  id: m.id,
  name: m.name,
  name_rw: m.nameRw,
  crop_ids: m.cropIds,
  quantity_per_hectare: m.quantityPerHectare,
  unit: m.unit,
  unit_price_frw: m.unitPriceFrw,
  image_url: m.imageUrl,
  description: m.description,
  description_rw: m.descriptionRw,
  category: m.category,
});
const rowToMaterial = (r: Record<string, unknown>): FarmMaterialItem => ({
  id: String(r.id),
  name: String(r.name ?? ""),
  nameRw: String(r.name_rw ?? ""),
  cropIds: (r.crop_ids as string[]) ?? [],
  quantityPerHectare: Number(r.quantity_per_hectare ?? 0),
  unit: String(r.unit ?? "pieces"),
  unitPriceFrw: Number(r.unit_price_frw ?? 0),
  imageUrl: String(r.image_url ?? ""),
  description: String(r.description ?? ""),
  descriptionRw: String(r.description_rw ?? ""),
  category: String(r.category ?? "Tools"),
});

/* fire-and-forget write-through helpers.
   Local state is always the source of truth, so any network/CORS/offline
   failure here is logged and swallowed instead of surfacing to the user. */
const upsert = (table: string, row: Record<string, unknown>) => {
  try {
    void Promise.resolve(supabase.from(table).upsert(row))
      .then(({ error }) => {
        if (error) console.warn(`[agri] upsert ${table}`, error.message);
      })
      .catch((err) => console.warn(`[agri] upsert ${table} offline`, err));
  } catch (err) {
    console.warn(`[agri] upsert ${table} offline`, err);
  }
};
const remove = (table: string, id: string) => {
  try {
    void Promise.resolve(supabase.from(table).delete().eq("id", id))
      .then(({ error }) => {
        if (error) console.warn(`[agri] delete ${table}`, error.message);
      })
      .catch((err) => console.warn(`[agri] delete ${table} offline`, err));
  } catch (err) {
    console.warn(`[agri] delete ${table} offline`, err);
  }
};

interface AppValue extends Persisted {
  t: (key: string) => string;
  setLang: (lang: Lang) => void;
  toggleTheme: () => void;
  cropName: (cropId: string) => string;
  loginFarmer: (farmerId: string) => void;
  loginFarmerWithPassword: (email: string, password: string) => Promise<boolean>;
  loginAdmin: (password: string) => boolean;
  registerFarmer: (input: {
    fullName: string;
    email: string;
    phone: string;
    district: string;
    sector: string;
    cropId: string;
  }) => void;
  logout: () => void;
  currentFarmer: Farmer | null;
  adminName: string;
  defaultPassword: string;
  addRecord: (record: Omit<FarmRecord, "id" | "farmerId">) => void;
  deleteRecord: (id: string) => void;
  publishPrice: (price: MarketPrice) => void;
  addGuide: (guide: Guide) => void;
  setFarmerStatus: (id: string, status: Farmer["status"]) => void;
  addFarmer: (input: {
    fullName: string;
    email: string;
    phone: string;
    district: string;
    sector: string;
    cropId: string;
    status: Farmer["status"];
    password?: string;
  }) => void;
  updateFarmer: (farmer: Farmer) => void;
  deleteFarmer: (id: string) => void;
  deletePrice: (id: string) => void;
  deleteGuide: (id: string) => void;
  sendBroadcast: (title: string, body: string, tone?: NotificationItem["tone"]) => void;
  grantSubscription: (farmerId: string, farmerName: string) => void;
  submitPayment: (
    method: PaymentRequest["method"],
    txnId: string,
    confirmPassword: string,
  ) => boolean;
  passwordForPhone: (phone: string) => string;
  decidePayment: (id: string, status: "approved" | "rejected") => void;
  markAllRead: () => void;
  saveFertilizer: (item: FertilizerItem) => void;
  deleteFertilizer: (id: string) => void;
  saveMaterial: (item: FarmMaterialItem) => void;
  deleteMaterial: (id: string) => void;
  subscription: Subscription;
  weatherFor: (district: string) => ReturnType<typeof buildWeather>;
  setSectorHint: (district: string) => string[];
}

const AppContext = createContext<AppValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(load);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", state.theme === "dark");
  }, [state.theme]);

  /* Hydrate persisted data from Supabase once on mount.
     When the app is opened offline or directly from the filesystem (file://),
     network calls would fail with CORS/network errors. We skip them in that
     case and keep the localStorage cache that is already hydrated above. */
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const offline =
      typeof navigator !== "undefined" && navigator.onLine === false;
    const isFileProtocol =
      typeof window !== "undefined" && window.location.protocol === "file:";
    if (offline || isFileProtocol) return;

    let cancelled = false;
    (async () => {
      try {
        const [f, r, g, p, pay, fz, mt] = await Promise.all([
          supabase.from("farmers").select("*"),
          supabase.from("farm_records").select("*"),
          supabase.from("tutorials").select("*"),
          supabase.from("market_prices").select("*"),
          supabase.from("payment_requests").select("*"),
          supabase.from("fertilizers").select("*"),
          supabase.from("farm_materials").select("*"),
        ]);
        if (cancelled) return;
        setState((s) => {
          const next = { ...s };
          if (f.data && f.data.length) next.farmers = f.data.map(rowToFarmer);
          if (r.data && r.data.length) next.records = r.data.map(rowToRecord);
          if (g.data && g.data.length) next.guides = g.data.map(rowToGuide);
          if (p.data && p.data.length) next.prices = p.data.map(rowToPrice);
          if (pay.data && pay.data.length) next.payments = pay.data.map(rowToPayment);
          if (fz.data && fz.data.length) next.fertilizers = fz.data.map(rowToFertilizer);
          if (mt.data && mt.data.length) next.materials = mt.data.map(rowToMaterial);
          return next;
        });
      } catch (err) {
        // Silent, by design: the local cache keeps the app fully usable.
        console.warn("[agri] offline mode, using local cache", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const t = useCallback((key: string) => translate(state.lang, key), [state.lang]);

  const cropName = useCallback(
    (cropId: string) => {
      const crop = CROPS.find((c) => c.id === cropId);
      if (!crop) return cropId;
      return state.lang === "rw" ? crop.nameRw : crop.name;
    },
    [state.lang],
  );

  const setLang = useCallback((lang: Lang) => {
    setState((s) => ({ ...s, lang }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState((s) => ({ ...s, theme: s.theme === "dark" ? "light" : "dark" }));
  }, []);

  const loginFarmer = useCallback((farmerId: string) => {
    setState((s) => ({ ...s, session: { role: "farmer", farmerId } }));
    toast.success(translate(load().lang, "toast.loginOk"));
  }, []);

  const loginFarmerWithPassword = useCallback<AppValue["loginFarmerWithPassword"]>(
    async (email, password) => {
      const { data } = await supabase
        .from("farmers")
        .select("*")
        .eq("email", email.trim().toLowerCase());
      const local = load().farmers.find((f) => f.email === email.trim().toLowerCase());
      const candidate = data && data.length ? rowToFarmer(data[0]) : local;
      if (!candidate || passwordForPhone(candidate.phone) !== password) {
        toast.error(translate(load().lang, "auth.errLogin"));
        return false;
      }
      setState((s) => ({ ...s, session: { role: "farmer", farmerId: candidate.id } }));
      toast.success(translate(load().lang, "toast.loginOk"));
      return true;
    },
    [],
  );

  const loginAdmin = useCallback<AppValue["loginAdmin"]>((password) => {
    if (password !== ADMIN_PASSWORD) {
      toast.error(translate(load().lang, "auth.errLogin"));
      return false;
    }
    setState((s) => ({ ...s, session: { role: "admin", farmerId: ADMIN_USER.id } }));
    toast.success(translate(load().lang, "toast.loginOk"));
    return true;
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, session: null }));
    toast.success(translate(load().lang, "toast.logoutOk"));
  }, []);

  const registerFarmer = useCallback<AppValue["registerFarmer"]>((input) => {
    const id = `f-${input.fullName.toLowerCase().replace(/[^a-z]+/g, "-")}-${Date.now().toString().slice(-4)}`;
    const email = input.email.trim().toLowerCase();
    const farmer: Farmer = {
      id,
      fullName: input.fullName,
      email,
      phone: input.phone,
      district: input.district,
      sector: input.sector,
      cropId: input.cropId,
      status: "pending",
      joined: new Date().toISOString().slice(0, 10),
      revenue: 0,
      password: passwordForPhone(input.phone),
    };
    setState((s) => ({
      ...s,
      farmers: [farmer, ...s.farmers],
      session: { role: "farmer", farmerId: id },
    }));
    upsert("farmers", farmerToRow(farmer));
    toast.success(translate(load().lang, "toast.farmerAdded"));
    toast.info(
      `${translate(load().lang, "auth.defaultPasswordNote")}: ${passwordForPhone(input.phone)}`,
    );
  }, []);

  const currentFarmer = useMemo(() => {
    if (!state.session || state.session.role !== "farmer") return null;
    return state.farmers.find((f) => f.id === state.session?.farmerId) ?? null;
  }, [state.session, state.farmers]);

  const addRecord = useCallback<AppValue["addRecord"]>(
    (record) => {
      const farmerId = state.session?.farmerId ?? "f-jean";
      const full: FarmRecord = { ...record, id: `r-${Date.now()}`, farmerId };
      setState((s) => ({ ...s, records: [full, ...s.records] }));
      upsert("farm_records", recordToRow(full));
      toast.success(translate(load().lang, "toast.saved"));
    },
    [state.session],
  );

  const deleteRecord = useCallback((id: string) => {
    setState((s) => ({ ...s, records: s.records.filter((r) => r.id !== id) }));
    remove("farm_records", id);
    toast.success(translate(load().lang, "toast.deleted"));
  }, []);

  const publishPrice = useCallback<AppValue["publishPrice"]>((price) => {
    setState((s) => {
      const exists = s.prices.some((p) => p.id === price.id);
      return {
        ...s,
        prices: exists ? s.prices.map((p) => (p.id === price.id ? price : p)) : [price, ...s.prices],
      };
    });
    upsert("market_prices", priceToRow(price));
    toast.success(translate(load().lang, "toast.pricePublished"));
  }, []);

  const addGuide = useCallback<AppValue["addGuide"]>((guide) => {
    setState((s) => ({ ...s, guides: [guide, ...s.guides] }));
    upsert("tutorials", guideToRow(guide));
    toast.success(translate(load().lang, "toast.guideAdded"));
  }, []);

  const setFarmerStatus = useCallback((id: string, status: Farmer["status"]) => {
    setState((s) => ({
      ...s,
      farmers: s.farmers.map((f) => (f.id === id ? { ...f, status } : f)),
    }));
    void supabase.from("farmers").update({ status }).eq("id", id);
  }, []);

  const addFarmer = useCallback<AppValue["addFarmer"]>((input) => {
    const farmer: Farmer = {
      id: `f-${input.fullName.toLowerCase().replace(/[^a-z]+/g, "-")}-${Date.now().toString().slice(-4)}`,
      fullName: input.fullName,
      email: input.email.trim().toLowerCase(),
      phone: input.phone,
      district: input.district,
      sector: input.sector,
      cropId: input.cropId,
      status: input.status,
      joined: new Date().toISOString().slice(0, 10),
      revenue: 0,
      password: input.password?.trim() || passwordForPhone(input.phone),
    };
    setState((s) => ({ ...s, farmers: [farmer, ...s.farmers] }));
    upsert("farmers", farmerToRow(farmer));
    toast.success(translate(load().lang, "toast.farmerAdded"));
  }, []);

  const updateFarmer = useCallback<AppValue["updateFarmer"]>((farmer) => {
    setState((s) => ({
      ...s,
      farmers: s.farmers.map((f) => (f.id === farmer.id ? farmer : f)),
    }));
    upsert("farmers", farmerToRow(farmer));
    toast.success(translate(load().lang, "toast.saved"));
  }, []);

  const deleteFarmer = useCallback((id: string) => {
    setState((s) => ({ ...s, farmers: s.farmers.filter((f) => f.id !== id) }));
    remove("farmers", id);
    toast.success(translate(load().lang, "toast.deleted"));
  }, []);

  const deletePrice = useCallback((id: string) => {
    setState((s) => ({ ...s, prices: s.prices.filter((p) => p.id !== id) }));
    remove("market_prices", id);
    toast.success(translate(load().lang, "toast.deleted"));
  }, []);

  const deleteGuide = useCallback((id: string) => {
    setState((s) => ({ ...s, guides: s.guides.filter((g) => g.id !== id) }));
    remove("tutorials", id);
    toast.success(translate(load().lang, "toast.deleted"));
  }, []);

  const sendBroadcast = useCallback<AppValue["sendBroadcast"]>((title, body, tone = "info") => {
    const item: NotificationItem = {
      id: `n-${Date.now()}`,
      titleKey: title,
      bodyKey: body,
      tone,
      date: new Date().toISOString().slice(0, 10),
      read: false,
    };
    setState((s) => ({ ...s, notifications: [item, ...s.notifications] }));
    toast.success(translate(load().lang, "toast.saved"));
  }, []);

  const grantSubscription = useCallback<AppValue["grantSubscription"]>((farmerId, farmerName) => {
    const request: PaymentRequest = {
      id: `p-${Date.now()}`,
      farmerId,
      farmerName,
      method: "momo",
      amount: PLAN_AMOUNT,
      txnId: `MANUAL-${Date.now().toString().slice(-6)}`,
      status: "approved",
      submitted: new Date().toISOString().slice(0, 10),
    };
    setState((s) => ({ ...s, payments: [request, ...s.payments] }));
    upsert("payment_requests", paymentToRow(request));
    toast.success(translate(load().lang, "toast.approved"));
  }, []);

  const submitPayment = useCallback<AppValue["submitPayment"]>(
    (method, txnId, confirmPassword) => {
      const farmer = currentFarmer;
      if (!farmer) return false;
      // Every payment must be confirmed with the farmer's derived default password.
      if (passwordForPhone(farmer.phone) !== confirmPassword.trim()) {
        toast.error(translate(load().lang, "auth.errPassword"));
        return false;
      }
      const request: PaymentRequest = {
        id: `p-${Date.now()}`,
        farmerId: farmer.id,
        farmerName: farmer.fullName,
        method,
        amount: PLAN_AMOUNT,
        txnId,
        status: "pending",
        submitted: new Date().toISOString().slice(0, 10),
      };
      setState((s) => ({ ...s, payments: [request, ...s.payments] }));
      upsert("payment_requests", paymentToRow(request));
      toast.success(translate(load().lang, "toast.paymentSent"));
      return true;
    },
    [currentFarmer],
  );

  const decidePayment = useCallback((id: string, status: "approved" | "rejected") => {
    setState((s) => ({
      ...s,
      payments: s.payments.map((p) => (p.id === id ? { ...p, status } : p)),
    }));
    void supabase.from("payment_requests").update({ status }).eq("id", id);
    toast.success(translate(load().lang, status === "approved" ? "toast.approved" : "toast.rejected"));
  }, []);

  const markAllRead = useCallback(() => {
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  }, []);

  const saveFertilizer = useCallback<AppValue["saveFertilizer"]>((item) => {
    setState((s) => {
      const exists = s.fertilizers.some((f) => f.id === item.id);
      return {
        ...s,
        fertilizers: exists
          ? s.fertilizers.map((f) => (f.id === item.id ? item : f))
          : [item, ...s.fertilizers],
      };
    });
    upsert("fertilizers", fertilizerToRow(item));
    toast.success(translate(load().lang, "toast.saved"));
  }, []);

  const deleteFertilizer = useCallback((id: string) => {
    setState((s) => ({ ...s, fertilizers: s.fertilizers.filter((f) => f.id !== id) }));
    remove("fertilizers", id);
    toast.success(translate(load().lang, "toast.deleted"));
  }, []);

  const saveMaterial = useCallback<AppValue["saveMaterial"]>((item) => {
    setState((s) => {
      const exists = s.materials.some((m) => m.id === item.id);
      return {
        ...s,
        materials: exists
          ? s.materials.map((m) => (m.id === item.id ? item : m))
          : [item, ...s.materials],
      };
    });
    upsert("farm_materials", materialToRow(item));
    toast.success(translate(load().lang, "toast.saved"));
  }, []);

  const deleteMaterial = useCallback((id: string) => {
    setState((s) => ({ ...s, materials: s.materials.filter((m) => m.id !== id) }));
    remove("farm_materials", id);
    toast.success(translate(load().lang, "toast.deleted"));
  }, []);

  const subscription = useMemo<Subscription>(() => {
    const mine = currentFarmer
      ? state.payments.filter((p) => p.farmerId === currentFarmer.id)
      : [];
    const approved = mine.find((p) => p.status === "approved");
    const pending = mine.find((p) => p.status === "pending");
    const status: Subscription["status"] = approved ? "active" : pending ? "pending" : "expired";
    const renews = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
    return { plan: "landing.plan", amount: PLAN_AMOUNT, status, renews };
  }, [currentFarmer, state.payments]);

  const weatherFor = useCallback((district: string) => buildWeather(district), []);
  const setSectorHint = useCallback((district: string) => SECTORS[district] ?? [], []);

  const value: AppValue = {
    ...state,
    t,
    setLang,
    toggleTheme,
    cropName,
    loginFarmer,
    loginFarmerWithPassword,
    loginAdmin,
    registerFarmer,
    logout,
    currentFarmer,
    adminName: ADMIN_USER.fullName,
    defaultPassword: DEFAULT_PASSWORD,
    passwordForPhone,
    addRecord,
    deleteRecord,
    publishPrice,
    addGuide,
    setFarmerStatus,
    addFarmer,
    updateFarmer,
    deleteFarmer,
    deletePrice,
    deleteGuide,
    sendBroadcast,
    grantSubscription,
    submitPayment,
    decidePayment,
    markAllRead,
    saveFertilizer,
    deleteFertilizer,
    saveMaterial,
    deleteMaterial,
    subscription,
    weatherFor,
    setSectorHint,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export { PLAN_AMOUNT };