export type PayTuitionFeeFormData = {
  fullAmount?: number;
  installmentAmount?: number;
  outstandingAmount?: number;
  paymentType: "full" | "installment" | "outstanding";
};
