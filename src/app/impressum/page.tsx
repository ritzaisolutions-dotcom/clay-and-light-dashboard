import { Header } from '@/components/layout/Header'

export const metadata = {
  title: 'Impressum - Clay & Light',
}

export default function ImpressumPage() {
  return (
    <div>
      <Header
        title="Impressum"
        subtitle="Demo-Vorlage fuer Restaurants in Oesterreich"
      />
      <div className="px-8 py-8 max-w-3xl">
        <div className="bg-white rounded-lg border border-pale-pistachio p-8 space-y-8 text-sm leading-relaxed text-ink">
          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">Demo-Hinweis</h2>
            <p className="text-dusk">
              Diese Seite ist eine Vorlage fuer Demo- und Kundenprojekte. Vor der
              Liveschaltung muessen alle Platzhalter ersetzt und alle optionalen
              Abschnitte an den tatsaechlich genutzten Betrieb, die echte Rechtsform
              und die echten Prozesse angepasst werden.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              Angaben zum Diensteanbieter
            </h2>
            <div className="space-y-1">
              <p><strong>[CLIENT_BUSINESS_NAME / NAME]</strong></p>
              <p><strong>Rechtsform:</strong> [CLIENT_BUSINESS_FORM]</p>
              <p><strong>Adresse:</strong> [CLIENT_ADDRESS_FULL]</p>
              <p>
                <strong>E-Mail:</strong>{' '}
                <a
                  href="mailto:[CLIENT_PUBLIC_EMAIL]"
                  className="text-pistachio hover:underline"
                >
                  [CLIENT_PUBLIC_EMAIL]
                </a>
              </p>
              <p><strong>Telefon:</strong> [CLIENT_PUBLIC_PHONE]</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              Unternehmensgegenstand
            </h2>
            <p>
              [z. B. Restaurant / Cafe / Bistro mit Online-Tischreservierungen,
              Eventbuchungen und optionalem E-Mail-Marketing]
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              Register- und Aufsichtsangaben
            </h2>
            <div className="space-y-1">
              <p><strong>Gewerbebehoerde:</strong> [CLIENT_COMPETENT_AUTHORITY]</p>
              <p><strong>WKO / Fachgruppe:</strong> [CLIENT_WKO_DETAILS_IF_APPLICABLE]</p>
              <p><strong>UID-Nummer:</strong> [CLIENT_UID_IF_APPLICABLE]</p>
              <p><strong>Firmenbuchnummer:</strong> [CLIENT_COMPANY_REGISTER_NO_IF_APPLICABLE]</p>
              <p><strong>Firmenbuchgericht:</strong> [CLIENT_REGISTER_COURT_IF_APPLICABLE]</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              Grundlegende Richtung des Mediums
            </h2>
            <p>
              Diese Website informiert ueber das gastronomische Angebot, Reservierungen,
              Veranstaltungen und weitere Leistungen des Betriebs und ermoeglicht
              Online-Anfragen bzw. Online-Buchungen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              Haftung fuer Inhalte und Links
            </h2>
            <p>
              Trotz sorgfaeltiger inhaltlicher Kontrolle uebernehmen wir keine Haftung
              fuer die Inhalte externer Links. Fuer den Inhalt der verlinkten Seiten
              sind ausschliesslich deren Betreiber verantwortlich.
            </p>
            <p className="mt-2">
              Alle Inhalte dieser Website sind urheberrechtlich geschuetzt, soweit
              nicht anders gekennzeichnet.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              Verbraucherstreitbeilegung
            </h2>
            <p>
              [Bitte hier individuell eintragen, ob der konkrete Betrieb zur Teilnahme
              an Streitbeilegungsverfahren verpflichtet oder bereit ist.]
            </p>
            <p className="mt-2 text-dusk">
              Die fruehere EU-ODR-Plattform wird in dieser Vorlage bewusst nicht mehr
              genannt, da sie seit dem 20. Juli 2025 eingestellt ist.
            </p>
          </section>

          <p className="text-dusk text-xs pt-4 border-t border-pale-pistachio">
            Stand: April 2026 · Demo-Vorlage fuer Clay &amp; Light / Restaurant-Projekte
          </p>
        </div>
      </div>
    </div>
  )
}
