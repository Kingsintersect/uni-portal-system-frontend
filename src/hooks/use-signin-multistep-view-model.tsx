"use client";

import { CreateStudentAccount } from "@/app/actions/auth-actions";
import { GetAllProgram } from "@/app/actions/faculty.api";
import { APPLICATION_FEE, Gender, Nationality, State } from "@/config";
import { notify } from "@/contexts/ToastProvider";
import { extractErrorMessages } from "@/lib/errorsHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { FieldName, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";

export const SignupSchema = z
    .object({
        first_name: z.string().min(1, { message: "Required" }),
        last_name: z.string().min(1, { message: "Required" }),
        other_name: z.string().min(1, { message: "Required" }),
        username: z.string().min(1, { message: "Required" }),
        phone_number: z.string().min(1, { message: "Required" }),
        gender: z.string().refine((value) => value !== "", {
            message: "Your gender must be selected",
        }),
        dob: z.string().min(1, { message: "Required" }),
        nationality: z.string().refine((value) => value !== "", { message: "Required" }),
        state: z.string().refine((value) => value !== "", { message: "Required" }),
        hometown_address: z.string().min(1, { message: "Required" }),
        residential_address: z.string().min(1, { message: "Required" }),
        email: z.string().email({ message: "Please enter a valid email." }),
        password: z.string().min(6, { message: "Should be at least 6 characters long" }),
        password_confirmation: z.string(),
        department_id: z.string().min(1, { message: "Required" }),
        faculty_id: z.string().min(1, { message: "Required" }),
        amount: z.number().min(1, { message: "Required" }),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"],
    });

export type SignupFormData = z.infer<typeof SignupSchema>;
export type ProgramItem = { id: number; name: string; parent: number };

export interface Program {
    id: number;
    label: string;
    value: string;
}

const steps = [
    {
        id: 1,
        label: "Personal Info",
        fields: ["first_name", "last_name", "other_name", "phone_number", "gender", "nationality", "state", "hometown_address", "residential_address", "dob"],
    },
    {
        id: 2,
        label: "Account Credentials",
        fields: ["faculty_id", "department_id"],
    },
    {
        id: 3,
        label: "Application Data",
        fields: ["email", "username", "password", "password_confirmation"],
    },
    {
        id: 4,
        label: "Confirmation",
        fields: ["amount"],
    },
];

export default function useSignInMultiStepViewModel() {
    const [currentStep, setCurrentStep] = useState(1);
    const [previousStep, setPreviousStep] = useState(1);
    const delta = currentStep - previousStep;
    const router = useRouter();
    const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
    const [selectedProgramName, setSelectedProgramName] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        trigger,
        control,
        setValue,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(SignupSchema),
        mode: "onBlur",
    });

    // React Query - Get all programs
    // const { data: programData } = useQuery({
    //     queryKey: ["programs"],
    //     queryFn: async () => {
    //         const res = await GetAllProgram();
    //         const raw = res?.success?.data || {};
    //         setProgramList(raw);
    //         const lt = raw.filter(item => item.parent === 0)
    //             .map(item => ({
    //                 id: Number(item.id),
    //                 label: String(item.name.trim()),
    //                 value: String(item.id),
    //             }));
    //         return lt;
    //     },
    //     staleTime: 1000 * 60 * 30, // 30 minutes
    // });
    const { data: programData, isLoading: isProgramsLoading } = useQuery({
        queryKey: ["programs"],
        queryFn: GetAllProgram,
        select: (res) => res?.success?.data || [],
    });

    // Extract parents
    const parentPrograms = useMemo(() => {
        return (programData || [])
            .filter((item: ProgramItem) => item.parent === 0)
            .map((item) => ({
                id: item.id,
                label: item.name.trim(),
                value: String(item.id),
            }));
    }, [programData]);

    // Extract children based on selected program
    const childPrograms = useMemo(() => {
        return (programData || [])
            .filter((item: ProgramItem) => item.parent === selectedProgramId)
            .map((item) => ({
                id: item.id,
                label: item.name.trim(),
                value: String(item.id),
            }));
    }, [programData, selectedProgramId]);

    // Set selectedProgramId and setSelectedProgramName when user chooses from dropdown
    const handleProgramChange = useCallback((programId: string) => {
        const numericId = Number(programId);
        setSelectedProgramId(numericId);
        setValue("faculty_id", String(programId));

        const selectedProgram = parentPrograms.find((p) => p.id === numericId);
        setSelectedProgramName(selectedProgram?.label || null);
    }, [setValue, parentPrograms]);


    const signinMutation = useMutation({
        mutationFn: CreateStudentAccount,
        onSuccess: (res) => {
            notify({ message: "Successfully Created Account", variant: "success", timeout: 5000 });
            localStorage.setItem('application_data', JSON.stringify(res.success.data));
            router.push(res.success.data.authorizationUrl);
            reset();
            setCurrentStep(1);
        },
        onError: (error) => {
            const errorMessages = extractErrorMessages(error);
            errorMessages.forEach((msg) => {
                notify({ message: msg, variant: "error", timeout: 5000 });
            });
        },
    });

    const onSubmit = useCallback<SubmitHandler<SignupFormData>>((data, event) => {
        event?.preventDefault();
        signinMutation.mutate(data);
    }, [signinMutation]);

    const nextStep = useCallback(async () => {
        const fields = steps[currentStep - 1].fields;
        const isFieldsValid = await trigger(fields as FieldName<SignupFormData>[], { shouldFocus: true });

        if (!isFieldsValid) return;
        if (currentStep < steps.length) {
            setPreviousStep(currentStep);
            setCurrentStep((prev) => prev + 1);
        }

        // if (currentStep === steps.length) {
        //     await handleSubmit(onSubmit)();
        // }
    }, [currentStep, trigger]);

    const prevStep = useCallback(() => {
        if (currentStep > 1) {
            setPreviousStep(currentStep);
            setCurrentStep((step) => Math.max(step - 1, 1));
        }
    }, [currentStep]);

    const NewGender = useMemo(() => Gender, []);
    const NewNationality = useMemo(() => Nationality, []);
    const NewState = useMemo(() => State, []);

    return useMemo(() => ({
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        register,
        handleSubmit,
        onSubmit,
        watch,
        reset,
        setValue,
        errors,
        isSubmitting: signinMutation.isPending,
        control,
        delta,
        steps,
        NewGender,
        NewNationality,
        NewState,
        parentPrograms,
        childPrograms,
        selectedProgramId,
        selectedProgramName,
        isProgramsLoading,
        handleProgramChange,
        APPLICATION_FEE,
    }), [
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        register,
        handleSubmit,
        onSubmit,
        watch,
        reset,
        errors,
        signinMutation.isPending,
        control,
        setValue,
        delta,
        parentPrograms,
        childPrograms,
        selectedProgramId,
        selectedProgramName,
        handleProgramChange,
        isProgramsLoading,
        NewGender,
        NewNationality,
        NewState,
    ]);
}
