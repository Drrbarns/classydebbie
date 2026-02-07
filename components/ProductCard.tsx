'use client';

import Link from 'next/link';
import LazyImage from './LazyImage';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  inStock?: boolean;
  maxStock?: number;
  moq?: number;
  hasVariants?: boolean;
  minVariantPrice?: number;
}

export default function ProductCard({
  id,
  slug,
  name,
  price,
  originalPrice,
  image,
  rating = 5,
  reviewCount = 0,
  badge,
  inStock = true,
  maxStock = 50,
  moq = 1,
  hasVariants = false,
  minVariantPrice
}: ProductCardProps) {
  const { addToCart } = useCart();
  const displayPrice = hasVariants && minVariantPrice ? minVariantPrice : price;
  const discount = originalPrice ? Math.round((1 - displayPrice / originalPrice) * 100) : 0;

  const formatPrice = (val: number) => `GH\u20B5${val.toFixed(2)}`;

  return (
    <div className="group bg-transparent rounded-lg h-full flex flex-col hover-lift">
      <Link href={`/product/${slug}`} className="relative block aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-4 shadow-sm group-hover:shadow-xl transition-all duration-300">
        <LazyImage
          src={image}
          alt={name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {badge && (
            <span className="bg-white/90 backdrop-blur text-gray-900 border border-gray-100 text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-md shadow-sm">
              {badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-50 text-red-700 border border-red-100 text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-md shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        {!inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium">Out of Stock</span>
          </div>
        )}

        {inStock && (
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden lg:block">
            {hasVariants ? (
              <span className="w-full bg-white text-gray-900 hover:bg-gray-900 hover:text-white py-3 rounded-lg font-medium shadow-lg transition-colors flex items-center justify-center space-x-2 text-sm">
                <i className="ri-list-check"></i>
                <span>Select Options</span>
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart({ id, name, price, image, quantity: moq, slug, maxStock, moq });
                }}
                className="w-full bg-white text-gray-900 hover:bg-gray-900 hover:text-white py-3 rounded-lg font-medium shadow-lg transition-colors flex items-center justify-center space-x-2 text-sm"
              >
                <i className="ri-shopping-cart-2-line"></i>
                <span>{moq > 1 ? `Add ${moq} to Cart` : 'Quick Add'}</span>
              </button>
            )}
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-grow">
        <Link href={`/product/${slug}`}>
          <h3 className="font-serif text-lg leading-tight text-gray-900 mb-1 group-hover:text-emerald-800 transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>

        <div className="flex items-baseline space-x-2 mb-2">
          {hasVariants && minVariantPrice ? (
            <span className="text-gray-900 font-semibold">From {formatPrice(minVariantPrice)}</span>
          ) : (
            <span className="text-gray-900 font-semibold">{formatPrice(price)}</span>
          )}
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(originalPrice)}</span>
          )}
        </div>

        <div className="mt-auto pt-2 lg:hidden">
          {hasVariants ? (
            <Link
              href={`/product/${slug}`}
              className="w-full border border-gray-200 text-gray-900 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center space-x-1"
            >
              <i className="ri-list-check text-sm"></i>
              <span>Select Options</span>
            </Link>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart({ id, name, price, image, quantity: moq, slug, maxStock, moq });
              }}
              disabled={!inStock}
              className="w-full border border-gray-200 text-gray-900 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {moq > 1 ? `Add ${moq} to Cart` : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
