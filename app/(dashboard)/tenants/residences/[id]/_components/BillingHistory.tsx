import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeasePaymentsType } from "@/lib/queries/lease.queries";
import { ArrowDownToLineIcon, Check, Download, FileText } from "lucide-react";

const BillingHistory = ({ payments }: { payments: LeasePaymentsType }) => {
  console.log(payments);
  return (
    <div className="mt-8 overflow-hidden rounded-xl bg-white p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-2xl font-bold">Billing History</h2>
          <p className="text-sm text-gray-500">
            Download your previous plan receipts and usage details.
          </p>
        </div>
        <div>
          <button className="hover:bg-primary-700 hover:text-primary-50 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700">
            <Download className="mr-2 h-5 w-5" />
            <span>Download All</span>
          </button>
        </div>
      </div>
      <hr className="mt-4 mb-1" />
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Billing Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments?.map((payment) => (
              <TableRow key={payment.id} className="h-16">
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Invoice #{payment.id} -{" "}
                    {payment.paymentDate
                      ? new Date(payment.paymentDate).toLocaleString(
                          "default",
                          {
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "—"}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-semibold ${
                      payment.paymentStatus === "Paid"
                        ? "border-green-300 bg-green-100 text-green-800"
                        : "border-yellow-300 bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payment.paymentStatus === "Paid" ? (
                      <Check className="mr-1 inline-block h-4 w-4" />
                    ) : null}
                    {payment.paymentStatus}
                  </span>
                </TableCell>
                <TableCell>
                  {payment.paymentDate
                    ? new Date(payment.paymentDate).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell>${payment.amountPaid.toFixed(2)}</TableCell>
                <TableCell>
                  <button className="hover:bg-primary-700 hover:text-primary-50 flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 font-semibold text-gray-700">
                    <ArrowDownToLineIcon className="mr-1 h-4 w-4" />
                    Download
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BillingHistory;
