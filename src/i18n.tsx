import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export const BRAND = 'Dagdan Tehnologiýa kärhanasy'

const tk = {
  nav: { about: 'Biz barada', services: 'Hyzmatlarymyz', process: 'Tapgyrlar', contact: 'Habarlaşmak' },
  hero: {
    welcome: 'Hoş geldiňiz!',
    title: 'Telekeçilik işiňiz üçin sanly çözgüt.',
    text: 'Biz diňe taslamalar döretmeýäris — biz uzak möhletleýin hyzmatdaşlyklary gurýarys we biznesiň sanly dünýäde ynamly öňe gitmegine ýardam edýäris.',
  },
  about: {
    statement: 'Biz — pikirleri täsirli sanly çözgütlere öwürýän topar. Hünärmenlerimiz web sahypalaryny, mobil goşundylary we reklam kampaniýalaryny döredýärler, olar bolsa biznesiň ösmegine, müşderileri özüne çekmegine we onlaýn giňişlikde gatnaşygyny güýçlendirmäge kömek edýär.',
    text: 'Biz tehnologiýany, analitikany we döredijiligi birleşdirip, hakyky netijäni berýän önümleri döredýäris. Strategiýany işläp taýýarlamakdan we dizaýndan başlap, ornaşdyrmaga hem-de mahabatlandyrmaga çenli — biz taslamany her tapgyrynda goldaýarys.',
    mission: 'Biziň maksadymyz',
    missionText: 'Döwrebap sanly gurallary ulanmak arkaly kompaniýalaryň müşderilerine has ýakyn bolmagyna ýardam etmek.',
  },
  services: {
    title: 'Biziň hyzmatlarymyz',
    items: {
      web: ['Web programmalar', 'Islendik çylşyrymlylykdaky web sahypalaryny we platformalaryny döretmek'],
      design: ['Brending we Dizaýn', 'Brending we dizaýn hyzmatlary'],
      android: ['Android', 'Android mobil goşundylary işläp taýýarlamak'],
      ios: ['iOS', 'iOS mobil goşundylary işläp taýýarlamak'],
      marketing: ['Marketing', 'Doly derejeli sanly marketing we maksatlaýyn mahabat'],
      analytics: ['Analitika we Optimizasiýa', 'Reklam kampaniýalarynyň analitikasyny we optimizasiýasyny geçirmek'],
    },
  },
  process: { title: 'Taslamany her tapgyrynda goldaýarys', steps: ['Strategiýa', 'Dizaýn', 'Ornaşdyrma', 'Mahabatlandyrma'] },
  contact: {
    title: 'Habarlaşmak',
    subtitle: 'Soraglaryňyz barmy? Sizden eşitmegi gowy görýäris.',
    phone: 'Telefon belgi',
    email: 'E-poçta',
    address: 'Salgy',
    location: 'Aşgabat şäheri, Köpetdag etraby, Parahat 2/4 ýaşaýyş toplumy 2',
    call: 'Jaň etmek',
    write: 'Hat ýazmak',
  },
  footer: {
    description: '«Dagdan Tehnologiýa kärhanasy» sanly ykdysadyýete geçmek üçin programma üpjünçilikleri we ýokary derejeli IT hyzmatlary ýerine ýetirýär.',
    rights: 'Ähli hukuklar goragly.',
    top: 'Ýokary',
  },
  ui: { menu: 'Menýu', close: 'Ýap', language: 'Dil' },
}

type Dict = typeof tk

