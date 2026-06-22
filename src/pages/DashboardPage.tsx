import { useMemo } from "react";
import {
  Activity,
  Ban,
  Car,
  Crown,
  ShieldAlert,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_AI_EVENTS, MOCK_LPR_EVENTS } from "@/data/mock";
import { useVehicles } from "@/hooks/useVehicles";
import { formatDateTime } from "@/lib/format";
import type { VehicleType } from "@/data/types";

const eventsByDay = [
  { day: "16/06", ai: 8, lpr: 4 },
  { day: "17/06", ai: 12, lpr: 6 },
  { day: "18/06", ai: 7, lpr: 9 },
  { day: "19/06", ai: 15, lpr: 5 },
  { day: "20/06", ai: 10, lpr: 11 },
  { day: "21/06", ai: 14, lpr: 8 },
  { day: "22/06", ai: 9, lpr: 13 },
];

const eventTypeBars = [
  { name: "บุคคล", value: 24 },
  { name: "ยานพาหนะ", value: 38 },
  { name: "ควัน/ไฟ", value: 6 },
  { name: "พื้นที่หวงห้าม", value: 17 },
  { name: "LPR", value: 31 },
];

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  tone: "primary" | "destructive" | "warning" | "success";
}) {
  const toneMap = {
    primary: "bg-primary-soft text-primary",
    destructive: "bg-destructive-soft text-destructive",
    warning: "bg-warning-soft text-warning",
    success: "bg-success-soft text-success",
  } as const;
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className={`flex size-12 items-center justify-center rounded-xl ${toneMap[tone]}`}>
          <Icon className="size-6" />
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
          {sub && <div className="text-xs text-muted-foreground/80">{sub}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function MatchBadge({ type }: { type: VehicleType | "unknown" }) {
  if (type === "blacklist")
    return <Badge variant="destructive-soft" className="gap-1"><Ban className="size-3" /> Blacklist</Badge>;
  if (type === "vip")
    return <Badge variant="warning-soft" className="gap-1"><Crown className="size-3" /> VIP</Badge>;
  return <Badge variant="secondary">ไม่รู้จัก</Badge>;
}

export function DashboardPage() {
  const vehicles = useVehicles();

  const pie = useMemo(() => {
    const bl = vehicles.filter((v) => v.type === "blacklist").length;
    const vip = vehicles.filter((v) => v.type === "vip").length;
    return [
      { name: "Blacklist", value: bl, color: "var(--destructive)" },
      { name: "VIP", value: vip, color: "var(--warning)" },
    ];
  }, [vehicles]);

  const lprAlerts = MOCK_LPR_EVENTS.filter((e) => e.matchType !== "unknown").length;
  const recent = [...MOCK_LPR_EVENTS].sort((a, b) => b.datetime.localeCompare(a.datetime));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="ภาพรวม AI Event และ LPR Event ที่ตรวจจับได้"
      />

      {/* stat cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Activity} label="AI Event วันนี้" value={MOCK_AI_EVENTS.length} sub="7 วันล่าสุด: 75" tone="primary" />
        <StatCard icon={Car} label="LPR Event ทั้งหมด" value={MOCK_LPR_EVENTS.length} sub="แมตช์ฐานข้อมูล" tone="success" />
        <StatCard icon={ShieldAlert} label="แจ้งเตือน LPR" value={lprAlerts} sub="Blacklist + VIP" tone="warning" />
        <StatCard icon={Ban} label="รถ Blacklist" value={pie[0].value} sub={`VIP ${pie[1].value} คัน`} tone="destructive" />
      </div>

      {/* charts */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 text-primary" /> Event ตามวัน (7 วันล่าสุด)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={eventsByDay} margin={{ left: -20, right: 8 }}>
                <defs>
                  <linearGradient id="ai" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="lpr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--popover-foreground)",
                  }}
                />
                <Area type="monotone" dataKey="ai" name="AI Event" stroke="var(--chart-1)" fill="url(#ai)" strokeWidth={2} />
                <Area type="monotone" dataKey="lpr" name="LPR Event" stroke="var(--chart-3)" fill="url(#lpr)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">สัดส่วนรถที่ลงทะเบียน</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {pie.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--popover-foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-destructive" /> Blacklist ({pie[0].value})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-warning" /> VIP ({pie[1].value})
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ประเภท Event ที่ตรวจจับ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={eventTypeBars} margin={{ left: -20, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  cursor={{ fill: "var(--accent)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--popover-foreground)",
                  }}
                />
                <Bar dataKey="value" name="จำนวน" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* recent LPR events */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">LPR Event ล่าสุด</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.map((e) => (
              <div
                key={e.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <img src={e.imageUrl} alt={e.plate} className="h-14 w-20 shrink-0 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{e.plate}</span>
                    <MatchBadge type={e.matchType} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {e.province} • {e.cam}
                  </div>
                </div>
                <div className="shrink-0 text-right text-xs text-muted-foreground">
                  {formatDateTime(e.datetime)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
