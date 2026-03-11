import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, CheckCircle2, AlertTriangle, Wrench, OctagonX, FileText, Clock, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { DocumentActions } from "@/components/cantiere/DocumentActions";
import { mockMezzi, mockCantieri, mockDocumenti, mockManutenzioni, getScadenzaStatus, type MezzoStatoOperativo } from "@/data/mock-data";

const statoChip: Record<MezzoStatoOperativo, { label: string; className: string }> = {
  operativo: { label: "Operativo", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" },
  in_manutenzione: { label: "In manutenzione", className: "bg-amber-500/10 text-amber-700 border-amber-500/30" },
  fermo: { label: "Fermo", className: "bg-destructive/10 text-destructive border-destructive/30" },
};

const scadenzaStatusChip = (status: string) => {
  if (status === "scaduto") return { label: "Scaduto", className: "text-destructive", icon: <OctagonX className="h-3.5 w-3.5" /> };
  if (status === "in_scadenza") return { label: "In scadenza", className: "text-amber-600", icon: <AlertTriangle className="h-3.5 w-3.5" /> };
  return { label: "Valido", className: "text-emerald-600", icon: <CheckCircle2 className="h-3.5 w-3.5" /> };
};

const tipiMezzo = ["Escavatore", "Gru a torre", "Autocarro", "Piattaforma aerea", "Betoniera", "Altro"] as const;

const editSchema = z.object({
  tipo: z.string().min(1, "Seleziona un tipo"),
  targa_o_matricola: z.string().trim().min(1, "Obbligatorio").max(30),
  descrizione: z.string().trim().min(1, "Obbligatoria").max(200),
  cantiere_id: z.string().min(1, "Seleziona un cantiere"),
  stato_operativo: z.enum(["operativo", "in_manutenzione", "fermo"]),
  data_immatricolazione: z.date(),
  data_prossima_revisione: z.date(),
  data_prossima_manutenzione: z.date(),
  scadenza_assicurazione: z.date(),
  scadenza_collaudo: z.date().optional(),
  ore_lavoro: z.coerce.number().min(0),
  km_percorsi: z.coerce.number().min(0).optional(),
  responsabile: z.string().trim().min(1, "Obbligatorio").max(100),
  note: z.string().max(500).optional(),
});

type EditValues = z.infer<typeof editSchema>;

function DatePickerField({ field, label }: { field: any; label: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.value ? format(field.value, "dd/MM/yyyy", { locale: it }) : <span>{label}</span>}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
      </PopoverContent>
    </Popover>
  );
}

