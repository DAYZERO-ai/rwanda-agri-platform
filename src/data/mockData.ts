import type {
  Crop,
  FarmRecord,
  Farmer,
  Guide,
  MarketPrice,
  NotificationItem,
  PaymentRequest,
  Weather,
  WeatherDay,
  WeatherKind,
} from "../types";

export const CROPS: Crop[] = [
  { id: "maize", name: "Maize", nameRw: "Ibigori", color: "#e5a93c" },
  { id: "beans", name: "Beans", nameRw: "Ibishyimbo", color: "#b45309" },
  { id: "potato", name: "Irish Potatoes", nameRw: "Ibirayi", color: "#a16207" },
  { id: "rice", name: "Rice", nameRw: "Umuceri", color: "#0ea5a5" },
  { id: "tea", name: "Tea", nameRw: "Icyayi", color: "#1b6b3e" },
  { id: "coffee", name: "Coffee", nameRw: "Ikawa", color: "#7c4a2d" },
];

// Default password issued to every new farmer on registration (changeable by admin).
export const DEFAULT_PASSWORD = "rwandaagri2025";

// Every farmer's confirmation password is derived from their phone number:
// the last digit of the phone, followed by the fixed suffix "rwanda2026".
export const PASSWORD_SUFFIX = "rwanda2026";
export function passwordForPhone(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  const last = digits.slice(-1) || "0";
  return `${last}${PASSWORD_SUFFIX}`;
}
// Administrator credentials.
export const ADMIN_PASSWORD = "admin@rwandaagri";

// All 30 districts of Rwanda (Kigali City 3 + Eastern 7 + Northern 5 + Southern 8 + Western 7).
export const DISTRICTS = [
  "Gasabo",
  "Kicukiro",
  "Nyarugenge",
  "Bugesera",
  "Gatsibo",
  "Kayonza",
  "Kirehe",
  "Ngoma",
  "Nyagatare",
  "Rwamagana",
  "Burera",
  "Gakenke",
  "Gicumbi",
  "Musanze",
  "Rulindo",
  "Gisagara",
  "Huye",
  "Kamonyi",
  "Muhanga",
  "Nyamagabe",
  "Nyanza",
  "Nyaruguru",
  "Ruhango",
  "Karongi",
  "Ngororero",
  "Nyabihu",
  "Nyamasheke",
  "Rubavu",
  "Rusizi",
  "Rutsiro",
] as const;

export const SECTORS: Record<string, string[]> = {
  Gasabo: ["Remera", "Kigali", "Nyarugunga"],
  Kicukiro: ["Niboye", "Kicukiro", "Gahanga"],
  Nyarugenge: ["Nyamirambo", "Nyarugenge", "Rusizi"],
  Bugesera: ["Nyamata", "Ruhuha", "Rilima"],
  Gatsibo: ["Nyagihanga", "Gitoki", "Rwimikoni"],
  Kayonza: ["Kabarondo", "Mukarange", "Ndego"],
  Kirehe: ["Nyamugali", "Mukoyamazuba", "Gahara"],
  Ngoma: ["Shyogwe", "Mugesera", "Murama"],
  Nyagatare: ["Nyagatare", "Karangazi", "Rwimiyaga"],
  Rwamagana: ["Rwamagana", "Muhazi", "Zone"],
  Burera: ["Cyanika", "Gisenyi", "Ngeri"],
  Gakenke: ["Gakenke", "Ruli", "Mugwera"],
  Gicumbi: ["Byumba", "Rushaki", "Shangasha"],
  Musanze: ["Muhoza", "Cyuve", "Remera"],
  Rulindo: ["Base", "Shyororo", "Kanombe"],
  Gisagara: ["Nyanza", "Gikinyi", "Mamba"],
  Huye: ["Ngoma", "Tumba", "Mukura"],
  Kamonyi: ["Kamonyi", "Runda", "Cwa"],
  Muhanga: ["Muhanga", "Shyogwe", "Nyamabuye"],
  Nyamagabe: ["Gasaka", "Kaduha", "Tare"],
  Nyanza: ["Nyanza", "Busasamana", "Mukingo"],
  Nyaruguru: ["Nyagisubi", "Munini", "Cyivo"],
  Ruhango: ["Ruhango", "Buhoro", "Kinazi"],
  Karongi: ["Kibungo", "Gishyita", "Mubamba"],
  Ngororero: ["Ngororero", "Nyange", "Kivumu"],
  Nyabihu: ["Jenda", "Karanda", "Mukura"],
  Nyamasheke: ["Nyamasheke", "Kanjongo", "Rusatira"],
  Rubavu: ["Gisenyi", "Rubavu", "Nyamyumba"],
  Rusizi: ["Nyungu", "Bugarama", "Bujumbura"],
  Rutsiro: ["Rutsiro", "Boneza", "Gishyita"],
};

