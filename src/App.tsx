import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent } from 'react'
import {
  mdiAndroid, mdiApple, mdiArrowRight, mdiArrowUp, mdiCheck, mdiChevronDown, mdiBullhornOutline, mdiChartLine, mdiClose, mdiEmailOutline,
  mdiMapMarkerOutline, mdiMenu, mdiPaletteOutline, mdiPhoneOutline, mdiWeb,
} from '@mdi/js'
import heroImage from './assets/hero.webp'
import aboutImage from './assets/about.webp'
import { BRAND, I18nProvider, LANGS, useI18n, type Lang } from './i18n'
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
      <img src="favicon.png" aria-hidden="true" />
      {/* <span>
        <b>Dagdan Tehnologiýa</b>
        <small>kärhanasy</small>
      </span> */}
    </a>
  )
}

const LANG_NAMES = { tk: 'Türkmençe', ru: 'Русский', en: 'English' } as const

function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (event: globalThis.PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        setOpen(false)
        root.current?.querySelector<HTMLButtonElement>('.lang-trigger')?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey, true)
    root.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus()
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [open])

  const onListKey = (event: ReactKeyboardEvent) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const items = [...(root.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? [])]
    const i = items.indexOf(document.activeElement as HTMLButtonElement)
    items[(i + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus()
  }

  const choose = (code: Lang) => {
    setLang(code)
    setOpen(false)
    root.current?.querySelector<HTMLButtonElement>('.lang-trigger')?.focus()
  }

  return (
    <div ref={root} className={`lang ${open ? 'is-open' : ''} ${className}`}>
      <button
        className="lang-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t.ui.language}: ${LANG_NAMES[lang]}`}
        onClick={() => setOpen(!open)}
      >
        <Icon path={mdiWeb} size={18} />
        <span>{lang.toUpperCase()}</span>
        <Icon path={mdiChevronDown} size={18} />
      </button>
      {open && (
        <div className="lang-menu" role="listbox" aria-label={t.ui.language} onKeyDown={onListKey}>
          {LANGS.map((code) => (
            <button key={code} type="button" role="option" aria-selected={lang === code} onClick={() => choose(code)}>
              <b>{code.toUpperCase()}</b>
              <span>{LANG_NAMES[code]}</span>
              {lang === code && <Icon path={mdiCheck} size={18} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MobileLang({ onSelect }: { onSelect: () => void }) {
  const { lang, setLang, t } = useI18n()
  return (
    <div className="mobile-lang">
      <div role="group" aria-label={t.ui.language}>
        {LANGS.map((code) => (
          <button
            key={code}
            type="button"
            aria-pressed={lang === code}
            onClick={() => {
              setLang(code)
              onSelect()
            }}
          >
            <b>{code.toUpperCase()}</b>
            <span>{LANG_NAMES[code]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const SECTION_IDS = ['about', 'services', 'process', 'contact']

function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.4
      let current = ''
      for (const id of SECTION_IDS) {
        const top = document.getElementById(id)?.getBoundingClientRect().top
        if (top !== undefined && top <= line) current = id
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = 'contact'
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return active
}

function Header() {
  const { t } = useI18n()
  const active = useActiveSection()
  const isActive = (href: string) => href === `#${active}`
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
            <a key={href} href={href} className={isActive(href) ? 'is-active' : ''} aria-current={isActive(href) ? 'true' : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <div className="bar-end">
          <LangSwitch className="lang-bar" />
          <a className={`btn btn-small desktop-cta ${isActive('#contact') ? 'is-active' : ''}`} href="#contact" aria-current={isActive('#contact') ? 'true' : undefined}>{t.nav.contact}</a>
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
              <a key={href} href={href} className={isActive(href) ? 'is-active' : ''} aria-current={isActive(href) ? 'true' : undefined} onClick={() => setOpen(false)}>
                {label}
                <Icon path={mdiArrowRight} size={20} />
              </a>
            ))}
          </nav>
          <MobileLang onSelect={() => setOpen(false)} />
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
  const tel = (phone: string) => `tel:${phone.replace(/\s/g, '')}`
  return (
    <section className="contact" id="contact">
      <div className="shell">
        <Reveal className="cta-banner">
          <div className="cta-deco" aria-hidden="true"><i /><i /><i /></div>
          <div className="cta-copy">
            <h2>{t.contact.title}</h2>
            <p>{t.contact.subtitle}</p>
          </div>
          <div className="cta-actions">
            <a className="btn" href={tel(PHONES[0])}>
              <Icon path={mdiPhoneOutline} size={20} />
              {t.contact.call}
            </a>
            <a className="btn btn-ghost" href={`mailto:${EMAIL}`}>
              <Icon path={mdiEmailOutline} size={20} />
              {t.contact.write}
            </a>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <ul className="contact-strip">
            <li>
              <Icon path={mdiPhoneOutline} size={20} />
              <div>
                <h3>{t.contact.phone}</h3>
                <p>
                  {PHONES.map((phone, i) => (
                    <span key={phone}>
                      {i > 0 && <span className="sep" aria-hidden="true"> · </span>}
                      <a href={tel(phone)}>{phone}</a>
                    </span>
                  ))}
                </p>
              </div>
            </li>
            <li>
              <Icon path={mdiEmailOutline} size={20} />
              <div>
                <h3>{t.contact.email}</h3>
                <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
              </div>
            </li>
            <li>
              <Icon path={mdiMapMarkerOutline} size={20} />
              <div>
                <h3>{t.contact.address}</h3>
                <p>{t.contact.location}</p>
              </div>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  const { t } = useI18n()
  const pages = [
    ['#about', t.nav.about],
    ['#services', t.nav.services],
    ['#process', t.nav.process],
    ['#contact', t.nav.contact],
  ]
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <Logo />
        <p className="footer-text">{t.footer.description}</p>
        <nav className="footer-nav">
          {pages.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <p className="footer-copy">© {new Date().getFullYear()} {BRAND}. {t.footer.rights}</p>
      </div>
    </footer>
  )
}

function BackToTop() {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      className={`to-top ${visible ? 'is-visible' : ''}`}
      aria-label={t.footer.top}
      title={t.footer.top}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <Icon path={mdiArrowUp} size={22} />
    </button>
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
      <BackToTop />
    </I18nProvider>
  )
}
