'use client'
import {Trans} from '@lingui/react/macro'
import {FacebookLogoIcon, InstagramLogoIcon, TwitterLogoIcon} from '@phosphor-icons/react'
import {Mail, MapPin, Phone} from 'lucide-react'
import Image from 'next/image'
import {Link} from 'react-aria-components'

export function Footer() {
  return (
    <footer className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-2">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <Image
                  src="/static/buy-logo.png"
                  alt="Dala Market Logo"
                  width={56}
                  height={56}
                  className="rounded-xl shadow-lg p-1"
                />
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-blue-500/20 to-purple-600/20" />
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Dala.kz
                </h3>
                <p className="text-gray-400 text-sm font-medium">Tourism Land Marketplace</p>
              </div>
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
              <Trans>
                Kazakhstan's premier platform for tourism land and development opportunities. Connecting investors,
                developers, and landowners with verified properties and professional support.
              </Trans>
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-3 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <FacebookLogoIcon size={20} />
              </a>
              <a
                href="#"
                className="p-3 bg-linear-to-br from-pink-600 to-pink-700 rounded-xl hover:from-pink-500 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <InstagramLogoIcon size={20} />
              </a>
              <a
                href="#"
                className="p-3 bg-linear-to-br from-blue-400 to-blue-500 rounded-xl hover:from-blue-300 hover:to-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <TwitterLogoIcon size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 text-white">
              <Trans>Quick Links</Trans>
            </h4>
            <ul className="space-y-4 ml-[-0.9rem]">
              <li>
                <Link
                  href="/property"
                  className="text-gray-300 hover:text-white transition-all duration-200 no-underline flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <Trans>Properties</Trans>
                </Link>
              </li>
              <li>
                <Link
                  href="/property/favourite"
                  className="text-gray-300 hover:text-white transition-all duration-200 no-underline flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <Trans>Favourites</Trans>
                </Link>
              </li>
              <li>
                <Link
                  href="/seller/create-property"
                  className="text-gray-300 hover:text-white transition-all duration-200 no-underline flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <Trans>List Property</Trans>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-all duration-200 no-underline flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <Trans>About Us</Trans>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 text-white">
              <Trans>Contact</Trans>
            </h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors duration-200">
                  <MapPin size={18} className="text-blue-400" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-200">
                  <Trans>Astana, Kazakhstan</Trans>
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors duration-200">
                  <Phone size={18} className="text-green-400" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-200">
                  +7 (727) 123-4567
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors duration-200">
                  <Mail size={18} className="text-purple-400" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-200">
                  info@dala.kz
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700/50 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Dala.kz. <Trans>All rights reserved.</Trans>
          </p>
          <div className="flex space-x-8 mt-4 sm:mt-0">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200 no-underline hover:underline"
            >
              <Trans>Privacy Policy</Trans>
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200 no-underline hover:underline"
            >
              <Trans>Terms of Service</Trans>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