const ru: Dict = {
  nav: { about: 'О нас', services: 'Услуги', process: 'Этапы', contact: 'Контакты' },
  hero: {
    welcome: 'Добро пожаловать!',
    title: 'Цифровое решение для вашего бизнеса.',
    text: 'Мы не просто создаем проекты — мы выстраиваем долгосрочные партнерские отношения и помогаем бизнесу уверенно двигаться вперед в цифровом мире.',
  },
  about: {
    statement: 'Мы — команда, которая превращает идеи в эффективные цифровые решения. Наши эксперты создают веб-сайты, мобильные приложения и рекламные кампании, которые помогают компаниям расти, привлекать клиентов и укреплять своё присутствие в интернете.',
    text: 'Мы объединяем технологии, аналитику и креативность для создания продуктов, которые приносят реальные результаты. Мы поддерживаем каждый этап проекта: от разработки стратегии и дизайна до внедрения и продвижения.',
    mission: 'Наша миссия',
    missionText: 'Помогаем компаниям стать ближе к своим клиентам за счет использования современных цифровых инструментов.',
  },
  services: {
    title: 'Наши услуги',
    items: {
      web: ['Веб-приложения', 'Создание сайтов и платформ любой сложности'],
      design: ['Брендинг и дизайн', 'Услуги брендинга и дизайна'],
      android: ['Android', 'Разработка мобильных приложений для Android'],
      ios: ['iOS', 'Разработка мобильных приложений для iOS'],
      marketing: ['Маркетинг', 'Полномасштабный цифровой маркетинг и таргетированная реклама'],
      analytics: ['Аналитика и оптимизация', 'Проведение аналитики и оптимизации рекламных кампаний'],
    },
  },
  process: { title: 'Поддерживаем каждый этап проекта', steps: ['Стратегия', 'Дизайн', 'Внедрение', 'Продвижение'] },
  contact: {
    title: 'Свяжитесь с нами',
    subtitle: 'Есть вопросы? Мы будем рады услышать от вас.',
    phone: 'Номер телефона',
    email: 'Электронная почта',
    address: 'Адрес',
    location: 'г. Ашхабад, Копетдагский район, жилой комплекс Парахат 2/4, дом 2',
    call: 'Позвонить',
    write: 'Написать',
  },
  footer: {
    description: '«Dagdan Tehnologiýa kärhanasy» разрабатывает программное обеспечение и оказывает IT-услуги высокого уровня для перехода к цифровой экономике.',
    rights: 'Все права защищены.',
    top: 'Наверх',
  },
  ui: { menu: 'Меню', close: 'Закрыть', language: 'Язык' },
}

const en: Dict = {
  nav: { about: 'About', services: 'Services', process: 'Process', contact: 'Contact' },
  hero: {
    welcome: 'Welcome!',
    title: 'A digital solution for your business.',
    text: "We don't just create projects — we build long-term partnerships and help businesses move forward confidently in the digital world.",
  },
  about: {
    statement: 'We are a team that turns ideas into impactful digital solutions. Our experts create websites, mobile apps, and advertising campaigns that help businesses grow, attract customers, and strengthen their online presence.',
    text: 'We combine technology, analytics, and creativity to create products that deliver real results. From strategy development and design to implementation and promotion, we support every stage of the project.',
    mission: 'Our Mission',
    missionText: 'Helping companies get closer to their customers through the use of modern digital tools.',
  },
  services: {
    title: 'Our Services',
    items: {
      web: ['Web applications', 'Creating websites and platforms of any complexity'],
      design: ['Branding and Design', 'Branding and design services'],
      android: ['Android', 'Developing Android mobile applications'],
      ios: ['iOS', 'Developing iOS mobile applications'],
      marketing: ['Marketing', 'Full-scale digital marketing and targeted advertising'],
      analytics: ['Analytics and Optimization', 'Conducting analytics and optimization of advertising campaigns'],
    },
  },
  process: { title: 'We support every stage of the project', steps: ['Strategy', 'Design', 'Implementation', 'Promotion'] },
  contact: {
    title: 'Get in Touch',
    subtitle: "Have questions? We'd love to hear from you.",
    phone: 'Phone number',
    email: 'Email',
    address: 'Address',
    location: 'Ashgabat, Kopetdag District, Parahat 2/4 Residential Complex, Building 2',
    call: 'Call us',
    write: 'Email us',
  },
  footer: {
    description: '«Dagdan Tehnologiýa kärhanasy» delivers software and high-level IT services for the transition to a digital economy.',
    rights: 'All rights reserved.',
    top: 'Back to top',
  },
  ui: { menu: 'Menu', close: 'Close', language: 'Language' },
}

const DICTS = { tk, ru, en }
export type Lang = keyof typeof DICTS
export const LANGS: Lang[] = ['tk', 'ru', 'en']
const STORAGE_KEY = 'dagdan-lang'

function savedLang(): Lang {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'tk' || value === 'ru' || value === 'en') return value
  } catch {
    // Storage can be blocked; the default language is fine.
  }
  return 'tk'
}

const I18nContext = createContext<{ lang: Lang; t: Dict; setLang: (lang: Lang) => void } | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(savedLang)
  const t = DICTS[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = t.hero.text
  }, [lang, t])

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Not remembering the choice is harmless.
    }
  }

  return <I18nContext.Provider value={{ lang, t, setLang }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside I18nProvider')
  return value
}
