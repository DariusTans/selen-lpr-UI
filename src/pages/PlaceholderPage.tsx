import { Construction } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div>
      <PageHeader title={title} />
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center text-muted-foreground">
          <Construction className="size-10 text-primary" />
          <p className="text-base font-medium">หน้านี้กำลังพัฒนา</p>
          <p className="text-sm">โมดูล “{title}” จะเชื่อมต่อกับระบบจริงในเฟสถัดไป</p>
        </CardContent>
      </Card>
    </div>
  );
}
