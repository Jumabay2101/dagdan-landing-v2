import { useEffect, useState, type PointerEvent } from 'react'
import {
  mdiAndroid, mdiApple, mdiArrowRight, mdiBullhornOutline, mdiChartLine, mdiClose, mdiEmailOutline,
  mdiMapMarkerOutline, mdiMenu, mdiPaletteOutline, mdiPhoneOutline, mdiWeb,
} from '@mdi/js'
import heroImage from './assets/hero.webp'
import aboutImage from './assets/about.webp'
import { BRAND, I18nProvider, LANGS, useI18n } from './i18n'
import { NetworkCanvas, Reveal, ScrollProgress, ScrollWords } from './effects'

const PHONES = ['+993 61 48 48 40', '+993 63 55 61 56']
const EMAIL = 'info@sanlyhorjun.tm'

function Icon({ path, size = 24 }: { path: string; size?: number }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} fill="currentColor" />
    </svg>
  )
}

function Logo() {
  return (
    <a className="logo" href="#top" aria-label={BRAND}>
      <svg viewBox="0 0 64 64" width="38" height="38" aria-hidden="true">
        <defs>
          <linearGradient id="logo-fill" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#4E6EF1" />
            <stop offset="1" stopColor="#38D6E8" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#logo-fill)" />
        <path d="M12 46 26 20l8 14 5-8 13 20z" fill="#fff" />
      </svg>
      <span>
        <b>Dagdan Tehnologiýa</b>
        <small>kärhanasy</small>
      </span>
    </a>
  )
}

function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useI18n()
  return (
    <div className={`lang ${className}`} role="group" aria-label={t.ui.language}>
      {LANGS.map((code) => (
        <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)}>
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

function Header() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const links = [
    ['#about', t.nav.about],
    ['#services', t.nav.services],
    ['#process', t.nav.process],
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth >= 900) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <header className={`site-header ${scrolled || open ? 'is-solid' : ''}`}>
      <div className="bar">
        <Logo />
        <nav className="desktop-nav">
          {links.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
        <div className="bar-end">
          <LangSwitch className="lang-bar" />
          <a className="btn btn-small desktop-cta" href="#contact">{t.nav.contact}</a>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.ui.close : t.ui.menu}
            onClick={() => setOpen(!open)}
          >
            <Icon path={open ? mdiClose : mdiMenu} size={26} />
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu" id="mobile-menu">
          <nav>
            {[...links, ['#contact', t.nav.contact]].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label}
                <Icon path={mdiArrowRight} />
              </a>
            ))}
          </nav>
          <LangSwitch />
        </div>
      )}
    </header>
  )
}

function Hero() {
  const { t } = useI18n()
  return (
    <section className="hero" id="top">
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <NetworkCanvas />
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="pill"><i aria-hidden="true" />{t.hero.welcome}</p>
          <p className="hero-brand">{BRAND}</p>
          <h1>{t.hero.title}</h1>
          <p className="hero-text">{t.hero.text}</p>
          <div className="hero-actions">
            <a className="btn" href="#contact">{t.nav.contact}<Icon path={mdiArrowRight} size={20} /></a>
            <a className="btn btn-ghost" href="#services">{t.nav.services}</a>
          </div>
        </div>
        <div className="hero-visual">
          <img src={heroImage} alt="" width="890" height="890" />
          <span className="chip chip-a"><Icon path={mdiWeb} size={18} />Web</span>
          <span className="chip chip-b"><Icon path={mdiAndroid} size={18} />Android</span>
          <span className="chip chip-c"><Icon path={mdiApple} size={18} />iOS</span>
        </div>
      </div>
    </section>
  )
}

function Marquee() {
  const { t } = useI18n()
  const names = Object.values(t.services.items).map(([name]) => name)
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-set" key={copy}>
            {[...names, ...names].map((name, i) => <span key={i}>{name}</span>)}
          </div>
        ))}
      </div>
    </div>
  )
}

