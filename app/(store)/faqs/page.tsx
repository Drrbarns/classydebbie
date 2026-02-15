'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function FAQsPage() {
  usePageTitle('FAQs');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Questions', icon: 'ri-question-line' },
    { id: 'orders', name: 'Orders', icon: 'ri-shopping-bag-line' },
    { id: 'shipping', name: 'Shipping', icon: 'ri-truck-line' },
    { id: 'products', name: 'Products', icon: 'ri-store-2-line' },
    { id: 'returns', name: 'Returns', icon: 'ri-arrow-go-back-line' },
    { id: 'payment', name: 'Payment', icon: 'ri-bank-card-line' },
  ];

  const faqs = [
    {
      category: 'orders',
      question: 'How do I place an order?',
      answer: 'Browse our diverse collection, add items to your cart, and proceed to checkout. You can checkout as a guest or create an account for faster future purchases.'
    },
    {
      category: 'orders',
      question: 'Can I modify my order after placing it?',
      answer: 'We process orders quickly to ensure fast delivery. If you need to make changes, please contact us via WhatsApp or phone within 1 hour of placing your order.'
    },
    {
      category: 'shipping',
      question: 'Do you deliver bulky items like mannequins?',
      answer: 'Yes! We have specialized delivery partners for our larger items like mannequins and kitchen appliances to ensure they arrive safely to your business or home.'
    },
    {
      category: 'shipping',
      question: 'What are your delivery times?',
      answer: 'Standard delivery within Accra takes 1-2 business days. For other regions, please allow 3-5 business days. Express delivery options are available at checkout.'
    },
    {
      category: 'products',
      question: 'Are your electronics covered by warranty?',
      answer: 'Yes, all our electronic appliances come with a standard manufacturer\'s warranty. Specific warranty periods are listed on the product page.'
    },
    {
      category: 'products',
      question: 'Do you sell full-body mannequins?',
      answer: 'We offer a wide range of mannequins including full-body, torso, and specific parts for jewelry display. Check our "Business Essentials" category for the full catalog.'
    },
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We accept returns within 7 days of delivery for most items, provided they are unused and in original packaging. Please note that for hygiene reasons, intimate apparel cannot be returned unless defective.'
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept Mobile Money (MTN, Vodafone, AirtelTigo), Visa/Mastercard, and Cash on Delivery for eligible orders within Accra.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern-noise.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Find answers to common questions about our products and services.
          </p>

          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 rounded-full border-none focus:ring-4 focus:ring-blue-500/30 text-gray-900 shadow-xl"
            />
            <i className="ri-search-line absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <i className={`${category.icon} text-lg`}></i>
              {category.name}
            </button>
          ))}
        </div>

        {filteredFAQs.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {filteredFAQs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 transition-all duration-300"
              >
                <summary className="px-6 py-5 font-medium text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between list-none">
                  <span className="text-lg">{faq.question}</span>
                  <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-open:bg-blue-600 group-open:text-white transition-colors">
                    <i className="ri-add-line group-open:hidden text-blue-600"></i>
                    <i className="ri-subtract-line hidden group-open:block"></i>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 bg-gray-50/30 animate-in fade-in slide-in-from-top-1">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-search-line text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500">
              Try adjusting your search or browse different categories
            </p>
          </div>
        )}
      </div>

      <div className="bg-sky-50 py-16 border-t border-sky-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-blue-600">
            <i className="ri-chat-smile-3-line text-3xl"></i>
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Can't find the answer you're looking for? Please chat to our friendly team.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-4 rounded-full font-medium hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
