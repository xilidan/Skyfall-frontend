'use client'
import {Trans, useLingui} from '@lingui/react/macro'
import {CheckCircle, Clock, Search, Star} from 'lucide-react'
import {useState} from 'react'
import {PropertyFilter} from '../property/PropertyFilter'

export function HeroSection() {
  const {t} = useLingui()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const stats = [
    {label: t`Verified Properties`, value: '10K+', icon: CheckCircle},
    {label: t`Trusted Sellers`, value: '4.9', icon: Star},
    {label: t`24/7 Support`, value: '24/7', icon: Clock},
  ]

  return (
    <section className="relative  flex flex-col py-16">
      <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200 animate-fade-from-bottom">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <Trans>Kazakhstan&apos;s Premier Land Marketplace</Trans>
          </div>

          <div className="space-y-6 animate-fade-from-bottom" style={{animationDelay: '0.15s'}}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <Trans>Find Your Perfect</Trans>
              <span className="block text-blue-600">
                <Trans>Land Investment</Trans>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              <Trans>
                Discover verified land opportunities across Kazakhstan. From tourism developments to commercial projects
                - connect with trusted sellers and make informed investment decisions.
              </Trans>
            </p>
          </div>

          <div className="animate-fade-from-bottom" style={{animationDelay: '0.3s'}}>
            <PropertyFilter showFilters={showFilters} setShowFilters={setShowFilters}>
              <div className="max-w-2xl mx-auto">
                <div className="relative cursor-pointer" onClick={() => setShowFilters(true)}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder={t`Search by location, type, or price range...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setShowFilters(true)}
                    className="w-full pl-12 pr-32 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer read-only"
                    readOnly
                  />
                </div>
              </div>
            </PropertyFilter>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-200 animate-fade-from-bottom"
                style={{animationDelay: `${0.45 + index * 0.1}s`}}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
