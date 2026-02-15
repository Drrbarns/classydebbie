export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern-noise.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-5xl font-serif font-bold mb-6">Terms & Conditions</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Please read these terms carefully before using Classy Debbie's website and services.
            </p>
            <p className="text-sm text-blue-200 mt-4">Last updated: February 2026</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600 prose-li:text-gray-600">
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">1. Agreement to Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our website or services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">2. Products & Pricing</h2>
            
            <h3 className="text-xl font-bold mb-4 mt-8">2.1 Product Information</h3>
            <p>
              We strive to display our products—including mannequins, electronics, and fashion items—as accurately as possible. However, we cannot guarantee that your device's display will accurately reflect product colors.
            </p>

            <h3 className="text-xl font-bold mb-4 mt-8">2.2 Pricing</h3>
            <p>
              All prices are listed in Ghana Cedis (GHS). We reserve the right to modify prices at any time without notice.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">3. Orders & Payment</h2>
            
            <h3 className="text-xl font-bold mb-4 mt-8">3.1 Order Acceptance</h3>
            <p>
              We reserve the right to refuse or cancel any order for reasons including product unavailability, pricing errors, or suspected fraud.
            </p>

            <h3 className="text-xl font-bold mb-4 mt-8">3.2 Payment</h3>
            <p>
              We accept Mobile Money (MTN, Vodafone, AirtelTigo), Visa/Mastercard, and Cash on Delivery for eligible orders. Payment must be received or confirmed before dispatch.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">4. Shipping & Delivery</h2>
            <p>
              Delivery times and costs vary by location. See our Shipping Policy for detailed information. We are not responsible for delays caused by circumstances beyond our control.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">5. Returns & Refunds</h2>
            <p>
              We offer a return policy for most products within 7 days of delivery. Items must be unused and in original packaging. Intimate apparel is non-returnable unless defective.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">6. Contact Information</h2>
            <p>
              For questions about these Terms and Conditions, please contact us:
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
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
