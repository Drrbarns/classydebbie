'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Setting {
  key: string;
  value: any;
  category: string;
}

export default function CMSSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: 'ri-settings-3-line' },
    { id: 'contact', label: 'Contact', icon: 'ri-phone-line' },
    { id: 'social', label: 'Social Media', icon: 'ri-share-line' },
    { id: 'theme', label: 'Theme', icon: 'ri-palette-line' },
  ];

  const settingsConfig: Record<string, { key: string; label: string; type: string; placeholder?: string }[]> = {
    general: [
      { key: 'site_name', label: 'Site Name', type: 'text', placeholder: 'Your Store Name' },
      { key: 'site_tagline', label: 'Tagline', type: 'text', placeholder: 'Your store tagline' },
      { key: 'site_logo', label: 'Logo URL', type: 'text', placeholder: '/logo.png' },
      { key: 'currency', label: 'Currency Code', type: 'text', placeholder: 'GHS' },
      { key: 'currency_symbol', label: 'Currency Symbol', type: 'text', placeholder: 'GH₵' },
    ],
    contact: [
      { key: 'contact_email', label: 'Email Address', type: 'email', placeholder: 'support@yourstore.com' },
      { key: 'contact_phone', label: 'Phone Number', type: 'text', placeholder: '+233 XX XXX XXXX' },
      { key: 'contact_address', label: 'Address', type: 'textarea', placeholder: 'Your store address' },
    ],
    social: [
      { key: 'social_facebook', label: 'Facebook URL', type: 'url', placeholder: 'https://facebook.com/yourpage' },
      { key: 'social_instagram', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/yourpage' },
      { key: 'social_twitter', label: 'Twitter/X URL', type: 'url', placeholder: 'https://twitter.com/yourpage' },
      { key: 'social_tiktok', label: 'TikTok URL', type: 'url', placeholder: 'https://tiktok.com/@yourpage' },
      { key: 'social_youtube', label: 'YouTube URL', type: 'url', placeholder: 'https://youtube.com/yourchannel' },
    ],
    theme: [
      { key: 'primary_color', label: 'Primary Color', type: 'color', placeholder: '#059669' },
      { key: 'secondary_color', label: 'Secondary Color', type: 'color', placeholder: '#0D9488' },
    ],
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value, category');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getValue = (key: string): string => {
    const setting = settings.find(s => s.key === key);
    if (!setting) return '';
    try {
      return typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
    } catch {
      return setting.value || '';
    }
  };

  const handleChange = (key: string, value: string, category: string) => {
    setSettings(prev => {
      const existing = prev.find(s => s.key === key);
      if (existing) {
        return prev.map(s => s.key === key ? { ...s, value: JSON.stringify(value) } : s);
      }
      return [...prev, { key, value: JSON.stringify(value), category }];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const setting of settings) {
        await supabase
          .from('site_settings')
          .upsert({
            key: setting.key,
            value: setting.value,
            category: setting.category,
          }, { onConflict: 'key' });
      }
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
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
            <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
            <p className="text-gray-600 mt-1">Configure your store's global settings</p>
          </div>
        </div>
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
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-semibold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${activeTab === tab.id
                    ? 'border-emerald-700 text-emerald-700 bg-emerald-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <i className={`${tab.icon} text-xl`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          <div className="max-w-2xl space-y-6">
            {settingsConfig[activeTab]?.map((config) => (
              <div key={config.key}>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {config.label}
                </label>
                {config.type === 'textarea' ? (
                  <textarea
                    value={getValue(config.key)}
                    onChange={(e) => handleChange(config.key, e.target.value, activeTab)}
                    placeholder={config.placeholder}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  />
                ) : config.type === 'color' ? (
                  <div className="flex items-center space-x-4">
                    <input
                      type="color"
                      value={getValue(config.key) || config.placeholder}
                      onChange={(e) => handleChange(config.key, e.target.value, activeTab)}
                      className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={getValue(config.key)}
                      onChange={(e) => handleChange(config.key, e.target.value, activeTab)}
                      placeholder={config.placeholder}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                    />
                  </div>
                ) : (
                  <input
                    type={config.type}
                    value={getValue(config.key)}
                    onChange={(e) => handleChange(config.key, e.target.value, activeTab)}
                    placeholder={config.placeholder}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
