"use client";

import React, { FC, useEffect, useState } from 'react'
import { Religion, Gender, YesOrNo } from '@/config';
import { FormFieldSet, InputFormField, SelectFormField, TextareaFormField } from '@/components/ui/inputs/FormFields';
import { CompleteApplicationFormData, OtherPersonalDetailsProps } from '../../studentApplication.types';
import Fade from '@/components/application/animatives/Fade';
import { GetListOfLocalGovInState, GetListOfStates } from '@/app/actions/server.admin';
import { useAuth } from '@/contexts/AuthContext';


const OtherPersonalDetails: FC<OtherPersonalDetailsProps> = ({ register, errors, control }) => {
   const { access_token } = useAuth();
   const { user } = useAuth();
   const state = user?.state ?? ""
   const [stateList, setStateList] = useState<{ id: string; name: string }[]>([])
   const [localGavAreaList, setLocalGavAreaList] = useState<{ id: number; name: string, state_id: number }[]>([])
   const [hasDisability, setHasDisability] = useState<string>('no');

   useEffect(() => {
      async function fetchLocalGovAreaInstate(access_token: string, stateName: string) {
         const { success } = await GetListOfLocalGovInState(stateName, access_token);
         if (success) {
            setLocalGavAreaList(success.data);
         }
      }
      async function fetchStateList() {
         const { success } = await GetListOfStates(null);
         if (success) {
            setStateList(success.data);
         }
      }

      if (access_token && state) {
         fetchLocalGovAreaInstate(access_token, state);
      }

      if (!state) {
         fetchStateList();
      }
   }, [access_token, state]);

   const handleSelectChange = (value: string) => {
      setHasDisability(value);
   };


   const handleStateListChange = async (value: string) => {
      const { error, success } = await GetListOfLocalGovInState(value, access_token ?? "");
      if (success) {
         setLocalGavAreaList(success.data);
      }
      if (error) console.log("ERROR FETCHING LOCAL GOVERNMENT", error)
   };

   return (
      <div className="mx-auto">
         <FormFieldSet legend={'Personal Information'} classList={'bg-white'} >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 my-7 gap-y-7">
               <InputFormField<CompleteApplicationFormData>
                  type="text"
                  id={'hometown'}
                  label={"Your home town"}
                  name="hometown"
                  register={register}
                  error={errors.hometown}
               />
               <InputFormField<CompleteApplicationFormData>
                  type="text"
                  id={'hometown_address'}
                  label={"Your home town address"}
                  name="hometown_address"
                  register={register}
                  error={errors.hometown_address}
               />
               <InputFormField<CompleteApplicationFormData>
                  classList={"col-span-full"}
                  type="date"
                  id={'dob'}
                  label={"Your date of birth"}
                  name="dob"
                  register={register}
                  error={errors.dob}
               />
               <InputFormField<CompleteApplicationFormData>
                  classList={"col-span-full"}
                  type="text"
                  id={'contact_address'}
                  label={"Your contact address"}
                  name="contact_address"
                  register={register}
                  error={errors.contact_address}
               />
               <SelectFormField<CompleteApplicationFormData>
                  name="religion"
                  label={"Select your Religion"}
                  placeholder={"Choose a Role"}
                  control={control!}
                  options={Religion.filter(item => item.value && item.label).map(item => ({
                     value: String(item.value),
                     label: item.label,
                  }))}

                  error={errors.religion}
               />
               {(!state) && <SelectFormField<CompleteApplicationFormData>
                  name="state"
                  label={"State"}
                  control={control!}
                  error={errors.state}
                  onValueSelect={handleStateListChange}
                  options={stateList.filter(item => item.id && item.name).map(item => ({
                     value: String(item.id),
                     label: item.name,
                  }))}
               />
               }
               <SelectFormField<CompleteApplicationFormData>
                  name="lga"
                  label={"Select your Local Government Area"}
                  placeholder={"Choose a Local Government Area"}
                  control={control!}
                  error={errors.lga}
                  options={localGavAreaList.filter(item => item.id && item.name).map(item => ({
                     value: String(item.id),
                     label: item.name,
                  }))}
               />
               <SelectFormField<CompleteApplicationFormData>
                  name="gender"
                  label={"Gender"}
                  placeholder={"Choose Your Gender"}
                  control={control!}
                  error={errors.gender}
                  options={Gender.filter(item => item.value && item.label).map(item => ({
                     value: String(item.value),
                     label: item.label,
                  }))}
               />
               <SelectFormField<CompleteApplicationFormData>
                  name="dis"
                  label={"Do you have any disability"}
                  placeholder={"Sepecify if any"}
                  control={control!}
                  defaultValue={hasDisability}
                  onValueSelect={handleSelectChange}
                  error={errors.dis}
                  options={YesOrNo.filter(item => item.value && item.label).map(item => ({
                     value: String(item.value),
                     label: item.label,
                  }))}
               />

               <div className="col-span-full">
                  <Fade duration={200} in={hasDisability === 'yes'}>
                     <TextareaFormField<CompleteApplicationFormData>
                        id="disability"
                        rows={3}
                        placeholder="Short note about the new Department"
                        name="disability"
                        register={register}
                        error={errors.disability} cols={0} />
                  </Fade>
               </div>
            </div>
         </FormFieldSet>
      </div>
   )
}

export default OtherPersonalDetails
