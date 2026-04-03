import { Header } from '@/components/layout/Header'

export const metadata = {
  title: 'Datenschutzerklärung — Clay & Light',
}

export default function DatenschutzPage() {
  return (
    <div>
      <Header
        title="Datenschutzerklärung"
        subtitle="Gemäß DSGVO (EU) 2016/679 und DSG"
      />
      <div className="px-8 py-8 max-w-3xl">
        <div className="bg-white rounded-lg border border-pale-pistachio p-8 space-y-8 text-sm leading-relaxed text-ink">

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              1. Verantwortlicher
            </h2>
            <div className="space-y-1">
              <p><strong>[Firmenname / Vor- und Nachname]</strong></p>
              <p>[Straße, PLZ, Ort, Österreich]</p>
              <p>E-Mail: <a href="mailto:hello@clayandlight.at" className="text-pistachio hover:underline">hello@clayandlight.at</a></p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              2. Erhobene Daten und Zwecke
            </h2>

            <h3 className="font-semibold text-ink mt-4 mb-2">2.1 Töpfer-Buchungen</h3>
            <p>Bei der Buchung eines Töpfer-Workshops erheben wir:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-dusk">
              <li>Name, E-Mail-Adresse, Telefonnummer</li>
              <li>Gewünschter Termin und Personenanzahl</li>
              <li>Optionale Notizen</li>
              <li>Marketingeinwilligung (optional, DSGVO Art. 6 Abs. 1 lit. a)</li>
            </ul>
            <p className="mt-2">
              <strong>Rechtsgrundlage:</strong> Vertragserfüllung gemäß Art. 6 Abs. 1 lit. b DSGVO.
              Die Verarbeitung ist für die Durchführung der gebuchten Leistung erforderlich.
            </p>

            <h3 className="font-semibold text-ink mt-4 mb-2">2.2 Tischreservierungen</h3>
            <p>Bei der Tischreservierung erheben wir:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-dusk">
              <li>Name, E-Mail-Adresse, Telefonnummer</li>
              <li>Gewünschtes Datum, Uhrzeit und Personenanzahl</li>
              <li>Optionale Notizen</li>
            </ul>
            <p className="mt-2">
              <strong>Rechtsgrundlage:</strong> Vertragserfüllung gemäß Art. 6 Abs. 1 lit. b DSGVO.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              3. Datenverarbeitung und Speicherung
            </h2>
            <p>
              Deine Buchungsdaten werden in einer sicheren Datenbank (Supabase, gehostet
              in der EU) gespeichert. Die Übertragung erfolgt ausschließlich über
              verschlüsselte HTTPS-Verbindungen.
            </p>
            <p className="mt-2">
              Buchungs- und Reservierungsdaten werden für die Dauer der gesetzlichen
              Aufbewahrungsfristen (7 Jahre gemäß österreichischem Steuerrecht) gespeichert
              und danach gelöscht.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              4. E-Mail-Kommunikation
            </h2>
            <p>
              Im Rahmen des Buchungsprozesses versenden wir automatisiert Bestätigungs-
              und Erinnerungs-E-Mails. Diese Kommunikation ist für die Vertragserfüllung
              erforderlich und bedarf keiner gesonderten Einwilligung.
            </p>
            <p className="mt-2">
              Marketing-E-Mails (Newsletter, Sonderangebote) werden nur versandt, wenn
              du im Buchungsformular ausdrücklich deine Einwilligung erteilt hast.
              Diese Einwilligung kannst du jederzeit widerrufen, indem du eine E-Mail
              an{' '}
              <a href="mailto:hello@clayandlight.at" className="text-pistachio hover:underline">
                hello@clayandlight.at
              </a>{' '}
              sendest.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              5. Cookies und Tracking
            </h2>
            <p>
              Unsere Website verwendet Cookies. Über das Cookiebot-Banner kannst du
              deine Einwilligung für verschiedene Cookie-Kategorien erteilen oder
              verweigern:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-dusk">
              <li><strong>Notwendige Cookies:</strong> Für die Grundfunktionen der Website (keine Einwilligung erforderlich)</li>
              <li><strong>Präferenz-Cookies:</strong> Speichern deine Einstellungen (optional)</li>
              <li><strong>Statistik-Cookies:</strong> Helfen uns, die Website zu verbessern (optional)</li>
              <li><strong>Marketing-Cookies:</strong> Für personalisierte Inhalte (optional)</li>
            </ul>
            <p className="mt-2">
              Du kannst deine Cookie-Einstellungen jederzeit über den Link
              „Cookie-Einstellungen" in der Fußzeile anpassen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              6. Datenweitergabe an Dritte
            </h2>
            <p>Deine Daten werden ausschließlich weitergegeben an:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-dusk">
              <li>
                <strong>Supabase Inc.</strong> (Datenbankdienstleister, EU-Rechenzentrum) —
                Standardvertragsklauseln (SCCs) gemäß Art. 46 DSGVO
              </li>
              <li>
                <strong>Google LLC</strong> (E-Mail-Versand über Gmail) —
                Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO
              </li>
              <li>
                <strong>n8n GmbH</strong> (Workflow-Automatisierung, EU-Hosting) —
                sofern als SaaS genutzt
              </li>
            </ul>
            <p className="mt-2">
              Eine darüber hinausgehende Weitergabe an Dritte findet nicht statt,
              außer wir sind gesetzlich dazu verpflichtet.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              7. Deine Rechte
            </h2>
            <p>Du hast gemäß DSGVO folgende Rechte:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-dusk">
              <li><strong>Auskunft</strong> (Art. 15 DSGVO): Welche Daten wir über dich speichern</li>
              <li><strong>Berichtigung</strong> (Art. 16 DSGVO): Korrektur unrichtiger Daten</li>
              <li><strong>Löschung</strong> (Art. 17 DSGVO): „Recht auf Vergessenwerden"</li>
              <li><strong>Einschränkung</strong> (Art. 18 DSGVO): Begrenzung der Verarbeitung</li>
              <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO): Erhalt deiner Daten in maschinenlesbarem Format</li>
              <li><strong>Widerspruch</strong> (Art. 21 DSGVO): Widerspruch gegen die Verarbeitung</li>
              <li><strong>Widerruf</strong> (Art. 7 Abs. 3 DSGVO): Widerruf erteilter Einwilligungen</li>
            </ul>
            <p className="mt-3">
              Zur Ausübung deiner Rechte wende dich an:{' '}
              <a href="mailto:hello@clayandlight.at" className="text-pistachio hover:underline">
                hello@clayandlight.at
              </a>
            </p>
            <p className="mt-2">
              Du hast zudem das Recht, bei der österreichischen Datenschutzbehörde
              Beschwerde einzureichen:{' '}
              <a
                href="https://www.dsb.gv.at"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pistachio hover:underline"
              >
                www.dsb.gv.at
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              8. Datensicherheit
            </h2>
            <p>
              Wir setzen technische und organisatorische Maßnahmen (TOMs) ein, um deine
              Daten zu schützen: Verschlüsselung (TLS/HTTPS), Zugriffskontrolle,
              regelmäßige Sicherheitsüberprüfungen sowie Row-Level-Security in der Datenbank.
            </p>
          </section>

          <p className="text-dusk text-xs pt-4 border-t border-pale-pistachio">
            Stand: April 2026 · Clay &amp; Light · Wien ·{' '}
            <a href="/impressum" className="text-pistachio hover:underline">Impressum</a>
          </p>
        </div>
      </div>
    </div>
  )
}
