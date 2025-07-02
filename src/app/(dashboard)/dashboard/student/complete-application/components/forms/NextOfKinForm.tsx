import React, { FC } from 'react'
import { CompleteApplicationFormData, OtherSponsorDetailsProps } from '../../studentApplication.types';
import { FormFieldSet, InputFormField } from '@/components/ui/inputs/FormFields';


const NextOfKinForm: FC<OtherSponsorDetailsProps> = ({ register, errors }) => {
   return (
      <div className="mx-auto">
         <FormFieldSet legend={`Sponsor's Information`} classList={'bg-white'} >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 my-7 gap-y-7">
               <InputFormField<CompleteApplicationFormData>
                  type="text"
                  id={'sponsor_name'}
                  label={"Your sponsor's full name"}
                  name="sponsor_name"
                  register={register}
                  error={errors.sponsor_name}
               />
               <InputFormField<CompleteApplicationFormData>
                  type="text"
                  id={'sponsor_relationship'}
                  label={"Your relationship with the sponsor"}
                  name="sponsor_relationship"
                  register={register}
                  error={errors.sponsor_relationship}
               />
               <InputFormField<CompleteApplicationFormData>
                  type="text"
                  id={'sponsor_email'}
                  label={"Your sponsor's email address"}
                  name="sponsor_email"
                  register={register}
                  error={errors.sponsor_email}
               />
               <InputFormField<CompleteApplicationFormData>
                  type="text"
                  id={'sponsor_contact_address'}
                  label={"Your sponsor's contact address"}
                  name="sponsor_contact_address"
                  register={register}
                  error={errors.sponsor_contact_address}
               />
               <InputFormField<CompleteApplicationFormData>
                  type="text"
                  id={'sponsor_phone_number'}
                  label={"Your sponsor's phone number"}
                  name="sponsor_phone_number"
                  register={register}
                  error={errors.sponsor_phone_number}
               />
            </div>
         </FormFieldSet>
      </div>
   )
}

export default NextOfKinForm