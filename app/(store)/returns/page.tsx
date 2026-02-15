'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const mockOrders = [
  {
    id: 'ORD-2024-156',
    date: '2024-01-20',
    items: [
      {
        id: 1,
        name: 'Female Torso Mannequin - White',
        price: 450,
        image: 'https://via.placeholder.com/400x400?text=Mannequin',
        returnable: true
      },
      {
        id: 2,
        name: 'Elegant Evening Dress - Navy Blue',
        price: 280,
        image: 'https://via.placeholder.com/400x400?text=Dress',
        returnable: true
      }
    ]
  }
];

export default function ReturnsPortalPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [returnReasons, setReturnReasons] = useState<Record<number, string>>({});
  const [returnType, setReturnType] = useState<'refund' | 'exchange'>('refund');
  const [isLoading, setIsLoading] = useState(false);
  const [foundOrder, setFoundOrder] = useState<any>(null);

  const reasons = [
    'Wrong size/fit',
    'Wrong item received',
    'Defective/damaged item',
    'Not as described',
    'Changed my mind',
    'Better price elsewhere',
    'No longer needed',
    'Other'
  ];

  const handleFindOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setFoundOrder(mockOrders[0]);
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSubmitReturn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/returns/confirmation');
    }, 1500);
  };

  return (
    <>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Returns Portal</h1>
          <p className="text-gray-600 mb-8">Start your return or exchange process</p>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold shadow-sm ${
                    i <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {i < step ? <i className="ri-check-line"></i> : i}
                  </div>
                  {i < 3 && (
                    <div className={`flex-1 h-1 mx-4 rounded-full ${
                      i < step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm font-semibold text-gray-900">Find Order</span>
              <span className="text-sm font-semibold text-gray-900">Select Items</span>
              <span className="text-sm font-semibold text-gray-900">Submit</span>
            </div>
          </div>

          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Find Your Order</h2>
              <form onSubmit={handleFindOrder} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Order Number *
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    placeholder="ORD-2024-156"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="ri-loader-4-line animate-spin"></i> Finding Order...
                    </span>
                  ) : 'Find Order'}
                </button>
              </form>

              <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-start space-x-3">
                  <i className="ri-information-line text-xl text-blue-600 mt-0.5"></i>
                  <div className="text-sm text-blue-800">
                    <p className="font-bold mb-2 text-blue-900">Return Policy Highlights</p>
                    <ul className="space-y-1.5">
                      <li>• Returns accepted within 7 days of delivery</li>
                      <li>• Items must be unused with original tags/packaging</li>
                      <li>• Free return shipping for defective items</li>
                      <li>• Refunds processed within 5-7 business days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && foundOrder && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Select Items to Return</h2>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600 font-medium">
                  Order <span className="text-gray-900 font-bold">#{foundOrder.id}</span> • Placed on {foundOrder.date}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {foundOrder.items.map((item: any) => (
                  <div key={item.id} className={`border rounded-xl p-4 transition-colors ${selectedItems.includes(item.id) ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200'}`}>
                    <div className="flex items-start space-x-4">
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{item.name}</p>
                        <p className="text-lg font-bold text-blue-600 mb-3">GH₵{item.price.toFixed(2)}</p>
                        
                        {selectedItems.includes(item.id) && (
                          <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Reason for return *
                            </label>
                            <div className="relative">
                              <select
                                value={returnReasons[item.id] || ''}
                                onChange={(e) => setReturnReasons({
                                  ...returnReasons,
                                  [item.id]: e.target.value
                                })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                required
                              >
                                <option value="">Select a reason</option>
                                {reasons.map((reason) => (
                                  <option key={reason} value={reason}>{reason}</option>
                                ))}
                              </select>
                              <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  What would you like to do? *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setReturnType('refund')}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      returnType === 'refund'
                        ? 'border-blue-600 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600">
                      <i className="ri-refund-line text-xl"></i>
                    </div>
                    <p className="font-bold text-gray-900">Get a Refund</p>
                    <p className="text-sm text-gray-600 mt-1">Money back to original payment</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReturnType('exchange')}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      returnType === 'exchange'
                        ? 'border-blue-600 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3 text-purple-600">
                      <i className="ri-exchange-line text-xl"></i>
                    </div>
                    <p className="font-bold text-gray-900">Exchange Item</p>
                    <p className="text-sm text-gray-600 mt-1">Get a different size or color</p>
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedItems.length === 0 || !selectedItems.every(id => returnReasons[id])}
                  className="flex-1 py-4 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Review & Submit</h2>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Return Summary</h3>
                <div className="space-y-3">
                  {foundOrder.items
                    .filter((item: any) => selectedItems.includes(item.id))
                    .map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600 mt-1">Reason: <span className="font-medium text-blue-600">{returnReasons[item.id]}</span></p>
                        </div>
                        <p className="font-bold text-gray-900">GH₵{item.price.toFixed(2)}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="mb-8 p-6 border border-blue-100 bg-blue-50/50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="ri-list-check text-blue-600"></i> Next Steps
                </h3>
                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs mt-0.5">1</span>
                    <span>Print your prepaid return label (sent to your email)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs mt-0.5">2</span>
                    <span>Pack items securely in original packaging</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs mt-0.5">3</span>
                    <span>Attach the label and drop off at any shipping location</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs mt-0.5">4</span>
                    <span>Track your return status in your account</span>
                  </li>
                </ol>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitReturn}
                  disabled={isLoading}
                  className="flex-1 py-4 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="ri-loader-4-line animate-spin"></i> Submitting...
                    </span>
                  ) : 'Submit Return Request'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
