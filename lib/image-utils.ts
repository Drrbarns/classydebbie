import { supabase } from './supabase';

/**
 * Normalize product image URL.
 * Ensures Supabase storage URLs are properly formatted and accessible.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return 'https://via.placeholder.com/800x800?text=No+Image';
  }

  const trimmed = url.trim();

  // If it's already a full URL (http/https), return as-is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If it's a relative path to Supabase storage, construct full URL
  // Example: "products/image.jpg" -> full Supabase URL
  if (trimmed.startsWith('products/') || !trimmed.includes('/')) {
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(trimmed.replace('products/', ''));
    return publicUrl;
  }

  // Fallback to placeholder
  return 'https://via.placeholder.com/800x800?text=No+Image';
}

/**
 * Get the first product image URL, with fallback.
 */
export function getProductImageUrl(
  productImages: Array<{ url: string; position?: number }> | null | undefined,
  fallback?: string
): string {
  if (!productImages || productImages.length === 0) {
    return fallback || 'https://via.placeholder.com/800x800?text=No+Image';
  }

  // Sort by position if available, otherwise use first
  const sorted = [...productImages].sort((a, b) => {
    const posA = a.position ?? 999;
    const posB = b.position ?? 999;
    return posA - posB;
  });

  const firstImage = sorted[0];
  return normalizeImageUrl(firstImage?.url) || fallback || 'https://via.placeholder.com/800x800?text=No+Image';
}
