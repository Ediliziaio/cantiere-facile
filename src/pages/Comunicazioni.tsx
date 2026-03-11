import { useState, useMemo, useRef, useEffect } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { it } from "date-fns/locale";
import {
  MessageSquare, Search, Plus, Send, Paperclip, ArrowLeft,
  AlertTriangle, FileText, Filter, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  mockThreads as initialThreads,
  mockMessaggi as initialMessages,
  CURRENT_USER_ID,
  CURRENT_USER_NAME,
  type ComunicazioneThread,
  type Messaggio,
  type TipoThread,
} from "@/data/mock-comunicazioni";
import { mockCantieri, mockLavoratori, mockSubappaltatori } from "@/data/mock-data";

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function TipoBadge({ tipo }: { tipo: TipoThread }) {
  if (tipo === "urgente") return <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Urgente</Badge>;
  if (tipo === "documento") return <Badge variant="secondary" className="text-[10px] px-1.5 py-0"><FileText className="h-3 w-3 mr-0.5" />Doc</Badge>;
  return null;
}

export default function Comunicazioni() {
  const isMobile = useIsMobile();
  const [threads, setThreads] = useState<ComunicazioneThread[]>(initialThreads);
  const [messaggi, setMessaggi] = useState<Messaggio[]>(initialMessages);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filtroCantiereId, setFiltroCantiereId] = useState("tutti");
  const [filtroTipo, setFiltroTipo] = useState<string>("tutti");
  const [composerText, setComposerText] = useState("");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // New message dialog state
  const [newCantiere, setNewCantiere] = useState("");
  const [newOggetto, setNewOggetto] = useState("");
  const [newDestinatari, setNewDestinatari] = useState<string[]>([]);
  const [newTesto, setNewTesto] = useState("");
  const [newTipo, setNewTipo] = useState<TipoThread>("generale");

  const selectedThread = threads.find(t => t.id === selectedThreadId) ?? null;
  const threadMessages = useMemo(
    () => messaggi.filter(m => m.thread_id === selectedThreadId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [messaggi, selectedThreadId]
  );

  const filteredThreads = useMemo(() => {
    let list = [...threads];
    if (filtroCantiereId !== "tutti") list = list.filter(t => t.cantiere_id === filtroCantiereId);
    if (filtroTipo !== "tutti") list = list.filter(t => t.tipo === filtroTipo);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.oggetto.toLowerCase().includes(q) ||
        t.partecipanti.some(p => p.nome.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => new Date(b.data_ultimo).getTime() - new Date(a.data_ultimo).getTime());
  }, [threads, filtroCantiereId, filtroTipo, search]);

  const totalNonLetti = threads.reduce((s, t) => s + t.non_letti, 0);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [threadMessages]);

  // Mark as read on select
  useEffect(() => {
    if (selectedThreadId) {
      setThreads(prev => prev.map(t => t.id === selectedThreadId ? { ...t, non_letti: 0 } : t));
      setMessaggi(prev => prev.map(m => m.thread_id === selectedThreadId ? { ...m, letto: true } : m));
    }
  }, [selectedThreadId]);

  function selectThread(id: string) {
    setSelectedThreadId(id);
    if (isMobile) setMobileShowChat(true);
  }

  function handleSend() {
    if (!composerText.trim() || !selectedThreadId) return;
    const now = new Date().toISOString();
    const newMsg: Messaggio = {
      id: `m-new-${Date.now()}`,
      thread_id: selectedThreadId,
      mittente_id: CURRENT_USER_ID,
      mittente_nome: CURRENT_USER_NAME,
      testo: composerText.trim(),
      timestamp: now,
      letto: true,
    };
    setMessaggi(prev => [...prev, newMsg]);
    setThreads(prev => prev.map(t => t.id === selectedThreadId ? { ...t, ultimo_messaggio: newMsg.testo, data_ultimo: now } : t));
    setComposerText("");
  }

  function handleCreateThread() {
    if (!newCantiere || !newOggetto.trim() || !newTesto.trim()) return;
    const cantiere = mockCantieri.find(c => c.id === newCantiere);
    const partecipanti = [
      { id: CURRENT_USER_ID, nome: CURRENT_USER_NAME, ruolo: "Responsabile" },
      ...newDestinatari.map(dId => {
        const lav = mockLavoratori.find(l => l.id === dId);
        if (lav) return { id: lav.id, nome: `${lav.nome} ${lav.cognome}`, ruolo: lav.mansione };
        const sub = mockSubappaltatori.find(s => s.id === dId);
        if (sub) return { id: sub.id, nome: sub.ragione_sociale, ruolo: "Subappaltatore" };
        return { id: dId, nome: dId, ruolo: "" };
      }),
    ];
    const now = new Date().toISOString();
    const threadId = `th-new-${Date.now()}`;
    const newThread: ComunicazioneThread = {
      id: threadId,
      cantiere_id: newCantiere,
      cantiere_nome: cantiere?.nome ?? "",
      oggetto: newOggetto.trim(),
      partecipanti,
      ultimo_messaggio: newTesto.trim(),
      data_ultimo: now,
      non_letti: 0,
      tipo: newTipo,
    };
    const newMsg: Messaggio = {
      id: `m-new-${Date.now()}`,
      thread_id: threadId,
      mittente_id: CURRENT_USER_ID,
      mittente_nome: CURRENT_USER_NAME,
      testo: newTesto.trim(),
      timestamp: now,
      letto: true,
    };
    setThreads(prev => [newThread, ...prev]);
    setMessaggi(prev => [...prev, newMsg]);
    setSelectedThreadId(threadId);
    setShowNewDialog(false);
    setNewCantiere("");
    setNewOggetto("");
    setNewDestinatari([]);
    setNewTesto("");
    setNewTipo("generale");
    if (isMobile) setMobileShowChat(true);
  }

  // Destinatari options
  const destinatariOptions = [
    ...mockLavoratori.map(l => ({ id: l.id, label: `${l.nome} ${l.cognome} (${l.mansione})` })),
    ...mockSubappaltatori.map(s => ({ id: s.id, label: s.ragione_sociale })),
  ];

  /* ── Thread List ── */
  const threadList = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h1 className="font-heading font-bold text-lg text-foreground">Comunicazioni</h1>
          {totalNonLetti > 0 && (
            <Badge variant="destructive" className="text-[10px] h-5 min-w-5 flex items-center justify-center">{totalNonLetti}</Badge>
          )}
        </div>
        <Button size="sm" onClick={() => setShowNewDialog(true)}>
          <Plus className="h-4 w-4" />
          {!isMobile && <span className="ml-1">Nuovo</span>}
        </Button>
      </div>

      {/* Search & filters */}
      <div className="p-3 space-y-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca conversazione..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <div className="flex gap-2">
          <Select value={filtroCantiereId} onValueChange={setFiltroCantiereId}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <Filter className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Cantiere" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti i cantieri</SelectItem>
              {mockCantieri.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="h-8 text-xs w-28">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti</SelectItem>
              <SelectItem value="urgente">Urgenti</SelectItem>
              <SelectItem value="documento">Documenti</SelectItem>
              <SelectItem value="generale">Generali</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Thread items */}
      <ScrollArea className="flex-1">
        {filteredThreads.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">Nessuna conversazione trovata.</div>
        ) : (
          <div className="divide-y divide-border">
            {filteredThreads.map(thread => (
              <button
                key={thread.id}
                onClick={() => selectThread(thread.id)}
                className={`w-full text-left p-3 hover:bg-accent/50 transition-colors ${
                  thread.id === selectedThreadId ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {thread.non_letti > 0 && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                      <span className="font-medium text-sm text-foreground truncate">{thread.oggetto}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{thread.ultimo_messaggio}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground">{thread.cantiere_nome}</span>
                      <TipoBadge tipo={thread.tipo} />
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(thread.data_ultimo), { addSuffix: true, locale: it })}
                    </span>
                    {thread.non_letti > 0 && (
                      <Badge className="text-[10px] h-4 min-w-4 flex items-center justify-center px-1">{thread.non_letti}</Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );

  /* ── Chat View ── */
  const chatView = selectedThread ? (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        {isMobile && (
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setMobileShowChat(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm text-foreground truncate">{selectedThread.oggetto}</h2>
            <TipoBadge tipo={selectedThread.tipo} />
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[11px] text-muted-foreground">{selectedThread.cantiere_nome}</span>
            <span className="text-[11px] text-muted-foreground">·</span>
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">{selectedThread.partecipanti.length}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {threadMessages.map((msg, i) => {
          const isMe = msg.mittente_id === CURRENT_USER_ID;
          const showAvatar = i === 0 || threadMessages[i - 1].mittente_id !== msg.mittente_id;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-2 max-w-[80%] ${isMe ? "flex-row-reverse" : ""}`}>
                {showAvatar ? (
                  <Avatar className="h-7 w-7 shrink-0 mt-1">
                    <AvatarFallback className="text-[10px] bg-muted">{getInitials(msg.mittente_nome)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-7 shrink-0" />
                )}
                <div>
                  {showAvatar && (
                    <p className={`text-[10px] mb-0.5 text-muted-foreground ${isMe ? "text-right" : ""}`}>{msg.mittente_nome}</p>
                  )}
                  <div className={`rounded-xl px-3 py-2 text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    <p>{msg.testo}</p>
                    {msg.allegato && (
                      <div className={`flex items-center gap-1 mt-1.5 text-[11px] ${isMe ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        <Paperclip className="h-3 w-3" />
                        <span className="underline">{msg.allegato.nome_file}</span>
                      </div>
                    )}
                  </div>
                  <p className={`text-[10px] text-muted-foreground mt-0.5 ${isMe ? "text-right" : ""}`}>
                    {format(new Date(msg.timestamp), "dd/MM HH:mm", { locale: it })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Textarea
            placeholder="Scrivi un messaggio..."
            value={composerText}
            onChange={e => setComposerText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            className="min-h-[36px] max-h-[120px] resize-none text-sm py-2"
            rows={1}
          />
          <Button size="icon" className="shrink-0 h-9 w-9" onClick={handleSend} disabled={!composerText.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
      <p className="text-sm text-muted-foreground">Seleziona una conversazione per visualizzare i messaggi</p>
    </div>
  );

  /* ── New Message Dialog ── */
  const newMessageDialog = (
    <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nuova Conversazione</DialogTitle>
          <DialogDescription>Crea un nuovo thread di comunicazione per un cantiere.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Cantiere</label>
            <Select value={newCantiere} onValueChange={setNewCantiere}>
              <SelectTrigger><SelectValue placeholder="Seleziona cantiere" /></SelectTrigger>
              <SelectContent>
                {mockCantieri.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Oggetto</label>
            <Input value={newOggetto} onChange={e => setNewOggetto(e.target.value)} placeholder="Oggetto della conversazione" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Destinatari</label>
            <div className="border border-input rounded-md p-2 max-h-32 overflow-y-auto space-y-1">
              {destinatariOptions.map(d => (
                <label key={d.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-accent/50 rounded px-1 py-0.5">
                  <input
                    type="checkbox"
                    checked={newDestinatari.includes(d.id)}
                    onChange={e => {
                      if (e.target.checked) setNewDestinatari(prev => [...prev, d.id]);
                      else setNewDestinatari(prev => prev.filter(x => x !== d.id));
                    }}
                    className="rounded"
                  />
                  <span className="text-foreground">{d.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Tipo</label>
            <Select value={newTipo} onValueChange={v => setNewTipo(v as TipoThread)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="generale">Generale</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
                <SelectItem value="documento">Documento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Messaggio</label>
            <Textarea value={newTesto} onChange={e => setNewTesto(e.target.value)} placeholder="Scrivi il primo messaggio..." rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewDialog(false)}>Annulla</Button>
          <Button onClick={handleCreateThread} disabled={!newCantiere || !newOggetto.trim() || !newTesto.trim()}>
            <Send className="h-4 w-4 mr-1" /> Invia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  /* ── Layout ── */
  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {newMessageDialog}

      {isMobile ? (
        mobileShowChat ? chatView : threadList
      ) : (
        <>
          <div className="w-[340px] border-r border-border shrink-0">{threadList}</div>
          <div className="flex-1">{chatView}</div>
        </>
      )}
    </div>
  );
}
