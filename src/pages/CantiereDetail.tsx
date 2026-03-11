import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCantieri, mockDocumenti, mockSubappaltatori, mockLavoratori, mockMezzi, mockAccessi, mockFileCantiere, mockDiarioCantiere } from "@/data/mock-data";
import { GalleriaCantiere } from "@/components/cantiere/GalleriaCantiere";
import { DiarioCantiere } from "@/components/cantiere/DiarioCantiere";
import { DocumentStatusBadge } from "@/components/cantiere/DocumentStatusBadge";
import { DocumentActions } from "@/components/cantiere/DocumentActions";
import { ChecklistProgress } from "@/components/cantiere/ChecklistProgress";
import type { DocumentoStato } from "@/data/mock-data";

export default function CantiereDetail() {
  const { id } = useParams();
  const cantiere = mockCantieri.find((c) => c.id === id);

  if (!cantiere) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Cantiere non trovato.</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link to="/app/cantieri">Torna ai cantieri</Link>
        </Button>
      </div>
    );
  }

  const docs = mockDocumenti.filter((d) => d.cantiere_id === id);
  const subs = mockSubappaltatori.filter((s) => s.cantiere_id === id);
  const workers = mockLavoratori.filter((l) => subs.some((s) => s.id === l.subappaltatore_id) || l.tipo === "interno");
  const mezzi = mockMezzi.filter((m) => m.cantiere_id === id);
  const accessi = mockAccessi.filter((a) => a.cantiere_id === id);
  const fileCantiere = mockFileCantiere.filter((f) => f.cantiere_id === id);
  const diario = mockDiarioCantiere.filter((d) => d.cantiere_id === id);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/app/cantieri"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">{cantiere.nome}</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{cantiere.indirizzo}, {cantiere.comune}</span>
            <span className="text-xs bg-success/15 text-success rounded-sm px-1.5 py-0.5 font-semibold uppercase tracking-wider">{cantiere.stato}</span>
          </div>
        </div>
        <div className="ml-auto">
          <ChecklistProgress completed={cantiere.documenti_ok} total={cantiere.documenti_totali} />
        </div>
      </div>

      <Tabs defaultValue="documenti">
        <TabsList>
          <TabsTrigger value="documenti">Documenti ({docs.length})</TabsTrigger>
          <TabsTrigger value="subappaltatori">Subappaltatori ({subs.length})</TabsTrigger>
          <TabsTrigger value="lavoratori">Lavoratori ({workers.length})</TabsTrigger>
          <TabsTrigger value="mezzi">Mezzi ({mezzi.length})</TabsTrigger>
          <TabsTrigger value="accessi">Accessi ({accessi.length})</TabsTrigger>
          <TabsTrigger value="galleria">Galleria ({fileCantiere.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="documenti">
          <div className="border border-border rounded-lg divide-y divide-border">
            {docs.length === 0 && <p className="p-4 text-sm text-muted-foreground">Nessun documento caricato.</p>}
            {docs.map((d) => (
              <div key={d.id} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{d.nome_file}</p>
                  <p className="text-xs text-muted-foreground">{d.categoria} · {d.data_scadenza ? `Scade il ${new Date(d.data_scadenza).toLocaleDateString("it-IT")}` : "Nessuna scadenza"}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <DocumentActions nomeFile={d.nome_file} categoria={d.categoria} dataCaricamento={d.data_caricamento} />
                  <DocumentStatusBadge stato={d.stato as DocumentoStato} />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subappaltatori">
          <div className="border border-border rounded-lg divide-y divide-border">
            {subs.map((s) => (
              <Link key={s.id} to={`/app/subappaltatori/${s.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">{s.ragione_sociale}</p>
                  <p className="text-xs text-muted-foreground">{s.email_referente}</p>
                </div>
                <ChecklistProgress completed={s.documenti_ok} total={s.documenti_totali} size="sm" />
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lavoratori">
          <div className="border border-border rounded-lg divide-y divide-border">
            {workers.map((w) => (
              <Link key={w.id} to={`/app/lavoratori/${w.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">{w.nome} {w.cognome}</p>
                  <p className="text-xs text-muted-foreground">{w.mansione} · {w.tipo}</p>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mezzi">
          <div className="border border-border rounded-lg divide-y divide-border">
            {mezzi.map((m) => (
              <div key={m.id} className="px-4 py-3">
                <p className="text-sm font-medium text-foreground">{m.tipo} — {m.targa_o_matricola}</p>
                <p className="text-xs text-muted-foreground">{m.descrizione}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accessi">
          <div className="border border-border rounded-lg divide-y divide-border">
            {accessi.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.lavoratore_nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.tipo === "entrata" ? "↗ Entrata" : "↙ Uscita"} · {new Date(a.timestamp).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-sm px-1.5 py-0.5">{a.metodo}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="galleria">
          <GalleriaCantiere cantiereId={id!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