export const MARKETS: Record<string, string> = Object.fromEntries(
  DISTRICTS.map((d) => [d, `${d} Central Market`]),
);

const BASE: Record<string, number> = {
  maize: 480,
  beans: 900,
  potato: 420,
  rice: 1250,
  tea: 320,
  coffee: 2100,
};

function districtFactor(district: string): number {
  // Deterministic 0.90 - 1.08 spread derived from the district name.
  const seed = district.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return 0.9 + ((seed % 19) / 100);
}

const today = () => new Date().toISOString().slice(0, 10);

function buildPrices(): MarketPrice[] {
  const rows: MarketPrice[] = [];
  CROPS.forEach((crop) => {
    DISTRICTS.forEach((district, i) => {
      const base = BASE[crop.id] * districtFactor(district);
      const retail = Math.round(base * (1 + (i % 3) * 0.04));
      const wholesale = Math.round(retail * 0.86);
      const drift = 1 + (((i * 7) % 5) - 2) / 100;
      rows.push({
        id: `mp-${crop.id}-${district.toLowerCase()}`,
        cropId: crop.id,
        district,
        market: MARKETS[district],
        retail,
        wholesale,
        previous: Math.round(retail / drift),
        unit: "RWF/kg",
        date: today(),
        published: true,
      });
    });
  });
  return rows;
}

export const MARKET_PRICES: MarketPrice[] = buildPrices();

export const CATEGORIES = [
  "cat.seeds",
  "cat.fertilizer",
  "cat.pesticides",
  "cat.labor",
  "cat.transport",
  "cat.equipment",
  "cat.irrigation",
  "cat.other",
];

export const DISTRICTS_COORDS = DISTRICTS;

function days(district: string): WeatherDay[] {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const labelsRw = ["Kuwa mbere", "Kuwa kabiri", "Kuwa gatatu", "Kuwa kane", "Kuwa gatanu"];
  const kinds: WeatherKind[] = ["sun", "cloud", "rain", "storm", "cloud"];
  const seed = district.length;
  return labels.map((label, i) => ({
    label,
    labelRw: labelsRw[i],
    kind: kinds[(i + seed) % kinds.length],
    max: 22 + ((seed + i * 3) % 6),
    min: 12 + ((seed + i) % 4),
    rain: (seed * 7 + i * 13) % 90,
  }));
}

export function buildWeather(district: string): Weather {
  const seed = district.length;
  const d = days(district);
  return {
    district,
    temp: 24 + (seed % 4),
    humidity: 62 + (seed % 15),
    wind: 6 + (seed % 6),
    rainChance: 40 + (seed % 40),
    kind: d[0].kind,
    days: d,
  };
}

