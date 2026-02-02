'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface CMSBlock {
  id?: string;
  section: string;
  block_key: string;
  title: string;
  subtitle: string;
  content: string;
  image_url: string;
  button_text: string;
  button_url: string;
  metadata: Record<string, any>;
  is_active: boolean;
}

export default function HomepageEditorPage() {
  const [blocks, setBlocks] = useState<CMSBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeBlock, setActiveBlock] = useState('hero');

  const blockConfigs = [
    { key: 'hero', label: 'Hero Section', icon: 'ri-layout-top-line' },
    { key: 'featured_heading', label: 'Featured Products', icon: 'ri-star-line' },
    { key: 'categories_heading', label: 'Categories Section', icon: 'ri-grid-line' },
    { key: 'newsletter', label: 'Newsletter', icon: 'ri-mail-line' },
  ];

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_content')
        .select('*')
        .eq('section', 'homepage');

      if (error) throw error;

      // Initialize missing blocks with defaults
      const existingKeys = new Set(data?.map(b => b.block_key) || []);
      const defaultBlocks: CMSBlock[] = blockConfigs
        .filter(c => !existingKeys.has(c.key))
        .map(c => ({
          section: 'homepage',
          block_key: c.key,
          title: '',
          subtitle: '',
          content: '',
          image_url: '',
          button_text: '',
          button_url: '',
          metadata: {},
          is_active: true,
        }));

      setBlocks([...(data || []), ...defaultBlocks]);
    } catch (error) {
      console.error('Error fetching blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBlock = (key: string): CMSBlock => {
    return blocks.find(b => b.block_key === key) || {
      section: 'homepage',
      block_key: key,
      title: '',
      subtitle: '',
      content: '',
      image_url: '',
      button_text: '',
      button_url: '',
      metadata: {},
      is_active: true,
    };
  };

  const updateBlock = (key: string, field: string, value: any) => {
    setBlocks(prev => prev.map(b =>
      b.block_key === key ? { ...b, [field]: value } : b
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const block of blocks) {
        if (block.id) {
          await supabase
            .from('cms_content')
            .update({
              title: block.title,
              subtitle: block.subtitle,
              content: block.content,
              image_url: block.image_url,
              button_text: block.button_text,
              button_url: block.button_url,
              metadata: block.metadata,
              is_active: block.is_active,
            })
            .eq('id', block.id);
        } else {
          await supabase
            .from('cms_content')
            .insert({
              section: block.section,
              block_key: block.block_key,
              title: block.title,
              subtitle: block.subtitle,
              content: block.content,
              image_url: block.image_url,
              button_text: block.button_text,
              button_url: block.button_url,
              metadata: block.metadata,
              is_active: block.is_active,
            });
        }
      }
      alert('Homepage content saved successfully!');
      fetchBlocks();
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

  const currentBlock = getBlock(activeBlock);

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
            <h1 className="text-3xl font-bold text-gray-900">Homepage Editor</h1>
            <p className="text-gray-600 mt-1">Customize your store's homepage content</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/"
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
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Block Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Content Sections</h3>
            <div className="space-y-2">
              {blockConfigs.map((config) => (
                <button
                  key={config.key}
                  onClick={() => setActiveBlock(config.key)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeBlock === config.key
                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                    : 'hover:bg-gray-100 text-gray-700 border-2 border-transparent'
                    }`}
                >
                  <i className={`${config.icon} text-xl`}></i>
                  <span className="font-medium">{config.label}</span>
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
                {blockConfigs.find(c => c.key === activeBlock)?.label}
              </h3>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentBlock.is_active}
                  onChange={(e) => updateBlock(activeBlock, 'is_active', e.target.checked)}
                  className="w-5 h-5 text-emerald-700 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-gray-700 font-medium">Active</span>
              </label>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={currentBlock.title || ''}
                  onChange={(e) => updateBlock(activeBlock, 'title', e.target.value)}
                  placeholder="Enter section title"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={currentBlock.subtitle || ''}
                  onChange={(e) => updateBlock(activeBlock, 'subtitle', e.target.value)}
                  placeholder="Enter subtitle"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Content / Description
                </label>
                <textarea
                  value={currentBlock.content || ''}
                  onChange={(e) => updateBlock(activeBlock, 'content', e.target.value)}
                  placeholder="Enter content or description"
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                />
              </div>

              {activeBlock === 'hero' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Background Image
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentBlock.image_url || ''}
                        onChange={(e) => updateBlock(activeBlock, 'image_url', e.target.value)}
                        placeholder="https://example.com/hero-image.jpg"
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <input
                        type="file"
                        id="hero-image-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          try {
                            setSaving(true);
                            const fileName = `hero-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                            const { error: uploadError } = await supabase.storage
                              .from('media')
                              .upload(`uploads/${fileName}`, file, {
                                cacheControl: '3600',
                                upsert: false,
                              });

                            if (uploadError) throw uploadError;

                            const { data: urlData } = supabase.storage
                              .from('media')
                              .getPublicUrl(`uploads/${fileName}`);

                            updateBlock(activeBlock, 'image_url', urlData.publicUrl);
                          } catch (error) {
                            console.error('Error uploading image:', error);
                            alert('Failed to upload image');
                          } finally {
                            setSaving(false);
                            // Reset file input
                            e.target.value = '';
                          }
                        }}
                      />
                      <label
                        htmlFor="hero-image-upload"
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors cursor-pointer flex items-center whitespace-nowrap"
                      >
                        <i className="ri-upload-2-line mr-2"></i>
                        Upload
                      </label>
                    </div>
                    {currentBlock.image_url && (
                      <div className="mt-3 relative group">
                        <img
                          src={currentBlock.image_url}
                          alt="Hero Preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <button
                          onClick={() => updateBlock(activeBlock, 'image_url', '')}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          title="Remove Image"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Recommended size: 1920x1080px or larger. Supports JPG, PNG, WEBP.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={currentBlock.button_text || ''}
                    onChange={(e) => updateBlock(activeBlock, 'button_text', e.target.value)}
                    placeholder="e.g., Shop Now"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Button URL
                  </label>
                  <input
                    type="text"
                    value={currentBlock.button_url || ''}
                    onChange={(e) => updateBlock(activeBlock, 'button_url', e.target.value)}
                    placeholder="e.g., /shop"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
