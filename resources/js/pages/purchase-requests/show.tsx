import { Head, Link, usePage, router } from "@inertiajs/react";
import { ArrowLeft, Edit, Calendar, User, Printer, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem, type PageProps } from "@/types";
import {
  index as purchaseRequestsIndex,
  show as purchaseRequestsShow,
  edit as purchaseRequestsEdit,
} from "@/routes/purchase-requests";

interface PurchaseRequestItem {
  id: number;
  item_description: string;
  stock_no: number;
  unit: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
}

interface PurchaseRequest {
  id: number;
  pr_number: string;
  ris_number: string;
  status: "pending" | "approved";
  requested_date: string;
  purpose: string;
  ris_status: string;
  user: {
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  items: PurchaseRequestItem[];
}

interface Props {
  purchaseRequest: PurchaseRequest;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "secondary";
    case "approved":
      return "default";
    default:
      return "secondary";
  }
};

export default function Show({ purchaseRequest }: Props) {
  const { props } = usePage<PageProps>();
  const userRole = props.auth?.user?.role;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Purchase Requests",
      href: purchaseRequestsIndex().url,
    },
    {
      title: purchaseRequest.pr_number,
      href: purchaseRequestsShow(purchaseRequest.id).url,
    },
  ];

  // 🔹 Approve handler (for admin only)
  const handleApprove = () => {
    if (confirm("Are you sure you want to approve this Purchase Request?")) {
      router.post(`/purchase-requests/${purchaseRequest.id}/approve`);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Purchase Request - ${purchaseRequest.pr_number}`} />

      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        {/* Header buttons */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href={purchaseRequestsIndex().url}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Purchase Requests
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            {/* Print button */}
            {purchaseRequest.ris_status === "with" ? (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`/purchase-requests/${purchaseRequest.id}/print-with-ris`}
                  target="_blank"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print with RIS
                </a>
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`/purchase-requests/${purchaseRequest.id}/print`}
                  target="_blank"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </a>
              </Button>
            )}

            {/* Edit button (admin only) */}
            {userRole === "admin" && purchaseRequest.status !== "approved" && (
              <Link href={purchaseRequestsEdit(purchaseRequest.id).url}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
            )}

            {/* ✅ Approve button (admin only, not approved yet) */}
            {userRole === "admin" && purchaseRequest.status !== "approved" && (
              <Button
                variant="default"
                size="sm"
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Item Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between border-b border-forebackground">
                  <div>
                    <CardTitle className="text-xl">
                      {purchaseRequest.pr_number}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1 mb-2">
                      PR Number
                    </p>
                    <p className="text-muted-foreground mt-1 mb-2">
                      RIS number : {purchaseRequest.ris_number || "None"}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(purchaseRequest.status)}>
                    {purchaseRequest.status.charAt(0).toUpperCase() +
                      purchaseRequest.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <h3 className="font-medium mb-2">Item Details</h3>

                {purchaseRequest.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-2 gap-4 mb-4 border-b border-secondary"
                  >
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Item Description
                      </p>
                      <p className="font-medium">{item.item_description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Stock Number
                      </p>
                      <p className="font-medium">{item.stock_no}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unit</p>
                      <p className="font-medium">{item.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quantity</p>
                      <p className="font-medium">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unit Cost</p>
                      <p className="font-medium">
                        ₱
                        {item.unit_cost.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <p className="font-medium text-green-600 dark:text-green-400 mb-4">
                        ₱
                        {item.total_cost.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                <div>
                  <h3 className="font-medium mb-2">Purpose</h3>
                  <p className="text-sm leading-relaxed">
                    {purchaseRequest.purpose}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Meta Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Requested Date
                    </p>
                    <p className="font-medium">
                      {new Date(
                        purchaseRequest.requested_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Requested By
                    </p>
                    <p className="font-medium">{purchaseRequest.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {purchaseRequest.user.email}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(purchaseRequest.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {new Date(purchaseRequest.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
