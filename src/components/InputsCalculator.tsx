import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  PencilSimple,
  Plant,
  Plus,
  Printer,
  Trash,
  X,
} from "@phosphor-icons/react";
import { CROPS } from "@/data/mockData";
import { AREA_UNITS, toHectares, type AreaUnit } from "@/data/cropInputs";
import { useApp } from "@/context/AppContext";
import type { FarmMaterialItem, FertilizerItem } from "@/types";

const rwf = (n: number) => `${Math.round(n).toLocaleString()} RWF`;
const kg = (n: number) =>
  n >= 100 ? `${Math.round(n).toLocaleString()} kg` : `${Math.round(n * 10) / 10} kg`;

/* ---------- shared bits ---------- */

function Thumb({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-emerald-700/10 text-emerald-700 dark:text-emerald-400">
        <Plant size={26} weight="duotone" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-20 w-20 shrink-0 rounded-xl object-cover"
    />
  );
}

function CropChips({
  selected,
  onToggle,
  labelOf,
}: {
  selected: string[];
  onToggle: (id: string) => void;
  labelOf: (id: string) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CROPS.map((crop) => {
        const on = selected.includes(crop.id);
        return (
          <button
            key={crop.id}
            type="button"
            onClick={() => onToggle(crop.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              on
                ? "border-emerald-700 bg-emerald-700 text-white"
                : "border-border bg-background text-muted-foreground hover:border-emerald-600/40 hover:text-foreground"
            }`}
          >
            {on && <Check size={13} weight="bold" />}
            {labelOf(crop.id)}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- farmer view ---------- */

export default function InputsCalculator() {
  const { t, lang, currentFarmer, cropName, fertilizers, materials } = useApp();
  const [selected, setSelected] = useState<string[]>(
    currentFarmer?.cropId ? [currentFarmer.cropId] : [],
  );
  const [area, setArea] = useState("0.5");
  const [unit, setUnit] = useState<AreaUnit>("ha");

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const ha = toHectares(Number(area) || 0, unit);

  const ferts = useMemo(
    () => fertilizers.filter((f) => f.cropIds.some((c) => selected.includes(c))),
    [fertilizers, selected],
  );
  const mats = useMemo(
    () => materials.filter((m) => m.cropIds.some((c) => selected.includes(c))),
    [materials, selected],
  );

  const fertRows = ferts.map((f) => {
    const qty = ha * f.kgPerHectare;
    return { item: f, qty, cost: qty * f.unitPriceFrw };
  });
  const matRows = mats.map((m) => {
    const raw = ha * m.quantityPerHectare;
    const qty = raw > 0 ? Math.max(1, Math.ceil(raw)) : 0;
    return { item: m, qty, cost: qty * m.unitPriceFrw };
  });

  const fertTotal = fertRows.reduce((s, r) => s + r.cost, 0);
  const matTotal = matRows.reduce((s, r) => s + r.cost, 0);

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">{t("inp.title")}</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("inp.sub")}</p>
      </header>

      <Card>
        <CardContent className="space-y-5 p-5">
          <div>
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("inp.crops")}
            </Label>
            <div className="mt-2">
              <CropChips selected={selected} onToggle={toggle} labelOf={cropName} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="land-area" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("inp.area")}
              </Label>
              <Input
                id="land-area"
                type="number"
                min="0"
                step="0.1"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("inp.unit")}
              </Label>
              <div className="mt-2 flex gap-2">
                {AREA_UNITS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUnit(u.id)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      unit === u.id
                        ? "border-emerald-700 bg-emerald-700/10 text-emerald-800 dark:text-emerald-400"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(u.labelKey)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-xl bg-muted/60 px-4 py-3">
            <Badge className="gap-1.5 bg-emerald-700/10 text-emerald-800 dark:text-emerald-400">
              <Plant size={13} weight="bold" />
              {t("inp.areaHa")}: {Math.round(ha * 1000) / 1000} ha
            </Badge>
            <span className="text-sm text-muted-foreground">{t("inp.tip")}</span>
            <Button
              size="sm"
              variant="outline"
              className="ml-auto"
              onClick={() => window.print()}
              disabled={!selected.length}
            >
              <Printer size={15} className="mr-1.5" weight="bold" />
              {t("inp.print")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {!selected.length ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-10 text-center">
            <Plant size={30} weight="duotone" className="text-emerald-700 dark:text-emerald-400" />
            <p className="text-sm text-muted-foreground">{t("inp.empty")}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div>
            <h3 className="mb-3 text-lg font-semibold">{t("inp.fertilizers")}</h3>
            {fertRows.length === 0 ? (
              <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                {t("inp.noneF")}
              </p>
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {fertRows.map(({ item, qty, cost }, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.04 }}
                  >
                    <Card>
                      <CardContent className="flex gap-4 p-4">
                        <Thumb src={item.imageUrl} alt={item.name} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold">
                            {lang === "rw" ? item.nameRw || item.name : item.name}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {lang === "rw" ? item.descriptionRw || item.description : item.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                            <span className="font-medium text-emerald-800 dark:text-emerald-400">
                              {t("inp.need")}: {kg(qty)}
                            </span>
                            <span className="text-muted-foreground">
                              {item.kgPerHectare} kg/ha
                            </span>
                            <span className="text-muted-foreground">
                              {rwf(item.unitPriceFrw)} / kg
                            </span>
                          </div>
                          <div className="mt-1.5 flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold">{rwf(cost)}</p>
                            <span className="text-[11px] text-muted-foreground">
                              {item.applicationStage}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">{t("inp.materials")}</h3>
            {matRows.length === 0 ? (
              <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                {t("inp.noneM")}
              </p>
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {matRows.map(({ item, qty, cost }, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.04 }}
                  >
                    <Card>
                      <CardContent className="flex gap-4 p-4">
                        <Thumb src={item.imageUrl} alt={item.name} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate font-semibold">
                              {lang === "rw" ? item.nameRw || item.name : item.name}
                            </p>
                            <Badge variant="secondary" className="shrink-0 text-[10px]">
                              {item.category}
                            </Badge>
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {lang === "rw" ? item.descriptionRw || item.description : item.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                            <span className="font-medium text-emerald-800 dark:text-emerald-400">
                              {t("inp.need")}: {qty.toLocaleString()} {item.unit}
                            </span>
                            <span className="text-muted-foreground">
                              {rwf(item.unitPriceFrw)} / {item.unit}
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm font-semibold">{rwf(cost)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <Card className="border-emerald-700/30 bg-emerald-700/5">
            <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t("inp.fertilizerTotal")}
                </p>
                <p className="mt-1 text-lg font-bold">{rwf(fertTotal)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t("inp.materialTotal")}
                </p>
                <p className="mt-1 text-lg font-bold">{rwf(matTotal)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t("inp.grandTotal")}
                </p>
                <p className="mt-1 text-2xl font-bold text-emerald-800 dark:text-emerald-400">
                  {rwf(fertTotal + matTotal)}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
}