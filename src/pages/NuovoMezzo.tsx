import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { ArrowLeft, CalendarIcon, Truck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { mockCantieri } from "@/data/mock-data";

const tipiMezzo = ["Escavatore", "Gru a torre", "Autocarro", "Piattaforma aerea", "Betoniera", "Altro"] as const;

const formSchema = z.object({
  tipo: z.string().min(1, "Seleziona un tipo"),
  targa_o_matricola: z.string().trim().min(1, "Targa o matricola obbligatoria").max(30),
  descrizione: z.string().trim().min(1, "Descrizione obbligatoria").max(200),
  cantiere_id: z.string().min(1, "Seleziona un cantiere"),
  stato_operativo: z.enum(["operativo", "in_manutenzione", "fermo"]),
  data_immatricolazione: z.date({ required_error: "Data obbligatoria" }),
  data_prossima_revisione: z.date({ required_error: "Data obbligatoria" }),
  data_prossima_manutenzione: z.date({ required_error: "Data obbligatoria" }),
  scadenza_assicurazione: z.date({ required_error: "Data obbligatoria" }),
  scadenza_collaudo: z.date().optional(),
  ore_lavoro: z.coerce.number().min(0, "Valore non valido"),
  km_percorsi: z.coerce.number().min(0).optional(),
  responsabile: z.string().trim().min(1, "Responsabile obbligatorio").max(100),
  note: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}

export default function NuovoMezzo() {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "",
      targa_o_matricola: "",
      descrizione: "",
      cantiere_id: "",
      stato_operativo: "operativo",
      ore_lavoro: 0,
      responsabile: "",
      note: "",
    },
  });

  function onSubmit(data: FormValues) {
    console.log("Nuovo mezzo:", data);
    toast.success("Mezzo creato con successo", {
      description: `${data.tipo} — ${data.targa_o_matricola}`,
    });
    navigate("/app/mezzi");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/app/mezzi"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <Truck className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-2xl text-foreground">Nuovo mezzo d'opera</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Info generali */}
          <div className="border border-border rounded-lg p-4 space-y-4">
            <h2 className="font-heading font-semibold text-foreground">Informazioni generali</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="tipo" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo mezzo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleziona tipo" /></SelectTrigger></FormControl>
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
                  <FormControl><Input placeholder="es. RM-2024-001" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="descrizione" render={({ field }) => (
              <FormItem>
                <FormLabel>Descrizione</FormLabel>
                <FormControl><Textarea placeholder="Descrivi il mezzo…" className="resize-none" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="cantiere_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantiere</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleziona cantiere" /></SelectTrigger></FormControl>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <FormControl><Input placeholder="Nome e cognome" {...field} /></FormControl>
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
                <FormControl><Input type="number" min={0} placeholder="0" {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* Scadenze */}
          <div className="border border-border rounded-lg p-4 space-y-4">
            <h2 className="font-heading font-semibold text-foreground">Scadenze e revisioni</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="data_immatricolazione" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data immatricolazione</FormLabel>
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
          </div>

          {/* Note */}
          <FormField control={form.control} name="note" render={({ field }) => (
            <FormItem>
              <FormLabel>Note (opzionale)</FormLabel>
              <FormControl><Textarea placeholder="Note aggiuntive…" className="resize-none" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="sticky bottom-16 sm:bottom-0 bg-background pt-3 pb-3 -mb-3 flex flex-col sm:flex-row gap-3">
            <Button type="submit" className="w-full sm:w-auto">Crea mezzo</Button>
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/app/mezzi")}>Annulla</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
