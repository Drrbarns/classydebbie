export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern-noise.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-5xl font-serif font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Your privacy matters to us. Learn how Classy Debbie collects, uses, and protects your personal information.
            </p>
            <p className="text-sm text-blue-200 mt-4">Last updated: February 2026</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600">
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">1. Information We Collect</h2>
            
            <h3 className="text-xl font-bold mb-4 mt-8">1.1 Information You Provide</h3>
            <p className="mb-4">
              When you create an account, place an order for our mannequins, electronics, or fashion items, or contact us, we collect:
            </p>
            <ul className="space-y-2 mb-6 list-none pl-0">
              <li className="flex items-start gap-3">
                <i className="ri-checkbox-circle-line text-blue-600 mt-1"></i>
                <span><strong>Personal Details:</strong> Name, email address, phone number.</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-checkbox-circle-line text-blue-600 mt-1"></i>
                <span><strong>Delivery Information:</strong> Shipping and billing addresses.</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-checkbox-circle-line text-blue-600 mt-1"></i>
                <span><strong>Payment Details:</strong> Payment method information (securely processed by third-party providers).</span>
              </li>
            </ul>

            <h3 className="text-xl font-bold mb-4 mt-8">1.2 Information Collected Automatically</h3>
            <p className="mb-4">
              When you visit our website, we automatically collect device information, usage data, and cookies to improve your shopping experience.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">2. How We Use Your Information</h2>
            <p className="mb-6">
              We use your personal information for the following purposes:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 not-prose">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <i className="ri-shopping-bag-line text-blue-600"></i>
                  Order Fulfilment
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  To process and deliver your orders, send confirmations, and handle returns.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <i className="ri-customer-service-2-line text-blue-600"></i>
                  Customer Support
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  To respond to your inquiries regarding products, shipping, or account issues.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <i className="ri-mail-send-line text-blue-600"></i>
                  Communication
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  To send you updates about your order and, if you opt-in, newsletters about new arrivals.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <i className="ri-shield-check-line text-blue-600"></i>
                  Security
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  To protect against fraud and ensure the security of our platform.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">3. Data Security</h2>
            <p className="mb-6">
              We implement robust security measures to protect your personal information. All data transmitted between your browser and our servers is encrypted using SSL technology. We do not store your full payment card details.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">4. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this privacy policy, please contact us:
            </p>

            <div className="bg-blue-50 border border-blue-100 p-8 rounded-xl not-prose">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <i className="ri-mail-line text-blue-600 text-xl mt-1"></i>
                  <div>
                    <p className="font-bold text-gray-900">Email</p>
                    <a href="mailto:brownydebbie61@gmail.com" className="text-blue-600 hover:underline">brownydebbie61@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <i className="ri-phone-line text-blue-600 text-xl mt-1"></i>
                  <div>
                    <p className="font-bold text-gray-900">Phone</p>
                    <a href="tel:+233240556909" className="text-blue-600 hover:underline">024 055 6909</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <i className="ri-map-pin-line text-blue-600 text-xl mt-1"></i>
                  <div>
                    <p className="font-bold text-gray-900">Address</p>
                    <p className="text-gray-600">Accra, Ghana</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