const GUIDE_SEED: Guide[] = [
  {
    id: "g-maize",
    cropId: "maize",
    title: "Maize: Season A to storage",
    titleRw: "Ibigori: Igihe A kugera kubika",
    summary: "Land preparation, spacing, Fall Armyworm defence and PICS bag storage.",
    summaryRw: "Gutegura ubutaka, intera, kurwanya udukoko na kubika mu masaho ya PICS.",
    season: "Season A / Igihe A",
    duration: "9 min",
    video: "maize",
    steps: [
      { en: "Plough and add 2 tonnes of manure per hectare before first rains.", rw: "Hingisha hanyuma ushyire ifumbire 2t kuri hegitari mbere y'imvura." },
      { en: "Plant improved RAB seed at 75cm by 25cm spacing, two seeds per hole.", rw: "Tera imbuto nziza ya RAB ku ntera ya 75cm na 25cm, imbuto ebyiri mu mwobo." },
      { en: "Scout weekly for Fall Armyworm and hand pick larvae early.", rw: "Kurikirana buri cyumweru udukoko twinshi maze ukubure utubyirinzi hakiri kare." },
      { en: "Harvest at 18% moisture, dry on a raised mat, then store in PICS bags.", rw: "Sarura kuri 18% ubuhehere, umishe ku giti, ubike mu masaho ya PICS." },
    ],
  },
  {
    id: "g-beans",
    cropId: "beans",
    title: "Beans: intercropping and seed saving",
    titleRw: "Ibishyimbo: guhuza ibihingwa no kubika imbuto",
    summary: "Variety choice, climbing stakes and post harvest handling.",
    summaryRw: "Guhitamo ubwoko, inkoni zo kuzamuka na kubungabunga umusaruro.",
    season: "Season B / Igihe B",
    duration: "7 min",
    video: "beans",
    steps: [
      { en: "Choose a bush or climbing variety that matches your altitude.", rw: "Hitamo ubwoko buhuye n'ubutumburuke bwawe." },
      { en: "Sow in rows 50cm apart with 10cm between plants.", rw: "Bitera mu mirongo ya 50cm, 10cm hagati y'ibimera." },
      { en: "Provide stakes for climbing types and weed twice early.", rw: "Shyiraho inkoni ku bwoko buzamuka kandi ubature kabiri hakiri kare." },
      { en: "Dry pods on tarpaulin and treat seed with ash before storing.", rw: "Anika ibishishwa ku rukarakara hanyuma ushyire ivu ku mbuto mbere yo kubika." },
    ],
  },
  {
    id: "g-potato",
    cropId: "potato",
    title: "Irish Potatoes: beating Late Blight",
    titleRw: "Ibirayi: kurwanya indwara y'ibishishwa",
    summary: "Clean seed, ridging and fungicide timing in the volcanic highlands.",
    summaryRw: "Imbuto zisukuye, gukora ibiraro no gihe cy'umuti mu misozi.",
    season: "Season A / Igihe A",
    duration: "8 min",
    video: "potato",
    steps: [
      { en: "Use certified seed tubers and rotate away from potato for two seasons.", rw: "Koresha imbuto zemewe kandi uhindure ibihingwa ibihe bibiri." },
      { en: "Ridge the soil 30cm high to protect tubers from rain.", rw: "Ubake ibiraro 30cm byo kurengera ibirayi ku mvura." },
      { en: "Apply protective fungicide every 10 days once leaves close the rows.", rw: "Shyira umuti wo kurinda buri minsi 10 amababi iyo ashyize hamwe." },
      { en: "Dehaulm two weeks before harvest to harden the skin.", rw: "Kuraho amababi ibyumweru bibiri mbere y'isarura kugira ngo uruhu rukomere." },
    ],
  },
  {
    id: "g-rice",
    cropId: "rice",
    title: "Rice: paddy water management",
    titleRw: "Umuceri: gucunga amazi mu gishanga",
    summary: "Transplanting age, water depth and bird scaring in marshland schemes.",
    summaryRw: "Igihe cyo guhindura, uburebure bw'amazi no kwirukana inyoni.",
    season: "Season B / Igihe B",
    duration: "11 min",
    video: "rice",
    steps: [
      { en: "Transplant 21 day old seedlings, two to three per hill.", rw: "Hindura uruto rw'iminsi 21, imbuto ebyiri cyangwa eshatu mu mwobo." },
      { en: "Maintain 3cm water depth and drain before top dressing.", rw: "Bungabunga amazi ya 3cm hanyuma utambike mbere yo kongeramo ifumbire." },
      { en: "Keep bunds repaired so each plot holds water evenly.", rw: "Sana imbibi kugira ngo amazi agume mu murima wose." },
      { en: "Drain the field 10 days before harvest for uniform ripening.", rw: "Tambika umurima iminsi 10 mbere y'isarura kugira ngo byose byumye." },
    ],
  },
  {
    id: "g-tea",
    cropId: "tea",
    title: "Tea: plucking and field recovery",
    titleRw: "Icyayi: gusarura no kuvugurura umurima",
    summary: "Plucking standards, pruning cycles and fertilizer for smallholders.",
    summaryRw: "Amahame y'isarura, gihe cyo gutema n'ifumbire ku bahinzi bato.",
    season: "All year / Umwaka wose",
    duration: "6 min",
    video: "tea",
    steps: [
      { en: "Pluck two leaves and a bud every 14 to 21 days.", rw: "Sarura amababi abiri n'akabuto buri minsi 14 kugeza 21." },
      { en: "Apply NPK 25:5:5 after each plucking round in the wet season.", rw: "Shyira NPK 25:5:5 nyuma ya buri gusarura mu gihe cy'imvura." },
      { en: "Prune every three to four years to renew plucking table.", rw: "Tema buri myaka itatu cyangwa ine kuvugurura urwego rw'isarura." },
      { en: "Deliver green leaf the same day to keep quality grade high.", rw: "Tanga amababi ku munsi umwe kugira ngo ubuziranenge bwiyongere." },
    ],
  },
  {
    id: "g-coffee",
    cropId: "coffee",
    title: "Coffee: cherry selection and pulping",
    titleRw: "Ikawa: guhitamo imbuto no gusya",
    summary: "Selective picking, floating, fermentation and raised bed drying.",
    summaryRw: "Gusarura guhitamo, kureremba, gutoranya no kumisha ku ntebe.",
    season: "Harvest / Igihe cy'isarura",
    duration: "12 min",
    video: "coffee",
    steps: [
      { en: "Pick only red cherries and keep ground falls separate.", rw: "Sarura imbuto zitukura gusa kandi zitandukanye n'izaguye." },
      { en: "Float cherries in water and remove any that float.", rw: "Reba imbuto mu mazi hanyuma ukureho izireremba." },
      { en: "Ferment 12 to 18 hours then wash channels until water runs clear.", rw: "Tunganya amasaha 12-18 hanyuma ukarabe kugeza amazi yeza." },
      { en: "Dry on raised beds for 12 days, turning every two hours.", rw: "Misha ku ntebe iminsi 12, uhindura buri masaha abiri." },
    ],
  },
];

