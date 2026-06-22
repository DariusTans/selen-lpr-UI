import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_AI_EVENTS } from "@/data/mock";
import type { AiEvent, EventStatus } from "@/data/types";
import { formatDateTime, formatDateBE } from "@/lib/format";

const STATUS_LABEL: Record<EventStatus, string> = {
  verify: "Verify",
  correct: "ถูกต้อง",
  incorrect: "ไม่ถูกต้อง",
};

const STATUS_VARIANT: Record<EventStatus, "warning" | "success" | "destructive"> = {
  verify: "warning",
  correct: "success",
  incorrect: "destructive",
};

type FilterTab = "all" | EventStatus;

function EventRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="w-24 shrink-0 text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function EventCard({ event, index }: { event: AiEvent; index: number }) {
  return (
    <Card className="overflow-hidden p-5">
      <div className="mb-3 text-sm font-semibold text-muted-foreground">#{index}</div>
      <div className="grid gap-5 lg:grid-cols-[1fr_400px]">
        <div className="space-y-2.5">
          <div className="flex gap-3 text-sm">
            <span className="w-24 shrink-0 text-muted-foreground">สถานะ:</span>
            <Badge variant={STATUS_VARIANT[event.status]}>{STATUS_LABEL[event.status]}</Badge>
          </div>
          <EventRow label="Event:" value={event.event} />
          <EventRow label="วัน-เวลา:" value={formatDateTime(event.datetime)} />
          <EventRow label="Cam:" value={event.cam} />
          <EventRow label="Updated by:" value={event.updatedBy} />
          <EventRow label="Note:" value={event.note} />

          <Button variant="dark" className="mt-3 w-full">
            ตรวจสอบความถูกต้อง
          </Button>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-black">
          <img
            src={event.imageUrl}
            alt={event.event}
            className="aspect-video w-full object-cover"
          />
          <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-xs text-emerald-300">
            {formatDateTime(event.datetime).replace(/\//g, "/")}
          </span>
          <span className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-xs text-sky-300">
            {event.channel}
          </span>
          <span className="absolute bottom-2 left-2 font-mono text-[10px] text-emerald-400">
            Frame: 249 · FPS: 22
          </span>
        </div>
      </div>
    </Card>
  );
}

export function AiEventLogPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [sort, setSort] = useState<"desc" | "asc">("desc");

  const dateRange = useMemo(() => {
    const dates = MOCK_AI_EVENTS.map((e) => e.datetime).sort();
    return `${formatDateBE(dates[0])} - ${formatDateBE(dates[dates.length - 1])}`;
  }, []);

  const events = useMemo(() => {
    let list = [...MOCK_AI_EVENTS];
    if (tab !== "all") list = list.filter((e) => e.status === tab);
    list.sort((a, b) =>
      sort === "desc"
        ? b.datetime.localeCompare(a.datetime)
        : a.datetime.localeCompare(b.datetime)
    );
    return list;
  }, [tab, sort]);

  return (
    <div>
      <PageHeader title={<>Event Log: ประจำวันที่ {dateRange}</>} />

      <div className="mb-4 flex items-center justify-between gap-3">
        <Button>
          <SlidersHorizontal /> Filter
        </Button>
        <Select value={sort} onValueChange={(v) => setSort(v as "desc" | "asc")}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Desc</SelectItem>
            <SelectItem value="asc">Asc</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="verify">Verify</TabsTrigger>
          <TabsTrigger value="correct">Correct</TabsTrigger>
          <TabsTrigger value="incorrect">Incorrect</TabsTrigger>
        </TabsList>
      </Tabs>

      <h2 className="mb-3 text-lg font-semibold text-foreground">รายการบันทึก</h2>

      <div className="space-y-4">
        {events.map((event, i) => (
          <EventCard key={event.id} event={event} index={i + 1} />
        ))}
      </div>

      <p className="py-10 text-center text-sm text-muted-foreground">End of results</p>
    </div>
  );
}
