import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAuth } from '@/lib/auth';

/**
 * DELETE products (single or bulk).
 * Requires admin/staff auth. Uses service role so RLS does not block.
 * Cleans up all foreign key references before deleting.
 */
export async function POST(req: Request) {
    try {
        const auth = await verifyAuth(req, { requireAdmin: true });
        if (!auth.authenticated) {
            return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const ids = Array.isArray(body.ids) ? body.ids : body.id ? [body.id] : [];

        if (ids.length === 0) {
            return NextResponse.json({ error: 'Missing product id(s)' }, { status: 400 });
        }

        const validIds = ids.filter((id: string) => typeof id === 'string' && id.length > 0);
        if (validIds.length === 0) {
            return NextResponse.json({ error: 'Invalid product id(s)' }, { status: 400 });
        }

        const errors: string[] = [];

        for (const productId of validIds) {
            // 1. Nullify order_items references (preserve order history)
            const { error: oiErr } = await supabaseAdmin
                .from('order_items')
                .update({ product_id: null })
                .eq('product_id', productId);
            if (oiErr) {
                console.error('[Admin] Nullify order_items.product_id:', oiErr.message);
                errors.push(`order_items: ${oiErr.message}`);
            }

            // 2. Delete cart items referencing this product
            const { error: cartErr } = await supabaseAdmin
                .from('cart_items')
                .delete()
                .eq('product_id', productId);
            if (cartErr) {
                console.error('[Admin] Delete cart_items:', cartErr.message);
            }

            // 3. Delete wishlist items referencing this product
            const { error: wishErr } = await supabaseAdmin
                .from('wishlist_items')
                .delete()
                .eq('product_id', productId);
            if (wishErr) {
                console.error('[Admin] Delete wishlist_items:', wishErr.message);
            }

            // 4. Delete reviews for this product
            const { error: revErr } = await supabaseAdmin
                .from('reviews')
                .delete()
                .eq('product_id', productId);
            if (revErr) {
                console.error('[Admin] Delete reviews:', revErr.message);
            }

            // 5. Delete product images
            const { error: imgErr } = await supabaseAdmin
                .from('product_images')
                .delete()
                .eq('product_id', productId);
            if (imgErr) {
                console.error('[Admin] Delete product_images:', imgErr.message);
            }

            // 6. Nullify order_items.variant_id for variants we're about to delete
            const { data: variants } = await supabaseAdmin
                .from('product_variants')
                .select('id')
                .eq('product_id', productId);

            if (variants && variants.length > 0) {
                const variantIds = variants.map((v: any) => v.id);
                await supabaseAdmin
                    .from('order_items')
                    .update({ variant_id: null })
                    .in('variant_id', variantIds);
            }

            // 7. Delete product variants
            const { error: varErr } = await supabaseAdmin
                .from('product_variants')
                .delete()
                .eq('product_id', productId);
            if (varErr) {
                console.error('[Admin] Delete product_variants:', varErr.message);
            }

            // 8. Finally delete the product itself
            const { error: delErr } = await supabaseAdmin
                .from('products')
                .delete()
                .eq('id', productId);

            if (delErr) {
                console.error('[Admin] Delete product:', productId, delErr.message);
                return NextResponse.json(
                    { error: `Failed to delete product: ${delErr.message}` },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json({ success: true, deleted: validIds.length });
    } catch (err: any) {
        console.error('[Admin] Products delete error:', err);
        return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
    }
}
