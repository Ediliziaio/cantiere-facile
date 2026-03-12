import { useState, useMemo } from "react";
import { Plus, FileText, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentUploader } from "@/components/cantiere/DocumentUploader";
import { DocumentGrid } from "@/components/cantiere/DocumentGrid";
import { DocumentFilters, defaultFilters } from "@/components/cantiere/DocumentFilters";
import { DocumentViewer } from "@/components/cantiere/DocumentViewer";
import { mockDocumenti, mockCantieri } from "@/data/mock-data";
import type { DocumentFilterState } from "@/components/cantiere/DocumentFilters";
import { toast } from "sonner";

export default function Documenti() {
  const [showUpload, setShowUpload] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [viewDoc, setViewDoc] = useState<typeof mockDocumenti[0] | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  // Stats
  const stats = useMemo(() => ({
    totali: mockDocumenti.length,
    validi: mockDocumenti.filter(d => d.stato === "valido").length,
    inScadenza: mockDocumenti.filter(d => d.stato === "in_scadenza").length,
    scaduti: mockDocumenti.filter(d => d.stato === "scaduto").length,
    daVerificare: mockDocumenti.filter(d => d.stato === "da_verificare").length,
  }), []);

  // Filter documents
  const filtered = useMemo(() => {
    return mockDocumenti.filter(d => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchName = d.nome_file.toLowerCase().includes(q);
        const matchCat = d.categoria.toLowerCase().includes(q);
        const matchFields = d.extracted_fields && Object.values(d.extracted_fields).some(v => v.toLowerCase().includes(q));
        if (!matchName && !matchCat && !matchFields) return false;
      }
      if (filters.stato !== "tutti" && d.stato !== filters.stato) return false;
      if (filters.cantiere !== "tutti" && d.cantiere_id !== filters.cantiere) return false;
      if (filters.categoria !== "tutti" && d.categoria !== filters.categoria) return false;
      if (filters.processingStatus !== "tutti" && d.processing_status !== filters.processingStatus) return false;
      if (filters.riferimentoTipo !== "tutti" && d.riferimento_tipo !== filters.riferimentoTipo) return false;
      return true;
    });
  }, [filters]);

  const handleViewDocument = (doc: typeof mockDocumenti[0]) => {
    setViewDoc(doc);
    setViewOpen(true);
  };

  const handleApprove = (id: string) => {
    toast.success("Documento approvato");
    setViewOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-foreground">Documenti</h1>
        <Button size="sm" onClick={() => setShowUpload(!showUpload)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Carica documenti
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Totali", value: stats.totali, icon: FileText, color: "text-foreground" },
          { label: "In scadenza", value: stats.inScadenza, icon: Clock, color: "text-warning" },
          { label: "Scaduti", value: stats.scaduti, icon: AlertTriangle, color: "text-destructive" },
          { label: "Da verificare", value: stats.daVerificare, icon: AlertTriangle, color: "text-muted-foreground" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-3 flex items-center gap-3">
              <Icon className={`h-5 w-5 ${color} shrink-0`} />
              <div>
                <p className="text-xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload zone */}
      {showUpload && (
        <DocumentUploader
          onComplete={() => setShowUpload(false)}
          onClose={() => setShowUpload(false)}
        />
      )}

      {/* Filters */}
      <DocumentFilters
        filters={filters}
        onChange={setFilters}
        resultCount={filtered.length}
      />

      {/* Document grid/list */}
      <DocumentGrid
        documents={filtered}
        onViewDocument={handleViewDocument}
        onApproveSelected={(ids) => toast.success(`${ids.length} documenti approvati`)}
      />

      {/* Document viewer modal */}
      <DocumentViewer
        document={viewDoc}
        open={viewOpen}
        onOpenChange={setViewOpen}
        onApprove={handleApprove}
      />
    </div>
  );
}
