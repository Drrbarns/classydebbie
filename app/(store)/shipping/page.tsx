import Link from 'next/link';
import { useCMS } from '@/context/CMSContext';

export default function ShippingPage() {
  const deliveryOptions = [
    {
      type: 'Standard Delivery',
      time: '2-5 Business Days',
      cost: 'Calculated at checkout',
      description: 'Reliable delivery for all items, including mannequins and electronics.',
      icon: 'ri-truck-line'
    },
    {
      type: 'Express Delivery',
      time: 'Next Day',
      cost: 'Premium Rate',
      description: 'Available for Accra orders placed before 2pm.',
      icon: 'ri-rocket-line'
    },
    {
      type: 'Store Pickup',
      time: 'Same Day',
      cost: 'FREE',
      description: 'Collect from our store in Accra.',
      icon: 'ri-store-2-line'
    }
  ];

  const zones = [
    {
      zone: 'Zone 1 - Accra Metro',
      areas: 'East Legon, Osu, Labone, Airport, Dzorwulu, Cantonments, Adabraka, Tema',
      standard: '1-2 days',
      express: 'Next day'
    },
    {
      zone: 'Zone 2 - Greater Accra',
      areas: 'Madina, Legon, Haatso, Achimota, Dansoman, Spintex, Teshie, Kasoa',
      standard: '2-3 days',
      express: 'Next day'
    },
    {
      zone: 'Zone 3 - Major Cities',
      areas: 'Kumasi, Takoradi, Cape Coast, Tamale, Sunyani, Ho, Koforidua',
      standard: '3-4 days',
      express: '1-2 days'
    },
    {
      zone: 'Zone 4 - Other Areas',
      areas: 'All other locations within Ghana',
      standard: '4-5 days',
      express: 'Not available'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern-noise.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-5xl font-serif font-bold mb-6">Shipping & Delivery</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Fast, reliable delivery across Ghana. From delicate dresses to sturdy mannequins, we handle it with care.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Delivery Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {deliveryOptions.map((option, index) => (
              <div key={index} className="bg-white border border-gray-200 p-8 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all group">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <i className={`${option.icon} text-2xl text-blue-600 group-hover:text-white transition-colors`}></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{option.type}</h3>
                <div className="text-blue-700 font-bold text-xl mb-2">{option.cost}</div>
                <div className="text-gray-500 font-medium mb-4">{option.time}</div>
                <p className="text-gray-600 leading-relaxed">{option.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-8 mb-16 text-center">
          <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-200">
            <i className="ri-gift-line text-3xl text-white"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Free Standard Shipping</h3>
          <p className="text-lg text-gray-600">
            Spend GHS 500 or more and get <span className="font-bold text-sky-600">FREE standard delivery</span> anywhere in Ghana
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Delivery Zones & Timeframes</h2>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Zone</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Areas Covered</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Standard</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Express</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {zones.map((zone, index) => (
                    <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{zone.zone}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{zone.areas}</td>
                      <td className="px-6 py-4 text-gray-900">{zone.standard}</td>
                      <td className="px-6 py-4 text-gray-900">{zone.express}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">How Shipping Works</h2>
            <div className="space-y-8 relative">
              {/* Vertical Line */}
              <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gray-200"></div>

              <div className="flex gap-6 relative">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200 z-10">
                  <span className="font-bold text-white">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Order Processing</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Orders placed before 2pm are processed same day. We carefully pack your items - from fragile electronics to large mannequins - to ensure they arrive in perfect condition.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 relative">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200 z-10">
                  <span className="font-bold text-white">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Dispatch</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your order is handed to our trusted delivery partner. You'll receive a tracking number via email and SMS.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 relative">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200 z-10">
                  <span className="font-bold text-white">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Track Your Order</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Use your tracking number to monitor your delivery in real-time. You'll get updates at each stage.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 relative">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200 z-10">
                  <span className="font-bold text-white">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Delivery</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our delivery partner will contact you before arrival. Sign for your package and enjoy your purchase!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Important Information</h2>
            <div className="bg-gray-50 rounded-2xl p-8 space-y-6 border border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <i className="ri-time-line text-blue-600"></i>
                  Cut-off Times
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Orders placed before 2pm are dispatched same day. Orders after 2pm are dispatched next business day.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <i className="ri-calendar-line text-blue-600"></i>
                  Business Days
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Delivery timeframes exclude weekends and public holidays. We process orders Monday to Friday.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <i className="ri-phone-line text-blue-600"></i>
                  Delivery Contact
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Our delivery partner will call you before arrival. Please ensure your phone number is correct and reachable.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <i className="ri-box-3-line text-blue-600"></i>
                  Bulky Items
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  For large items like mannequins, our delivery team will assist with unloading. Please ensure there is clear access to your location.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-10 text-white text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold mb-4">Need Help with Your Delivery?</h2>
            <p className="text-blue-100 mb-8 leading-relaxed max-w-2xl mx-auto">
              Questions about shipping costs, delivery times, or tracking? Our customer service team is here to help.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors whitespace-nowrap shadow-lg"
              >
                Contact Support
              </Link>
              <Link
                href="/faqs"
                className="inline-flex items-center gap-2 bg-blue-700 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors whitespace-nowrap shadow-lg border border-blue-500"
              >
                View FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
