export type Lang = "en" | "rw";

export interface Crop {
  id: string;
  name: string;
  nameRw: string;
  color: string;
}

export interface FarmRecord {
  id: string;
  farmerId: string;
  type: "income" | "expense";
  cropId: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category: string;
  party: string;
  notes: string;
  date: string;
}

export interface MarketPrice {
  id: string;
  cropId: string;
  district: string;
  market: string;
  retail: number;
  wholesale: number;
  previous: number;
  unit: string;
  date: string;
  published: boolean;
}

export type WeatherKind = "sun" | "rain" | "cloud" | "storm";

export interface WeatherDay {
  label: string;
  labelRw: string;
  kind: WeatherKind;
  max: number;
  min: number;
  rain: number;
}

export interface Weather {
  district: string;
  temp: number;
  humidity: number;
  wind: number;
  rainChance: number;
  kind: WeatherKind;
  days: WeatherDay[];
}

export interface Guide {
  id: string;
  cropId: string;
  title: string;
  titleRw: string;
  summary: string;
  summaryRw: string;
  season: string;
  duration: string;
  video: string;
  youtubeUrl?: string;
  wallpaperUrl?: string;
  steps: { en: string; rw: string }[];
}

export interface Farmer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  district: string;
  sector: string;
  cropId: string;
  status: "approved" | "pending" | "rejected";
  joined: string;
  revenue: number;
  password: string;
}

export interface PaymentRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  method: "momo" | "airtel";
  amount: number;
  txnId: string;
  status: "pending" | "approved" | "rejected";
  submitted: string;
}

export interface Subscription {
  plan: string;
  amount: number;
  status: "active" | "pending" | "expired";
  renews: string;
}

export interface NotificationItem {
  id: string;
  titleKey: string;
  bodyKey: string;
  tone: "info" | "warn" | "success";
  date: string;
  read: boolean;
}

export interface Session {
  role: "farmer" | "admin";
  farmerId: string;
}

export interface FertilizerItem {
  id: string;
  name: string;
  nameRw: string;
  cropIds: string[];
  kgPerHectare: number;
  unitPriceFrw: number;
  imageUrl: string;
  description: string;
  descriptionRw: string;
  applicationStage: string;
}

export interface FarmMaterialItem {
  id: string;
  name: string;
  nameRw: string;
  cropIds: string[];
  quantityPerHectare: number;
  unit: string;
  unitPriceFrw: number;
  imageUrl: string;
  description: string;
  descriptionRw: string;
  category: string;
}

