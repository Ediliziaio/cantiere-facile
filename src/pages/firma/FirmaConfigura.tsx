import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Save, GripVertical, FileText } from "lucide-react";
import { mockDocumentiFirma, mockFirmatari, mockCampiFirma, type CampoFirma, type TipoCampoFirma } from "@/data/mock-firma";
import { useToast } from "@/hooks/use-toast";

const tipoLabels: Record<TipoCampoFirma, string> = {
  firma: "Firma",
  iniziali: "Iniziali",
  data: "Data",
  testo_libero: "Testo libero",
};

const tipoColors: Record<TipoCampoFirma, string> = {
  firma: "border-amber-400 bg-amber-50",
  iniziali: "border-blue-400 bg-blue-50",
  data: "border-emerald-400 bg-emerald-50",
  testo_libero: "border-purple-400 bg-purple-50",
};

interface PlacedField {
  id: string;
  pagina: number;
  x: number;
  y: number;
  larghezza: number;
  altezza: number;
  firmatario_id: string;
  tipo: TipoCampoFirma;
  ordine: number;
}

export default function FirmaConfigura() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const doc = mockDocumentiFirma.find(d => d.id === id);
  const signers = mockFirmatari.filter(f => f.documento_id === id);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const [fields, setFields] = useState<PlacedField[]>(() =>
    mockCampiFirma
      .filter(c => c.documento_id === id)
      .map(c => ({
        id: c.id,
        pagina: c.pagina,
        x: c.x,
        y: c.y,
        larghezza: c.larghezza,
        altezza: c.altezza,
        firmatario_id: c.firmatario_id,
        tipo: c.tipo,
        ordine: c.ordine,
      }))
  );

  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [draggingField, setDraggingField] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; // mock

  const addField = (tipo: TipoCampoFirma) => {
    const newField: PlacedField = {
      id: `cf-new-${Date.now()}`,
      pagina: currentPage,
      x: 20 + Math.random() * 30,
      y: 40 + Math.random() * 20,
      larghezza: tipo === "iniziali" ? 15 : tipo === "data" ? 20 : 30,
      altezza: tipo === "iniziali" ? 6 : 8,
      firmatario_id: signers[0]?.id || "",
      tipo,
      ordine: fields.length + 1,
    };
    setFields(prev => [...prev, newField]);
    setSelectedField(newField.id);
  };

  const removeField = (fieldId: string) => {
    setFields(prev => prev.filter(f => f.id !== fieldId));
    if (selectedField === fieldId) setSelectedField(null);
  };

  const updateField = (fieldId: string, updates: Partial<PlacedField>) => {
    setFields(prev => prev.map(f => f.id === fieldId ? { ...f, ...updates } : f));
  };

  const handlePointerDown = useCallback((e: React.PointerEvent, fieldId: string) => {
    e.stopPropagation();
    const container = pdfContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setDragOffset({ x: clickX - field.x, y: clickY - field.y });
    setDraggingField(fieldId);
    setSelectedField(fieldId);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [fields]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingField) return;
    const container = pdfContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    const newX = Math.max(0, Math.min(85, ((e.clientX - rect.left) / rect.width) * 100 - dragOffset.x));
    const newY = Math.max(0, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100 - dragOffset.y));

    updateField(draggingField, { x: newX, y: newY });
  }, [draggingField, dragOffset]);

  const handlePointerUp = useCallback(() => {
    setDraggingField(null);
  }, []);

  const handleSave = () => {
    toast({ title: "Configurazione salvata", description: `${fields.length} campi firma configurati` });
    navigate(`/app/firma/${id}`);
  };

  if (!doc) return <div className="p-8 text-center text-muted-foreground">Documento non trovato</div>;

  const pageFields = fields.filter(f => f.pagina === currentPage);
  const selected = fields.find(f => f.id === selectedField);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/app/firma/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">Configura campi firma</h1>
          <p className="text-sm text-muted-foreground truncate">{doc.nome}</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-1.5" /> Salva
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* PDF Viewer with fields */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-sm">Pagina {currentPage} di {totalPages}</CardTitle>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>←</Button>
              <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>→</Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div
              ref={pdfContainerRef}
              className="relative bg-white border rounded-lg shadow-inner aspect-[210/297] w-full select-none cursor-crosshair"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onClick={() => setSelectedField(null)}
            >
              {/* Mock PDF content */}
              <div className="absolute inset-0 p-[8%] pointer-events-none">
                <div className="space-y-3">
                  <div className="h-3 bg-muted/40 rounded w-1/2 mx-auto" />
                  <div className="h-2 bg-muted/30 rounded w-3/4 mx-auto" />
                  <div className="mt-6 space-y-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="h-1.5 bg-muted/20 rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-1.5 bg-muted/20 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Placed fields */}
              {pageFields.map(field => {
                const signer = signers.find(s => s.id === field.firmatario_id);
                return (
                  <div
                    key={field.id}
                    className={`absolute border-2 rounded cursor-move transition-shadow ${tipoColors[field.tipo]} ${
                      selectedField === field.id ? "ring-2 ring-primary shadow-lg z-10" : "hover:shadow-md"
                    }`}
                    style={{
                      left: `${field.x}%`,
                      top: `${field.y}%`,
                      width: `${field.larghezza}%`,
                      height: `${field.altezza}%`,
                    }}
                    onPointerDown={e => handlePointerDown(e, field.id)}
                  >
                    <div className="flex items-center justify-between h-full px-1.5 text-[10px] font-medium text-foreground/70 select-none">
                      <div className="flex items-center gap-1 truncate">
                        <GripVertical className="h-3 w-3 shrink-0 opacity-50" />
                        <span className="truncate">{tipoLabels[field.tipo]}</span>
                        {signer && <span className="text-[9px] opacity-60 truncate">· {signer.nome}</span>}
                      </div>
                      <button
                        className="shrink-0 text-destructive/60 hover:text-destructive"
                        onClick={e => { e.stopPropagation(); removeField(field.id); }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Toolbox panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Aggiungi campo</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start border-amber-300 hover:bg-amber-50" onClick={() => addField("firma")}>
                <div className="w-3 h-3 rounded-sm bg-amber-400 mr-1.5" /> Firma
              </Button>
              <Button variant="outline" size="sm" className="justify-start border-blue-300 hover:bg-blue-50" onClick={() => addField("iniziali")}>
                <div className="w-3 h-3 rounded-sm bg-blue-400 mr-1.5" /> Iniziali
              </Button>
              <Button variant="outline" size="sm" className="justify-start border-emerald-300 hover:bg-emerald-50" onClick={() => addField("data")}>
                <div className="w-3 h-3 rounded-sm bg-emerald-400 mr-1.5" /> Data
              </Button>
              <Button variant="outline" size="sm" className="justify-start border-purple-300 hover:bg-purple-50" onClick={() => addField("testo_libero")}>
                <div className="w-3 h-3 rounded-sm bg-purple-400 mr-1.5" /> Testo
              </Button>
            </CardContent>
          </Card>

          {/* Field properties */}
          {selected && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Proprietà campo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Tipo</label>
                  <Select value={selected.tipo} onValueChange={v => updateField(selected.id, { tipo: v as TipoCampoFirma })}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(tipoLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Assegna a</label>
                  <Select value={selected.firmatario_id} onValueChange={v => updateField(selected.id, { firmatario_id: v })}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {signers.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.nome} {s.cognome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-muted-foreground">X: {selected.x.toFixed(1)}%</label>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Y: {selected.y.toFixed(1)}%</label>
                  </div>
                </div>
                <Button variant="destructive" size="sm" className="w-full" onClick={() => removeField(selected.id)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Rimuovi campo
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Fields list */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Campi posizionati ({fields.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 max-h-[200px] overflow-y-auto">
              {fields.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Clicca "Aggiungi campo" per posizionare i campi firma sul documento
                </p>
              )}
              {fields.map(field => {
                const signer = signers.find(s => s.id === field.firmatario_id);
                return (
                  <div
                    key={field.id}
                    className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer transition-colors ${
                      selectedField === field.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                    }`}
                    onClick={() => { setSelectedField(field.id); setCurrentPage(field.pagina); }}
                  >
                    <div className={`w-2.5 h-2.5 rounded-sm ${field.tipo === "firma" ? "bg-amber-400" : field.tipo === "iniziali" ? "bg-blue-400" : field.tipo === "data" ? "bg-emerald-400" : "bg-purple-400"}`} />
                    <span className="font-medium">{tipoLabels[field.tipo]}</span>
                    <span className="text-muted-foreground">p.{field.pagina}</span>
                    {signer && <span className="text-muted-foreground truncate ml-auto">{signer.cognome}</span>}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}