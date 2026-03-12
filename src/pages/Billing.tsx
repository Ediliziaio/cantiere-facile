import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard, Download, ExternalLink, ArrowUpRight, Check, Crown, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { mockInvoices, mockPaymentMethods, mockPlans, mockCurrentTenantBilling, type MockInvoice } from "@/data/mock-billing";

const invoiceStatusMap: Record<MockInvoice["stato"], { label: string; variant: "default" | "destructive" | "secondary" | "outline" }> = {
  pagata: { label: "Pagata", variant: "default" },
  in_scadenza: { label: "In scadenza", variant: "secondary" },
  scaduta: { label: "Scaduta", variant: "destructive" },
  bozza: { label: "Bozza", variant: "outline" },
};

const planIcons: Record<string, React.ReactNode> = {
  free: <Zap className="h-5 w-5" />,
  pro: <Crown className="h-5 w-5" />,
  enterprise: <ArrowUpRight className="h-5 w-5" />,
};

export default function Billing() {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const tenantInvoices = mockInvoices.filter((i) => i.tenant_id === "t1");
  const paymentMethod = mockPaymentMethods.find((p) => p.tenant_id === "t1");
  const { plan, billing_cycle, current_period_end, status } = mockCurrentTenantBilling;

  const handleUpgrade = (planId: string) => {
    const selected = mockPlans.find((p) => p.id === planId);
    toast({ title: "Upgrade richiesto", description: `Passaggio al piano ${selected?.nome} in corso... (simulato — richiede Stripe)` });
    setUpgradeOpen(false);
  };

  const handleDownloadInvoice = (inv: MockInvoice) => {
    toast({ title: "Download fattura", description: `Download ${inv.numero_fattura} in corso... (simulato)` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Abbonamento</h1>
        <p className="text-muted-foreground text-sm">Gestisci il tuo piano e la fatturazione</p>
      </div>

      {/* Piano attuale */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg">Piano attuale</CardTitle>
            <CardDescription>Dettagli del tuo abbonamento</CardDescription>
          </div>
          <Badge variant={status === "active" ? "default" : "destructive"} className="capitalize">
            {status === "active" ? "Attivo" : status}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {planIcons[plan.id] || <Crown className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">{plan.nome}</p>
                <p className="text-sm text-muted-foreground">
                  €{billing_cycle === "monthly" ? plan.prezzo_mensile : plan.prezzo_annuale}/mese
                  {billing_cycle === "annual" && " (annuale)"}
                </p>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Cantieri</p>
                <p className="font-medium text-foreground">{plan.max_cantieri ?? "Illimitati"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Utenti</p>
                <p className="font-medium text-foreground">{plan.max_utenti ?? "Illimitati"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Prossimo rinnovo</p>
                <p className="font-medium text-foreground">{new Date(current_period_end).toLocaleDateString("it-IT")}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm">Cambia piano</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Cambia piano</DialogTitle>
                    <DialogDescription>Seleziona il piano che preferisci</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-2">
                    {mockPlans.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleUpgrade(p.id)}
                        disabled={p.id === plan.id}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                          p.id === plan.id
                            ? "border-primary bg-primary/5 cursor-default"
                            : "border-border hover:border-primary/50 hover:bg-accent"
                        }`}
                      >
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          {planIcons[p.id]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{p.nome}</p>
                          <p className="text-xs text-muted-foreground">€{p.prezzo_mensile}/mese</p>
                        </div>
                        {p.id === plan.id && <Check className="h-4 w-4 text-primary shrink-0" />}
                      </button>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setUpgradeOpen(false)}>Annulla</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast({ title: "Portale Stripe", description: "Apertura portale self-service... (simulato — richiede Stripe)" })}
              >
                <ExternalLink className="h-4 w-4 mr-1" /> Gestisci
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metodo di pagamento */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Metodo di pagamento</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast({ title: "Aggiornamento carta", description: "Redirect al portale Stripe... (simulato)" })}
          >
            Aggiorna
          </Button>
        </CardHeader>
        <CardContent>
          {paymentMethod ? (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {paymentMethod.tipo === "card" ? `${paymentMethod.brand} •••• ${paymentMethod.last4}` : `SEPA •••• ${paymentMethod.last4}`}
                </p>
                {paymentMethod.tipo === "card" && (
                  <p className="text-xs text-muted-foreground">Scade {paymentMethod.expiry_month}/{paymentMethod.expiry_year}</p>
                )}
              </div>
              {paymentMethod.is_default && <Badge variant="secondary" className="ml-auto">Predefinito</Badge>}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nessun metodo di pagamento configurato</p>
          )}
        </CardContent>
      </Card>

      {/* Storico fatture */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Storico fatture</CardTitle>
          <CardDescription>Le tue fatture recenti</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Fattura</TableHead>
                <TableHead>Descrizione</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Totale</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantInvoices.map((inv) => {
                const st = invoiceStatusMap[inv.stato];
                return (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs">{inv.numero_fattura}</TableCell>
                    <TableCell className="text-sm">{inv.descrizione}</TableCell>
                    <TableCell className="text-sm">{new Date(inv.data_emissione).toLocaleDateString("it-IT")}</TableCell>
                    <TableCell className="text-right font-medium">€{inv.totale.toFixed(2)}</TableCell>
                    <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownloadInvoice(inv)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
