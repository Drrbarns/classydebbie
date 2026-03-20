import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAuth } from '@/lib/auth';

/**
 * DELETE a category.
 * Requires admin/staff auth. Uses service role so RLS does not block.
 */
export async function POST(req: Request) {
    try {
        const auth = await verifyAuth(req, { requireAdmin: true });
        if (!auth.authenticated) {
            return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const id = typeof body.id === 'string' ? body.id.trim() : '';

        if (!id) {
            return NextResponse.json({ error: 'Missing category id' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('[Admin] Delete category:', id, error);
            return NextResponse.json(
                { error: error.message || 'Could not delete category (e.g. in use by products)' },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[Admin] Categories delete error:', err);
        return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
    }
}
