import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendOrderConfirmation } from '@/lib/notifications';

// Ensure we use Service Role Key for admin-level updates (marking paid)
// This bypasses RLS policies which might block 'update' for anonymous users
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('Moolre Callback Received:', body);

        const {
            status,
            externalref, // This is our orderNumber
            reference,   // Moolre's reference
        } = body;

        if (!externalref) {
            console.error('Missing externalref (Order Number) in callback');
            return NextResponse.json({ success: false, message: 'Invalid callback data' }, { status: 400 });
        }

        // Verify payment success (flexible match)
        // Moolre might send 'success', 'completed', or 1
        const isSuccess = status === 'success' || status === 'completed' || status === 1;

        if (isSuccess) {
            console.log(`Processing successful payment for Order ${externalref}, Method: Moolre`);

            // Use RPC to Update Order Status (Works with Anon Key via Security Definer)
            const { data: orderJson, error: updateError } = await supabase
                .rpc('mark_order_paid', {
                    order_ref: externalref,
                    moolre_ref: reference
                });

            if (updateError) {
                console.error('Failed to update order via RPC:', updateError);
                return NextResponse.json({ success: false, message: 'Database update failed' }, { status: 500 });
            }

            if (!orderJson) {
                console.error('Order not found or update returned null:', externalref);
                return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
            }

            // Send notification directly
            try {
                console.log('Triggering Order Confirmation Notification...');
                await sendOrderConfirmation(orderJson); // RPC returns JSONB which matches shape
                console.log('Notification trigger completed.');
            } catch (notifyError) {
                console.error('Notification sent failed (Non-blocking):', notifyError);
            }

            return NextResponse.json({ success: true, message: 'Payment verified and Order Updated' });

        } else {
            // Payment failed or pending
            console.log(`Payment failed/pending for order ${externalref}, status: ${status}`);

            await supabase
                .from('orders')
                .update({
                    payment_status: 'failed',
                    metadata: {
                        moolre_reference: reference,
                        failure_reason: body.message || 'Payment failed'
                    }
                })
                .eq('order_number', externalref);

            return NextResponse.json({ success: false, message: 'Payment reported as not successful' });
        }

    } catch (error: any) {
        console.error('Callback Critical Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    return NextResponse.json({ message: 'Moolre callback endpoint ready' });
}
