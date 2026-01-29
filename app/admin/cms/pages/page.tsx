'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface PageContent {
  id?: string;
  section: string;
  block_key: string;
  title: string;
  subtitle: string;
  content: string;
  metadata: Record<string, any>;
  is_active: boolean;
}

const STATIC_PAGES = [
  { section: 'about', label: 'About Us', icon: 'ri-information-line' },
  { section: 'contact', label: 'Contact', icon: 'ri-phone-line' },
  { section: 'faqs', label: 'FAQs', icon: 'ri-question-line' },
  { section: 'privacy', label: 'Privacy Policy', icon: 'ri-shield-line' },
  { section: 'terms', label: 'Terms & Conditions', icon: 'ri-file-list-line' },
  { section: 'shipping', label: 'Shipping Info', icon: 'ri-truck-line' },
  { section: 'returns', label: 'Returns Policy', icon: 'ri-refresh-line' },
];

export default function CMSPagesPage() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activePage, setActivePage] = useState('about');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_content')
        .select('*')
        .in('section', STATIC_PAGES.map(p => p.section));

      if (error) throw error;

      // Initialize missing pages with defaults
      const existingSections = new Set(data?.map(p => p.section) || []);
      const defaultPages: PageContent[] = STATIC_PAGES
        .filter(p => !existingSections.has(p.section))
        .map(p => ({
          section: p.section,
          block_key: 'main',
          title: p.label,
          subtitle: '',
          content: '',
          metadata: {},
          is_active: true,
        }));

      setPages([...(data || []), ...defaultPages]);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPage = (section: string): PageContent => {
    return pages.find(p => p.section === section) || {
      section,
      block_key: 'main',
      title: '',
      subtitle: '',
      content: '',
      metadata: {},
      is_active: true,
    };
  };

  const updatePage = (section: string, field: string, value: any) => {
    setPages(prev => {
      const existing = prev.find(p => p.section === section);
      if (existing) {
        return prev.map(p => p.section === section ? { ...p, [field]: value } : p);
      }
      return [...prev, {
        section,
        block_key: 'main',
        title: '',
        subtitle: '',
        content: '',
        metadata: {},
        is_active: true,
        [field]: value,
      }];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const currentPage = getPage(activePage);

      if (currentPage.id) {
        await supabase
          .from('cms_content')
          .update({
            title: currentPage.title,
            subtitle: currentPage.subtitle,
            content: currentPage.content,
            metadata: currentPage.metadata,
            is_active: currentPage.is_active,
          })
          .eq('id', currentPage.id);
      } else {
        await supabase
          .from('cms_content')
          .insert({
            section: currentPage.section,
            block_key: 'main',
            title: currentPage.title,
            subtitle: currentPage.subtitle,
            content: currentPage.content,
            metadata: currentPage.metadata,
            is_active: currentPage.is_active,
          });
      }

      alert('Page content saved successfully!');
      fetchPages();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <i className="ri-loader-4-line animate-spin text-4xl text-emerald-700"></i>
      </div>
    );
  }

  const currentPage = getPage(activePage);
  const pageConfig = STATIC_PAGES.find(p => p.section === activePage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/cms"
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <i className="ri-arrow-left-line text-xl text-gray-700"></i>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Static Pages</h1>
            <p className="text-gray-600 mt-1">Edit content for your store's information pages</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href={`/${activePage}`}
            target="_blank"
            className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-semibold"
          >
            <i className="ri-eye-line mr-2"></i>
            Preview
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="ri-save-line mr-2"></i>
                Save Page
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Page Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Pages</h3>
            <div className="space-y-2">
              {STATIC_PAGES.map((page) => (
                <button
                  key={page.section}
                  onClick={() => setActivePage(page.section)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activePage === page.section
                      ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                      : 'hover:bg-gray-100 text-gray-700 border-2 border-transparent'
                    }`}
                >
                  <i className={`${page.icon} text-xl`}></i>
                  <span className="font-medium">{page.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {pageConfig?.label} Page
              </h3>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentPage.is_active}
                  onChange={(e) => updatePage(activePage, 'is_active', e.target.checked)}
                  className="w-5 h-5 text-emerald-700 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-gray-700 font-medium">Published</span>
              </label>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={currentPage.title || ''}
                  onChange={(e) => updatePage(activePage, 'title', e.target.value)}
                  placeholder={`Enter ${pageConfig?.label} page title`}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={currentPage.subtitle || ''}
                  onChange={(e) => updatePage(activePage, 'subtitle', e.target.value)}
                  placeholder="Enter a subtitle or tagline"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Page Content
                </label>
                <textarea
                  value={currentPage.content || ''}
                  onChange={(e) => updatePage(activePage, 'content', e.target.value)}
                  placeholder="Enter the main content for this page. You can use multiple paragraphs..."
                  rows={12}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none font-mono text-sm"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Tip: Use double line breaks to create paragraphs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
