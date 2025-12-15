'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Send, Check, ArrowLeft, CreditCard, FileText, 
  QrCode, Loader2, Copy, CheckCircle2 
} from 'lucide-react'

const plans = [
  {
    id: 'pro',
    name: 'Pro',
    price: 990,
    period: 'месяц',
    description: 'Для активных авторов и SMM',
    features: ['100 постов/мес', 'Все платформы', 'AI-капшены', '50 генераций картинок', 'Приоритетная поддержка'],
  },
  {
    id: 'business',
    name: 'Business',
    price: 2990,
    period: 'месяц',
    description: 'Для агентств и команд',
    features: ['Безлимит постов', 'Все платформы', 'AI-капшены', 'Безлимит картинок', 'API доступ', 'Выделенная поддержка'],
  },
]

type PaymentMethod = 'card' | 'invoice' | 'sbp'

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [loading, setLoading] = useState(false)
  const [invoiceGenerated, setInvoiceGenerated] = useState(false)
  const [copied, setCopied] = useState(false)

  const selectedPlanData = plans.find(p => p.id === selectedPlan)

  const handlePayment = async () => {
    if (!selectedPlan || !paymentMethod) return
    
    setLoading(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (paymentMethod === 'invoice') {
      setInvoiceGenerated(true)
    } else {
      // For card and SBP - show coming soon
      alert('Оплата картой и СБП скоро будет доступна. Пока используйте оплату по счёту.')
    }
    
    setLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Invoice details (placeholder)
  const invoiceDetails = {
    number: `INV-${Date.now().toString().slice(-8)}`,
    recipient: 'ИП Гладких Виталий Олегович',
    inn: '381705889083',
    account: '40802810500000123456',
    bank: 'АО "Тинькофф Банк"',
    bik: '044525974',
    corrAccount: '30101810145250000974',
    amount: selectedPlanData?.price || 0,
    purpose: `Оплата подписки Crosspost ${selectedPlanData?.name || ''} на 1 месяц`,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Выберите тариф</h1>
          <p className="text-gray-400">Улучшите свой план для доступа ко всем функциям</p>
        </div>

        {!selectedPlan ? (
          /* Plan Selection */
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition text-left"
              >
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold">{plan.price}₽</span>
                  <span className="text-gray-400">/ {plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        ) : !paymentMethod ? (
          /* Payment Method Selection */
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setSelectedPlan(null)}
              className="mb-6 text-gray-400 hover:text-white transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к тарифам
            </button>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
              <h3 className="font-bold mb-2">{selectedPlanData?.name}</h3>
              <p className="text-2xl font-bold">{selectedPlanData?.price}₽ <span className="text-sm text-gray-400 font-normal">/ месяц</span></p>
            </div>

            <h2 className="text-xl font-bold mb-4">Способ оплаты</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('invoice')}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Счёт на оплату</p>
                  <p className="text-sm text-gray-400">Для юридических лиц и ИП</p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('card')}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition flex items-center gap-4 opacity-60"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Банковская карта</p>
                  <p className="text-sm text-gray-400">Visa, Mastercard, МИР</p>
                </div>
                <span className="ml-auto text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">Скоро</span>
              </button>

              <button
                onClick={() => setPaymentMethod('sbp')}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition flex items-center gap-4 opacity-60"
              >
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium">СБП (QR-код)</p>
                  <p className="text-sm text-gray-400">Мгновенный перевод</p>
                </div>
                <span className="ml-auto text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">Скоро</span>
              </button>
            </div>
          </div>
        ) : invoiceGenerated ? (
          /* Invoice Generated */
          <div className="max-w-md mx-auto">
            <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 mb-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Счёт сформирован</h2>
              <p className="text-gray-400">Оплатите по реквизитам ниже</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Номер счёта</p>
                <p className="font-mono">{invoiceDetails.number}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-1">Получатель</p>
                <p>{invoiceDetails.recipient}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">ИНН</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono">{invoiceDetails.inn}</p>
                  <button onClick={() => copyToClipboard(invoiceDetails.inn)} className="text-indigo-400 hover:text-indigo-300">
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Расчётный счёт</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm">{invoiceDetails.account}</p>
                  <button onClick={() => copyToClipboard(invoiceDetails.account)} className="text-indigo-400 hover:text-indigo-300">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Банк</p>
                <p>{invoiceDetails.bank}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">БИК</p>
                  <p className="font-mono">{invoiceDetails.bik}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Корр. счёт</p>
                  <p className="font-mono text-xs">{invoiceDetails.corrAccount}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-1">Сумма к оплате</p>
                <p className="text-2xl font-bold">{invoiceDetails.amount}₽</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Назначение платежа</p>
                <p className="text-sm">{invoiceDetails.purpose}</p>
              </div>
            </div>

            <p className="text-center text-gray-500 text-sm mt-6">
              После оплаты подписка активируется автоматически в течение 24 часов.
              <br />
              Если возникли вопросы — напишите на <a href="mailto:support@saleswhisper.pro" className="text-indigo-400">support@saleswhisper.pro</a>
            </p>

            <Link
              href="/dashboard"
              className="block w-full mt-6 py-3 bg-indigo-500 rounded-xl font-medium text-center hover:bg-indigo-600 transition"
            >
              Вернуться в личный кабинет
            </Link>
          </div>
        ) : (
          /* Payment Processing */
          <div className="max-w-md mx-auto text-center">
            <button
              onClick={() => setPaymentMethod(null)}
              className="mb-6 text-gray-400 hover:text-white transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </button>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              {loading ? (
                <>
                  <Loader2 className="w-12 h-12 animate-spin text-indigo-400 mx-auto mb-4" />
                  <p>Формирование счёта...</p>
                </>
              ) : (
                <>
                  <p className="mb-6">
                    Вы выбрали оплату{' '}
                    {paymentMethod === 'card' && 'картой'}
                    {paymentMethod === 'invoice' && 'по счёту'}
                    {paymentMethod === 'sbp' && 'через СБП'}
                  </p>
                  <button
                    onClick={handlePayment}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-medium"
                  >
                    {paymentMethod === 'invoice' ? 'Сформировать счёт' : 'Оплатить'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
