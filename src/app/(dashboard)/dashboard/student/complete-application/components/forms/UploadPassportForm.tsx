'use client';

import { FC } from 'react';
import { ExamSittingProps } from '../../studentApplication.types';
import { UploadFileBox } from '../Boxes';

const UploadPassportForm: FC<ExamSittingProps> = ({ fileKey, uploadMethod, register, errors, label }) => {
   return (
      <div className="mx-32 mt-10">
         <UploadFileBox
            label={label}
            fileKey={fileKey}
            uploadMethod={uploadMethod}
            register={register}
            errors={errors}
         />
      </div>
   );
};

export default UploadPassportForm;
