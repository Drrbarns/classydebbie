"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCMS } from '@/context/CMSContext';
import { supabase } from '@/lib/supabase';

export default function AboutPage() {
  const { getSetting, getContent } = useCMS();
  const [activeTab, setActiveTab] = useState('story');
  const [pageContent, setPageContent] = useState<any>(null);

  useEffect(() => {
    async function fetchAboutContent() {
      const { data } = await supabase
        .from('cms_content')
        .select('*')
        .eq('section', 'about')
        .eq('block_key', 'main')
        .single();

      if (data) {
        setPageContent(data);
      }
    }
    fetchAboutContent();
  }, []);

  const siteName = getSetting('site_name') || 'StandardStore';

  const values = [
    {
      icon: 'ri-leaf-line',
      title: 'Sustainability',
      description: 'We source responsibly and partner with eco-conscious brands to minimise our environmental footprint.'
    },
    {
      icon: 'ri-hand-heart-line',
      title: 'Quality First',
      description: 'Every product is carefully curated and tested to ensure it meets our premium standards.'
    },
    {
      icon: 'ri-group-line',
      title: 'Community',
      description: 'We believe in building lasting relationships with our customers and supporting local artisans.'
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Transparency',
      description: 'Honest communication, fair pricing, and ethical practices guide everything we do.'
    }
  ];

  const team = [
    {
      name: 'Kwame Mensah',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
      bio: 'With over 15 years in retail and ecommerce, Kwame founded our company to bring premium products to Ghana.'
    },
    {
      name: 'Ama Osei',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      bio: 'Ama ensures every order is fulfilled perfectly and our customers receive exceptional service.'
    },
    {
      name: 'Yaw Darko',
      role: 'Product Curator',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
      bio: 'Yaw travels the world discovering unique, high-quality products for our discerning customers.'
    },
    {
      name: 'Efua Asante',
      role: 'Customer Experience',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
      bio: 'Efua leads our support team, ensuring every customer interaction exceeds expectations.'
    }
  ];

  const milestones = [
    { year: '2018', event: 'Company founded with a vision to revolutionise online shopping in Ghana' },
    { year: '2019', event: 'Launched our first collection with 50 carefully curated products' },
    { year: '2020', event: 'Reached 10,000 happy customers and expanded our warehouse' },
    { year: '2021', event: 'Introduced same-day delivery in Accra and opened our second fulfilment centre' },
    { year: '2022', event: 'Partnered with 100+ premium brands and launched our loyalty programme' },
    { year: '2023', event: 'Expanded nationwide delivery and won Best Ecommerce Platform award' },
    { year: '2024', event: 'Serving 100,000+ customers with 500+ premium products' }
  ];

  // Use CMS content if available, otherwise use defaults
  const heroTitle = pageContent?.title || 'Redefining Premium Shopping in Ghana';
  const heroSubtitle = pageContent?.subtitle || "We're more than just an online store.";
  const heroContent = pageContent?.content || "We're a curated marketplace bringing the world's finest products to your doorstep, backed by exceptional service and genuine care.";

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {heroTitle}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {heroSubtitle} {heroContent}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex border-b border-gray-200 mb-12">
          <button
            onClick={() => setActiveTab('story')}
            className={`px-6 py-4 font-medium transition-colors cursor-pointer ${activeTab === 'story'
                ? 'text-emerald-700 border-b-2 border-emerald-700'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Our Story
          </button>
          <button
            onClick={() => setActiveTab('mission')}
            className={`px-6 py-4 font-medium transition-colors cursor-pointer ${activeTab === 'mission'
                ? 'text-emerald-700 border-b-2 border-emerald-700'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Mission & Vision
          </button>
        </div>

        {activeTab === 'story' && (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How It All Began</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  {siteName} was founded with a simple mission: to bring premium quality products to customers who value both quality and convenience.
                </p>
                <p>
                  We saw a gap in the market for a curated shopping experience that combines world-class products with exceptional local service.
                </p>
                <p>
                  Today, we serve thousands of customers, offering carefully selected products. But our mission remains unchanged: to delight every customer, every time.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop"
                alt="Our warehouse"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {activeTab === 'mission' && (
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-emerald-50 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center mb-6">
                <i className="ri-compass-3-line text-2xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide seamless access to premium products, delivered with exceptional service, transparent pricing, and a commitment to sustainability. We exist to make premium shopping accessible, reliable, and delightful.
              </p>
            </div>
            <div className="bg-amber-50 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mb-6">
                <i className="ri-eye-line text-2xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become the most trusted premium ecommerce platform, setting new standards for quality, service, and customer experience. We envision a future where everyone has access to the world's best products, delivered with care.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">Principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <i className={`${value.icon} text-2xl text-emerald-700`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold text-emerald-700 mb-2">100K+</div>
            <p className="text-gray-600 font-medium">Happy Customers</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-emerald-700 mb-2">500+</div>
            <p className="text-gray-600 font-medium">Premium Products</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-emerald-700 mb-2">99.2%</div>
            <p className="text-gray-600 font-medium">Satisfaction Rate</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-emerald-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Join Our Journey</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Every order you place supports our mission to bring premium products and exceptional service. Thank you for being part of our story.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-emerald-700 text-white px-8 py-4 rounded-full font-medium hover:bg-emerald-800 transition-colors whitespace-nowrap"
          >
            Start Shopping
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
