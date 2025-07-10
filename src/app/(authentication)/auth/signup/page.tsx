"use client";
import Stepper from "@/components/Stepper";
import { FormFieldSet, InputFormField, SelectFormField } from '@/components/ui/inputs/FormFields';
import { CheckCircle2, Loader2, SaveAll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { z } from "zod";
import useSignInMultiStepViewModel, { SignupSchema } from "@/hooks/use-signin-multistep-view-model";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatToCurrency } from "@/lib/utils";


type SignupFormData = z.infer<typeof SignupSchema>;
export default function SignupPage() {
    const {
        currentStep,
        nextStep,
        prevStep,
        NewGender,
        NewNationality,
        NewState,
        register,
        handleSubmit,
        onSubmit,
        control,
        errors,
        isSubmitting,
        steps,
        parentPrograms,
        childPrograms,
        selectedProgramId,
        isProgramsLoading,
        handleProgramChange,
        delta,
        APPLICATION_FEE,
    } = useSignInMultiStepViewModel();
    const isLastStep = currentStep === steps.length;

    return (
        <div className="block w-full space-y-1 text-left">
            <Stepper steps={steps} currentStep={currentStep} />

            <form
                onSubmit={isLastStep ? handleSubmit(onSubmit) : (e) => e.preventDefault()}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && currentStep !== steps.length) {
                        e.preventDefault();
                    }
                }}
                className={`block max-h-[450px] overflow-y-scroll overflow-x-hidden pr-5`}>
                {currentStep == 1 && (
                    <motion.div
                        initial={{ x: delta >= 1 ? '80%' : '-80%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <FormFieldSet classList={`bg-white border-0 py-2`} >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 my-4 gap-y-4">
                                <InputFormField<SignupFormData>
                                    type="text"
                                    id={'first_name'}
                                    label={"Your First Name"}
                                    name="first_name"
                                    register={register}
                                    error={errors.first_name}
                                />
                                <InputFormField<SignupFormData>
                                    type="text"
                                    id={'last_name'}
                                    label="Your Last Name"
                                    name="last_name"
                                    register={register}
                                    error={errors.last_name}
                                />
                                <InputFormField<SignupFormData>
                                    type="text"
                                    id={'other_name'}
                                    label="Other Names"
                                    name="other_name"
                                    register={register}
                                    error={errors.other_name}
                                />
                                <InputFormField<SignupFormData>
                                    classList=""
                                    type="text"
                                    id={'phone_number'}
                                    label="Phone Number"
                                    name="phone_number"
                                    register={register}
                                    error={errors.phone_number}
                                />
                                <SelectFormField<SignupFormData>
                                    name="gender"
                                    label={"Your Gender"}
                                    control={control}
                                    error={errors.gender}
                                    options={NewGender}
                                />
                                <InputFormField<SignupFormData>
                                    classList={"mt-5"}
                                    type="date"
                                    id={'dob'}
                                    label={"Your date of birth"}
                                    name="dob"
                                    register={register}
                                    error={errors.dob}
                                />
                                <SelectFormField<SignupFormData>
                                    name="nationality"
                                    label={"Country of origin"}
                                    control={control}
                                    error={errors.nationality}
                                    options={NewNationality.map(item => ({ value: String(item.value), label: String(item.value) }))}
                                />
                                <SelectFormField<SignupFormData>
                                    name="state"
                                    label={"State of origin"}
                                    control={control}
                                    error={errors.state}
                                    options={NewState.map(item => ({ value: String(item.value), label: String(item.value) }))}
                                />
                                <InputFormField<SignupFormData>
                                    type="text"
                                    id={'hometown_address'}
                                    label="Home Town Address"
                                    name="hometown_address"
                                    register={register}
                                    error={errors.hometown_address}
                                />
                                <InputFormField<SignupFormData>
                                    type="text"
                                    id={'residential_address'}
                                    label="Residential Address"
                                    name="residential_address"
                                    register={register}
                                    error={errors.residential_address}
                                />
                            </div>
                        </FormFieldSet>
                    </motion.div>
                )}
                {currentStep == 2 && (
                    <motion.div
                        initial={{ x: delta >= 1 ? '80%' : '-80%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        {isProgramsLoading ? (
                            <div className="flex items-center justify-center">
                                <Loader2 fontSize={20} size={20} className="animate-spin text-lg" />
                            </div>
                        ) : (
                            <FormFieldSet classList={`bg-white border-0`} >
                                <div className="mb-4">
                                    <SelectFormField<SignupFormData>
                                        name="faculty_id"
                                        label={"Select Programme of Study"}
                                        control={control}
                                        error={errors.faculty_id}
                                        options={parentPrograms.map(item => ({ value: String(item.value), label: String(item.label) }))}
                                        onValueSelect={handleProgramChange}
                                    />
                                </div>
                                {selectedProgramId && (<div className="mb-4">
                                    <SelectFormField<SignupFormData>
                                        name="department_id"
                                        label={"Select Department of Study"}
                                        control={control}
                                        error={errors.department_id}
                                        options={childPrograms.map(item => ({ value: String(item.value), label: String(item.label) }))}
                                    />
                                </div>
                                )}
                            </FormFieldSet>
                        )}
                    </motion.div>
                )}
                {currentStep == 3 && (
                    <motion.div
                        initial={{ x: delta >= 1 ? '80%' : '-80%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <FormFieldSet classList={`bg-white border-0`} >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">

                                <InputFormField<SignupFormData>
                                    classList={"md:col-span-2"}
                                    type="text"
                                    id={'email'}
                                    label="Email address"
                                    name="email"
                                    register={register}
                                    error={errors.email}
                                />
                                <InputFormField<SignupFormData>
                                    classList={"col-span-full"}
                                    type="text"
                                    id={'username'}
                                    label="Username"
                                    name="username"
                                    register={register}
                                    error={errors.username}
                                />
                                <InputFormField<SignupFormData>
                                    type="password"
                                    id={'password'}
                                    label="Your password"
                                    name="password"
                                    register={register}
                                    error={errors.password}
                                />
                                <InputFormField<SignupFormData>
                                    type="password"
                                    id={'password_confirmation'}
                                    label="Confirm your password"
                                    name="password_confirmation"
                                    register={register}
                                    error={errors.password_confirmation}
                                />
                            </div>
                        </FormFieldSet>
                    </motion.div>
                )}
                {currentStep == 4 && (
                    <motion.div
                        initial={{ x: delta >= 1 ? '80%' : '-80%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <FormFieldSet classList={`bg-white border-0`} >
                            <div className="flex items-center justify-center">
                                <Card className="w-full max-w-md">
                                    <CardHeader className="text-center">
                                        <CheckCircle2 className="mx-auto h-12 w-12 text-site-a-dark" />
                                        <CardTitle className="text-2xl font-bold text-gray-500">Your will be charged the sum of <br /><strong className="text-orange-500 text-3xl animate-pulse">{formatToCurrency(APPLICATION_FEE)}</strong> <br /> to purchae the admission form.</CardTitle>
                                        <CardDescription>

                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <InputFormField<SignupFormData>
                                            type="hidden"
                                            id={'amount'}
                                            label="Confirm your password"
                                            name="amount"
                                            register={register}
                                            error={errors.amount}
                                            value={APPLICATION_FEE}
                                            valueAsNumber={true}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </FormFieldSet>
                    </motion.div>
                )}

                <div className="mt-6 flex justify-between">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`px-4 py-1 bg-gray-300 rounded-md ${currentStep === 1 ? "hidden" : "block"}`}
                    >
                        ← Previous
                    </button>
                    <Button
                        type={isLastStep ? "submit" : "button"}
                        onClick={async (e) => {
                            if (!isLastStep) {
                                e.preventDefault();
                                await nextStep();
                            }
                        }}
                        className={`px-4 py-1 bg-site-b hover:bg-site-b-light text-white rounded-md ml-auto cursor-pointer ${isLastStep ? "w-[50%] text-lg font-bold" : ""}`}
                        disabled={isSubmitting}
                    >
                        {isLastStep ? (
                            <>
                                {isSubmitting ? (
                                    <>
                                        <span>{"Processing"}</span>
                                        <Loader2 fontSize={20} size={20} className="animate-spin text-lg" />
                                    </>
                                ) : (
                                    <span className="flex items-center gap-3">{"Submit"} <SaveAll size={36} strokeWidth={2.75} /></span>
                                )}
                            </>
                        ) : (
                            "Continue →"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
