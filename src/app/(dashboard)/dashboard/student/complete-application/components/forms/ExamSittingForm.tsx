"use client";
import React, { FC, useState } from 'react'
import { useAppContext } from '@/contexts/AppContext';
import { OLevels, Years } from '@/config';
import QualificationPhotoForm from './QualificationPhotoForm';
import { UploadFirstSittingResult, UploadSecondSittingResult } from '@/app/actions/student';
import { CheckBoxFormField } from '@/components/ui/inputs/FormFields';
import SwitchToggle from '@/components/ui/inputs/SwitchToggle';
import Fade from '@/components/application/animatives/Fade';
import { ExamSittingFormProps } from '../../studentApplication.types';
import ExamSitting from '../ExamSitting';


const ExamSittingForm: FC<ExamSittingFormProps> = ({ register, errors, control, firstResultError, secondResultError }) => {
   const { state, setExamSittingState } = useAppContext();
   const [awaitingResult, setAwaitingResult] = useState(true);

   const handleAwaitingResultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setAwaitingResult(!isChecked);
      if (isChecked && state.examSittingState) {
         setExamSittingState(false);
      }
   };

   const handleSecondSittingToggle = () => {
      if (awaitingResult) {
         setExamSittingState(!state.examSittingState);
      }
   };


   return (
      <div className="form-content mt-10 text-left grid md:grid-cols-2 gap-10">
         <div className="head col-span-2 bg-orange-100 rounded-lg">
            {/* <HR classList='w-full' /> */}
            <div className="w-full flex justify-around items-center text-2xl text-orange-700 rounded-md py-3">
               <CheckBoxFormField
                  label={'Awaiting Result'}
                  classList={'my-5 font-bold text-orange-800'}
                  name={'awaiting_result'}
                  register={register}
                  error={errors.awaiting_result}
                  onChange={(e) => handleAwaitingResultChange(e)}
               />
               {awaitingResult &&
                  <SwitchToggle
                     classList="font-bold  text-orange-700"
                     onChange={handleSecondSittingToggle}
                     label="Open second sitting"
                     name="switch_sitting"
                  />
               }
            </div>
         </div>
         <div className="col-span-2 md:col-span-1">
            <Fade duration={200} in={awaitingResult}>
               <ExamSitting
                  register={register}
                  control={control}
                  errors={errors}
                  key={"2"}
                  id='first-sitting'
                  name={"first_sitting"}
                  title='First Sitting'
                  result={OLevels}
                  years={Years}
                  required={awaitingResult} />
               <div className="upload-first-sitting-cert-pix">
                  <QualificationPhotoForm label='Upload your first sitting result document' register={register} errors={errors} fileKey={'first_sitting_result'} uploadMethod={UploadFirstSittingResult} />
                  {firstResultError && (<p className="text-sm text-red-400">Please upload your first sitting result</p>)}
               </div>
            </Fade>
         </div>

         <div className="col-span-2 md:col-span-1 border-t md:border-t-0">
            <Fade duration={200} in={state.examSittingState}>
               {awaitingResult &&
                  <>
                     <ExamSitting
                        register={register}
                        control={control}
                        errors={errors}
                        key={"22"}
                        id='second-sitting'
                        name="second_sitting"
                        title='Second Sitting'
                        result={OLevels}
                        years={Years}
                        required={state.examSittingState}
                     />
                     <div className="upload-second-sitting-cert-pix">
                        <QualificationPhotoForm label='Upload your second sitting result document' register={register} errors={errors} fileKey={'second_sitting_result'} uploadMethod={UploadSecondSittingResult} />
                        {secondResultError && (<p className="text-sm text-red-400">Please upload your second sitting result</p>)}
                     </div>
                  </>
               }
            </Fade>
         </div>
      </div>
   )
}

export default ExamSittingForm