export default function MezzoDetail() {
  const { id } = useParams<{ id: string }>();
  const mezzo = mockMezzi.find((m) => m.id === id);
  const [editOpen, setEditOpen] = useState(false);

  if (!mezzo) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Mezzo non trovato</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link to="/app/mezzi">Torna ai mezzi</Link>
        </Button>
      </div>
    );
  }

  const cantiere = mockCantieri.find((c) => c.id === mezzo.cantiere_id);
  const documenti = mockDocumenti.filter((d) => d.riferimento_tipo === "mezzo" && d.riferimento_id === mezzo.id);
  const manutenzioni = mockManutenzioni.filter((m) => m.mezzo_id === mezzo.id).sort((a, b) => b.data.localeCompare(a.data));
  const chip = statoChip[mezzo.stato_operativo];

  const scadenze = [
    { label: "Prossima revisione", date: mezzo.data_prossima_revisione },
    { label: "Prossima manutenzione", date: mezzo.data_prossima_manutenzione },
    { label: "Scadenza assicurazione", date: mezzo.scadenza_assicurazione },
    ...(mezzo.scadenza_collaudo ? [{ label: "Scadenza collaudo", date: mezzo.scadenza_collaudo }] : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/app/mezzi"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <Truck className="h-5 w-5 text-primary" />
          <h1 className="font-heading font-bold text-2xl text-foreground">
            {mezzo.tipo} — {mezzo.targa_o_matricola}
          </h1>
          <span className={`inline-flex items-center text-[11px] font-medium border rounded-full px-2 py-0.5 ${chip.className}`}>
            {chip.label}
          </span>
        </div>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Pencil className="h-3.5 w-3.5 mr-1" /> Modifica</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifica mezzo</DialogTitle>
            </DialogHeader>
            <EditMezzoForm mezzo={mezzo} onSuccess={() => setEditOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Info generali */}
        <div className="border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-heading font-semibold text-foreground">Informazioni generali</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground text-xs">Descrizione</span><p className="text-foreground">{mezzo.descrizione}</p></div>
            <div><span className="text-muted-foreground text-xs">Cantiere</span><p className="text-foreground">{cantiere?.nome ?? "—"}</p></div>
            <div><span className="text-muted-foreground text-xs">Responsabile</span><p className="text-foreground">{mezzo.responsabile}</p></div>
            <div><span className="text-muted-foreground text-xs">Immatricolazione</span><p className="text-foreground">{new Date(mezzo.data_immatricolazione).toLocaleDateString("it-IT")}</p></div>
            <div><span className="text-muted-foreground text-xs">Ore lavoro</span><p className="text-foreground">{mezzo.ore_lavoro.toLocaleString("it-IT")} h</p></div>
            {mezzo.km_percorsi && <div><span className="text-muted-foreground text-xs">Km percorsi</span><p className="text-foreground">{mezzo.km_percorsi.toLocaleString("it-IT")} km</p></div>}
          </div>
          {mezzo.note && (
            <div className="border-t border-border pt-3">
              <span className="text-muted-foreground text-xs">Note</span>
              <p className="text-sm text-foreground mt-0.5">{mezzo.note}</p>
            </div>
          )}
        </div>

        {/* Scadenze e revisioni */}
        <div className="border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" /> Scadenze e Revisioni
          </h2>
          <div className="space-y-3">
            {scadenze.map((s, i) => {
              const status = getScadenzaStatus(s.date);
              const sc = scadenzaStatusChip(status);
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{new Date(s.date).toLocaleDateString("it-IT")}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${sc.className}`}>
                    {sc.icon} {sc.label}
                  </span>
                </div>
              );
            })}
          </div>
          {mezzo.data_ultima_revisione && (
            <div className="text-xs text-muted-foreground border-t border-border pt-3">
              Ultima revisione: {new Date(mezzo.data_ultima_revisione).toLocaleDateString("it-IT")}
            </div>
          )}
        </div>
      </div>

      {/* Documenti collegati */}
      <div className="border border-border rounded-lg p-5 space-y-3">
        <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" /> Documenti collegati
        </h2>
        {documenti.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nessun documento collegato</p>
        ) : (
          <div className="divide-y divide-border">
            {documenti.map((d) => (
              <div key={d.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-foreground">{d.nome_file}</p>
                  <p className="text-xs text-muted-foreground">{d.categoria} · Caricato il {new Date(d.data_caricamento).toLocaleDateString("it-IT")}</p>
                </div>
                {d.data_scadenza && (
                  <span className={`text-xs font-medium ${getScadenzaStatus(d.data_scadenza) === "scaduto" ? "text-destructive" : getScadenzaStatus(d.data_scadenza) === "in_scadenza" ? "text-amber-600" : "text-emerald-600"}`}>
                    Scade: {new Date(d.data_scadenza).toLocaleDateString("it-IT")}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Storico manutenzioni */}
      <div className="border border-border rounded-lg p-5 space-y-3">
        <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" /> Storico manutenzioni
        </h2>
        {manutenzioni.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nessuna manutenzione registrata</p>
        ) : (
          <div className="space-y-3">
            {manutenzioni.map((man) => {
              const tipoColors: Record<string, string> = {
                ordinaria: "border-l-emerald-500",
                straordinaria: "border-l-amber-500",
                revisione: "border-l-primary",
                collaudo: "border-l-blue-500",
              };
              return (
                <div key={man.id} className={`border border-border border-l-4 ${tipoColors[man.tipo]} rounded-lg p-3`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{man.descrizione}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(man.data).toLocaleDateString("it-IT")} · {man.eseguita_da}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-sm px-1.5 py-0.5">
                        {man.tipo}
                      </span>
                      {man.costo && (
                        <p className="text-xs text-foreground mt-1">€ {man.costo.toLocaleString("it-IT")}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Edit form component ---
function EditMezzoForm({ mezzo, onSuccess }: { mezzo: typeof mockMezzi[0]; onSuccess: () => void }) {
  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      tipo: mezzo.tipo,
      targa_o_matricola: mezzo.targa_o_matricola,
      descrizione: mezzo.descrizione,
      cantiere_id: mezzo.cantiere_id,
      stato_operativo: mezzo.stato_operativo,
      data_immatricolazione: new Date(mezzo.data_immatricolazione),
      data_prossima_revisione: new Date(mezzo.data_prossima_revisione),
      data_prossima_manutenzione: new Date(mezzo.data_prossima_manutenzione),
      scadenza_assicurazione: new Date(mezzo.scadenza_assicurazione),
      scadenza_collaudo: mezzo.scadenza_collaudo ? new Date(mezzo.scadenza_collaudo) : undefined,
      ore_lavoro: mezzo.ore_lavoro,
      km_percorsi: mezzo.km_percorsi ?? undefined,
      responsabile: mezzo.responsabile,
      note: mezzo.note ?? "",
    },
  });

  function onSubmit(data: EditValues) {
    console.log("Mezzo aggiornato:", data);
    toast.success("Mezzo aggiornato con successo", {
      description: `${data.tipo} — ${data.targa_o_matricola}`,
    });
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="tipo" render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo mezzo</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {tipiMezzo.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="targa_o_matricola" render={({ field }) => (
            <FormItem>
              <FormLabel>Targa / Matricola</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="descrizione" render={({ field }) => (
          <FormItem>
            <FormLabel>Descrizione</FormLabel>
            <FormControl><Textarea className="resize-none" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="cantiere_id" render={({ field }) => (
            <FormItem>
              <FormLabel>Cantiere</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {mockCantieri.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="stato_operativo" render={({ field }) => (
            <FormItem>
              <FormLabel>Stato operativo</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="operativo">Operativo</SelectItem>
                  <SelectItem value="in_manutenzione">In manutenzione</SelectItem>
                  <SelectItem value="fermo">Fermo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="responsabile" render={({ field }) => (
            <FormItem>
              <FormLabel>Responsabile</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="ore_lavoro" render={({ field }) => (
            <FormItem>
              <FormLabel>Ore lavoro</FormLabel>
              <FormControl><Input type="number" min={0} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="km_percorsi" render={({ field }) => (
          <FormItem className="sm:w-1/2">
            <FormLabel>Km percorsi (opzionale)</FormLabel>
            <FormControl><Input type="number" min={0} {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <h3 className="font-heading font-semibold text-sm text-foreground pt-2">Scadenze e revisioni</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="data_immatricolazione" render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Immatricolazione</FormLabel>
              <DatePickerField field={field} label="Seleziona data" />
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="data_prossima_revisione" render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Prossima revisione</FormLabel>
              <DatePickerField field={field} label="Seleziona data" />
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="data_prossima_manutenzione" render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Prossima manutenzione</FormLabel>
              <DatePickerField field={field} label="Seleziona data" />
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="scadenza_assicurazione" render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Scadenza assicurazione</FormLabel>
              <DatePickerField field={field} label="Seleziona data" />
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="scadenza_collaudo" render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Scadenza collaudo (opzionale)</FormLabel>
              <DatePickerField field={field} label="Seleziona data" />
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="note" render={({ field }) => (
          <FormItem>
            <FormLabel>Note (opzionale)</FormLabel>
            <FormControl><Textarea className="resize-none" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex gap-3 pt-2">
          <Button type="submit">Salva modifiche</Button>
          <Button type="button" variant="outline" onClick={onSuccess}>Annulla</Button>
        </div>
      </form>
    </Form>
  );
}