const en: Record<string, string> = {
  "app.name": "Rwanda Agri",
  "app.tagline": "Smart tools for every Rwandan farmer",
  "app.language": "Language",
  "app.dark": "Dark mode",
  "app.light": "Light mode",
  "nav.home": "Home",
  "nav.bookkeeping": "Farm books",
  "nav.market": "Market",
  "nav.weather": "Weather",
  "nav.learn": "Learn",
  "nav.billing": "Billing",
  "nav.admin": "Admin",
  "nav.dashboard": "Dashboard",
  "nav.login": "Login",
  "nav.logout": "Log out",
  "nav.notifications": "Notifications",
  "nav.guest": "Guest",
  "nav.farmer": "Farmer",
  "nav.adminRole": "Administrator",
  "nav.markAllRead": "Mark all read",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.export": "Export",
  "common.submit": "Submit",
  "common.search": "Search",
  "common.filter": "Filter",
  "common.close": "Close",
  "common.all": "All",
  "common.loading": "Loading data...",
  "common.noData": "No records found",
  "common.date": "Date",
  "common.amount": "Amount (RWF)",
  "common.notes": "Notes",
  "common.quantity": "Quantity (kg)",
  "common.total": "Total",
  "common.status": "Status",
  "common.edit": "Edit",
  "common.name": "Name",
  "common.phone": "Phone",
  "common.email": "Email",
  "common.district": "District",
  "common.sector": "Sector",
  "common.crop": "Crop",
  "landing.heroTitle": "Farm records, market prices and weather advice in your language",
  "landing.heroSub": "Rwanda Agri helps smallholder farmers track every franc of every harvest season.",
  "landing.ctaStart": "Create free account",
  "landing.ctaDemo": "Explore demo farmer",
  "landing.ctaAdmin": "Open admin dashboard",
  "landing.trust": "Aligned with MINAGRI and RAB guidance",
  "landing.ticker": "Today's markets",
  "landing.featuresTitle": "Everything a farm business needs",
  "landing.f1": "Farm bookkeeping",
  "landing.f1d": "Log sales and costs, then read profit and margin instantly in RWF.",
  "landing.f2": "Local market prices",
  "landing.f2d": "Compare retail and wholesale prices across Rwandan districts and markets.",
  "landing.f3": "Weather guidance",
  "landing.f3d": "Five day forecasts with advisories for spraying, irrigation and drying.",
  "landing.f4": "Learning centre",
  "landing.f4d": "Step by step guides for six key Rwandan crops, with video walkthroughs.",
  "landing.howTitle": "How it works",
  "landing.step1": "Register with your district",
  "landing.step1d": "Name, phone and district are enough to open your farm file.",
  "landing.step2": "Record every sale and cost",
  "landing.step2d": "Income and expense entries update your profit immediately.",
  "landing.step3": "Decide with live data",
  "landing.step3d": "Check market trends and weather advice before you plant or sell.",
  "landing.pricingTitle": "Simple pricing",
  "landing.plan": "Standard plan",
  "landing.perMonth": "per month",
  "landing.priceNote": "Pay with MTN MoMo or Airtel Money. Cancel any time.",
  "landing.priceF1": "Unlimited farm records",
  "landing.priceF2": "Every district market price",
  "landing.priceF3": "Weather advisory alerts",
  "landing.priceF4": "Six crop learning guides",
  "landing.footer": "Built for Rwandan farmers. Demo data shown for illustration only.",
  "auth.name": "Full name",
  "auth.createAccount": "Create account",
  "auth.loginTitle": "Farmer login",
  "auth.signupTitle": "Farmer registration",
  "auth.lastName": "Primary crop",
  "auth.loginBtn": "Login",
  "auth.haveAccount": "Already registered? Login",
  "auth.noAccount": "New here? Register",
  "auth.errFields": "Please fill in all required fields",
  "auth.errEmail": "Enter a valid email address",
  "auth.errPhone": "Enter a valid Rwandan phone number",
  "auth.errLogin": "Invalid email or password",
  "auth.errPassword": "Incorrect confirmation password",
  "auth.defaultPasswordNote": "Your default password",
  "auth.farmerLogin": "Farmer sign in",
  "auth.adminLogin": "Administrator sign in",
  "auth.password": "Password",
  "auth.signIn": "Sign in",
  "auth.adminHint": "Enter the administrator password to open the dashboard",
  "common.districts": "Districts",
  "farmer.welcome": "Welcome back",
  "farmer.activeCrops": "Active crops",
  "farmer.income": "Monthly revenue",
  "farmer.expense": "Monthly expenses",
  "farmer.profit": "Net profit",
  "farmer.margin": "Profit margin",
  "farmer.recent": "Recent transactions",
  "farmer.quick": "Quick actions",
  "farmer.seasonTip": "Season tip",
  "book.title": "Farm bookkeeping",
  "book.addIncome": "Add sale",
  "book.addExpense": "Add expense",
  "book.type": "Transaction type",
  "book.incomeType": "Income",
  "book.expenseType": "Expense",
  "book.category": "Expense category",
  "book.party": "Buyer or supplier",
  "book.from": "From",
  "book.to": "To",
  "book.exportCsv": "Export CSV",
  "book.print": "Print report",
  "book.filtered": "Filtered balance",
  "cat.seeds": "Seeds",
  "cat.fertilizer": "Fertilizer",
  "cat.pesticides": "Pesticides",
  "cat.labor": "Labour",
  "cat.transport": "Transport",
  "cat.equipment": "Equipment",
  "cat.irrigation": "Irrigation",
  "cat.other": "Other",
  "mkt.title": "Market price directory",
  "mkt.market": "Market",
  "mkt.retail": "Retail",
  "mkt.wholesale": "Wholesale",
  "mkt.priceKg": "Price per kg",
  "mkt.trend": "Trend",
  "mkt.rising": "Rising",
  "mkt.stable": "Stable",
  "mkt.falling": "Falling",
  "mkt.tip": "Selling tip",
  "mkt.tip1": "Prices are rising. Consider waiting a few days before selling.",
  "mkt.tip2": "Prices are stable. Sell when storage costs start to bite.",
  "mkt.tip3": "Prices are falling. Move your harvest to market quickly.",
  "mkt.alerts": "Price alerts",
  "mkt.setAlert": "Set alert",
  "mkt.updated": "Updated",
  "wth.title": "Weather and advisory",
  "wth.now": "Right now",
  "wth.temp": "Temperature",
  "wth.humidity": "Humidity",
  "wth.wind": "Wind",
  "wth.rain": "Rain chance",
  "wth.forecast": "5 day forecast",
  "wth.source": "Source: Rwanda Meteorology Agency (Meteo Rwanda)",
  "wth.advice": "Farming advisory",
  "wth.a1": "Good spraying days ahead: low wind and no heavy rain expected.",
  "wth.a2": "Rain is expected. Delay fertilizer and cover drying grain.",
  "wth.a3": "A dry week ahead. Irrigate young plants early in the morning.",
  "cond.sun": "Sunny",
  "cond.rain": "Rain",
  "cond.cloud": "Cloudy",
  "cond.storm": "Storms",
  "lrn.title": "Learning centre",
  "lrn.guides": "Crop guides",
  "lrn.watch": "Watch video",
  "lrn.season": "Season",
  "lrn.steps": "Steps",
  "lrn.video": "Video walkthrough",
  "lrn.videoNote": "Demo player. Real lessons are recorded with RAB extension officers.",
  "lrn.duration": "Duration",
  "sub.title": "Subscription and billing",
  "sub.plan": "Standard plan",
  "sub.status": "Subscription status",
  "sub.active": "Active",
  "sub.pending": "Pending verification",
  "sub.expired": "Expired",
  "sub.renews": "Next renewal",
  "sub.pay": "Pay with mobile money",
  "sub.momo": "MTN MoMo (182)",
  "sub.airtel": "Airtel Money",
  "sub.txn": "Transaction ID",
  "sub.submitPayment": "Submit payment",
  "sub.confirmPassword": "Confirm password",
  "sub.passwordRule": "Your password is the last digit of your phone number followed by rwanda2026.",
  "sub.renew": "Renew subscription",
  "sub.history": "Payment history",
  "adm.title": "Administrator dashboard",
  "adm.farmers": "Registered farmers",
  "adm.activeSubs": "Active subscriptions",
  "adm.revenue": "Recorded farm revenue",
  "adm.reports": "Published market reports",
  "adm.farmerMgmt": "Farmer management",
  "adm.verify": "Payment verification",
  "adm.publisher": "Market price publisher",
  "adm.content": "Learning content",
  "adm.broadcast": "Broadcast notice",
  "adm.addFarmer": "Add farmer",
  "adm.grantSub": "Grant subscription",
  "adm.editFarmer": "Edit farmer",
  "adm.broadcastTitle": "Notice title",
  "adm.broadcastBody": "Notice message",
  "adm.sendNotice": "Send to all farmers",
  "adm.saveFarmer": "Save farmer",
  "adm.approve": "Approve",
  "adm.reject": "Reject",
  "adm.publish": "Publish price",
  "adm.addGuide": "Add guide",
  "adm.pendingPayments": "Payments awaiting review",
  "adm.analytics": "Platform analytics",
  "adm.txn": "Transaction ID",
  "nav.inputs": "Inputs & tools",
  "inp.title": "Fertilizers & materials",
  "inp.sub": "Choose your crops and the size of your land to see the fertilizer and tools you need.",
  "inp.crops": "Your crops",
  "inp.area": "Land size",
  "inp.unit": "Unit",
  "inp.ha": "Hectares",
  "inp.are": "Ares",
  "inp.acre": "Acres",
  "inp.fertilizers": "Recommended fertilizers",
  "inp.materials": "Materials & tools (Ibikoresho)",
  "inp.need": "You need",
  "inp.unitPrice": "Unit price",
  "inp.totalCost": "Total cost",
  "inp.grandTotal": "Estimated budget",
  "inp.perHa": "kg per hectare",
  "inp.perUnit": "per",
  "inp.noneF": "No fertilizer is registered for the selected crops yet.",
  "inp.noneM": "No materials are registered for the selected crops yet.",
  "inp.stage": "When to apply",
  "inp.tip": "Prices are approximate Rwanda market prices in FRW and may change.",
  "inp.print": "Print budget sheet",
  "inp.empty": "Select at least one crop to start the estimate.",
  "inp.loading": "Loading catalog...",
  "inp.areaHa": "Area used",
  "inp.fertilizerTotal": "Fertilizers total",
  "inp.materialTotal": "Materials total",
  "adm.inputs": "Fertilizers & materials",
  "adm.addFertilizer": "Add fertilizer",
  "adm.addMaterial": "Add material",
  "adm.editFertilizer": "Edit fertilizer",
  "adm.editMaterial": "Edit material",
  "adm.kgPerHa": "Kg per hectare",
  "adm.qtyPerHa": "Quantity per hectare",
  "adm.unitPriceFrw": "Unit price (FRW)",
  "adm.imageUrl": "Image URL",
  "adm.cropsLinked": "Applies to crops",
  "adm.sample": "Sample for 1 ha",
  "adm.category": "Category",
  "adm.unitLabel": "Unit",
  "adm.stageLabel": "Application stage",
  "adm.description": "Description",
  "adm.noCatalog": "Nothing registered yet. Add your first item above.",
  "toast.saved": "Record saved successfully",
  "toast.deleted": "Record deleted",
  "toast.paymentSent": "Payment submitted for verification",
  "toast.approved": "Payment approved",
  "toast.rejected": "Payment rejected",
  "toast.pricePublished": "Market price published",
  "toast.loginOk": "Signed in successfully",
  "toast.logoutOk": "You are signed out",
  "toast.guideAdded": "Learning guide added",
  "toast.alertSet": "Price alert created",
  "toast.farmerAdded": "Farmer account created",
};

