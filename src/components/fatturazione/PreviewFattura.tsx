import { format, isPast } from 'date-fns';
import { it } from 'date-fns/locale';
import type { DocumentoFiscale, AnagraficaAzienda, MODALITA_PAGAMENTO_LABELS } from '@/types/fatturazione';
import { MODALITA_PAGAMENTO_LABELS as PAY_LABELS } from '@/types/fatturazione';

interface PreviewFatturaProps {
  documento: DocumentoFiscale;
  azienda: AnagraficaAzienda;
  scale?: number;
}

const fmtDate = (d?: string) => d ? format(new Date(d), 'dd/MM/yyyy', { locale: it }) : '—';
const fmtMoney = (n: number) => n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const tipoLabel: Record<string, string> = {
  fattura: 'FATTURA',
  nota_credito: 'NOTA DI CREDITO',
  fattura_pa: 'FATTURA PA',
  parcella: 'PARCELLA',
};

export function PreviewFattura({ documento, azienda, scale = 0.75 }: PreviewFatturaProps) {
  const isNC = documento.tipo === 'nota_credito';
  const isPA = documento.tipo === 'fattura_pa';
  const isScaduta = documento.data_scadenza && isPast(new Date(documento.data_scadenza));
  const isForfettario = azienda.regime_fiscale === 'RF19';

  // A4: 210mm x 297mm → px at 96dpi ~= 794 x 1123
  const pageW = 794;
  const pageMinH = 1123;

  return (
    <div
      className="origin-top-left bg-white shadow-lg border border-border"
      style={{
        width: pageW,
        minHeight: pageMinH,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        fontFamily: "'Inter', sans-serif",
        fontSize: '9pt',
        color: '#1a1a1a',
        lineHeight: 1.4,
      }}
    >
      <div style={{ padding: '56px' }}>
        {/* ═══ HEADER ═══ */}
        <div className="flex justify-between items-start mb-8">
          {/* Left: Azienda */}
          <div className="max-w-[55%]">
            {azienda.logo_url && (
              <img src={azienda.logo_url} alt="" className="h-12 mb-3 object-contain" />
            )}
            <div className="font-bold text-base">{azienda.ragione_sociale}</div>
            <div className="text-[8pt] text-gray-500 mb-1">{azienda.forma_giuridica}</div>
            <div className="text-[8pt] text-gray-600 space-y-0.5">
              <div>{azienda.indirizzo.via}</div>
              <div>{azienda.indirizzo.cap} {azienda.indirizzo.citta} ({azienda.indirizzo.provincia})</div>
              <div className="font-mono">P.IVA {azienda.p_iva}</div>
              {azienda.codice_fiscale !== azienda.p_iva && (
                <div className="font-mono">C.F. {azienda.codice_fiscale}</div>
              )}
              <div>PEC: {azienda.pec}</div>
              {azienda.codice_rea && <div>REA: {azienda.codice_rea}</div>}
              {azienda.capitale_sociale && (
                <div>Cap. Soc. € {fmtMoney(azienda.capitale_sociale)} i.v.</div>
              )}
              {azienda.telefono && <div>Tel: {azienda.telefono}</div>}
              {azienda.sito_web && <div>{azienda.sito_web}</div>}
            </div>
          </div>

          {/* Right: Documento info */}
          <div className="text-right">
            <div
              className="inline-block px-4 py-1.5 rounded text-white font-bold text-[10pt] mb-3"
              style={{ backgroundColor: azienda.colore_primario }}
            >
              {tipoLabel[documento.tipo] || 'DOCUMENTO'}
            </div>
            <div className="font-mono text-lg font-bold mb-1">N° {documento.numero}</div>
            <div className="text-[8pt] text-gray-600 space-y-0.5">
              <div>Data: {fmtDate(documento.data_emissione)}</div>
              {documento.data_scadenza && (
                <div className={isScaduta ? 'text-red-600 font-semibold' : ''}>
                  Scadenza: {fmtDate(documento.data_scadenza)}
                  {isScaduta && ' ⚠ SCADUTA'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ CLIENT BOX ═══ */}
        <div className="bg-slate-50 border border-slate-200 rounded p-4 mb-6">
          <div className="text-[7pt] uppercase tracking-wider text-gray-400 mb-1">Destinatario</div>
          <div className="font-bold text-[10pt]">{documento.cliente_snapshot.ragione_sociale}</div>
          <div className="text-[8pt] text-gray-600 mt-1 space-y-0.5">
            {documento.cliente_snapshot.p_iva && (
              <div className="font-mono">P.IVA {documento.cliente_snapshot.p_iva}</div>
            )}
            {documento.cliente_snapshot.codice_fiscale && documento.cliente_snapshot.codice_fiscale !== documento.cliente_snapshot.p_iva && (
              <div className="font-mono">C.F. {documento.cliente_snapshot.codice_fiscale}</div>
            )}
            {documento.cliente_snapshot.codice_sdi && (
              <div>Codice SDI: <span className="font-mono">{documento.cliente_snapshot.codice_sdi}</span></div>
            )}
            {documento.cliente_snapshot.pec && <div>PEC: {documento.cliente_snapshot.pec}</div>}
            <div>{documento.cliente_snapshot.indirizzo.via}</div>
            <div>{documento.cliente_snapshot.indirizzo.cap} {documento.cliente_snapshot.indirizzo.citta} ({documento.cliente_snapshot.indirizzo.provincia})</div>
          </div>
        </div>

        {/* NC reference */}
        {isNC && documento.riferimento_fattura_nc && (
          <div className="bg-amber-50 border border-amber-300 rounded p-3 mb-4 text-[8pt]">
            <span className="font-semibold text-amber-800">Nota di Credito</span>{' '}
            <span className="text-amber-700">a storno della fattura N° {documento.riferimento_fattura_nc} del {fmtDate(documento.riferimento_fattura_nc_data)}</span>
          </div>
        )}

        {/* PA references */}
        {isPA && documento.riferimenti_ordine && documento.riferimenti_ordine.length > 0 && (
          <div className="bg-blue-50 border border-blue-300 rounded p-3 mb-4 text-[8pt]">
            <span className="font-semibold text-blue-800">Riferimenti PA:</span>
            {documento.riferimenti_ordine.map((ref, i) => (
              <div key={i} className="text-blue-700 mt-0.5">
                {ref.id_documento && <>Ordine: {ref.id_documento}</>}
                {ref.cig && <> — CIG: <span className="font-mono">{ref.cig}</span></>}
                {ref.cup && <> — CUP: <span className="font-mono">{ref.cup}</span></>}
              </div>
            ))}
          </div>
        )}

        {/* ═══ ITEMS TABLE ═══ */}
        <table className="w-full mb-6" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #334155' }}>
              {['#', 'Descrizione', 'Q.tà', 'U.M.', 'Prezzo', 'Sc.%', 'IVA', 'Importo'].map((h, i) => (
                <th
                  key={h}
                  className="text-[7pt] uppercase tracking-wider text-gray-500 font-semibold py-2"
                  style={{
                    textAlign: i === 1 ? 'left' : 'right',
                    paddingLeft: i === 0 ? 0 : 8,
                    paddingRight: i === 7 ? 0 : 8,
                    width: i === 1 ? '40%' : 'auto',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {documento.righe.map((riga, idx) => (
              <tr
                key={riga.numero_linea}
                style={{
                  backgroundColor: idx % 2 === 1 ? '#f8fafc' : 'transparent',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <td className="py-2 text-right text-[8pt] text-gray-400" style={{ paddingRight: 8 }}>{riga.numero_linea}</td>
                <td className="py-2 text-left" style={{ paddingLeft: 8, paddingRight: 8 }}>
                  <div className="text-[9pt]">{riga.descrizione}</div>
                  {riga.codice && <div className="text-[7pt] text-gray-400 font-mono">{riga.codice}</div>}
                  {riga.note_riga && <div className="text-[7pt] text-gray-500 italic">{riga.note_riga}</div>}
                </td>
                <td className="py-2 text-right text-[8pt]" style={{ paddingRight: 8 }}>{riga.quantita}</td>
                <td className="py-2 text-right text-[8pt] text-gray-500" style={{ paddingRight: 8 }}>{riga.unita_misura}</td>
                <td className="py-2 text-right text-[8pt] font-mono" style={{ paddingRight: 8 }}>€ {fmtMoney(riga.prezzo_unitario)}</td>
                <td className="py-2 text-right text-[8pt]" style={{ paddingRight: 8 }}>{riga.sconto_percentuale ? `${riga.sconto_percentuale}%` : ''}</td>
                <td className="py-2 text-right text-[8pt]" style={{ paddingRight: 8 }}>
                  {riga.aliquota_iva > 0 ? `${riga.aliquota_iva}%` : riga.natura || '0%'}
                </td>
                <td className="py-2 text-right font-semibold text-[9pt] font-mono" style={{ paddingRight: 0 }}>€ {fmtMoney(riga.importo)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ═══ IVA SUMMARY + TOTALS ═══ */}
        <div className="flex gap-6 mb-6">
          {/* IVA table */}
          <div className="flex-1">
            <div className="text-[7pt] uppercase tracking-wider text-gray-400 mb-1 font-semibold">Riepilogo IVA</div>
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                  {['Aliquota/Natura', 'Imponibile', 'Imposta'].map((h) => (
                    <th key={h} className="text-[7pt] text-gray-500 py-1 text-right font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {documento.riepilogo_iva.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td className="py-1 text-right text-[8pt]">{r.natura || `${r.aliquota_iva}%`}</td>
                    <td className="py-1 text-right text-[8pt] font-mono">€ {fmtMoney(r.imponibile)}</td>
                    <td className="py-1 text-right text-[8pt] font-mono">€ {fmtMoney(r.imposta)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="w-[240px] text-[8pt]">
            <div className="space-y-1">
              <div className="flex justify-between"><span>Imponibile</span><span className="font-mono">€ {fmtMoney(documento.totali.imponibile)}</span></div>
              {documento.totali.sconto_globale && documento.totali.sconto_globale > 0 && (
                <div className="flex justify-between text-gray-500"><span>Sconto</span><span className="font-mono">-€ {fmtMoney(documento.totali.sconto_globale)}</span></div>
              )}
              {documento.totali.cassa_previdenziale && documento.totali.cassa_previdenziale > 0 && (
                <div className="flex justify-between text-gray-500"><span>Cassa prev. ({documento.totali.cassa_previdenziale_aliquota}%)</span><span className="font-mono">€ {fmtMoney(documento.totali.cassa_previdenziale)}</span></div>
              )}
              <div className="flex justify-between"><span>IVA</span><span className="font-mono">€ {fmtMoney(documento.totali.totale_iva)}</span></div>
              {documento.totali.bollo_virtuale && documento.totali.bollo_virtuale > 0 && (
                <div className="flex justify-between text-gray-500"><span>Bollo</span><span className="font-mono">€ {fmtMoney(documento.totali.bollo_virtuale)}</span></div>
              )}
              <div
                className="flex justify-between font-bold text-[11pt] pt-2 mt-2"
                style={{ borderTop: `2px solid ${azienda.colore_primario}`, color: azienda.colore_primario }}
              >
                <span>TOTALE</span>
                <span className="font-mono">€ {fmtMoney(documento.totali.totale_documento)}</span>
              </div>
              {documento.totali.ritenuta_acconto && documento.totali.ritenuta_acconto > 0 && (
                <div className="flex justify-between text-gray-500"><span>Ritenuta d'acconto ({documento.totali.ritenuta_aliquota}%)</span><span className="font-mono">-€ {fmtMoney(documento.totali.ritenuta_acconto)}</span></div>
              )}
              {documento.totali.ritenuta_acconto && documento.totali.ritenuta_acconto > 0 && (
                <div className="flex justify-between font-bold text-[10pt]">
                  <span>Netto a pagare</span>
                  <span className="font-mono">€ {fmtMoney(documento.totali.netto_a_pagare)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ PAYMENT BLOCK ═══ */}
        <div className="bg-slate-50 border border-slate-200 rounded p-4 mb-6">
          <div className="text-[7pt] uppercase tracking-wider text-gray-400 mb-2 font-semibold">Modalità di pagamento</div>
          <div className="text-[8pt] space-y-1">
            <div><span className="text-gray-500">Metodo:</span> {PAY_LABELS[documento.pagamento.modalita]}</div>
            {documento.pagamento.iban && (
              <div><span className="text-gray-500">IBAN:</span> <span className="font-mono font-semibold">{documento.pagamento.iban}</span></div>
            )}
            {documento.pagamento.intestatario_conto && (
              <div><span className="text-gray-500">Intestatario:</span> {documento.pagamento.intestatario_conto}</div>
            )}
            {documento.pagamento.istituto_finanziario && (
              <div><span className="text-gray-500">Banca:</span> {documento.pagamento.istituto_finanziario}</div>
            )}
            {documento.pagamento.scadenze.length > 1 && (
              <div className="mt-2">
                <span className="text-gray-500">Scadenze:</span>
                <ul className="list-none mt-1 space-y-0.5">
                  {documento.pagamento.scadenze.map((s, i) => (
                    <li key={i} className="font-mono">
                      {fmtDate(s.data_scadenza)} — € {fmtMoney(s.importo)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ═══ NOTES ═══ */}
        {documento.note_documento && (
          <div className="mb-4 text-[8pt] text-gray-600">
            <div className="text-[7pt] uppercase tracking-wider text-gray-400 mb-1 font-semibold">Note</div>
            {documento.note_documento}
          </div>
        )}

        {/* Forfettario disclaimer */}
        {isForfettario && (
          <div className="text-[7pt] text-gray-500 italic mb-4 border-t border-gray-200 pt-2">
            Operazione effettuata ai sensi dell'art. 1, commi da 54 a 89, della Legge n. 190/2014 — Regime forfettario.
            Si applica l'imposta sostitutiva del 15% (o 5% per i primi 5 anni di attività).
            Non soggetto a ritenuta d'acconto, IVA né addizionale IRPEF. Compenso non assoggettato a ritenuta d'acconto ai sensi dell'art. 1, comma 67, L. 190/2014.
          </div>
        )}

        {/* ═══ FOOTER ═══ */}
        <div
          className="flex justify-between items-center pt-4 text-[7pt]"
          style={{ borderTop: `1px solid ${azienda.colore_primario}` }}
        >
          <span className="text-gray-500">
            {azienda.ragione_sociale} — P.IVA {azienda.p_iva}
          </span>
          <span style={{ color: azienda.colore_primario }} className="font-semibold">
            Documento generato da Cantiere in Cloud
          </span>
        </div>
      </div>
    </div>
  );
}
