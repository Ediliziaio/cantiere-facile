import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, ArrowLeft, Send, AlertTriangle, Clock, CheckCircle2, MessageSquare, Search } from "lucide-react";
import {
  mockTickets, mockComments, categoryLabels, priorityLabels, statusLabels,
  type SupportTicket, type TicketComment,
} from "@/data/mock-support";

const priorityColors: Record<SupportTicket["priority"], string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  critical: "bg-destructive text-destructive-foreground",
};

const statusColors: Record<SupportTicket["status"], string> = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  waiting_customer: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  closed: "bg-muted text-muted-foreground",
};

// Filter tickets for current tenant (mock: t1)
const tenantTickets = mockTickets.filter((t) => t.tenant_id === "t1");

export default function Supporto() {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [newReply, setNewReply] = useState("");

  const filtered = tenantTickets.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (search && !t.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const comments = selectedTicket
    ? mockComments.filter((c) => c.ticket_id === selectedTicket.id && !c.is_internal)
    : [];

  const openCount = tenantTickets.filter((t) => !["resolved", "closed"].includes(t.status)).length;
  const resolvedCount = tenantTickets.filter((t) => t.status === "resolved" || t.status === "closed").length;

  if (selectedTicket) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Torna alla lista
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <CardTitle className="text-lg">{selectedTicket.subject}</CardTitle>
                <CardDescription>
                  {selectedTicket.id} · Aperto il {new Date(selectedTicket.created_at).toLocaleDateString("it-IT")}
                </CardDescription>
              </div>
              <div className="flex gap-2 shrink-0">
                <Badge className={priorityColors[selectedTicket.priority]}>{priorityLabels[selectedTicket.priority]}</Badge>
                <Badge className={statusColors[selectedTicket.status]}>{statusLabels[selectedTicket.status]}</Badge>
              </div>
            </div>
            {selectedTicket.sla_breached && (
              <div className="flex items-center gap-1 text-destructive text-xs mt-2">
                <AlertTriangle className="h-3 w-3" /> SLA superato
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Description */}
            <div className="bg-muted/50 rounded-lg p-4 text-sm">{selectedTicket.description}</div>

            {/* Chat-like conversation */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {comments.map((c) => (
                <div key={c.id} className={`flex ${c.author_type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 text-sm ${
                      c.author_type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="font-medium text-xs mb-1 opacity-70">{c.author_name}</div>
                    <p>{c.content}</p>
                    <div className="text-[10px] mt-1 opacity-50">
                      {new Date(c.created_at).toLocaleString("it-IT")}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply */}
            {!["resolved", "closed"].includes(selectedTicket.status) && (
              <div className="flex gap-2">
                <Textarea
                  placeholder="Scrivi una risposta..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  className="min-h-[60px]"
                />
                <Button
                  size="icon"
                  className="shrink-0 self-end"
                  onClick={() => {
                    if (!newReply.trim()) return;
                    toast.success("Risposta inviata");
                    setNewReply("");
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Satisfaction */}
            {selectedTicket.status === "resolved" && !selectedTicket.satisfaction_rating && (
              <Card className="border-primary/20">
                <CardContent className="pt-4 text-center space-y-2">
                  <p className="text-sm font-medium">Come valuti il supporto ricevuto?</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Button key={n} variant="outline" size="sm" onClick={() => toast.success("Grazie per il feedback!")}>
                        {n} ⭐
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Supporto</h1>
          <p className="text-muted-foreground text-sm">Gestisci le tue richieste di assistenza</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="h-4 w-4 mr-1" /> Nuovo Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-foreground">{tenantTickets.length}</div>
            <p className="text-xs text-muted-foreground">Totale ticket</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{openCount}</div>
            <p className="text-xs text-muted-foreground">Aperti</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
            <p className="text-xs text-muted-foreground">Risolti</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {(tenantTickets.filter((t) => t.satisfaction_rating).reduce((s, t) => s + (t.satisfaction_rating || 0), 0) /
                Math.max(tenantTickets.filter((t) => t.satisfaction_rating).length, 1)).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">CSAT medio</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca ticket..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti gli stati</SelectItem>
            <SelectItem value="open">Aperti</SelectItem>
            <SelectItem value="pending">In lavorazione</SelectItem>
            <SelectItem value="waiting_customer">In attesa</SelectItem>
            <SelectItem value="resolved">Risolti</SelectItem>
            <SelectItem value="closed">Chiusi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ticket list */}
      <div className="space-y-2">
        {filtered.map((ticket) => (
          <Card
            key={ticket.id}
            className="cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => setSelectedTicket(ticket)}
          >
            <CardContent className="py-3 px-4 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground font-mono">{ticket.id}</span>
                  <Badge className={priorityColors[ticket.priority]} variant="secondary">
                    {priorityLabels[ticket.priority]}
                  </Badge>
                  <Badge className={statusColors[ticket.status]} variant="secondary">
                    {statusLabels[ticket.status]}
                  </Badge>
                  {ticket.sla_breached && (
                    <AlertTriangle className="h-3 w-3 text-destructive" />
                  )}
                </div>
                <p className="font-medium text-sm text-foreground truncate">{ticket.subject}</p>
                <p className="text-xs text-muted-foreground">
                  {categoryLabels[ticket.category]} · {new Date(ticket.updated_at).toLocaleDateString("it-IT")}
                </p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs">
                  {mockComments.filter((c) => c.ticket_id === ticket.id && !c.is_internal).length}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nessun ticket trovato</p>
          </div>
        )}
      </div>

      {/* New ticket dialog */}
      <NewTicketDialog open={showNew} onOpenChange={setShowNew} />
    </div>
  );
}

function NewTicketDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [priority, setPriority] = useState<string>("medium");

  const handleSubmit = () => {
    if (!subject.trim() || !description.trim() || !category) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    toast.success("Ticket creato con successo! Ti risponderemo al più presto.");
    onOpenChange(false);
    setSubject("");
    setDescription("");
    setCategory("");
    setPriority("medium");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuovo Ticket di Supporto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Oggetto *</label>
            <Input placeholder="Descrivi brevemente il problema" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground">Categoria *</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Seleziona" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Tecnico</SelectItem>
                  <SelectItem value="billing">Fatturazione</SelectItem>
                  <SelectItem value="feature_request">Richiesta funzionalità</SelectItem>
                  <SelectItem value="training">Formazione</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Priorità</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Bassa</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Critica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Descrizione *</label>
            <Textarea
              placeholder="Descrivi il problema in dettaglio. Includi passaggi per riprodurre il problema, screenshot, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Annulla</Button>
            <Button onClick={handleSubmit}>Invia Ticket</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
