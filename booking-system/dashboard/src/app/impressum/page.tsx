import { Header } from '@/components/layout/Header'

export const metadata = {
  title: 'Impressum — Clay & Light',
}

export default function ImpressumPage() {
  return (
    <div>
      <Header
        title="Impressum"
        subtitle="Pflichtangaben gemäß § 5 ECG und § 25 MedienG"
      />
      <div className="px-8 py-8 max-w-3xl">
        <div className="bg-white rounded-lg border border-pale-pistachio p-8 space-y-8 text-sm leading-relaxed text-ink">

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              Informationen über den Diensteanbieter
            </h2>
            <p className="text-dusk text-xs mb-3 italic">
              Bitte ersetze diese Platzhalter mit deinen realen Unternehmensdaten.
            </p>
            <div className="space-y-1">
              <p><strong>Unternehmensname:</strong> [Firmenname / Name der natürlichen Person]</p>
              <p><strong>Rechtsform:</strong> [z.B. Einzelunternehmen / GmbH / OG]</p>
              <p><strong>Adresse:</strong> [Straße und Hausnummer, PLZ Ort, Österreich]</p>
              <p><strong>E-Mail:</strong> <a href="mailto:hello@clayandlight.at" className="text-pistachio hover:underline">hello@clayandlight.at</a></p>
              <p><strong>Telefon:</strong> [+43 …]</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              Unternehmensgegenstand
            </h2>
            <p>
              Betrieb eines Slow-Cafés und Keramikstudios. Angebot von Töpfer-Workshops,
              Tischreservierungen und kreativen Erlebnisformaten.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              Behördliche Zulassung / Gewerberecht
            </h2>
            <div className="space-y-1">
              <p><strong>Mitglied der Wirtschaftskammer Österreich (WKO):</strong> [Ja/Nein, ggf. Sparte]</p>
              <p><strong>Anwendbare Gewerbeordnung:</strong> Österreichische Gewerbeordnung (GewO)</p>
              <p><strong>UID-Nummer:</strong> [ATU…] (sofern vorhanden)</p>
              <p><strong>Firmenbuchnummer:</strong> [FN …] (sofern vorhanden)</p>
              <p><strong>Firmenbuchgericht:</strong> [Handelsgericht Wien, sofern relevant]</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              Grundlegende Richtung des Mediums
            </h2>
            <p>
              Diese Website informiert über das Angebot von Clay &amp; Light, einem Slow-Café
              und Keramikstudio in Wien. Sie ermöglicht Buchungen für Töpfer-Workshops
              sowie Tischreservierungen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              Haftungsausschluss
            </h2>
            <p>
              Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für
              die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind
              ausschließlich deren Betreiber verantwortlich.
            </p>
            <p className="mt-2">
              Alle Inhalte dieser Website sind urheberrechtlich geschützt.
              Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung
              außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung
              des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-burgundy mb-3">
              Online-Streitbeilegung
            </h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung
              (OS) bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pistachio hover:underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              . Unsere E-Mail-Adresse findest du oben in diesem Impressum.
            </p>
            <p className="mt-2">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
              vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <p className="text-dusk text-xs pt-4 border-t border-pale-pistachio">
            Stand: April 2026 · Clay &amp; Light · Wien
          </p>
        </div>
      </div>
    </div>
  )
}
