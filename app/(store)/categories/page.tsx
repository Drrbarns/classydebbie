import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';

export const revalidate = 0; // Ensure fresh data on every visit

export default async function CategoriesPage() {
  const { data: categoriesData } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      description,
      image_url,
      position
    `)
    .eq('status', 'active')
    .order('position', { ascending: true });

  const categories = categoriesData?.map((c) => ({
    ...c,
    image: c.image_url || 'https://via.placeholder.com/800x600?text=Category',
  })) || [];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Collections"
        subtitle="Curated styles for every occasion"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className={`group relative overflow-hidden rounded-3xl cursor-pointer ${
                  index % 3 === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Background Image with Zoom Effect */}
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-serif text-3xl font-bold mb-3">{category.name}</h3>
                    <p className="text-white/80 text-base mb-6 line-clamp-2 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {category.description || 'Explore our exclusive collection in this category.'}
                    </p>
                    
                    <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b border-white/30 pb-1 group-hover:border-white transition-colors">
                      <span>Shop Collection</span>
                      <i className="ri-arrow-right-line transition-transform group-hover:translate-x-1"></i>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-3xl">
            <i className="ri-layout-masonry-line text-5xl text-gray-300 mb-4"></i>
            <p className="text-xl text-gray-500 font-serif">No collections found.</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            Looking for something specific?
          </h2>
          <p className="text-lg text-blue-800/70 mb-10 max-w-2xl mx-auto">
            Our personal shoppers are here to help you find the perfect piece for any occasion.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-blue-900 text-white px-8 py-4 rounded-full font-medium hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Browse All Products
            </Link>
            <Link
              href="/contact"
              className="bg-white text-blue-900 border border-blue-200 px-8 py-4 rounded-full font-medium hover:bg-blue-50 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
