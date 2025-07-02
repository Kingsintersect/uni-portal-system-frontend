import { PaymentStatus } from "@/lib/definitions";
import { useState } from "react";
// import { PaymentStatus } from "./SetPaymentStatusRecord";

export const usePaymentStatus = () => {
	const [tuitionPaymentStatus, setTuitionPaymentStatus] =
		useState<PaymentStatus>(null);
	const [applicationPaymentStatus, setApplicationPaymentStatus] =
		useState<PaymentStatus>(null);
	const [acceptancePaymentStatus, setAcceptancePaymentStatus] =
		useState<PaymentStatus>(null);
	const [statusError, setStatusError] = useState<string | null>(null);
	const [tuitionAmount, setTuitionAmount] = useState("");

	const handleTuitionPaymentStatusChange = (status: string) => {
		setTuitionPaymentStatus(status as PaymentStatus);
		setStatusError(null);
	};

	const handleApplicationPaymentStatusChange = (status: string) => {
		setApplicationPaymentStatus(status as PaymentStatus);
		setStatusError(null);
	};

	const handleAcceptancePaymentStatusChange = (status: string) => {
		setAcceptancePaymentStatus(status as PaymentStatus);
		setStatusError(null);
	};

	const isTuitionAmountValid =
		(tuitionPaymentStatus === "1" && tuitionAmount.length > 0) ||
		(tuitionPaymentStatus === "0" && tuitionAmount.length < 1);

	const isApplicationStatusValid =
		applicationPaymentStatus === "1" || applicationPaymentStatus === "0";
	const isAcceptanceStatusValid =
		acceptancePaymentStatus === "1" || acceptancePaymentStatus === "0";

	return {
		tuitionPaymentStatus,
		applicationPaymentStatus,
		acceptancePaymentStatus,
		statusError,
		tuitionAmount,
		setTuitionAmount,
		handleTuitionPaymentStatusChange,
		handleApplicationPaymentStatusChange,
		handleAcceptancePaymentStatusChange,
		isTuitionAmountValid,
		isApplicationStatusValid,
		isAcceptanceStatusValid,
	};
};
