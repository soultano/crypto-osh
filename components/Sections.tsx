import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { auctionText } from "@/content/auction";
import { photos, site, videos } from "@/lib/site";
import { Divider, IkatBand, Rosette } from "./Ornament";
import { VideoCard } from "./VideoCard";

export function SectionHead({ kicker, title, intro }: { kicker?: string; title: string; intro?: string }) {
  return (
    <div className="section-head">
      {kicker && <span className="kicker">{kicker}</span>}
      <h2>{title}</h2>
      <Divider />
      {intro && <p className="lead">{intro}</p>}
    </div>
  );
}

export function Mission({ t }: { t: Dictionary }) {
  return (
    <section className="section">
      <div className="container">
        <SectionHead kicker={t.mission.kicker} title={t.mission.title} intro={t.mission.intro} />
        <div className="grid-4">
          {t.mission.pillars.map((p, i) => (
            <div className="tile" key={p.title}>
              <span className="tile-num">0{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Audience({ t }: { t: Dictionary }) {
  const icons = ["📈", "⛓️", "🎙️", "💼"];
  return (
    <section className="section section-alt">
      <div className="container">
        <SectionHead kicker={t.audience.kicker} title={t.audience.title} />
        <div className="grid-4">
          {t.audience.items.map((a, i) => (
            <div className="card-plain" key={a.title}>
              <span className="emoji" aria-hidden="true">
                {icons[i]}
              </span>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Gallery({ t }: { t: Dictionary }) {
  const items = [
    { src: photos.group2, w: 1200, h: 1600, cls: "g-tall" },
    { src: photos.plov, w: 1200, h: 1600, cls: "" },
    { src: photos.groupOutdoor, w: 1600, h: 1200, cls: "g-wide" },
    { src: photos.plov2, w: 1200, h: 1600, cls: "" },
    { src: photos.group1, w: 1600, h: 1200, cls: "g-wide" },
  ];
  return (
    <section className="section">
      <div className="container">
        <SectionHead kicker={t.gallery.kicker} title={t.gallery.title} />
        <div className="gallery">
          {items.map((p) => (
            <figure key={p.src} className={p.cls}>
              <Image src={p.src} alt={t.gallery.title} width={p.w} height={p.h} sizes="(max-width: 700px) 50vw, 33vw" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VideoGrid({ t, locale, limit }: { t: Dictionary; locale: Locale; limit?: number }) {
  const list = limit ? videos.slice(0, limit) : videos;
  return (
    <div className="video-grid">
      {list.map((v) => (
        <VideoCard key={v.id} id={v.id} title={v.title} city={v.city[locale]} playLabel={t.videos.play} />
      ))}
    </div>
  );
}

export function Contact({ t }: { t: Dictionary }) {
  const { group, telegram, instagram, phone } = site.contacts;
  const hasAny = group || telegram || instagram || phone;
  return (
    <section className="section contact" id="contact">
      <IkatBand />
      <div className="container contact-inner">
        <Rosette className="contact-rosette" size={180} />
        <div>
          <h2>{t.contact.title}</h2>
          <p className="lead">{t.contact.text}</p>
          {hasAny ? (
            <div className="btn-row">
              {group && (
                <a className="btn" href={group} target="_blank" rel="noopener noreferrer">
                  {t.contact.group}
                </a>
              )}
              {telegram && (
                <a className={group ? "btn btn-ghost" : "btn"} href={telegram} target="_blank" rel="noopener noreferrer">
                  {t.contact.telegram}
                </a>
              )}
              {instagram && (
                <a className="btn btn-ghost" href={instagram} target="_blank" rel="noopener noreferrer">
                  {t.contact.instagram}
                </a>
              )}
              {phone && (
                <a className="btn btn-ghost" href={`tel:${phone.replace(/[^+\d]/g, "")}`}>
                  {t.contact.phone}
                </a>
              )}
            </div>
          ) : (
            <p className="muted">{t.contact.soon}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export function Footer({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <footer className="footer">
      <IkatBand />
      <div className="container footer-inner">
        <div>
          <Link href={`/${locale}`} className="brand">
            <span className="brand-mark" aria-hidden="true">₿</span>
            <span>
              Crypto <b>Osh</b>
            </span>
          </Link>
          <p className="muted">{t.footer.tagline}</p>
        </div>
        <nav className="footer-nav" aria-label="Footer">
          <Link href={`/${locale}/about`}>{t.nav.about}</Link>
          <Link href={`/${locale}/business`}>{t.nav.business}</Link>
          <Link href={`/${locale}/auction`}>{auctionText[locale].nav}</Link>
          <Link href={`/${locale}/people`}>{t.nav.people}</Link>
          <Link href={`/${locale}/videos`}>{t.nav.videos}</Link>
          <Link href={`/${locale}#contact`}>{t.nav.contact}</Link>
          {site.contacts.group && (
            <a href={site.contacts.group} target="_blank" rel="noopener noreferrer">
              {t.contact.group}
            </a>
          )}
        </nav>
        <div className="footer-small">
          <p>{t.footer.founder}</p>
          <p className="muted">{t.footer.disclaimer}</p>
          <p className="muted">
            © {new Date().getFullYear()} Crypto Osh. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
