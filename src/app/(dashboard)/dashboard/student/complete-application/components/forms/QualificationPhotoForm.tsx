'use client';

import { FC } from 'react';
import { ExamSittingProps } from '../../studentApplication.types';
import { UploadFileBox } from '../Boxes';

const QualificationPhotoForm: FC<ExamSittingProps> = ({ fileKey, uploadMethod, register, errors, label }) => {

   return (
      <UploadFileBox
         label={label}
         fileKey={fileKey}
         uploadMethod={uploadMethod}
         register={register}
         errors={errors}
      />
   )
}

export default QualificationPhotoForm
