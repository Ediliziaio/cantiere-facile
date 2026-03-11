import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trash2, Save, GripVertical, Grid3X3, Copy } from "lucide-react";
import { mockDocumentiFirma, mockFirmatari, mockCampiFirma, type TipoCampoFirma } from "@/data/mock-firma";
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

const GRID_SIZE = 2.5; // percentage snap

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

type ResizeHandle = "nw" | "ne" | "sw" | "se" | null;
type InteractionMode = "idle" | "dragging" | "resizing";

function snapToGrid(value: number, enabled: boolean): number {
  if (!enabled) return value;
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
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
        id: c.id, pagina: c.pagina, x: c.x, y: c.y,
        larghezza: c.larghezza, altezza: c.altezza,
        firmatario_id: c.firmatario_id, tipo: c.tipo, ordine: c.ordine,
      }))
  );

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  // Interaction state
  const [mode, setMode] = useState<InteractionMode>("idle");
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fieldStart, setFieldStart] = useState({ x: 0, y: 0, w: 0, h: 0 });

  // Settings
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  // Multi-selection drag offsets
  const [multiDragOffsets, setMultiDragOffsets] = useState<Map<string, { dx: number; dy: number }>>(new Map());

  const addField = (tipo: TipoCampoFirma) => {
    const newField: PlacedField = {
      id: `cf-new-${Date.now()}`,
      pagina: currentPage,
      x: snapToGrid(20 + Math.random() * 30, snapEnabled),
      y: snapToGrid(40 + Math.random() * 20, snapEnabled),
      larghezza: tipo === "iniziali" ? 15 : tipo === "data" ? 20 : 30,
      altezza: tipo === "iniziali" ? 6 : 8,
      firmatario_id: signers[0]?.id || "",
      tipo,
      ordine: fields.length + 1,
    };
    setFields(prev => [...prev, newField]);
    setSelectedIds(new Set([newField.id]));
  };

  const removeSelected = () => {
    setFields(prev => prev.filter(f => !selectedIds.has(f.id)));
    setSelectedIds(new Set());
  };

  const duplicateSelected = () => {
    const newFields: PlacedField[] = [];
    fields.forEach(f => {
      if (selectedIds.has(f.id)) {
        newFields.push({
          ...f,
          id: `cf-dup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          x: snapToGrid(Math.min(f.x + 3, 85), snapEnabled),
          y: snapToGrid(Math.min(f.y + 3, 90), snapEnabled),
        });
      }
    });
    setFields(prev => [...prev, ...newFields]);
    setSelectedIds(new Set(newFields.map(f => f.id)));
    toast({ title: `${newFields.length} campo/i duplicato/i` });
  };

  const updateField = useCallback((fieldId: string, updates: Partial<PlacedField>) => {
    setFields(prev => prev.map(f => f.id === fieldId ? { ...f, ...updates } : f));
  }, []);

  // Convert client coords to percentage
  const toPercent = useCallback((clientX: number, clientY: number) => {
    const container = pdfContainerRef.current;
    if (!container) return { px: 0, py: 0 };
    const rect = container.getBoundingClientRect();
    return {
      px: ((clientX - rect.left) / rect.width) * 100,
      py: ((clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  // --- DRAG START ---
  const handleFieldPointerDown = useCallback((e: React.PointerEvent, fieldId: string) => {
    e.stopPropagation();
    e.preventDefault();

    const { px, py } = toPercent(e.clientX, e.clientY);
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    // Multi-select with Ctrl/Cmd
    if (e.ctrlKey || e.metaKey) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(fieldId)) next.delete(fieldId);
        else next.add(fieldId);
        return next;
      });
      return;
    }

    // If not already selected, select only this
    if (!selectedIds.has(fieldId)) {
      setSelectedIds(new Set([fieldId]));
    }

    // Compute offsets for all selected fields
    const offsets = new Map<string, { dx: number; dy: number }>();
    const currentSelected = selectedIds.has(fieldId) ? selectedIds : new Set([fieldId]);
    currentSelected.forEach(sid => {
      const sf = fields.find(f => f.id === sid);
      if (sf) offsets.set(sid, { dx: px - sf.x, dy: py - sf.y });
    });
    if (!offsets.has(fieldId)) {
      offsets.set(fieldId, { dx: px - field.x, dy: py - field.y });
    }
    setMultiDragOffsets(offsets);

    setMode("dragging");
    setActiveFieldId(fieldId);
    setDragStart({ x: px, y: py });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [fields, selectedIds, toPercent]);

  // --- RESIZE START ---
  const handleResizePointerDown = useCallback((e: React.PointerEvent, fieldId: string, handle: ResizeHandle) => {
    e.stopPropagation();
    e.preventDefault();

    const { px, py } = toPercent(e.clientX, e.clientY);
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    setMode("resizing");
    setActiveFieldId(fieldId);
    setResizeHandle(handle);
    setDragStart({ x: px, y: py });
    setFieldStart({ x: field.x, y: field.y, w: field.larghezza, h: field.altezza });
    setSelectedIds(new Set([fieldId]));
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [fields, toPercent]);

  // --- POINTER MOVE ---
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (mode === "idle") return;
    const { px, py } = toPercent(e.clientX, e.clientY);

    if (mode === "dragging") {
      // Move all selected fields
      multiDragOffsets.forEach((offset, fid) => {
        const newX = snapToGrid(Math.max(0, Math.min(85, px - offset.dx)), snapEnabled);
        const newY = snapToGrid(Math.max(0, Math.min(92, py - offset.dy)), snapEnabled);
        updateField(fid, { x: newX, y: newY });
      });
    }

    if (mode === "resizing" && activeFieldId && resizeHandle) {
      const dx = px - dragStart.x;
      const dy = py - dragStart.y;
      let { x, y, w, h } = fieldStart;
      const minW = 8;
      const minH = 4;

      switch (resizeHandle) {
        case "se":
          w = snapToGrid(Math.max(minW, fieldStart.w + dx), snapEnabled);
          h = snapToGrid(Math.max(minH, fieldStart.h + dy), snapEnabled);
          break;
        case "sw":
          w = snapToGrid(Math.max(minW, fieldStart.w - dx), snapEnabled);
          h = snapToGrid(Math.max(minH, fieldStart.h + dy), snapEnabled);
          x = snapToGrid(fieldStart.x + fieldStart.w - w, snapEnabled);
          break;
        case "ne":
          w = snapToGrid(Math.max(minW, fieldStart.w + dx), snapEnabled);
          h = snapToGrid(Math.max(minH, fieldStart.h - dy), snapEnabled);
          y = snapToGrid(fieldStart.y + fieldStart.h - h, snapEnabled);
          break;
        case "nw":
          w = snapToGrid(Math.max(minW, fieldStart.w - dx), snapEnabled);
          h = snapToGrid(Math.max(minH, fieldStart.h - dy), snapEnabled);
          x = snapToGrid(fieldStart.x + fieldStart.w - w, snapEnabled);
          y = snapToGrid(fieldStart.y + fieldStart.h - h, snapEnabled);
          break;
      }

      updateField(activeFieldId, {
        x: Math.max(0, x),
        y: Math.max(0, y),
        larghezza: Math.min(w, 100 - x),
        altezza: Math.min(h, 100 - y),
      });
    }
  }, [mode, activeFieldId, resizeHandle, dragStart, fieldStart, multiDragOffsets, snapEnabled, toPercent, updateField]);

  const handlePointerUp = useCallback(() => {
    setMode("idle");
    setActiveFieldId(null);
    setResizeHandle(null);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds.size > 0) { e.preventDefault(); removeSelected(); }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        setSelectedIds(new Set(fields.filter(f => f.pagina === currentPage).map(f => f.id)));
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        if (selectedIds.size > 0) duplicateSelected();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIds, fields, currentPage]);

  const handleSave = () => {
    toast({ title: "Configurazione salvata", description: `${fields.length} campi firma configurati` });
    navigate(`/app/firma/${id}`);
  };

  if (!doc) return <div className="p-8 text-center text-muted-foreground">Documento non trovato</div>;

  const pageFields = fields.filter(f => f.pagina === currentPage);
  const selectedField = selectedIds.size === 1 ? fields.find(f => f.id === [...selectedIds][0]) : null;

  // Resize handle component
  const ResizeHandles = ({ fieldId }: { fieldId: string }) => {
    const handles: { pos: ResizeHandle; cursor: string; style: React.CSSProperties }[] = [
      { pos: "nw", cursor: "nwse-resize", style: { top: -4, left: -4 } },
      { pos: "ne", cursor: "nesw-resize", style: { top: -4, right: -4 } },
      { pos: "sw", cursor: "nesw-resize", style: { bottom: -4, left: -4 } },
      { pos: "se", cursor: "nwse-resize", style: { bottom: -4, right: -4 } },
    ];
    return (
      <>
        {handles.map(h => (
          <div
            key={h.pos}
            className="absolute w-2.5 h-2.5 bg-primary border-2 border-primary-foreground rounded-sm z-20 shadow-sm"
            style={{ ...h.style, cursor: h.cursor }}
            onPointerDown={e => handleResizePointerDown(e, fieldId, h.pos)}
          />
        ))}
      </>
    );
  };

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
        {/* PDF Viewer */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-sm">Pagina {currentPage} di {totalPages}</CardTitle>
            <div className="flex items-center gap-3">
              {selectedIds.size > 1 && (
                <span className="text-xs text-primary font-medium">{selectedIds.size} selezionati</span>
              )}
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>←</Button>
                <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>→</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div
              ref={pdfContainerRef}
              className="relative bg-white border rounded-lg shadow-inner aspect-[210/297] w-full select-none cursor-crosshair overflow-hidden"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onClick={(e) => {
                if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.grid) {
                  setSelectedIds(new Set());
                }
              }}
            >
              {/* Snap grid overlay */}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none z-0" data-grid="true">
                  <svg width="100%" height="100%" className="opacity-[0.07]">
                    <defs>
                      <pattern id="grid" width={`${GRID_SIZE}%`} height={`${GRID_SIZE}%`} patternUnits="userSpaceOnUse">
                        <path d={`M ${GRID_SIZE}% 0 L 0 0 0 ${GRID_SIZE}%`} fill="none" stroke="currentColor" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
              )}

              {/* Mock PDF content */}
              <div className="absolute inset-0 p-[8%] pointer-events-none z-[1]">
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
                const isSelected = selectedIds.has(field.id);
                return (
                  <div
                    key={field.id}
                    className={`absolute border-2 rounded cursor-move transition-shadow z-[5] ${tipoColors[field.tipo]} ${
                      isSelected ? "ring-2 ring-primary shadow-lg z-10" : "hover:shadow-md"
                    }`}
                    style={{
                      left: `${field.x}%`,
                      top: `${field.y}%`,
                      width: `${field.larghezza}%`,
                      height: `${field.altezza}%`,
                    }}
                    onPointerDown={e => handleFieldPointerDown(e, field.id)}
                  >
                    <div className="flex items-center justify-between h-full px-1.5 text-[10px] font-medium text-foreground/70 select-none">
                      <div className="flex items-center gap-1 truncate">
                        <GripVertical className="h-3 w-3 shrink-0 opacity-50" />
                        <span className="truncate">{tipoLabels[field.tipo]}</span>
                        {signer && <span className="text-[9px] opacity-60 truncate">· {signer.nome}</span>}
                      </div>
                    </div>
                    {/* Resize handles */}
                    {isSelected && <ResizeHandles fieldId={field.id} />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Toolbox panel */}
        <div className="space-y-4">
          {/* Grid & snap settings */}
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs flex items-center gap-1.5">
                  <Grid3X3 className="h-3.5 w-3.5" /> Griglia
                </Label>
                <Switch checked={showGrid} onCheckedChange={setShowGrid} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Snap to grid ({GRID_SIZE}%)</Label>
                <Switch checked={snapEnabled} onCheckedChange={setSnapEnabled} />
              </div>
            </CardContent>
          </Card>

          {/* Add field buttons */}
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

          {/* Multi-selection actions */}
          {selectedIds.size > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  Azioni ({selectedIds.size} {selectedIds.size === 1 ? "campo" : "campi"})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={duplicateSelected}>
                  <Copy className="h-3.5 w-3.5 mr-1.5" /> Duplica {selectedIds.size > 1 ? "selezionati" : ""}
                </Button>
                <Button variant="destructive" size="sm" className="w-full justify-start" onClick={removeSelected}>
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Elimina {selectedIds.size > 1 ? "selezionati" : ""}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Single field properties */}
          {selectedField && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Proprietà campo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Tipo</label>
                  <Select value={selectedField.tipo} onValueChange={v => updateField(selectedField.id, { tipo: v as TipoCampoFirma })}>
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
                  <Select value={selectedField.firmatario_id} onValueChange={v => updateField(selectedField.id, { firmatario_id: v })}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {signers.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.nome} {s.cognome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span>X: {selectedField.x.toFixed(1)}%</span>
                  <span>Y: {selectedField.y.toFixed(1)}%</span>
                  <span>W: {selectedField.larghezza.toFixed(1)}%</span>
                  <span>H: {selectedField.altezza.toFixed(1)}%</span>
                </div>
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
                const isSelected = selectedIds.has(field.id);
                return (
                  <div
                    key={field.id}
                    className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                    }`}
                    onClick={(e) => {
                      if (e.ctrlKey || e.metaKey) {
                        setSelectedIds(prev => {
                          const next = new Set(prev);
                          if (next.has(field.id)) next.delete(field.id);
                          else next.add(field.id);
                          return next;
                        });
                      } else {
                        setSelectedIds(new Set([field.id]));
                      }
                      setCurrentPage(field.pagina);
                    }}
                  >
                    <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${field.tipo === "firma" ? "bg-amber-400" : field.tipo === "iniziali" ? "bg-blue-400" : field.tipo === "data" ? "bg-emerald-400" : "bg-purple-400"}`} />
                    <span className="font-medium">{tipoLabels[field.tipo]}</span>
                    <span className="text-muted-foreground">p.{field.pagina}</span>
                    {signer && <span className="text-muted-foreground truncate ml-auto">{signer.cognome}</span>}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Shortcuts hint */}
          <div className="text-[10px] text-muted-foreground space-y-0.5 px-1">
            <p><kbd className="bg-muted px-1 rounded">Ctrl+Click</kbd> multi-selezione</p>
            <p><kbd className="bg-muted px-1 rounded">Ctrl+A</kbd> seleziona tutti</p>
            <p><kbd className="bg-muted px-1 rounded">Ctrl+D</kbd> duplica</p>
            <p><kbd className="bg-muted px-1 rounded">Canc</kbd> elimina selezionati</p>
          </div>
        </div>
      </div>
    </div>
  );
}