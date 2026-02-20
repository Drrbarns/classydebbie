'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCMS } from '@/context/CMSContext';
import PageHero from '@/components/PageHero';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AboutPage() {
  usePageTitle('Our Story');
  const { getSetting } = useCMS();
  const [activeTab, setActiveTab] = useState('story');

  const siteName = getSetting('site_name') || 'Classy Debbie';

  const values = [
    {
      icon: 'ri-store-3-line',
      title: 'Diverse Selection',
      description: 'From high-quality mannequins for your business to essential kitchenware and stunning dresses, we have it all.'
    },
    {
      icon: 'ri-money-dollar-circle-line',
      title: 'Unbeatable Value',
      description: 'Direct sourcing ensures premium quality at prices that make sense, without the markup.'
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Quality Assured',
      description: 'Every product, whether electronic or fabric, is personally inspected to meet our high standards.'
    },
    {
      icon: 'ri-customer-service-2-line',
      title: 'Customer First',
      description: 'We believe in building lasting relationships through exceptional service and support.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="More Than Just A Store"
        subtitle="Welcome to Classy Debbie. Your one-stop destination for business essentials, home comforts, and fashion."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex border-b border-gray-200 mb-12 justify-center overflow-x-auto">
          <button
            onClick={() => setActiveTab('story')}
            className={`px-4 sm:px-8 py-4 font-medium transition-colors text-base sm:text-lg cursor-pointer whitespace-nowrap shrink-0 touch-manipulation ${activeTab === 'story'
              ? 'text-blue-700 border-b-4 border-blue-700 font-bold'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Our Story
          </button>
          <button
            onClick={() => setActiveTab('mission')}
            className={`px-4 sm:px-8 py-4 font-medium transition-colors text-base sm:text-lg cursor-pointer whitespace-nowrap shrink-0 touch-manipulation ${activeTab === 'mission'
              ? 'text-blue-700 border-b-4 border-blue-700 font-bold'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Our Mission
          </button>
        </div>

        {activeTab === 'story' && (
          <div className="grid md:grid-cols-2 gap-16 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">A Vision of Versatility</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  <strong>Classy Debbie</strong> started with a simple idea: why shouldn't you be able to find everything you need to elevate your life and business in one place?
                </p>
                <p>
                  We recognized that our customers are multi-faceted. You're entrepreneurs needing durable <strong>mannequins</strong> to showcase your own products. You're homemakers looking for reliable <strong>kitchen essentials</strong> and modern <strong>electronics</strong>. And you're fashion-forward individuals seeking that perfect <strong>dress</strong> for the weekend.
                </p>
                <p>
                  Today, Classy Debbie stands as a testament to variety without compromise. We carefully curate each category, ensuring that whether you're buying a blender or a ballgown, you're getting the best quality on the market.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-gray-100 relative flex items-center justify-center group">
                {/* Abstract representation or actual image */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white opacity-50"></div>
                <img
                  src="/logo.png"
                  alt="Classy Debbie Logo"
                  className="w-2/3 h-auto object-contain relative z-10 drop-shadow-xl transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-transparent p-8 pt-24">
                  <p className="text-white font-serif font-bold text-2xl">Classy Debbie</p>
                  <p className="text-blue-200">Est. 2024</p>
                </div>
              </div>
              {/* Decorative Element */}
              <div className="absolute -z-10 top-12 -right-12 w-full h-full border-2 border-blue-100 rounded-3xl hidden md:block"></div>
              <div className="absolute -z-10 -bottom-12 -left-12 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
            </div>
          </div>
        )}

        {activeTab === 'mission' && (
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-50 p-10 rounded-3xl border border-blue-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200">
                <i className="ri-store-2-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Empowering Businesses</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                We support local entrepreneurs by providing high-quality retail displays and mannequins. Your success is our success, and we're here to help you showcase your products in the best light.
              </p>
            </div>
            <div className="bg-sky-50 p-10 rounded-3xl border border-sky-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-sky-200">
                <i className="ri-home-heart-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enhancing Homes</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                From the kitchen to the living room, our electronics and home essentials are chosen for their durability and style, making your daily life smoother and more enjoyable.
              </p>
            </div>
            <div className="bg-indigo-50 p-10 rounded-3xl border border-indigo-100 hover:shadow-lg transition-shadow md:col-span-2">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-200">
                <i className="ri-t-shirt-air-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Celebrating Style</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our fashion collection is for the modern woman who values elegance and comfort. We believe that looking good should be effortless and accessible to everyone.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Values Section */}
      <div className="bg-slate-50 py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-900 rounded-full blur-[100px]"></div>
          <div className="absolute left-0 bottom-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Why Shop With Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Quality, variety, and a commitment to your satisfaction.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600">
                  <i className={`${value.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern-noise.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">Ready to explore?</h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Discover our diverse collection and find exactly what you've been looking for.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 bg-white text-blue-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Start Shopping
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
