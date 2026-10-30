import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, PencilSimple, Plant, Plus, Trash, X } from "@phosphor-icons/react";
import { CROPS } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import type { FarmMaterialItem, FertilizerItem } from "@/types";

const rwf = (n: number) => `${Math.round(n).toLocaleString()} RWF`;

type Kind = "fertilizer" | "material";

interface Draft {
  id: string;
  name: string;
  nameRw: string;
  cropIds: string[];
  kgPerHectare: string;
  quantityPerHectare: string;
  unit: string;
  unitPriceFrw: string;
  imageUrl: string;
  description: string;
  descriptionRw: string;
  applicationStage: string;
  category: string;
}

const emptyDraft: Draft = {
  id: "",
  name: "",
  nameRw: "",
  cropIds: [],
  kgPerHectare: "0",
  quantityPerHectare: "0",
  unit: "pieces",
  unitPriceFrw: "0",
  imageUrl: "",
  description: "",
  descriptionRw: "",
  applicationStage: "",
  category: "Tools",
};

const toDraft = (item: FertilizerItem | FarmMaterialItem): Draft => ({
  id: item.id,
  name: item.name,
  nameRw: item.nameRw,
  cropIds: item.cropIds,
  kgPerHectare: "kgPerHectare" in item ? String(item.kgPerHectare) : "0",
  quantityPerHectare: "quantityPerHectare" in item ? String(item.quantityPerHectare) : "0",
  unit: "unit" in item ? item.unit : "kg",
  unitPriceFrw: String(item.unitPriceFrw),
  imageUrl: item.imageUrl,
  description: item.description,
  descriptionRw: item.descriptionRw,
  applicationStage: "applicationStage" in item ? item.applicationStage : "",
  category: "category" in item ? item.category : "Tools",
});

function Thumb({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-emerald-700/10 text-emerald-700 dark:text-emerald-400">
        <Plant size={20} weight="duotone" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-14 w-14 shrink-0 rounded-lg object-cover"
    />
  );
}