const rw: Record<string, string> = {
  "app.name": "Ubuhinzi Rwanda",
  "app.tagline": "Ibikoresho by'ubwenge ku muhinzi wese wo mu Rwanda",
  "app.language": "Ururimi",
  "app.dark": "Uburyo bwijimye",
  "app.light": "Uburyo bweruye",
  "nav.home": "Ahabanza",
  "nav.bookkeeping": "Ibitabo",
  "nav.market": "Isoko",
  "nav.weather": "Ikirere",
  "nav.learn": "Kwiga",
  "nav.billing": "Kwishyura",
  "nav.admin": "Ubuyobozi",
  "nav.dashboard": "Imbonerahamwe",
  "nav.login": "Injira",
  "nav.logout": "Sohoka",
  "nav.notifications": "Amatangazo",
  "nav.guest": "Mushyitsi",
  "nav.farmer": "Umuhinzi",
  "nav.adminRole": "Umuyobozi",
  "nav.markAllRead": "Byose byasomwe",
  "common.save": "Bika",
  "common.cancel": "Reka",
  "common.delete": "Siba",
  "common.export": "Kuramo",
  "common.submit": "Ohereza",
  "common.search": "Shakisha",
  "common.filter": "Shungura",
  "common.close": "Funga",
  "common.all": "Byose",
  "common.loading": "Amakuru aratunganywa...",
  "common.noData": "Nta makuru abonetse",
  "common.date": "Itariki",
  "common.amount": "Amafaranga (RWF)",
  "common.notes": "Ibisobanuro",
  "common.quantity": "Ingano (kg)",
  "common.total": "Byose hamwe",
  "common.status": "Imimerere",
  "common.edit": "Hindura",
  "common.view": "Reba",
  "common.name": "Amazina",
  "common.phone": "Telefone",
  "common.email": "Imeyili",
  "common.district": "Akarere",
  "common.sector": "Umurenge",
  "common.crop": "Igihingwa",
  "landing.heroTitle": "Ibitabo by'ubuhinzi, ibiciro by'isoko n'iteganyagihe mu rurimi rwawe",
  "landing.heroSub": "Ubuhinzi Rwanda bufasha abahinzi bato gukurikirana amafaranga n'isarura.",
  "landing.ctaStart": "Fungura konti ku buntu",
  "landing.ctaDemo": "Reba umuhinzi w'urugero",
  "landing.ctaAdmin": "Fungura ubuyobozi",
  "landing.trust": "Bihuye n'amabwiriza ya MINAGRI na RAB",
  "landing.ticker": "Amasoko y'uyu munsi",
  "landing.featuresTitle": "Ibikenewe byose mu bucuruzi bw'ubuhinzi",
  "landing.f1": "Ibitabo by'ubuhinzi",
  "landing.f1d": "Andika ibyacurujwe n'ibyakoreshejwe, urebe inyungu ako kanya muri RWF.",
  "landing.f2": "Ibiciro by'isoko hafi aho",
  "landing.f2d": "Gereranya ibiciro byo ku isoko no mu maduka mu turere dutandukanye.",
  "landing.f3": "Iteganyagihe n'inama",
  "landing.f3d": "Iteganyagihe ry'iminsi itanu n'inama ku gufumbira no kumisha.",
  "landing.f4": "Ikigo cyo kwiga",
  "landing.f4d": "Inama ku bimera by'ingenzi bitandatu by'u Rwanda, n'amashusho.",
  "landing.howTitle": "Bikorwa gute",
  "landing.step1": "Iyandikishe n'akarere kawe",
  "landing.step1d": "Amazina, telefone n'akarere birahagije gufungura dosiye yawe.",
  "landing.step2": "Andika buri kugurisha n'ikiguzi",
  "landing.step2d": "Inyungu ihinduka ako kanya iyo wanditse ibyinjira n'ibisohoka.",
  "landing.step3": "Fata ibyemezo n'amakuru mashya",
  "landing.step3d": "Koresha ibiciro n'iteganyagihe mbere yo guhinga cyangwa kugurisha.",
  "landing.pricingTitle": "Igiciro cyoroshye",
  "landing.plan": "Ifatabuguzi rusange",
  "landing.perMonth": "ku kwezi",
  "landing.priceNote": "Wishyura na MTN MoMo cyangwa Airtel Money. Uhagarika igihe ushakiye.",
  "landing.priceF1": "Ibitabo bitagira umupaka",
  "landing.priceF2": "Ibiciro by'uturere twose",
  "landing.priceF3": "Amatangazo y'iteganyagihe",
  "landing.priceF4": "Inama ku bimera bitandatu",
  "landing.footer": "Yakorewe abahinzi b'u Rwanda. Amakuru y'urugero gusa.",
  "auth.name": "Amazina yombi",
  "auth.createAccount": "Fungura konti",
  "auth.loginTitle": "Kwinjira kw'umuhinzi",
  "auth.signupTitle": "Kwiyandikisha kw'umuhinzi",
  "auth.lastName": "Igihingwa gikuru",
  "auth.loginBtn": "Injira",
  "auth.haveAccount": "Usanzwe ufite konti? Injira",
  "auth.noAccount": "Uri mushya? Iyandikishe",
  "auth.errFields": "Uzuza imyanya yose iteganijwe",
  "auth.errEmail": "Andika imeyili yemewe",
  "auth.errPhone": "Andika numero ya telefone yo mu Rwanda",
  "auth.errLogin": "Imeyili cyangwa ijambo ry'ibanga si byo",
  "auth.errPassword": "Ijambo ry'ibanga ryo kwemeza si ryo",
  "auth.defaultPasswordNote": "Ijambo ry'ibanga ryawe risanzwe",
  "auth.farmerLogin": "Kwinjira kw'umuhinzi",
  "auth.adminLogin": "Kwinjira kw'umuyobozi",
  "auth.password": "Ijambo ry'ibanga",
  "auth.signIn": "Injira",
  "auth.adminHint": "Andika ijambo ry'ibanga ry'umuyobozi kugira ngo ufungure imbonerahamwe",
  "common.districts": "Uturere",
  "farmer.welcome": "Murakaza neza",
  "farmer.activeCrops": "Ibihingwa biri guhingwa",
  "farmer.income": "Amafaranga yinjiye ukwezi",
  "farmer.expense": "Amafaranga yakoreshejwe",
  "farmer.profit": "Inyungu isigaye",
  "farmer.margin": "Ijanisha ry'inyungu",
  "farmer.recent": "Ibikorwa biheruka",
  "farmer.quick": "Ibikorwa byihuse",
  "farmer.seasonTip": "Inama z'igihe",
  "book.title": "Ibitabo by'ubuhinzi",
  "book.addIncome": "Ongeraho igurisha",
  "book.addExpense": "Ongeraho ikiguzi",
  "book.type": "Ubwoko bw'igikorwa",
  "book.incomeType": "Amafaranga yinjiye",
  "book.expenseType": "Ikiguzi",
  "book.category": "Icyiciro cy'ikiguzi",
  "book.party": "Ugura cyangwa utanga",
  "book.from": "Kuva",
  "book.to": "Kugeza",
  "book.exportCsv": "Kuramo CSV",
  "book.print": "Printa raporo",
  "book.filtered": "Amafaranga muri iki gihe",
  "cat.seeds": "Imbuto",
  "cat.fertilizer": "Ifumbire",
  "cat.pesticides": "Ibiti byica udukoko",
  "cat.labor": "Abakozi",
  "cat.transport": "Gutwara",
  "cat.equipment": "Ibikoresho",
  "cat.irrigation": "Kuhira",
  "cat.other": "Ibindi",
  "mkt.title": "Urutonde rw'ibiciro by'isoko",
  "mkt.market": "Isoko",
  "mkt.retail": "Isoko rito",
  "mkt.wholesale": "Isoko rinini",
  "mkt.priceKg": "Igiciro ku kilo",
  "mkt.trend": "Icyerekezo",
  "mkt.rising": "Kuzamuka",
  "mkt.stable": "Guhagarara",
  "mkt.falling": "Kugwa",
  "mkt.tip": "Inama yo kugurisha",
  "mkt.tip1": "Ibiciro birazamuka. Tegereza iminsi mike mbere yo kugurisha.",
  "mkt.tip2": "Ibiciro bihagaze. Gurisha igihe kubika bishyize uku.",
  "mkt.tip3": "Ibiciro biragwa. Gurisha umusaruro wawe vuba.",
  "mkt.alerts": "Amatangazo y'ibiciro",
  "mkt.setAlert": "Shyiraho itangazo",
  "mkt.updated": "Byavuguruwe",
  "wth.title": "Ikirere n'inama",
  "wth.now": "Ubu",
  "wth.temp": "Ubushyuhe",
  "wth.humidity": "Ubuhehere",
  "wth.wind": "Umuyaga",
  "wth.rain": "Amahirwe y'imvura",
  "wth.forecast": "Iteganyagihe ry'iminsi 5",
  "wth.source": "Inkomoko: Ikigo cy'ikirere cy'u Rwanda (Meteo Rwanda)",
  "wth.advice": "Inama z'ubuhinzi",
  "wth.a1": "Iminsi myiza yo gufumbira: umuyaga muke nta mvura nyinshi iteganyijwe.",
  "wth.a2": "Imvura irateganyijwe. Tegereza ifumbire kandi ukinge imyaka yumye.",
  "wth.a3": "Icyumweru kirakaze. Hira ibimera bishya mu gitondo.",
  "cond.sun": "Izuba",
  "cond.rain": "Imvura",
  "cond.cloud": "Ibicu",
  "cond.storm": "Inkuba",
  "lrn.title": "Ikigo cyo kwiga",
  "lrn.guides": "Inama ku bihingwa",
  "lrn.watch": "Reba videwo",
  "lrn.season": "Igihe",
  "lrn.steps": "Intambwe",
  "lrn.video": "Inama z'amashusho",
  "lrn.videoNote": "Urugero rwa videwo. Amasomo nyayo afatwa n'abakozi ba RAB.",
  "lrn.duration": "Igihe",
  "sub.title": "Ifatabuguzi n'ubwishyu",
  "sub.plan": "Ifatabuguzi rusange",
  "sub.status": "Imimerere y'ifatabuguzi",
  "sub.active": "Irakora",
  "sub.pending": "Itegereje kwemezwa",
  "sub.expired": "Yarangiye",
  "sub.renews": "Guvugurura kukurikira",
  "sub.pay": "Wishyura na mobile money",
  "sub.momo": "MTN MoMo (182)",
  "sub.airtel": "Airtel Money",
  "sub.txn": "Nomero y'ubwishyu",
  "sub.submitPayment": "Ohereza ubwishyu",
  "sub.confirmPassword": "Kwemeza ijambo ry'ibanga",
  "sub.passwordRule": "Ijambo ry'ibanga ni umubare wa nyuma wa telefone yawe ukurikirwa na rwanda2026.",
  "sub.renew": "Vugurura ifatabuguzi",
  "sub.history": "Amateka y'ubwishyu",
  "adm.title": "Ubuyobozi",
  "adm.farmers": "Abahinzi biyandikishije",
  "adm.activeSubs": "Ifatabuguzi zikora",
  "adm.revenue": "Amafaranga yanditswe",
  "adm.reports": "Raporo z'isoko zatangajwe",
  "adm.farmerMgmt": "Gucunga abahinzi",
  "adm.verify": "Kwemeza ubwishyu",
  "adm.publisher": "Gutangaza ibiciro",
  "adm.content": "Inama zo kwiga",
  "adm.broadcast": "Itangazo ry'ubutumwa",
  "adm.addFarmer": "Ongeraho umuhinzi",
  "adm.grantSub": "Ha ubwishingizi",
  "adm.editFarmer": "Hindura umuhinzi",
  "adm.broadcastTitle": "Umutwe w'itangazo",
  "adm.broadcastBody": "Ubutumwa bw'itangazo",
  "adm.sendNotice": "Ohereza ku bahinzi bose",
  "adm.saveFarmer": "Bika umuhinzi",
  "adm.approve": "Emeza",
  "adm.reject": "Anga",
  "adm.publish": "Tangaza igiciro",
  "adm.addGuide": "Ongeraho inama",
  "adm.pendingPayments": "Ubwishyu butegereje",
  "adm.analytics": "Isesengura ry'urubuga",
  "adm.txn": "Nomero y'ubwishyu",
  "nav.inputs": "Ifumbire n'Ibikoresho",
  "inp.title": "Ifumbire n'ibikoresho",
  "inp.sub": "Hitamo ibihingwa n'ubunini bw'ubutaka bwawe kugira ngo urebe ifumbire n'ibikoresho ubikeneye.",
  "inp.crops": "Ibihingwa byawe",
  "inp.area": "Ubuso bw'ubutaka",
  "inp.unit": "Igipimo",
  "inp.ha": "Hegitari",
  "inp.are": "Ari",
  "inp.acre": "Akeri",
  "inp.fertilizers": "Ifumbire isabwa",
  "inp.materials": "Ibikoresho bikenewe",
  "inp.need": "Ukeneye",
  "inp.unitPrice": "Igiciro cya kimwe",
  "inp.totalCost": "Igiciro cyose",
  "inp.grandTotal": "Ingengo y'imari",
  "inp.perHa": "kg kuri hegitari",
  "inp.perUnit": "kuri",
  "inp.noneF": "Nta fumbire yanditswe ku bihingwa wahisemo.",
  "inp.noneM": "Nta bikoresho byanditswe ku bihingwa wahisemo.",
  "inp.stage": "Igihe cyo gutera",
  "inp.tip": "Ibiciro ni ibigereranyo by'isoko ry'u Rwanda muri FRW kandi bishobora guhinduka.",
  "inp.print": "Printa ingengo y'imari",
  "inp.empty": "Hitamo nibura igihingwa kimwe kugira ngo utangire.",
  "inp.loading": "Urutonde ruratunganywa...",
  "inp.areaHa": "Ubuso bwakoreshejwe",
  "inp.fertilizerTotal": "Ifumbire yose",
  "inp.materialTotal": "Ibikoresho byose",
  "adm.inputs": "Ifumbire n'ibikoresho",
  "adm.addFertilizer": "Ongeraho ifumbire",
  "adm.addMaterial": "Ongeraho igikoresho",
  "adm.editFertilizer": "Hindura ifumbire",
  "adm.editMaterial": "Hindura igikoresho",
  "adm.kgPerHa": "Kg kuri hegitari",
  "adm.qtyPerHa": "Ingano kuri hegitari",
  "adm.unitPriceFrw": "Igiciro (FRW)",
  "adm.imageUrl": "Aderesi y'ifoto",
  "adm.cropsLinked": "Bikorerwa ku bihingwa",
  "adm.sample": "Urugero kuri hegitari 1",
  "adm.category": "Icyiciro",
  "adm.unitLabel": "Igipimo",
  "adm.stageLabel": "Igihe cyo gutera",
  "adm.description": "Ibisobanuro",
  "adm.noCatalog": "Nta kintu kirandikwa. Ongeraho icya mbere hejuru.",
  "toast.saved": "Byabitswe neza",
  "toast.deleted": "Byasibwe",
  "toast.paymentSent": "Ubwishyu bwoherejwe kwemezwa",
  "toast.approved": "Ubwishyu bwemejwe",
  "toast.rejected": "Ubwishyu bwanze",
  "toast.pricePublished": "Igiciro cyatangajwe",
  "toast.loginOk": "Winjiye neza",
  "toast.logoutOk": "Wasohotse",
  "toast.guideAdded": "Inama yongeweho",
  "toast.alertSet": "Itangazo ryashyizweho",
  "toast.farmerAdded": "Konti y'umuhinzi yafunguwe",
};

export const dict: Record<Lang, Record<string, string>> = { en, rw };

export function translate(lang: Lang, key: string): string {
  return dict[lang][key] ?? dict.en[key] ?? key;
}