function About() {
  const { t } = useI18n()
  return (
    <section className="section" id="about">
      <div className="shell">
        <p className="eyebrow">{t.nav.about}</p>
        <ScrollWords text={t.about.statement} />
        <div className="about-grid">
          <Reveal className="about-image">
            <img src={aboutImage} alt="" width="890" height="846" loading="lazy" />
          </Reveal>
          <div className="about-copy">
            <Reveal><p className="lead">{t.about.text}</p></Reveal>
            <Reveal delay={100}>
              <div className="mission">
                <h3>{t.about.mission}</h3>
                <p>{t.about.missionText}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function WebVisual() {
  return (
    <div className="visual-browser" aria-hidden="true">
      <div className="dots"><i /><i /><i /></div>
      <div className="code">
        <i style={{ width: '46%' }} /><i style={{ width: '72%' }} /><i style={{ width: '58%' }} /><i style={{ width: '34%' }} />
      </div>
    </div>
  )
}

function ChartVisual() {
  const bars = [32, 48, 41, 63, 57, 78, 70, 92]
  return (
    <div className="visual-chart" aria-hidden="true">
      {bars.map((height, i) => <i key={i} style={{ height: `${height}%`, animationDelay: `${i * 70}ms` }} />)}
    </div>
  )
}

function followPointer(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--x', `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty('--y', `${event.clientY - rect.top}px`)
}

function Services() {
  const { t } = useI18n()
  const { web, design, android, ios, marketing, analytics } = t.services.items
  const cards = [
    { item: web, icon: mdiWeb, area: 'card-web', visual: <WebVisual /> },
    { item: design, icon: mdiPaletteOutline, area: 'card-design' },
    { item: android, icon: mdiAndroid, area: 'card-android' },
    { item: ios, icon: mdiApple, area: 'card-ios' },
    { item: marketing, icon: mdiBullhornOutline, area: 'card-marketing' },
    { item: analytics, icon: mdiChartLine, area: 'card-analytics', visual: <ChartVisual /> },
  ]
  return (
    <section className="section section-tint" id="services">
      <div className="shell">
        <Reveal className="section-head">
          <p className="eyebrow">{t.nav.services}</p>
          <h2>{t.services.title}</h2>
          <p>{t.hero.text}</p>
        </Reveal>
        <div className="bento">
          {cards.map(({ item: [name, text], icon, area, visual }, i) => (
            <Reveal key={area} className={area} delay={i * 60}>
              <article className="card" onPointerMove={followPointer}>
                <div className="card-top">
                  <span className="card-icon"><Icon path={icon} size={26} /></span>
                  <span className="card-index">0{i + 1}</span>
                </div>
                {visual}
                <div className="card-text">
                  <h3>{name}</h3>
                  <p>{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process() {
  const { t } = useI18n()
  return (
    <section className="section" id="process">
      <div className="shell">
        <Reveal className="section-head">
          <p className="eyebrow">{t.nav.process}</p>
          <h2>{t.process.title}</h2>
        </Reveal>
        <ol className="steps">
          {t.process.steps.map((step, i) => (
            <li key={step}>
              <Reveal delay={i * 120}>
                <span className="step-dot">{i + 1}</span>
                <h3>{step}</h3>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Contact() {
  const { t } = useI18n()
  return (
    <section className="contact" id="contact">
      <div className="aurora aurora-soft" aria-hidden="true"><i /><i /></div>
      <div className="shell contact-grid">
        <Reveal className="contact-head">
          <h2>{t.contact.title}</h2>
          <p>{t.contact.subtitle}</p>
        </Reveal>
        <div className="contact-cards">
          <Reveal>
            <div className="contact-card">
              <Icon path={mdiPhoneOutline} />
              <div>
                <h3>{t.contact.phone}</h3>
                {PHONES.map((phone) => <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>)}
              </div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="contact-card">
              <Icon path={mdiEmailOutline} />
              <div>
                <h3>{t.contact.email}</h3>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="contact-card">
              <Icon path={mdiMapMarkerOutline} />
              <div>
                <h3>{t.contact.address}</h3>
                <p>{t.contact.location}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const { t } = useI18n()
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div>
          <Logo />
          <p>{t.footer.description}</p>
        </div>
        <nav>
          <a href="#about">{t.nav.about}</a>
          <a href="#services">{t.nav.services}</a>
          <a href="#process">{t.nav.process}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
      </div>
      <div className="shell copyright">© {new Date().getFullYear()} {BRAND}. {t.footer.rights}</div>
    </footer>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Process />
        <Contact />
      </main>
      <Footer />
    </I18nProvider>
  )
}