export default function AdminInputsManager() {
  const { t, fertilizers, materials, saveFertilizer, deleteFertilizer, saveMaterial, deleteMaterial, cropName } =
    useApp();
  const [kind, setKind] = useState<Kind>("fertilizer");
  const [draft, setDraft] = useState<Draft | null>(null);

  const set = (key: keyof Draft, value: string) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  const toggleCrop = (cropId: string) =>
    setDraft((d) =>
      d
        ? {
            ...d,
            cropIds: d.cropIds.includes(cropId)
              ? d.cropIds.filter((c) => c !== cropId)
              : [...d.cropIds, cropId],
          }
        : d,
    );

  const submit = () => {
    if (!draft || !draft.name.trim() || draft.cropIds.length === 0) return;
    const id = draft.id || `${kind === "fertilizer" ? "fert" : "mat"}-${Date.now()}`;
    if (kind === "fertilizer") {
      saveFertilizer({
        id,
        name: draft.name.trim(),
        nameRw: draft.nameRw.trim() || draft.name.trim(),
        cropIds: draft.cropIds,
        kgPerHectare: Number(draft.kgPerHectare) || 0,
        unitPriceFrw: Number(draft.unitPriceFrw) || 0,
        imageUrl: draft.imageUrl.trim(),
        description: draft.description.trim(),
        descriptionRw: draft.descriptionRw.trim() || draft.description.trim(),
        applicationStage: draft.applicationStage.trim(),
      });
    } else {
      saveMaterial({
        id,
        name: draft.name.trim(),
        nameRw: draft.nameRw.trim() || draft.name.trim(),
        cropIds: draft.cropIds,
        quantityPerHectare: Number(draft.quantityPerHectare) || 0,
        unit: draft.unit.trim() || "pieces",
        unitPriceFrw: Number(draft.unitPriceFrw) || 0,
        imageUrl: draft.imageUrl.trim(),
        description: draft.description.trim(),
        descriptionRw: draft.descriptionRw.trim() || draft.description.trim(),
        category: draft.category.trim() || "Tools",
      });
    }
    setDraft(null);
  };

  const items = kind === "fertilizer" ? fertilizers : materials;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {(["fertilizer", "material"] as Kind[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setKind(k);
              setDraft(null);
            }}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
              kind === k
                ? "bg-emerald-700 text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {k === "fertilizer" ? t("inp.fertilizers") : t("inp.materials")}
          </button>
        ))}
        <Button
          size="sm"
          className="ml-auto"
          onClick={() =>
            setDraft({ ...emptyDraft, unit: kind === "fertilizer" ? "kg" : "pieces" })
          }
        >
          <Plus size={15} weight="bold" className="mr-1.5" />
          {kind === "fertilizer" ? t("adm.addFertilizer") : t("adm.addMaterial")}
        </Button>
      </div>

      {draft && (
        <Card className="border-emerald-700/30">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {draft.id
                  ? kind === "fertilizer"
                    ? t("adm.editFertilizer")
                    : t("adm.editMaterial")
                  : kind === "fertilizer"
                    ? t("adm.addFertilizer")
                    : t("adm.addMaterial")}
              </p>
              <Button size="icon" variant="ghost" onClick={() => setDraft(null)} aria-label="Close">
                <X size={16} />
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs text-muted-foreground">Name (EN)</Label>
                <Input
                  className="mt-1.5"
                  value={draft.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="NPK 17-17-17"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Izina (RW)</Label>
                <Input
                  className="mt-1.5"
                  value={draft.nameRw}
                  onChange={(e) => set("nameRw", e.target.value)}
                  placeholder="Ifumbire NPK"
                />
              </div>

              {kind === "fertilizer" ? (
                <div>
                  <Label className="text-xs text-muted-foreground">{t("adm.kgPerHa")}</Label>
                  <Input
                    className="mt-1.5"
                    type="number"
                    min="0"
                    value={draft.kgPerHectare}
                    onChange={(e) => set("kgPerHectare", e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <Label className="text-xs text-muted-foreground">{t("adm.qtyPerHa")}</Label>
                  <Input
                    className="mt-1.5"
                    type="number"
                    min="0"
                    value={draft.quantityPerHectare}
                    onChange={(e) => set("quantityPerHectare", e.target.value)}
                  />
                </div>
              )}

              <div>
                <Label className="text-xs text-muted-foreground">{t("adm.unitPriceFrw")}</Label>
                <Input
                  className="mt-1.5"
                  type="number"
                  min="0"
                  value={draft.unitPriceFrw}
                  onChange={(e) => set("unitPriceFrw", e.target.value)}
                />
              </div>

              {kind === "material" && (
                <>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("adm.unitLabel")}</Label>
                    <Input
                      className="mt-1.5"
                      value={draft.unit}
                      onChange={(e) => set("unit", e.target.value)}
                      placeholder="pieces / pairs / crates"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("adm.category")}</Label>
                    <Input
                      className="mt-1.5"
                      value={draft.category}
                      onChange={(e) => set("category", e.target.value)}
                      placeholder="Tools / Irrigation / Storage"
                    />
                  </div>
                </>
              )}

              {kind === "fertilizer" && (
                <div>
                  <Label className="text-xs text-muted-foreground">{t("adm.stageLabel")}</Label>
                  <Input
                    className="mt-1.5"
                    value={draft.applicationStage}
                    onChange={(e) => set("applicationStage", e.target.value)}
                    placeholder="At planting / Top dressing"
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <Label className="text-xs text-muted-foreground">{t("adm.imageUrl")}</Label>
                <Input
                  className="mt-1.5"
                  value={draft.imageUrl}
                  onChange={(e) => set("imageUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t("adm.description")} (EN)</Label>
                <Input
                  className="mt-1.5"
                  value={draft.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t("adm.description")} (RW)</Label>
                <Input
                  className="mt-1.5"
                  value={draft.descriptionRw}
                  onChange={(e) => set("descriptionRw", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">{t("adm.cropsLinked")}</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {CROPS.map((crop) => {
                  const on = draft.cropIds.includes(crop.id);
                  return (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => toggleCrop(crop.id)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        on
                          ? "border-emerald-700 bg-emerald-700 text-white"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {on && <Check size={11} weight="bold" />}
                      {cropName(crop.id)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" onClick={submit} disabled={!draft.name.trim() || !draft.cropIds.length}>
                <Check size={15} weight="bold" className="mr-1.5" />
                {t("common.save")}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setDraft(null)}>
                {t("common.cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          {t("adm.noCatalog")}
        </p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {items.map((item) => {
            const perHa =
              "kgPerHectare" in item
                ? `${item.kgPerHectare} kg/ha`
                : `${item.quantityPerHectare} ${item.unit}/ha`;
            const sample =
              "kgPerHectare" in item
                ? item.kgPerHectare * item.unitPriceFrw
                : item.quantityPerHectare * item.unitPriceFrw;
            return (
              <Card key={item.id}>
                <CardContent className="flex gap-3 p-4">
                  <Thumb src={item.imageUrl} alt={item.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{item.name}</p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{perHa}</span>
                      <span>{rwf(item.unitPriceFrw)}</span>
                      <span>
                        {t("adm.sample")}: {rwf(sample)}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {item.cropIds.map((c) => (
                        <Badge key={c} variant="secondary" className="text-[10px]">
                          {cropName(c)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setKind("kgPerHectare" in item ? "fertilizer" : "material");
                        setDraft(toDraft(item));
                      }}
                      aria-label="Edit"
                    >
                      <PencilSimple size={15} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-rose-600"
                      onClick={() =>
                        "kgPerHectare" in item ? deleteFertilizer(item.id) : deleteMaterial(item.id)
                      }
                      aria-label="Delete"
                    >
                      <Trash size={15} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}