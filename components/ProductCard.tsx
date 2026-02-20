'use client';

import { useState } from 'react';
import Link from 'next/link';
import LazyImage from './LazyImage';
import { useCart } from '@/context/CartContext';

// Map common color names to hex values for swatches
const COLOR_MAP: Record<string, string> = {
  black: '#000000', white: '#FFFFFF', red: '#EF4444', blue: '#3B82F6',
  navy: '#1E3A5F', green: '#22C55E', yellow: '#EAB308', orange: '#F97316',
  pink: '#EC4899', purple: '#A855F7', brown: '#92400E', beige: '#D4C5A9',
  grey: '#6B7280', gray: '#6B7280', cream: '#FFFDD0', teal: '#14B8A6',
  maroon: '#800000', coral: '#FF7F50', burgundy: '#800020', olive: '#808000',
  tan: '#D2B48C', khaki: '#C3B091', charcoal: '#36454F', ivory: '#FFFFF0',
  gold: '#FFD700', silver: '#C0C0C0', rose: '#FF007F', lavender: '#E6E6FA',
  mint: '#98FB98', peach: '#FFDAB9', wine: '#722F37', denim: '#1560BD',
  nude: '#E3BC9A', camel: '#C19A6B', sage: '#BCB88A', rust: '#B7410E',
  mustard: '#FFDB58', plum: '#8E4585', lilac: '#C8A2C8', stone: '#928E85',
  sand: '#C2B280', taupe: '#483C32', mauve: '#E0B0FF', sky: '#87CEEB',
  forest: '#228B22', cobalt: '#0047AB', emerald: '#50C878', scarlet: '#FF2400',
  aqua: '#00FFFF', turquoise: '#40E0D0', indigo: '#4B0082', crimson: '#DC143C',
  magenta: '#FF00FF', cyan: '#00FFFF', chocolate: '#7B3F00', coffee: '#6F4E37',
};

export function getColorHex(colorName: string): string | null {
  const lower = colorName.toLowerCase().trim();
  if (COLOR_MAP[lower]) return COLOR_MAP[lower];
  // Try partial match (e.g. "Light Blue" -> "blue")
  for (const [key, val] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

export interface ColorVariant {
  name: string;
  hex: string;
}

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
  colorVariants?: ColorVariant[];
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
  minVariantPrice,
  colorVariants = []
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const displayPrice = hasVariants && minVariantPrice ? minVariantPrice : price;
  const discount = originalPrice ? Math.round((1 - displayPrice / originalPrice) * 100) : 0;
  const MAX_SWATCHES = 5;

  const formatPrice = (val: number) => `GH\u20B5${val.toFixed(2)}`;

  return (
    <div className="group relative flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 mb-4">
        <Link href={`/product/${slug}`} className="block w-full h-full">
          <LazyImage
            src={image}
            alt={name}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
        </Link>

        {/* Badges - Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {badge && (
            <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-sm">
              {badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Actions - Floating Bottom Right (always visible on touch, hover on desktop) */}
        {inStock && (
          <div className="absolute bottom-3 right-3 z-20 transform translate-y-0 opacity-100 md:translate-y-12 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300 ease-out">
            {hasVariants ? (
              <Link
                href={`/product/${slug}`}
                className="flex items-center justify-center w-10 h-10 bg-white text-gray-900 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors"
                title="Select Options"
              >
                <i className="ri-arrow-right-line text-lg"></i>
              </Link>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart({ id, name, price, image, quantity: moq, slug, maxStock, moq });
                }}
                className="flex items-center justify-center w-10 h-10 bg-white text-gray-900 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors"
                title="Add to Cart"
              >
                <i className="ri-shopping-bag-line text-lg"></i>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow space-y-1.5">
        {/* Color Swatches - Above Title */}
        {colorVariants.length > 0 && (
          <div className="flex items-center gap-1.5 mb-1 h-4">
            {colorVariants.slice(0, MAX_SWATCHES).map((color) => (
              <button
                key={color.name}
                title={color.name}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveColor(activeColor === color.name ? null : color.name);
                }}
                className={`w-3 h-3 rounded-full border border-gray-200 transition-all duration-200 ${
                  activeColor === color.name ? 'ring-1 ring-offset-1 ring-gray-900 scale-110' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {colorVariants.length > MAX_SWATCHES && (
              <span className="text-[10px] text-gray-400">+{colorVariants.length - MAX_SWATCHES}</span>
            )}
          </div>
        )}

        <Link href={`/product/${slug}`} className="group-hover:text-blue-600 transition-colors">
          <h3 className="font-medium text-gray-900 text-[15px] leading-snug line-clamp-2">
            {name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-serif text-lg font-bold text-gray-900">
            {hasVariants && minVariantPrice ? `From ${formatPrice(minVariantPrice)}` : formatPrice(price)}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through decoration-gray-300">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