const IMG = "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/08d11f00-1530-4ef4-946f-8d73d3a6b3a1";
const WALLPAPER: Record<string, string> = {
  maize: `${IMG}/maize-wallpaper-f6ece67c-1793008048072.webp`,
  beans: `${IMG}/beans-wallpaper-81602f13-1793008048219.webp`,
  potato: `${IMG}/potato-wallpaper-c8047013-1793008047857.webp`,
  rice: `${IMG}/rice-wallpaper-1a15069d-1793008048063.webp`,
  tea: `${IMG}/tea-wallpaper-7534a22d-1793008080705.webp`,
  coffee: `${IMG}/coffee-wallpaper-da0e59a3-1793008049584.webp`,
};
// Default tutorial video (admin can replace per crop from the dashboard).
const DEFAULT_YT = "https://www.youtube.com/embed/ScMzIvxBSi4";

export const GUIDES: Guide[] = GUIDE_SEED.map((g) => ({
  ...g,
  wallpaperUrl: WALLPAPER[g.cropId],
  youtubeUrl: g.youtubeUrl ?? DEFAULT_YT,
}));

const FARMER_SEED: Omit<Farmer, "password">[] = [
  {
    id: "f-jean",
    fullName: "Jean Bosco Mugabo",
    email: "jean.bosco@rwandaagri.rw",
    phone: "+250 788 412 905",
    district: "Musanze",
    sector: "Muhoza",
    cropId: "potato",
    status: "approved",
    joined: "2025-01-14",
    revenue: 1840000,
  },
  {
    id: "f-claudine",
    fullName: "Claudine Nyirahabimana",
    email: "claudine.n@rwandaagri.rw",
    phone: "+250 782 663 118",
    district: "Nyagatare",
    sector: "Karangazi",
    cropId: "maize",
    status: "approved",
    joined: "2025-02-02",
    revenue: 2260000,
  },
  {
    id: "f-emmanuel",
    fullName: "Emmanuel Habiyaremye",
    email: "emmanuel.h@rwandaagri.rw",
    phone: "+250 787 220 741",
    district: "Huye",
    sector: "Ngoma",
    cropId: "beans",
    status: "pending",
    joined: "2025-03-19",
    revenue: 640000,
  },
  {
    id: "f-vestine",
    fullName: "Vestine Mukamana",
    email: "vestine.m@rwandaagri.rw",
    phone: "+250 783 905 472",
    district: "Rubavu",
    sector: "Gisenyi",
    cropId: "coffee",
    status: "approved",
    joined: "2024-11-08",
    revenue: 3120000,
  },
  {
    id: "f-thierry",
    fullName: "Thierry Nsengimana",
    email: "thierry.n@rwandaagri.rw",
    phone: "+250 786 118 330",
    district: "Bugesera",
    sector: "Ruhuha",
    cropId: "rice",
    status: "pending",
    joined: "2025-04-01",
    revenue: 910000,
  },
];

