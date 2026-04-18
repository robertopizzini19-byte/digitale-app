"use client";

import { useState } from "react";
import {
  HelpCircle,
  FileText,
  Users,
  CreditCard,
  Mail,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

const FAQ = [
  {
    categoria: "Fatture",
    icon: FileText,
    domande: [
      {
        q: "Come creo una nuova fattura?",
        a: 'Vai su "Fatture" nel menu laterale, poi clicca "Nuova Fattura" in alto a destra. Compila i dati del cliente, l\'importo e la data. La fattura viene salvata automaticamente come bozza.',
      },
      {
        q: "Come passo una fattura a stato 'Pagata'?",
        a: "Nella lista fatture, clicca il pulsante freccia (→) accanto alla fattura per avanzare lo stato: Bozza → Emessa → Pagata. Puoi anche aprire la fattura e modificarla.",
      },
      {
        q: "Posso stampare o esportare una fattura in PDF?",
        a: 'Sì. Apri la fattura cliccando l\'icona occhio nella lista, poi clicca "Stampa / Salva PDF". Si aprirà il dialogo di stampa del browser — scegli "Salva come PDF" come destinazione.',
      },
      {
        q: "Come funziona l'IVA?",
        a: "Puoi scegliere tra aliquote IVA standard: 0%, 4%, 10%, 22%. L'IVA viene calcolata automaticamente sull'imponibile che inserisci.",
      },
    ],
  },
  {
    categoria: "Clienti",
    icon: Users,
    domande: [
      {
        q: "Come aggiungo un nuovo cliente?",
        a: 'Vai su "Clienti" nel menu laterale, poi clicca "+ Nuovo Cliente". Puoi aggiungere sia persone fisiche che aziende (persona giuridica).',
      },
      {
        q: "Posso modificare i dati di un cliente già esistente?",
        a: "Sì. Nella lista clienti, clicca l'icona matita accanto al cliente. Si aprirà il form di modifica con tutti i dati precompilati.",
      },
      {
        q: "Come elimino un cliente?",
        a: "Clicca l'icona cestino nella lista clienti. L'eliminazione è logica (soft-delete): il cliente non appare più, ma le fatture associate vengono conservate.",
      },
    ],
  },
  {
    categoria: "Pagamenti & Piano",
    icon: CreditCard,
    domande: [
      {
        q: "Quali piani sono disponibili?",
        a: "Piano Gratuito (base), Piano Professionista €9/mese (fatturazione illimitata, clienti illimitati), Piano Impresa €49/mese (tutto Professionista + team + API). Tutti includono 14 giorni di prova gratuita.",
      },
      {
        q: "Come posso fare l'upgrade?",
        a: 'Vai su "Upgrade" nel menu, scegli il piano e clicca "Inizia prova gratuita". Verrai reindirizzato al checkout sicuro Stripe.',
      },
      {
        q: "Posso cancellare l'abbonamento?",
        a: "Sì, in qualsiasi momento dalla sezione Impostazioni → Account. L'abbonamento rimane attivo fino alla fine del periodo pagato.",
      },
    ],
  },
  {
    categoria: "Account & Sicurezza",
    icon: HelpCircle,
    domande: [
      {
        q: "Come cambio la mia password?",
        a: "Vai su Impostazioni → Account → Cambia password. Riceverai un link via email per reimpostare la password.",
      },
      {
        q: "I miei dati sono al sicuro?",
        a: "Sì. digITAle usa Supabase (database sicuro con Row Level Security), connessioni HTTPS, e non memorizza mai i dati della carta di credito (gestiti da Stripe PCI-DSS).",
      },
      {
        q: "Posso esportare i miei dati?",
        a: "La funzionalità di export completo (CSV, XML) è in arrivo nel piano Impresa. Per ora puoi stampare ogni singola fattura in PDF.",
      },
    ],
  },
];

function FaqCard({ categoria, icon: Icon, domande }: (typeof FAQ)[0]) {
  const [aperto, setAperto] = useState<number | null>(null);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100">
        <Icon size={16} className="text-[#009246]" />
        <h2 className="font-semibold text-gray-900">{categoria}</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {domande.map((item, i) => (
          <div key={i}>
            <button
              onClick={() => setAperto(aperto === i ? null : i)}
              className="w-full flex items-start justify-between gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-800">{item.q}</span>
              {aperto === i ? (
                <ChevronUp size={16} className="text-gray-400 shrink-0 mt-0.5" />
              ) : (
                <ChevronDown size={16} className="text-gray-400 shrink-0 mt-0.5" />
              )}
            </button>
            {aperto === i && (
              <div className="px-6 pb-4">
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AiutoPage() {
  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Centro Assistenza</h1>
        <p className="text-sm text-gray-500 mt-0.5">Risposte alle domande più frequenti</p>
      </div>

      <div className="space-y-4 mb-8">
        {FAQ.map((cat) => (
          <FaqCard key={cat.categoria} {...cat} />
        ))}
      </div>

      {/* Contatta supporto */}
      <div className="bg-gradient-to-br from-[#009246]/5 to-[#009246]/10 border border-[#009246]/20 rounded-2xl p-6 text-center">
        <MessageSquare size={24} className="text-[#009246] mx-auto mb-3" />
        <h3 className="font-semibold text-gray-900 mb-1">Non hai trovato la risposta?</h3>
        <p className="text-sm text-gray-600 mb-4">Scrivi al team digITAle — ti rispondiamo entro 24 ore.</p>
        <a
          href="mailto:supporto@digitale-italia.netlify.app"
          className="inline-flex items-center gap-2 bg-[#009246] hover:bg-[#007a3a] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
        >
          <Mail size={15} />
          Contatta il Supporto
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
