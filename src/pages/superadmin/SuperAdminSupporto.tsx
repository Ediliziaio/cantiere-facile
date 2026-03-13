import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  Inbox, KanbanSquare, BarChart3, BookOpen, Send, AlertTriangle,
  Clock, CheckCircle2, ArrowRight, User, ExternalLink,
} from "lucide-react";
import {
  mockTickets, mockComments, mockKBArticles, categoryLabels, priorityLabels, statusLabels,
  type SupportTicket,
} from "@/data/mock-support";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from "recharts";

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

const kanbanStatuses: SupportTicket["status"][] = ["open", "pending", "waiting_customer", "resolved"];
const kanbanLabels = { open: "Da fare", pending: "In corso", waiting_customer: "In attesa", resolved: "Risolti" };

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

export default function SuperAdminSupporto() {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [filter, setFilter] = useState({ status: "all", priority: "all", search: "" });
  const [replyText, setReplyText] = useState("");

  const filtered = mockTickets.filter((t) => {
    if (filter.status !== "all" && t.status !== filter.status) return false;
    if (filter.priority !== "all" && t.priority !== filter.priority) return false;
    if (filter.search && !t.subject.toLowerCase().includes(filter.search.toLowerCase()) && !t.tenant_name.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  // Analytics data
  const ticketsByCategory = Object.entries(categoryLabels).map(([key, label]) => ({
    name: label,
    value: mockTickets.filter((t) => t.category === key).length,
  }));

  const openTickets = mockTickets.filter((t) => !["resolved", "closed"].includes(t.status)).length;
  const slaBreached = mockTickets.filter((t) => t.sla_breached).length;
  const avgSatisfaction = mockTickets.filter((t) => t.satisfaction_rating).reduce((s, t) => s + (t.satisfaction_rating || 0), 0) / Math.max(mockTickets.filter((t) => t.satisfaction_rating).length, 1);
  const slaCompliance = ((mockTickets.length - slaBreached) / mockTickets.length * 100).toFixed(0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Supporto Clienti</h1>
        <p className="text-muted-foreground text-sm">Gestione ticket e knowledge base</p>
      </div>

      <Tabs defaultValue="inbox">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inbox" className="gap-1"><Inbox className="h-4 w-4" /><span className="hidden sm:inline"> Inbox</span></TabsTrigger>
          <TabsTrigger value="kanban" className="gap-1"><KanbanSquare className="h-4 w-4" /><span className="hidden sm:inline"> Kanban</span></TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1"><BarChart3 className="h-4 w-4" /><span className="hidden sm:inline"> Analytics</span></TabsTrigger>
          <TabsTrigger value="kb" className="gap-1"><BookOpen className="h-4 w-4" /><span className="hidden sm:inline"> Knowledge Base</span></TabsTrigger>
        </TabsList>

        {/* INBOX */}
        <TabsContent value="inbox" className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <Input
              placeholder="Cerca ticket o tenant..."
              className="flex-1 min-w-[200px]"
              value={filter.search}
              onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
            />
            <Select value={filter.status} onValueChange={(v) => setFilter((f) => ({ ...f, status: v }))}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti</SelectItem>
                <SelectItem value="open">Aperti</SelectItem>
                <SelectItem value="pending">In lavorazione</SelectItem>
                <SelectItem value="waiting_customer">In attesa</SelectItem>
                <SelectItem value="resolved">Risolti</SelectItem>
                <SelectItem value="closed">Chiusi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filter.priority} onValueChange={(v) => setFilter((f) => ({ ...f, priority: v }))}>
              <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte</SelectItem>
                <SelectItem value="critical">Critica</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Bassa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop table */}
          <div className="rounded-md border hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Oggetto</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Priorità</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead className="w-[100px]">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((ticket) => (
                  <TableRow key={ticket.id} className="cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                    <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                    <TableCell className="font-medium max-w-[250px] truncate">{ticket.subject}</TableCell>
                    <TableCell className="text-sm">{ticket.tenant_name}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{categoryLabels[ticket.category]}</Badge></TableCell>
                    <TableCell><Badge className={priorityColors[ticket.priority]}>{priorityLabels[ticket.priority]}</Badge></TableCell>
                    <TableCell><Badge className={statusColors[ticket.status]}>{statusLabels[ticket.status]}</Badge></TableCell>
                    <TableCell>
                      {ticket.sla_breached ? (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm"><ArrowRight className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile card layout */}
          <div className="space-y-2 md:hidden">
            {filtered.map((ticket) => (
              <Card key={ticket.id} className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => setSelectedTicket(ticket)}>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">{ticket.id}</span>
                    <div className="flex items-center gap-1.5">
                      <Badge className={`${priorityColors[ticket.priority]} text-[10px] px-1.5`}>{priorityLabels[ticket.priority]}</Badge>
                      {ticket.sla_breached && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground leading-tight">{ticket.subject}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`${statusColors[ticket.status]} text-[10px]`}>{statusLabels[ticket.status]}</Badge>
                    <Badge variant="outline" className="text-[10px]">{categoryLabels[ticket.category]}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{ticket.tenant_name}</span>
                    <span>{new Date(ticket.updated_at).toLocaleDateString("it-IT")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* KANBAN */}
        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {kanbanStatuses.map((status) => {
              const tickets = mockTickets.filter((t) => t.status === status);
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">{kanbanLabels[status]}</h3>
                    <Badge variant="secondary" className="text-xs">{tickets.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {tickets.map((ticket) => (
                      <Card key={ticket.id} className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => setSelectedTicket(ticket)}>
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono text-muted-foreground">{ticket.id}</span>
                            <Badge className={`${priorityColors[ticket.priority]} text-[10px] px-1`}>{priorityLabels[ticket.priority]}</Badge>
                            {ticket.sla_breached && <AlertTriangle className="h-3 w-3 text-destructive" />}
                          </div>
                          <p className="text-sm font-medium text-foreground leading-tight">{ticket.subject}</p>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>{ticket.tenant_name}</span>
                            <span>{new Date(ticket.updated_at).toLocaleDateString("it-IT")}</span>
                          </div>
                          {/* Quick status change */}
                          <div className="flex gap-1">
                            {kanbanStatuses.filter((s) => s !== status).slice(0, 2).map((s) => (
                              <Button key={s} variant="outline" size="sm" className="text-[10px] h-6 px-2" onClick={(e) => { e.stopPropagation(); toast.success(`Ticket spostato in "${kanbanLabels[s]}"`); }}>
                                → {kanbanLabels[s]}
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {tickets.length === 0 && (
                      <div className="text-center py-8 text-xs text-muted-foreground border border-dashed rounded-lg">Nessun ticket</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ANALYTICS */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-foreground">{openTickets}</div><p className="text-xs text-muted-foreground">Ticket aperti</p></CardContent></Card>
            <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-foreground">{slaCompliance}%</div><p className="text-xs text-muted-foreground">SLA compliance</p></CardContent></Card>
            <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-foreground">{avgSatisfaction.toFixed(1)}</div><p className="text-xs text-muted-foreground">CSAT medio</p></CardContent></Card>
            <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-destructive">{slaBreached}</div><p className="text-xs text-muted-foreground">SLA violati</p></CardContent></Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Ticket per categoria</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={ticketsByCategory}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <ReTooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Distribuzione priorità</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={Object.entries(priorityLabels).map(([key, label]) => ({
                        name: label,
                        value: mockTickets.filter((t) => t.priority === key).length,
                      }))}
                      cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}
                    >
                      {Object.keys(priorityLabels).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <ReTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* KNOWLEDGE BASE */}
        <TabsContent value="kb" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{mockKBArticles.length} articoli</p>
            <Button size="sm" onClick={() => toast.info("Editor articoli coming soon")}>+ Nuovo articolo</Button>
          </div>
          <div className="space-y-2">
            {mockKBArticles.map((article) => (
              <Card key={article.id}>
                <CardContent className="py-3 px-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={article.is_published ? "default" : "secondary"} className="text-[10px]">
                        {article.is_published ? "Pubblicato" : "Bozza"}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">{article.category === "user_guide" ? "Guida Utente" : article.category === "admin_guide" ? "Guida Admin" : "FAQ"}</Badge>
                    </div>
                    <p className="font-medium text-sm text-foreground">{article.title}</p>
                    <p className="text-xs text-muted-foreground">
                      👁 {article.view_count} visualizzazioni · 👍 {article.helpful_count} utili
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => window.open(`/help-center#${article.slug}`, "_blank")}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Ticket detail dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">{selectedTicket.id} — {selectedTicket.subject}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={priorityColors[selectedTicket.priority]}>{priorityLabels[selectedTicket.priority]}</Badge>
                  <Badge className={statusColors[selectedTicket.status]}>{statusLabels[selectedTicket.status]}</Badge>
                  <Badge variant="outline">{categoryLabels[selectedTicket.category]}</Badge>
                  <Badge variant="outline">{selectedTicket.tenant_name}</Badge>
                  {selectedTicket.sla_breached && <Badge variant="destructive">SLA Violato</Badge>}
                </div>

                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <p className="text-xs text-muted-foreground mb-1">{selectedTicket.requester_name} · {new Date(selectedTicket.created_at).toLocaleString("it-IT")}</p>
                  {selectedTicket.description}
                </div>

                {/* All comments including internal */}
                <div className="space-y-2">
                  {mockComments.filter((c) => c.ticket_id === selectedTicket.id).map((c) => (
                    <div key={c.id} className={`rounded-lg p-3 text-sm ${c.is_internal ? "bg-yellow-50 border border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800" : c.author_type === "superadmin" ? "bg-primary/5 border border-primary/20" : "bg-muted/50"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">{c.author_name}</span>
                        {c.is_internal && <Badge variant="outline" className="text-[10px] h-4">Nota interna</Badge>}
                        <span className="text-[10px] text-muted-foreground ml-auto">{new Date(c.created_at).toLocaleString("it-IT")}</span>
                      </div>
                      <p>{c.content}</p>
                    </div>
                  ))}
                </div>

                {/* Reply */}
                <div className="space-y-2">
                  <Textarea placeholder="Rispondi al ticket..." value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => { toast.success("Nota interna aggiunta"); setReplyText(""); }}>Nota interna</Button>
                    <Button size="sm" onClick={() => { toast.success("Risposta inviata al cliente"); setReplyText(""); }}><Send className="h-3 w-3 mr-1" /> Rispondi</Button>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex gap-2 flex-wrap border-t pt-3">
                  <Button variant="outline" size="sm" onClick={() => toast.success("Stato aggiornato a 'Risolto'")}>✅ Marca risolto</Button>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Ticket escalato")}>⬆️ Escala</Button>
                  <Button variant="outline" size="sm" onClick={() => toast.info("Impersonation attivata")}>👤 Impersona tenant</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
