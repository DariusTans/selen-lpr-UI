import type { AiEvent, LprEvent, Vehicle } from "./types";

// Local bundled camera frame (from the original SELEN preview)
const CAM_FRAME = "/selen-preview.jpg";

// A simple inline SVG "license plate" placeholder generator (offline-friendly).
export function platePlaceholder(plate: string, type: "blacklist" | "vip" | "unknown" = "unknown"): string {
  const bg = type === "blacklist" ? "#7f1d1d" : type === "vip" ? "#92400e" : "#1e293b";
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200">
  <rect width="320" height="200" fill="${bg}"/>
  <rect x="70" y="120" width="180" height="55" rx="6" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
  <text x="160" y="158" font-family="monospace" font-size="26" font-weight="700" fill="#0f172a" text-anchor="middle">${plate}</text>
  <text x="16" y="30" font-family="sans-serif" font-size="13" fill="#cbd5e1">LPR CAM • SELEN AI</text>
  <circle cx="160" cy="70" r="26" fill="none" stroke="#38bdf8" stroke-width="3"/>
  <line x1="134" y1="70" x2="120" y2="70" stroke="#38bdf8" stroke-width="3"/>
  <line x1="186" y1="70" x2="200" y2="70" stroke="#38bdf8" stroke-width="3"/>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// A simple inline SVG "car photo" placeholder generator (offline-friendly).
export function carPlaceholder(label: string, type: "blacklist" | "vip" | "unknown" = "unknown"): string {
  const accent = type === "blacklist" ? "#ef4444" : type === "vip" ? "#f59e0b" : "#38bdf8";
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200">
  <rect width="320" height="200" fill="#0f172a"/>
  <rect width="320" height="200" fill="url(#g)"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <path d="M60 130 L80 95 Q86 84 100 84 L210 84 Q226 84 236 96 L262 128 L268 150 L52 150 Z" fill="#334155" stroke="${accent}" stroke-width="2"/>
  <rect x="96" y="92" width="44" height="30" rx="3" fill="#0f172a"/>
  <rect x="148" y="92" width="60" height="30" rx="3" fill="#0f172a"/>
  <circle cx="98" cy="150" r="18" fill="#0f172a" stroke="${accent}" stroke-width="3"/>
  <circle cx="222" cy="150" r="18" fill="#0f172a" stroke="${accent}" stroke-width="3"/>
  <rect x="0" y="170" width="320" height="30" fill="#0f172a"/>
  <text x="16" y="190" font-family="sans-serif" font-size="13" fill="#94a3b8">${label}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const MOCK_AI_EVENTS: AiEvent[] = [
  {
    id: 1,
    status: "verify",
    event: "ทดสอบ",
    datetime: "2026-06-17T16:26:26",
    cam: "Test Cam 1",
    updatedBy: "SELEN AI",
    note: "-",
    imageUrl: CAM_FRAME,
    channel: "Channel 1",
  },
  {
    id: 2,
    status: "correct",
    event: "บุคคลเข้าพื้นที่หวงห้าม",
    datetime: "2026-06-18T09:12:04",
    cam: "Warehouse Cam 3",
    updatedBy: "operator_002",
    note: "ยืนยันแล้ว",
    imageUrl: CAM_FRAME,
    channel: "Channel 3",
  },
  {
    id: 3,
    status: "incorrect",
    event: "ตรวจพบควัน/ไฟ",
    datetime: "2026-06-19T22:48:51",
    cam: "Parking Cam 2",
    updatedBy: "operator_005",
    note: "แสงสะท้อน ไม่ใช่ไฟจริง",
    imageUrl: CAM_FRAME,
    channel: "Channel 2",
  },
  {
    id: 4,
    status: "verify",
    event: "รถจอดในพื้นที่ห้ามจอด",
    datetime: "2026-06-20T13:05:17",
    cam: "Gate Cam 1",
    updatedBy: "SELEN AI",
    note: "-",
    imageUrl: CAM_FRAME,
    channel: "Channel 1",
  },
  {
    id: 5,
    status: "correct",
    event: "ตรวจพบป้ายทะเบียน Blacklist",
    datetime: "2026-06-21T07:33:40",
    cam: "Gate Cam 1",
    updatedBy: "operator_001",
    note: "แจ้งเตือน รปภ.",
    imageUrl: CAM_FRAME,
    channel: "Channel 1",
  },
];

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "v-1001",
    plate: "1มฆ 639",
    province: "กรุงเทพมหานคร",
    type: "blacklist",
    brand: "Toyota",
    model: "corolla",
    color: "เหลือง-เขียว",
    ownerName: "-",
    reason: "เคยบุกรุกพื้นที่",
    carImageUrl: "/blacklist_vehicle_1.jpg",
    plateImageUrl: "/blacklist_lpr_1.jpg",
    createdAt: "2026-05-30T10:00:00",
  },
  {
    id: "v-1002",
    plate: "ฒฬ 943",
    province: "กรุงเทพมหานคร",
    type: "vip",
    brand: "isuzu",
    model: "C220d",
    color: "เงิน",
    ownerName: "คุณสมชาย (ผู้บริหาร)",
    reason: "รถผู้บริหาร เปิดไม้กั้นอัตโนมัติ",
    carImageUrl: "/vip_vehicle_1.jpg",
    plateImageUrl: "/vip_lpr_1.jpg",
    createdAt: "2026-06-02T08:30:00",
  },
  {
    id: "v-1003",
    plate: "1กฒ 3821",
    province: "ระยอง",
    type: "blacklist",
    brand: "wave",
    model: "125",
    color: "ดำ",
    ownerName: "-",
    reason: "ต้องสงสัย",
    carImageUrl: "/blacklist_vehicle_2.jpg",
    plateImageUrl: "/blacklist_lpr_2.jpg",
    createdAt: "2026-06-10T14:20:00",
  },
  {
    id: "v-1004",
    plate: "3ฒฐ 34",
    province: "กรุงเทพมหานคร",
    type: "vip",
    brand: "Isuzu",
    model: "CR-V",
    color: "ดำ",
    ownerName: "คุณวิภา (แขก VIP)",
    reason: "แขกประจำ",
    carImageUrl: "/vip_vehicle_2.jpg",
    plateImageUrl: "/vip_lpr_2.jpg",
    createdAt: "2026-06-15T11:45:00",
  },
];

