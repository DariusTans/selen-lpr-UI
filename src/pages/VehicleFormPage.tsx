import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Ban, Crown, ImagePlus, Save, X, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { vehicleStore } from "@/data/store";
import { PROVINCES } from "@/data/provinces";
import { platePlaceholder, carPlaceholder } from "@/data/mock";
import type { VehicleType } from "@/data/types";

function ImageUploader({
  label,
  icon: Icon,
  hint,
  value,
  onChange,
}: {
  label: string;
  icon: LucideIcon;
  hint: string;
  value: string;
  onChange: (dataUrl: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-border">
          <img src={value} alt={label} className="aspect-video w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Icon className="size-8" />
          <span className="text-sm font-medium">{hint}</span>
          <span className="text-xs">PNG / JPG</span>
        </button>
      )}
    </div>
  );
}

const empty = {
  plate: "",
  province: "",
  brand: "",
  model: "",
  color: "",
  ownerName: "",
  reason: "",
};

export function VehicleFormPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<VehicleType>("blacklist");
  const [form, setForm] = useState(empty);
  const [carImage, setCarImage] = useState<string>("");
  const [plateImage, setPlateImage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof empty) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  function validate() {
    const next: Record<string, string> = {};
    if (!form.plate.trim()) next.plate = "กรุณากรอกป้ายทะเบียน";
    if (!form.province) next.province = "กรุณาเลือกจังหวัด";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const plate = form.plate.trim();
    vehicleStore.add({
      ...form,
      type,
      ownerName: form.ownerName.trim() || "-",
      reason: form.reason.trim() || "-",
      carImageUrl: carImage || carPlaceholder([form.brand, form.model].filter(Boolean).join(" ") || plate, type),
      plateImageUrl: plateImage || platePlaceholder(plate, type),
    });
    navigate("/vehicles");
  }

  return (
    <div>
      <PageHeader
        title="เพิ่มรถ (Pre-register)"
        description="ลงทะเบียนรถที่ติด Blacklist หรือรถ VIP ล่วงหน้า เพื่อให้ระบบ LPR แจ้งเตือนเมื่อตรวจพบ"
        actions={
          <Button variant="outline" onClick={() => navigate("/vehicles")}>
            <ArrowLeft /> กลับ
          </Button>
        }
      />

      <form onSubmit={onSubmit}>
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left: fields */}
          <Card>
            <CardContent className="space-y-5 pt-6">
              {/* type toggle */}
              <div className="space-y-2">
                <Label>ประเภท</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType("blacklist")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-colors",
                      type === "blacklist"
                        ? "border-destructive bg-destructive-soft text-destructive"
                        : "border-border text-muted-foreground hover:bg-accent"
                    )}
                  >
                    <Ban className="size-4" /> Blacklist
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("vip")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-colors",
                      type === "vip"
                        ? "border-warning bg-warning-soft text-warning"
                        : "border-border text-muted-foreground hover:bg-accent"
                    )}
                  >
                    <Crown className="size-4" /> VIP
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="plate">ป้ายทะเบียน *</Label>
                  <Input
                    id="plate"
                    placeholder="เช่น 1กก 1234"
                    value={form.plate}
                    onChange={(e) => set("plate")(e.target.value)}
                  />
                  {errors.plate && <p className="text-xs text-destructive">{errors.plate}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>จังหวัด *</Label>
                  <Select value={form.province} onValueChange={set("province")}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกจังหวัด" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.province && (
                    <p className="text-xs text-destructive">{errors.province}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="brand">ยี่ห้อ</Label>
                  <Input
                    id="brand"
                    placeholder="เช่น Toyota"
                    value={form.brand}
                    onChange={(e) => set("brand")(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="model">รุ่น</Label>
                  <Input
                    id="model"
                    placeholder="เช่น Vios"
                    value={form.model}
                    onChange={(e) => set("model")(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="color">สี</Label>
                  <Input
                    id="color"
                    placeholder="เช่น ขาว"
                    value={form.color}
                    onChange={(e) => set("color")(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="owner">ชื่อเจ้าของ / ผู้เกี่ยวข้อง</Label>
                  <Input
                    id="owner"
                    placeholder="เช่น คุณสมชาย"
                    value={form.ownerName}
                    onChange={(e) => set("ownerName")(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reason">หมายเหตุ / เหตุผล</Label>
                <Textarea
                  id="reason"
                  placeholder={
                    type === "blacklist"
                      ? "เช่น เคยบุกรุกพื้นที่ / ต้องสงสัย"
                      : "เช่น รถผู้บริหาร เปิดไม้กั้นอัตโนมัติ"
                  }
                  value={form.reason}
                  onChange={(e) => set("reason")(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Right: image uploads */}
          <Card>
            <CardContent className="space-y-4 pt-6">
              <ImageUploader
                label="รูปรถ"
                icon={ImagePlus}
                hint="คลิกเพื่ออัปโหลดรูปรถ"
                value={carImage}
                onChange={setCarImage}
              />
              <ImageUploader
                label="รูปป้ายทะเบียน"
                icon={ImagePlus}
                hint="คลิกเพื่ออัปโหลดรูปป้าย"
                value={plateImage}
                onChange={setPlateImage}
              />
              <p className="text-xs text-muted-foreground">
                หากไม่อัปโหลด ระบบจะสร้างรูปตัวอย่างให้อัตโนมัติ
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/vehicles")}>
            ยกเลิก
          </Button>
          <Button type="submit">
            <Save /> บันทึก
          </Button>
        </div>
      </form>
    </div>
  );
}
