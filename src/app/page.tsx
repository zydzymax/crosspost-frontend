import Link from 'next/link'
import { 
  Send, Zap, Calendar, BarChart3, Shield, 
  MessageSquare, Instagram, Youtube, Music2,
  Check, ArrowRight, Sparkles
} from 'lucide-react'

const platforms = [
  { name: 'Telegram', icon: MessageSquare, color: '#0088cc' },
  { name: 'VK', icon: MessageSquare, color: '#4a76a8' },
  { name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { name: 'TikTok', icon: Music2, color: '#000000' },
  { name: 'YouTube', icon: Youtube, color: '#FF0000' },
]

const features = [
  {
    icon: Send,
    title: 'Кросспостинг',
    description: 'Публикуйте контент во все соцсети одним кликом. Один пост — все платформы.',
  },
  {
    icon: Sparkles,
    title: 'AI-капшены',
    description: 'Нейросеть адаптирует текст под каждую платформу. Идеальные хештеги и форматирование.',
  },
  {
    icon: Calendar,
    title: 'Расписание',
    description: 'Планируйте публикации заранее. Автоматический постинг в лучшее время.',
  },
  {
    icon: BarChart3,
    title: 'Аналитика',
    description: 'Отслеживайте охваты и вовлеченность. Понимайте, что работает.',
  },
]

const pricing = [
  {
    name: 'Demo',
    price: '0₽',
    period: '7 дней',
    description: 'Попробуйте все функции бесплатно',
    features: ['10 постов', 'Все платформы', 'AI-капшены', '5 генераций картинок'],
    cta: 'Начать бесплатно',
    popular: false,
  },
  {
    name: 'Pro',
    price: '990₽',
    period: 'месяц',
    description: 'Для активных авторов и SMM',
    features: ['100 постов/мес', 'Все платформы', 'AI-капшены', '50 генераций картинок', 'Приоритетная поддержка'],
    cta: 'Выбрать Pro',
    popular: true,
  },
  {
    name: 'Business',
    price: '2 990₽',
    period: 'месяц',
    description: 'Для агентств и команд',
    features: ['Безлимит постов', 'Все платформы', 'AI-капшены', 'Безлимит картинок', 'API доступ', 'Выделенная поддержка'],
    cta: 'Выбрать Business',
    popular: false,
  },
]

const faq = [
  {
    q: 'Какие платформы поддерживаются?',
    a: 'Telegram, VK, Instagram, TikTok и YouTube. Мы постоянно добавляем новые.',
  },
  {
    q: 'Как работают AI-капшены?',
    a: 'Нейросеть анализирует ваш контент и генерирует оптимальный текст для каждой платформы с учетом её особенностей.',
  },
  {
    q: 'Можно ли отменить подписку?',
    a: 'Да, в любой момент. Деньги за неиспользованный период не возвращаются, но доступ сохраняется до конца оплаченного периода.',
  },
  {
    q: 'Есть ли API?',
    a: 'Да, на тарифе Business доступен полноценный REST API для интеграции с вашими системами.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg">Crosspost</span>
              <span className="text-xs text-gray-400">by Sales Whisper</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-400 hover:text-white transition">Возможности</a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition">Тарифы</a>
              <a href="#faq" className="text-gray-400 hover:text-white transition">FAQ</a>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-400 hover:text-white transition">Войти</Link>
              <Link 
                href="/login" 
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition"
              >
                Начать
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-300">AI-powered кросспостинг</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Один пост — все соцсети
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Публикуйте контент в Telegram, VK, Instagram, TikTok и YouTube одним кликом. 
            AI адаптирует текст под каждую платформу.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link 
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold text-lg hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              Попробовать бесплатно
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition"
            >
              Смотреть тарифы
            </Link>
          </div>
          
          {/* Platform icons */}
          <div className="flex items-center justify-center gap-6">
            {platforms.map((platform) => (
              <div 
                key={platform.name}
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10"
                title={platform.name}
              >
                <platform.icon className="w-6 h-6" style={{ color: platform.color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Всё для SMM в одном месте</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Автоматизируйте рутину и сосредоточьтесь на создании контента
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-transparent to-indigo-950/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Простые тарифы</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            7 дней бесплатно. Без карты. Отмена в любой момент.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {pricing.map((plan) => (
              <div 
                key={plan.name}
                className={`p-6 rounded-2xl border ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-indigo-500/10 to-purple-500/10 border-indigo-500/50' 
                    : 'bg-white/5 border-white/10'
                } relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-xs font-medium">
                    Популярный
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">/ {plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href="/login"
                  className={`block w-full py-3 rounded-xl font-medium text-center transition ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90' 
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Частые вопросы</h2>
          
          <div className="space-y-4">
            {faq.map((item, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-gray-400 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-gray-400 mb-8">7 дней бесплатно. Без карты. Без обязательств.</p>
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold text-lg hover:opacity-90 transition"
          >
            Попробовать бесплатно
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <span className="font-bold">Crosspost</span>
              <span className="text-xs text-gray-400">by Sales Whisper</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="mailto:support@saleswhisper.pro" className="hover:text-white transition">Поддержка</a>
              <a href="#" className="hover:text-white transition">Политика конфиденциальности</a>
              <a href="#" className="hover:text-white transition">Условия использования</a>
            </div>
            
            <div className="text-sm text-gray-500">
              © 2025 Sales Whisper. Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
