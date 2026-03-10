import { MessageSquare } from "lucide-react";

export default function Comunicazioni() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-2xl text-foreground">Comunicazioni</h1>
      </div>
      <div className="border border-border rounded-lg p-8 text-center">
        <p className="text-sm text-muted-foreground">Nessuna comunicazione presente. Le comunicazioni appariranno qui quando invierai o riceverai messaggi relativi ai cantieri.</p>
      </div>
    </div>
  );
}
