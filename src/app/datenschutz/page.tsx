import { Header } from '@/components/layout/Header'

export const metadata = {
  title: 'Datenschutzerklaerung - Clay & Light',
}

export default function DatenschutzPage() {
  return (
    <div>
      <Header
        title="Datenschutzerklaerung"
        subtitle="Demo-Vorlage fuer Restaurants mit Reservierungs- und Buchungsformularen"
      />
      <div className="px-8 py-8 max-w-3xl">
        <div className="bg-white rounded-lg border border-pale-pistachio p-8 space-y-8 text-sm leading-relaxed text-ink">
          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">Demo-Hinweis</h2>
            <p className="text-dusk">
              Diese Datenschutzerklaerung ist eine Vorlage fuer Demo- und Kundenprojekte.
              Vor der Liveschaltung muessen Verantwortlicher, Auftragsverarbeiter,
              Speicherdauern, Domains, Empfaenger und alle optionalen Dienste an die
              tatsaechlich genutzte Konfiguration angepasst werden.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              1. Verantwortlicher
            </h2>
            <div className="space-y-1">
              <p><strong>[CLIENT_BUSINESS_NAME / NAME]</strong></p>
              <p>[CLIENT_ADDRESS_FULL]</p>
              <p>
                E-Mail:{' '}
                <a
                  href="mailto:[CLIENT_PRIVACY_EMAIL]"
                  className="text-pistachio hover:underline"
                >
                  [CLIENT_PRIVACY_EMAIL]
                </a>
              </p>
              <p>Telefon: [CLIENT_PUBLIC_PHONE]</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              2. Welche Daten wir verarbeiten
            </h2>

            <h3 className="font-semibold text-ink mt-4 mb-2">2.1 Tischreservierungen</h3>
            <ul className="list-disc list-inside space-y-1 text-dusk">
              <li>Name</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer (falls angegeben)</li>
              <li>Datum, Uhrzeit und Personenanzahl</li>
              <li>Optionale Freitext-Notizen</li>
              <li>Bestaetigung, dass die Datenschutzerklaerung zur Kenntnis genommen wurde</li>
              <li>Optionale Marketing-Einwilligung</li>
            </ul>

            <h3 className="font-semibold text-ink mt-4 mb-2">2.2 Buchungen / Workshops</h3>
            <ul className="list-disc list-inside space-y-1 text-dusk">
              <li>Name</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer (falls angegeben)</li>
              <li>Gebuchter Termin / Slot und Personenanzahl</li>
              <li>Optionale Freitext-Notizen</li>
              <li>Bestaetigung, dass die Datenschutzerklaerung zur Kenntnis genommen wurde</li>
              <li>Optionale Marketing-Einwilligung</li>
            </ul>

            <p className="mt-3">
              Bitte keine besonders sensiblen Daten in Freitextfelder eintragen,
              insbesondere keine Gesundheitsdaten, sofern der konkrete Betrieb dafuer
              keinen gesonderten und sauber dokumentierten Prozess vorgesehen hat.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              3. Zwecke und Rechtsgrundlagen
            </h2>
            <ul className="list-disc list-inside space-y-2 text-dusk">
              <li>
                Bearbeitung von Reservierungen und Buchungen, Versand von Bestaetigungen,
                Erinnerungen und interner Betriebskoordination auf Grundlage von Art. 6
                Abs. 1 lit. b DSGVO.
              </li>
              <li>
                Erfuellung gesetzlicher Pflichten, etwa handels- oder steuerrechtlicher
                Aufbewahrungspflichten, auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO.
              </li>
              <li>
                Versand von Newslettern oder Angebots-E-Mails nur bei gesonderter,
                freiwilliger Einwilligung auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              4. Eingesetzte Systeme und Empfaenger
            </h2>
            <p className="mb-3">
              Je nach eingesetzter Live-Konfiguration koennen insbesondere folgende
              Systeme beteiligt sein. Nicht verwendete Punkte sind in der Live-Version
              zu entfernen.
            </p>
            <ul className="list-disc list-inside space-y-2 text-dusk">
              <li>
                <strong>Supabase</strong> zur Speicherung von Reservierungs- und
                Buchungsdaten in einer europaeischen / EWR-nahen Region.
              </li>
              <li>
                <strong>n8n</strong> als Workflow-System, im Demo-Setup selbst gehostet
                auf einem VPS bei [N8N_HOSTING_PROVIDER, z. B. Hostinger].
              </li>
              <li>
                <strong>Gmail / Google</strong> fuer Transaktions-E-Mails an Gaeste
                sowie interne Benachrichtigungen an den Betrieb.
              </li>
              <li>
                <strong>Telegram</strong> fuer interne Manager-Benachrichtigungen mit
                minimierten Daten. Im Demo-Setup sind dies Name, Personenanzahl, Termin
                und optionale Notizen.
              </li>
              <li>
                <strong>Cookiebot</strong> nur dann, wenn auf der Website tatsaechlich
                ein Consent-Banner per Umgebungsvariable aktiviert ist.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              5. Drittstaatentransfers
            </h2>
            <p>
              Je nach konkret eingesetzten Diensten kann es zu Verarbeitungen ausserhalb
              des EWR kommen, insbesondere bei globalen Kommunikationsdiensten. In der
              Live-Version sind die tatsaechlich eingesetzten Anbieter, deren Rolle und
              die jeweils herangezogenen Garantien fuer internationale Uebermittlungen
              konkret zu benennen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              6. Speicherdauer
            </h2>
            <ul className="list-disc list-inside space-y-2 text-dusk">
              <li>
                Operative Reservierungs- und Buchungsdaten: [RETENTION_OPERATIONAL,
                z. B. bis zum Termin und anschliessend X Monate fuer Nachfragen,
                Stornierungen oder No-Show-Management].
              </li>
              <li>
                Rechnungs- und steuerrelevante Daten: gemaess den jeweils geltenden
                gesetzlichen Aufbewahrungspflichten.
              </li>
              <li>
                Nachweise ueber Marketing-Einwilligungen: bis zum Widerruf und darueber
                hinaus fuer die Dauer etwaiger Nachweis- und Verjaehrungsfristen.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              7. Cookies und Consent
            </h2>
            <p>
              Sofern auf der Website ein Consent-Banner aktiviert ist, werden nur
              technisch notwendige Cookies ohne vorherige Einwilligung gesetzt.
              Statistik-, Praeferenz- oder Marketing-Cookies duerfen nur verwendet werden,
              wenn sie tatsaechlich im Projekt vorhanden sind und die entsprechende
              Einwilligung wirksam eingeholt wurde.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              8. Deine Rechte
            </h2>
            <p>Betroffene Personen haben insbesondere folgende Rechte:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-dusk">
              <li>Auskunft gemaess Art. 15 DSGVO</li>
              <li>Berichtigung gemaess Art. 16 DSGVO</li>
              <li>Loeschung gemaess Art. 17 DSGVO</li>
              <li>Einschraenkung der Verarbeitung gemaess Art. 18 DSGVO</li>
              <li>Datenuebertragbarkeit gemaess Art. 20 DSGVO</li>
              <li>Widerspruch gemaess Art. 21 DSGVO</li>
              <li>Widerruf erteilter Einwilligungen mit Wirkung fuer die Zukunft</li>
            </ul>
            <p className="mt-3">
              Datenschutzanfragen bitte an{' '}
              <a
                href="mailto:[CLIENT_PRIVACY_EMAIL]"
                className="text-pistachio hover:underline"
              >
                [CLIENT_PRIVACY_EMAIL]
              </a>
              .
            </p>
            <p className="mt-2">
              Zudem besteht ein Beschwerderecht bei der zustaendigen
              Datenschutzaufsichtsbehoerde, in Oesterreich insbesondere bei der
              Datenschutzbehoerde:{' '}
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
              9. Datensicherheit
            </h2>
            <p>
              Wir setzen angemessene technische und organisatorische Massnahmen ein,
              um personenbezogene Daten zu schuetzen, insbesondere verschluesselte
              Uebertragung, rollenbasierte Zugriffe und beschraenkte Zugriffsrechte auf
              die verwendeten Systeme.
            </p>
          </section>

          <p className="text-dusk text-xs pt-4 border-t border-pale-pistachio">
            Stand: April 2026 · Demo-Vorlage fuer Clay &amp; Light / Restaurant-Projekte ·{' '}
            <a href="/impressum" className="text-pistachio hover:underline">Impressum</a>
          </p>
        </div>
      </div>
    </div>
  )
}
