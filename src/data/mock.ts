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
    plate: "1กก 1234",
    province: "กรุงเทพมหานคร",
    type: "blacklist",
    brand: "Toyota",
    model: "Vios",
    color: "ขาว",
    ownerName: "-",
    reason: "เคยบุกรุกพื้นที่",
    imageUrl: platePlaceholder("1กก 1234", "blacklist"),
    createdAt: "2026-05-30T10:00:00",
  },
  {
    id: "v-1002",
    plate: "ขข 5678",
    province: "นนทบุรี",
    type: "vip",
    brand: "Mercedes-Benz",
    model: "C220d",
    color: "ดำ",
    ownerName: "คุณสมชาย (ผู้บริหาร)",
    reason: "รถผู้บริหาร เปิดไม้กั้นอัตโนมัติ",
    imageUrl: platePlaceholder("ขข 5678", "vip"),
    createdAt: "2026-06-02T08:30:00",
  },
  {
    id: "v-1003",
    plate: "2มท 9012",
    province: "สมุทรปราการ",
    type: "blacklist",
    brand: "Isuzu",
    model: "D-Max",
    color: "เทา",
    ownerName: "-",
    reason: "ต้องสงสัย",
    imageUrl: platePlaceholder("2มท 9012", "blacklist"),
    createdAt: "2026-06-10T14:20:00",
  },
  {
    id: "v-1004",
    plate: "ฮก 3456",
    province: "ปทุมธานี",
    type: "vip",
    brand: "Honda",
    model: "CR-V",
    color: "เงิน",
    ownerName: "คุณวิภา (แขก VIP)",
    reason: "แขกประจำ",
    imageUrl: platePlaceholder("ฮก 3456", "vip"),
    createdAt: "2026-06-15T11:45:00",
  },
];

export const MOCK_LPR_EVENTS: LprEvent[] = [
  {
    id: 1,
    plate: "1กก 1234",
    province: "กรุงเทพมหานคร",
    matchType: "blacklist",
    cam: "Gate Cam 1",
    datetime: "2026-06-21T07:33:40",
    imageUrl: platePlaceholder("1กก 1234", "blacklist"),
  },
  {
    id: 2,
    plate: "ขข 5678",
    province: "นนทบุรี",
    matchType: "vip",
    cam: "Gate Cam 1",
    datetime: "2026-06-21T08:10:02",
    imageUrl: platePlaceholder("ขข 5678", "vip"),
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
    plate: "2มท 9012",
    province: "สมุทรปราการ",
    matchType: "blacklist",
    cam: "Gate Cam 1",
    datetime: "2026-06-22T06:48:11",
    imageUrl: platePlaceholder("2มท 9012", "blacklist"),
  },
  {
    id: 5,
    plate: "ฮก 3456",
    province: "ปทุมธานี",
    matchType: "vip",
    cam: "Gate Cam 1",
    datetime: "2026-06-22T07:22:30",
    imageUrl: platePlaceholder("ฮก 3456", "vip"),
  },
];
