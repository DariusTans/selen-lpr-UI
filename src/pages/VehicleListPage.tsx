import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Ban, Crown, Plus, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useVehicles } from "@/hooks/useVehicles";
import { vehicleStore } from "@/data/store";
import { formatDateBE } from "@/lib/format";
import type { Vehicle, VehicleType } from "@/data/types";

function TypeBadge({ type }: { type: VehicleType }) {
  return type === "blacklist" ? (
    <Badge variant="destructive-soft" className="gap-1">
      <Ban className="size-3" /> Blacklist
    </Badge>
  ) : (
    <Badge variant="warning-soft" className="gap-1">
      <Crown className="size-3" /> VIP
    </Badge>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="truncate text-sm font-medium text-foreground">{value || "-"}</div>
    </div>
  );
}

export function VehicleListPage() {
  const vehicles = useVehicles();
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | VehicleType>("all");
  const [toDelete, setToDelete] = useState<Vehicle | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vehicles.filter((v) => {
      if (filterType !== "all" && v.type !== filterType) return false;
      if (!q) return true;
      return [v.plate, v.province, v.brand, v.model, v.ownerName, v.reason]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [vehicles, query, filterType]);

  const counts = useMemo(
    () => ({
      all: vehicles.length,
      blacklist: vehicles.filter((v) => v.type === "blacklist").length,
      vip: vehicles.filter((v) => v.type === "vip").length,
    }),
    [vehicles]
  );

  return (
    <div>
      <PageHeader
        title="รายการรถ Blacklist / VIP"
        description={`ทั้งหมด ${counts.all} คัน • Blacklist ${counts.blacklist} • VIP ${counts.vip}`}
        actions={
          <Button asChild>
            <Link to="/vehicles/new">
              <Plus /> เพิ่มรถ
            </Link>
          </Button>
        }
      />

      {/* filter bar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="ค้นหาป้ายทะเบียน, จังหวัด, ยี่ห้อ, เจ้าของ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
          <SelectTrigger className="sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกประเภท</SelectItem>
            <SelectItem value="blacklist">Blacklist</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            ไม่พบรายการที่ตรงกับเงื่อนไข
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((v) => (
            <Card key={v.id} className="overflow-hidden">
              <div className="relative">
                <img src={v.carImageUrl} alt={`รถ ${v.plate}`} className="aspect-video w-full object-cover" />
                <div className="absolute left-2 top-2">
                  <TypeBadge type={v.type} />
                </div>
                <img
                  src={v.plateImageUrl}
                  alt={`ป้าย ${v.plate}`}
                  className="absolute bottom-2 right-2 h-12 w-20 rounded border-2 border-white/80 object-cover shadow-md"
                />
              </div>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg font-bold tracking-wide text-foreground">{v.plate}</span>
                  <span className="text-xs text-muted-foreground">{v.province}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="ยี่ห้อ" value={v.brand} />
                  <Field label="รุ่น" value={v.model} />
                  <Field label="สี" value={v.color} />
                  <Field label="เจ้าของ" value={v.ownerName} />
                </div>
                <Field label="หมายเหตุ" value={v.reason} />
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">
                    เพิ่มเมื่อ {formatDateBE(v.createdAt)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive-soft hover:text-destructive"
                    onClick={() => setToDelete(v)}
                  >
                    <Trash2 /> ลบ
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบ</DialogTitle>
            <DialogDescription>
              ต้องการลบรถทะเบียน <span className="font-semibold">{toDelete?.plate}</span> ออกจากระบบใช่หรือไม่?
              การลบไม่สามารถย้อนกลับได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (toDelete) vehicleStore.remove(toDelete.id);
                setToDelete(null);
              }}
            >
              <Trash2 /> ลบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
