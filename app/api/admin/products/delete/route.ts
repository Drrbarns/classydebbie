import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAuth } from '@/lib/auth';

/**
 * DELETE products (single or bulk).
 * Requires admin/staff auth. Uses service role so RLS does not block.
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

        for (const productId of validIds) {
            const { error: imgErr } = await supabaseAdmin
                .from('product_images')
                .delete()
                .eq('product_id', productId);
            if (imgErr) {
                console.error('[Admin] Delete product_images:', imgErr);
            }

            const { error: varErr } = await supabaseAdmin
                .from('product_variants')
                .delete()
                .eq('product_id', productId);
            if (varErr) {
                console.error('[Admin] Delete product_variants:', varErr);
            }

            const { error: delErr } = await supabaseAdmin
                .from('products')
                .delete()
                .eq('id', productId);

            if (delErr) {
                console.error('[Admin] Delete product:', productId, delErr);
                return NextResponse.json(
                    { error: delErr.message || 'Could not delete product (e.g. already used in orders)' },
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