export const DEMO_FARMERS: Farmer[] = FARMER_SEED.map((f) => ({
  ...f,
  password: DEFAULT_PASSWORD,
}));

export const ADMIN_USER = {
  id: "a-alice",
  fullName: "Alice Uwimana",
  email: "alice.uwimana@minagri.gov.rw",
  phone: "+250 788 000 121",
  password: ADMIN_PASSWORD,
};

function rec(
  id: string,
  type: "income" | "expense",
  cropId: string,
  quantity: number,
  unitPrice: number,
  category: string,
  party: string,
  notes: string,
  date: string,
): FarmRecord {
  return {
    id,
    farmerId: "f-jean",
    type,
    cropId,
    quantity,
    unitPrice,
    amount: Math.round(quantity * unitPrice),
    category,
    party,
    notes,
    date,
  };
}

export const DEMO_RECORDS: FarmRecord[] = [
  rec("r1", "income", "potato", 1200, 430, "", "Kimironko traders", "Season A first harvest", "2025-03-04"),
  rec("r2", "expense", "potato", 400, 620, "cat.seeds", "RAB Musanze", "Certified seed tubers", "2025-02-11"),
  rec("r3", "income", "maize", 800, 495, "", "Musanze Central", "Dry maize sale", "2025-03-18"),
  rec("r4", "expense", "maize", 250, 480, "cat.fertilizer", "Agro dealer", "NPK 17:17:17", "2025-02-20"),
  rec("r5", "expense", "potato", 0, 180000, "cat.labor", "Muhoza cooperative", "Ridging and weeding team", "2025-02-25"),
  rec("r6", "income", "beans", 350, 940, "", "Huye wholesaler", "Climbing bean harvest", "2025-04-02"),
  rec("r7", "expense", "beans", 0, 42000, "cat.transport", "Transport co-op", "Delivery to market", "2025-04-03"),
  rec("r8", "expense", "potato", 0, 65000, "cat.pesticides", "Agro dealer", "Late blight fungicide", "2025-02-28"),
  rec("r9", "income", "coffee", 280, 2150, "", "Rubavu washing station", "Red cherry delivery", "2025-04-15"),
  rec("r10", "expense", "maize", 0, 88000, "cat.irrigation", "Bugesera scheme", "Supplemental irrigation", "2025-03-07"),
];

export const DEMO_PAYMENTS: PaymentRequest[] = [
  {
    id: "p1",
    farmerId: "f-emmanuel",
    farmerName: "Emmanuel Habiyaremye",
    method: "momo",
    amount: 5000,
    txnId: "MOMO8841203",
    status: "pending",
    submitted: "2025-04-18",
  },
  {
    id: "p2",
    farmerId: "f-thierry",
    farmerName: "Thierry Nsengimana",
    method: "airtel",
    amount: 5000,
    txnId: "AIR9930217",
    status: "pending",
    submitted: "2025-04-19",
  },
  {
    id: "p3",
    farmerId: "f-vestine",
    farmerName: "Vestine Mukamana",
    method: "momo",
    amount: 5000,
    txnId: "MOMO7710554",
    status: "approved",
    submitted: "2025-03-21",
  },
];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    titleKey: "mkt.rising",
    bodyKey: "mkt.tip1",
    tone: "success",
    date: "2025-04-20",
    read: false,
  },
  {
    id: "n2",
    titleKey: "wth.a2",
    bodyKey: "wth.source",
    tone: "warn",
    date: "2025-04-19",
    read: false,
  },
  {
    id: "n3",
    titleKey: "sub.renews",
    bodyKey: "landing.plan",
    tone: "info",
    date: "2025-04-12",
    read: true,
  },
];

export type Trend = "rising" | "stable" | "falling";

export function trendOf(price: MarketPrice): Trend {
  const diff = price.retail - price.previous;
  if (diff > price.retail * 0.01) return "rising";
  if (diff < -price.retail * 0.01) return "falling";
  return "stable";
}

export const TREND_META: Record<Trend, { key: string; tip: string; tone: string }> = {
  rising: { key: "mkt.rising", tip: "mkt.tip1", tone: "text-emerald-600 dark:text-emerald-400" },
  stable: { key: "mkt.stable", tip: "mkt.tip2", tone: "text-amber-600 dark:text-amber-400" },
  falling: { key: "mkt.falling", tip: "mkt.tip3", tone: "text-rose-600 dark:text-rose-400" },
};