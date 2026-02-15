'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import PageHero from '@/components/PageHero';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function WishlistPage() {
  usePageTitle('Wishlist');
  const { wishlist: wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const addAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => item.inStock);
    inStockItems.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        slug: item.slug || item.id,
        maxStock: 99,
        moq: 1
      });
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <PageHero 
        title="My Wishlist" 
        subtitle="Save your favorite items for later"
      />

      <section className="py-8 border-b border-gray-100 sticky top-[72px] bg-white/80 backdrop-blur-md z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center space-x-2 text-sm mb-1 text-gray-500">
                <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
                <span className="text-gray-900 font-medium">Wishlist</span>
              </nav>
              <p className="text-gray-900 font-medium">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <button
                onClick={addAllToCart}
                className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-2"
              >
                <i className="ri-shopping-bag-3-line"></i>
                Add All to Cart
              </button>
            )}
          </div>
        </div>
      </section>

      {wishlistItems.length === 0 ? (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="w-24 h-24 flex items-center justify-center mx-auto mb-8 bg-blue-50 rounded-full">
              <i className="ri-heart-line text-5xl text-blue-200"></i>
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-10 text-lg max-w-md mx-auto">
              Browse our collections and save your favorite items here to easily find them later.
            </p>
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Explore Products <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        </section>
      ) : (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {wishlistItems.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard 
                    {...product} 
                    slug={product.slug || product.id}
                    inStock={product.inStock ?? true} // Default to true if undefined
                  />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-red-50 hover:text-red-600 text-gray-400 transition-all z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                    title="Remove from wishlist"
                  >
                    <i className="ri-close-line text-lg"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-blue-50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-blue-100">
            <h2 className="text-3xl font-serif font-bold mb-4 text-gray-900">Share Your Wishlist</h2>
            <p className="text-gray-600 mb-8 text-lg">Found something you love? Let your friends and family know.</p>
            <div className="flex justify-center gap-4">
              <button className="w-12 h-12 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors">
                <i className="ri-facebook-fill text-xl"></i>
              </button>
              <button className="w-12 h-12 flex items-center justify-center bg-sky-100 hover:bg-sky-200 text-sky-600 rounded-full transition-colors">
                <i className="ri-twitter-x-fill text-xl"></i>
              </button>
              <button className="w-12 h-12 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-600 rounded-full transition-colors">
                <i className="ri-whatsapp-fill text-xl"></i>
              </button>
              <button className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors">
                <i className="ri-mail-fill text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
