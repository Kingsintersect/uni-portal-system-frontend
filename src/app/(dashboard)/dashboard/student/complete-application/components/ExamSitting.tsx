import React, { FC } from 'react'
import { CompleteApplicationFormData, CompleteApplicationProps } from '../studentApplication.types';
import { InputFormField, SelectFormField } from '@/components/ui/inputs/FormFields';
import ComboBox from '@/components/application/ComboBox';
import { FieldError } from 'react-hook-form';

import { Control } from 'react-hook-form';

interface ExamSitting extends CompleteApplicationProps {
   id: string,
   name: string,
   title: string,
   result: { value: string | number; label: string; }[],
   years: { value: string | number; label: string; }[],
   required?: boolean,
   control: Control<CompleteApplicationFormData>,
}

const ExamSitting: FC<ExamSitting> = ({ register, errors, control, id, name, title, result, years, required = false }) => {

   const examType = name + '_type';
   const examYear = name + '_year';
   const examNumber = name + '_exam_number';

   return (
      <div className={id}>
         <h3 className="text-lg text-blue-700 font-bold">{title} {required && <span className='text-red-600 text-3xl'>*</span>}</h3>
         <div className={` homee ${examType} --- ${examYear} ---- ${examNumber}`}>
            <div className="grid grid-cols-1 gap-4 mt-2">
               <SelectFormField<CompleteApplicationFormData>
                  name={examType as keyof CompleteApplicationFormData}
                  label={"Exam type"}
                  placeholder={"Choose exam type"}
                  control={control!}
                  // options={result.map((item) => ({ value: String(item.value), label: item.label }))}
                  error={errors[examType as keyof CompleteApplicationFormData] as FieldError | undefined}
                  options={result.filter(item => item.value && item.label).map(item => ({
                     value: String(item.value),
                     label: item.label,
                  }))}
               />
               <SelectFormField<CompleteApplicationFormData>
                  name={examYear as keyof CompleteApplicationFormData}
                  label={"Exam Year"}
                  placeholder={"Select exam year"}
                  control={control!}
                  // options={years.map((item) => ({ value: String(item.value), label: item.label }))}
                  error={errors[examYear as keyof CompleteApplicationFormData] as FieldError | undefined}
                  options={years.filter(item => item.value && item.label).map(item => ({
                     value: String(item.value),
                     label: item.label,
                  }))}
               />
               <InputFormField<CompleteApplicationFormData>
                  type="text"
                  id={examNumber}
                  label={"Fill in your exam number"}
                  name={examNumber as keyof CompleteApplicationFormData}
                  register={register}
                  error={errors[examNumber as keyof CompleteApplicationFormData] as FieldError | undefined}
               />

               <div className="grid grid-cols-1 my-7">
                  <ComboBox key={name} identifire={name} />
               </div>
            </div>
         </div>
      </div >
   )
}

export default ExamSitting