export const MOCK_LPR_EVENTS: LprEvent[] = [
  {
    id: 1,
    plate: "1มฆ 639",
    province: "กรุงเทพมหานคร",
    matchType: "blacklist",
    cam: "Gate Cam 1",
    datetime: "2026-06-21T07:33:40",
    imageUrl: "/blacklist_lpr_1.jpg",
  },
  {
    id: 2,
    plate: "ฒฬ 943",
    province: "กรุงเทพมหานคร",
    matchType: "vip",
    cam: "Gate Cam 1",
    datetime: "2026-06-21T08:10:02",
    imageUrl: "/vip_lpr_1.jpg",
  },
  {
    id: 3,
    plate: "9กฮ 0001",
    province: "กรุงเทพมหานคร",
    matchType: "unknown",
    cam: "Parking Cam 2",
    datetime: "2026-06-21T09:01:55",
    imageUrl: platePlaceholder("9กฮ 0001", "unknown"),
  },
  {
    id: 4,
    plate: "1กฒ 3821",
    province: "ระยอง",
    matchType: "blacklist",
    cam: "Gate Cam 1",
    datetime: "2026-06-22T06:48:11",
    imageUrl: "/blacklist_lpr_2.jpg",
  },
  {
    id: 5,
    plate: "3ฒฐ 34",
    province: "กรุงเทพมหานคร",
    matchType: "vip",
    cam: "Gate Cam 1",
    datetime: "2026-06-22T07:22:30",
    imageUrl: "/vip_lpr_2.jpg",
  },
];
