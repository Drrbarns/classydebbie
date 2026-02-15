'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const urlOrderNumber = searchParams.get('order') || '';
  
  const [orderNumber, setOrderNumber] = useState(urlOrderNumber);
  const [email, setEmail] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const urlEmail = searchParams.get('email') || '';
  
  useEffect(() => {
    if (urlOrderNumber && urlEmail) {
      setEmail(urlEmail);
      fetchOrder(urlOrderNumber, urlEmail);
    }
  }, [urlOrderNumber, urlEmail]);

  const fetchOrder = async (orderNum: string, verifyEmail?: string) => {
    const emailToVerify = verifyEmail || email;
    
    if (!emailToVerify) {
      setError('Please enter your email address to verify your identity.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          payment_status,
          total,
          email,
          created_at,
          shipping_address,
          metadata,
          order_items (
            id,
            product_name,
            variant_name,
            quantity,
            unit_price,
            metadata,
            products (
              product_images (url)
            )
          )
        `)
        .eq('order_number', orderNum)
        .single();

      if (fetchError || !data) {
        setError('Order not found. Please check your order number and try again.');
        setIsTracking(false);
        return;
      }

      if (data.email?.toLowerCase() !== emailToVerify.toLowerCase()) {
        setError('The email address does not match this order. Please use the email you placed the order with.');
        setIsTracking(false);
        return;
      }

      setOrder(data);
      setIsTracking(true);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!orderNumber) {
      setError('Please enter your order number');
      return;
    }

    if (!email) {
      setError('Please enter your email address for verification');
      return;
    }

    fetchOrder(orderNumber, email);
  };

  const getTrackingSteps = () => {
    if (!order) return [];

    const status = order.status || 'pending';
    const paymentStatus = order.payment_status || 'pending';

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);

    const steps = [
      {
        key: 'placed',
        title: 'Order Placed',
        description: 'Your order has been confirmed',
        date: new Date(order.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        icon: 'ri-checkbox-circle-line',
        status: 'completed' as const
      },
      {
        key: 'payment',
        title: 'Payment',
        description: paymentStatus === 'paid' ? 'Payment confirmed' : 'Awaiting payment',
        date: paymentStatus === 'paid' 
          ? (order.metadata?.payment_verified_at 
            ? new Date(order.metadata.payment_verified_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : 'Confirmed')
          : 'Pending',
        icon: 'ri-bank-card-line',
        status: paymentStatus === 'paid' ? 'completed' as const : 'pending' as const
      },
      {
        key: 'processing',
        title: 'Processing',
        description: 'Your order is being prepared',
        date: currentIndex >= 1 ? 'In progress' : 'Pending',
        icon: 'ri-box-3-line',
        status: currentIndex >= 1 ? 'completed' as const : currentIndex === 0 && paymentStatus === 'paid' ? 'active' as const : 'pending' as const
      },
      {
        key: 'shipped',
        title: 'On the Way',
        description: 'Your order is out for delivery',
        date: currentIndex >= 2 ? 'Dispatched' : 'Pending',
        icon: 'ri-truck-line',
        status: currentIndex >= 2 ? 'completed' as const : currentIndex === 1 ? 'active' as const : 'pending' as const
      },
      {
        key: 'delivered',
        title: 'Delivered',
        description: 'Your order has arrived',
        date: currentIndex >= 3 ? 'Delivered' : 'Pending',
        icon: 'ri-home-smile-line',
        status: currentIndex >= 3 ? 'completed' as const : currentIndex === 2 ? 'active' as const : 'pending' as const
      }
    ];

    return steps;
  };

  const getStatusBadge = () => {
    if (!order) return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    
    const statusMap: Record<string, { label: string; color: string }> = {
      'pending': { label: 'Pending', color: 'bg-amber-100 text-amber-800' },
      'processing': { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
      'shipped': { label: 'Out for Delivery', color: 'bg-purple-100 text-purple-800' },
      'delivered': { label: 'Delivered', color: 'bg-green-100 text-green-800' },
      'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-800' }
    };

    return statusMap[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };
  };

  if (!isTracking || !order) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Track Your Order</h1>
            <p className="text-gray-600 text-lg">Enter your order details to see real-time updates.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <form onSubmit={handleTrack} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="e.g. ORD-123456"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Email Address <span className="text-red-500 font-normal">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="you@example.com"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <i className="ri-error-warning-line text-red-600 mt-0.5"></i>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Searching...
                  </span>
                ) : 'Track Order'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-start space-x-4 bg-blue-50 p-6 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600">
                  <i className="ri-information-line text-xl"></i>
                </div>
                <div>
                  <p className="font-bold text-blue-900 mb-1">Where can I find my order number?</p>
                  <p className="text-sm text-blue-800/80 leading-relaxed">
                    Check the confirmation email or SMS sent to you after placing your order. It usually starts with "ORD-".
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-gray-500 hover:text-blue-600 font-medium inline-flex items-center gap-2 transition-colors">
              <i className="ri-arrow-left-line"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const trackingSteps = getTrackingSteps();
  const statusBadge = getStatusBadge();
  const trackingNumber = order.metadata?.tracking_number || '';
  const shippingAddress = order.shipping_address || {};
  const estimatedDelivery = new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000)
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => { setIsTracking(false); setOrder(null); setOrderNumber(''); setEmail(''); }}
            className="text-gray-500 hover:text-blue-600 font-medium inline-flex items-center gap-2 transition-colors"
          >
            <i className="ri-arrow-left-line"></i>
            Track Another Order
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 pb-8 border-b border-gray-100">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Order #{order.order_number}</h1>
              {trackingNumber && (
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="font-medium">Tracking Number:</span>
                  <span className="font-mono bg-gray-100 px-3 py-1 rounded text-sm text-gray-800">{trackingNumber}</span>
                </p>
              )}
              <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
                <i className="ri-calendar-event-line"></i>
                Estimated Delivery: <span className="font-medium text-gray-900">{estimatedDelivery}</span>
              </p>
            </div>
            <div className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider ${statusBadge.color}`}>
              {statusBadge.label}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm text-blue-600">
                  <i className="ri-map-pin-line text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Shipping To</p>
                  <p className="font-bold text-gray-900">
                    {shippingAddress.city || shippingAddress.region || 'Ghana'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm text-blue-600">
                  <i className="ri-money-dollar-circle-line text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                  <p className="font-bold text-gray-900">GH₵ {Number(order.total).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm text-blue-600">
                  <i className="ri-shopping-bag-3-line text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Items</p>
                  <p className="font-bold text-gray-900">
                    {order.order_items?.length || 0} Product{(order.order_items?.length || 0) !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="relative pl-4 md:pl-0">
            {trackingSteps.map((step, index) => (
              <div key={step.key} className="flex items-start mb-10 last:mb-0 group">
                <div className="relative flex flex-col items-center mr-8">
                  <div className={`w-14 h-14 flex items-center justify-center rounded-full font-bold transition-all duration-500 z-10 ${
                    step.status === 'completed'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110'
                      : step.status === 'active'
                      ? 'bg-white text-blue-600 border-4 border-blue-600 shadow-xl scale-110'
                      : 'bg-gray-100 text-gray-400 border-4 border-white'
                  }`}>
                    <i className={`${step.icon} text-xl`}></i>
                  </div>
                  {index < trackingSteps.length - 1 && (
                    <div className={`absolute top-14 bottom-[-40px] w-1 transition-colors duration-500 ${
                      step.status === 'completed' ? 'bg-blue-600' : 'bg-gray-100'
                    }`}></div>
                  )}
                </div>
                <div className={`flex-1 pt-2 transition-opacity duration-500 ${
                  step.status === 'pending' ? 'opacity-50' : 'opacity-100'
                }`}>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    {step.description}
                  </p>
                  <p className="text-sm font-medium text-blue-600">
                    {step.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif">Order Items</h2>
          <div className="space-y-4">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="flex items-center space-x-6 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                  {item.products?.product_images?.[0]?.url || item.metadata?.image ? (
                    <img
                      src={item.products?.product_images?.[0]?.url || item.metadata?.image}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <i className="ri-image-line text-2xl text-gray-300"></i>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{item.product_name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="bg-white px-2 py-1 rounded border border-gray-200">Qty: {item.quantity}</span>
                    {item.variant_name && (
                      <span className="bg-white px-2 py-1 rounded border border-gray-200">{item.variant_name}</span>
                    )}
                  </div>
                </div>
                <p className="font-bold text-blue-700 text-lg">GH₵ {Number(item.unit_price).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">Need help with your order?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
              <i className="ri-customer-service-line text-blue-600"></i>
              Contact Support
            </Link>
            <Link href="/returns" className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
              <i className="ri-arrow-left-right-line text-blue-600"></i>
              Returns Policy
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading tracking...</p>
        </div>
      </main>
    }>
      <OrderTrackingContent />
    </Suspense>
  );
}
