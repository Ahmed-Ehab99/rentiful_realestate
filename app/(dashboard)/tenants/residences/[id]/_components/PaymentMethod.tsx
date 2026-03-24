import { CreditCard, Edit, Mail } from "lucide-react";

const PaymentMethod = () => {
  return (
    <div className="mt-10 flex-1 overflow-hidden rounded-xl bg-white p-6 shadow-md md:mt-0">
      <h2 className="mb-4 text-2xl font-bold">Payment method</h2>
      <p className="mb-4">Change how you pay for your plan.</p>
      <div className="rounded-lg border p-6">
        <div>
          {/* Card Info */}
          <div className="flex gap-10">
            <div className="flex h-20 w-36 items-center justify-center rounded-md bg-blue-600">
              <span className="text-2xl font-bold text-white">VISA</span>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-5">
                  <h3 className="text-lg font-semibold">Visa ending in 2024</h3>
                  <span className="border-primary-700 text-primary-700 rounded-full border px-3 py-1 text-sm font-medium">
                    Default
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CreditCard className="mr-1 h-4 w-4" />
                  <span>Expiry • 26/06/2024</span>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="mr-1 h-4 w-4" />
                <span>billing@baseclub.com</span>
              </div>
            </div>
          </div>

          <hr className="my-4" />
          <div className="flex justify-end">
            <button className="hover:bg-primary-700 hover:text-primary-50 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700">
              <Edit className="mr-2 h-5 w-5" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
