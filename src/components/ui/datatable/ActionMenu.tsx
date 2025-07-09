"use client";
import {
  MoreHorizontal,
  Trash,
  Settings,
  Copy,
  LucideIcon,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import React, { useState } from "react";
import { useSession } from "@/contexts/SessionContext ";
import { notify } from "@/contexts/ToastProvider";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/generic.types";
import { remoteApiUrl } from "@/config";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { saveAs } from 'file-saver';
import { generatePaymentInvoice } from "@/app/actions/student";
import { toast } from "react-toastify";

interface DropMenu {
  title: string;
  url?: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

export type PaymentRowType = {
  id: string;
  status: string;
  session: string;
  date: string;
  amount: string;
  type: string;
  reference: string;
};

export type BaseRowType = {
  id: string;
  
};

interface ActionMenuProps<TData extends BaseRowType> {
  row: TData;
  onCopy?: (id: string) => void;
  onDelete?: (access_token: string, id: string) => Promise<ApiResponse<TData>>;
  onClick?: (access_token: string, id: string) => Promise<ApiResponse<any>>;
  onSuccess?: () => void;
  menu?: DropMenu[];
  isPaymentRow?: boolean;
}

export function ActionMenu<TData extends BaseRowType>({
  row,
  onCopy,
  onDelete,
  onClick,
  menu = [],
  onSuccess,
  isPaymentRow = false,
}: ActionMenuProps<TData>) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSession();

  const handleDelete = async () => {
    if (!session?.access_token) {
      notify({
        message: "Token has expired.",
        variant: "error",
        timeout: 5000,
      });
      router.push("/auth/signin");
      return;
    }
    setIsLoading(true);
    try {
      const result = (await onDelete?.(session.access_token, row.id)) ?? {
        success: false,
        error: "Unknown error",
      };
      const { success, error } = result;

      if (success)
        notify({
          message: "Record Deleted Successfully",
          variant: "success",
          timeout: 5000,
        });
      if (error)
        notify({
          message: "Record Could not be Deleted",
          variant: "error",
          timeout: 5000,
        });
      setIsModalOpen(false);
      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error("Error deleting record:", error);
      notify({
        message: "Failed to delete record.",
        variant: "error",
        timeout: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
     if (!isPaymentRow) return;
    
    // Type cast to PaymentRowType since we checked isPaymentRow
    const paymentRow = row as unknown as PaymentRowType;
    setIsLoading(true);
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      // Load your logo
    const logoUrl = '/logo/logo2.png';
    const logoResponse = await fetch(logoUrl);
    const logoBytes = await logoResponse.arrayBuffer();
    const logoImage = await pdfDoc.embedPng(logoBytes);
      
      // Embed fonts
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // Add a new page
      const page = pdfDoc.addPage([600, 800]);

      page.drawImage(logoImage, {
      x: 400,
      y: 730,
      width: 150,
      height: 50,
    });
      
      // Draw header
      page.drawText('INVOICE', {
        x: 50,
        y: 750,
        size: 24,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      
      // Draw school information
      page.drawText('Chukwuemeka Odumegwu Ojukwu University', {
        x: 50,
        y: 700,
        size: 14,
        font: fontBold,
      });
      
      page.drawText('123 School Address', {
        x: 50,
        y: 680,
        size: 12,
        font,
      });
      
      page.drawText('City, State, ZIP', {
        x: 50,
        y: 660,
        size: 12,
        font,
      });
      
      // Draw invoice details
      const invoiceDetails = [
        { label: 'Invoice Number', value: paymentRow.reference },
        { label: 'Date Issued', value: new Date(paymentRow.date).toLocaleDateString() },
        { label: 'Payment Type', value: paymentRow.type === 'tuition' ? 'Tuition Fee' : 'Application Fee' },
        { label: 'Academic Session', value: paymentRow.session },
        { label: 'Status', value: paymentRow.status.charAt(0).toUpperCase() + paymentRow.status.slice(1) },
      ];
      
      let yPosition = 600;
      invoiceDetails.forEach(({ label, value }) => {
        page.drawText(`${label}:`, {
          x: 50,
          y: yPosition,
          size: 12,
          font: fontBold,
        });
        
        page.drawText(value, {
          x: 200,
          y: yPosition,
          size: 12,
          font,
        });
        
        yPosition -= 25;
      });
      
      // Draw payment amount
      yPosition -= 30;
      page.drawText('Amount:', {
        x: 50,
        y: yPosition,
        size: 16,
        font: fontBold,
      });
      
      page.drawText(`NGN ${parseFloat(paymentRow.amount).toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`, {
        x: 200,
        y: yPosition,
        size: 16,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      
      // Draw footer
      page.drawText('Thank you for your payment!', {
        x: 50,
        y: 100,
        size: 12,
        font,
      });
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const uint8Array = new Uint8Array(pdfBytes);
      const blob = new Blob([uint8Array], { type: 'application/pdf' });
      saveAs(blob, `invoice-${paymentRow.reference}.pdf`);
      
      toast.success("Invoice generated successfully");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
            <span className="sr-only">Open menu</span>
            {isLoading ? (
              <div className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent style={{ position: "relative" }} align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy?.(row.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>

          {onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsModalOpen(true)}
                className="text-red-500"
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </>
          )}

          {menu.map((item, index) => (
            <React.Fragment key={index}>
              <DropdownMenuSeparator />
              {item.url ? (
                <DropdownMenuItem asChild>
                  <Link href={item.url} className="flex items-center">
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={item.title === "Generate Invoice" 
                    ? handleGenerateInvoice 
                    : item.onClick
                  }
                  className="flex items-center cursor-pointer"
                  disabled={isLoading}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.title}
                </DropdownMenuItem>
              )}
            </React.Fragment>
          ))}

          {onClick && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const result = await onClick(session.access_token, row.id);
                    if (result?.success?.shouldRedirect) {
                      router.push(`/dashboard/teacher/courses/${row.id}`);
                    }
                  } catch (error) {
                    notify({
                      message: "Failed to view details",
                      variant: "error",
                      timeout: 5000,
                    });
                  }
                }}
                className="cursor-pointer"
              >
                <Eye className="h-4 w-4 mr-2" /> View Details
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>
            This action cannot be undone. This will permanently delete this
            record.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}