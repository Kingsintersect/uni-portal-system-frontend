import { FC, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { notify } from "@/contexts/ToastProvider";
import { FileInputFormField } from "@/components/ui/inputs/FormFields";
import { CompleteApplicationFormData, CompleteApplicationProps } from "../studentApplication.types";
import { cn } from "@/lib/utils";
import { FieldError } from "react-hook-form";

interface UploadFileBoxProps extends CompleteApplicationProps {
   fileKey: string,
   uploadMethod: (val: any) => any,
   label?: string,
   classList?: string,
}

export const UploadFileBox: FC<UploadFileBoxProps> = ({
   register,
   errors,
   fileKey,
   uploadMethod,
   label = "Upload file | document",
   classList,
}) => {
   const { setPassportUrl, setFirstSittingResultUrl, setSecondSittingResultUrl } = useAppContext()
   const [isLoading, setIsLoading] = useState(false);
   // const [error, seterror] = useState('');
   const [pic, setPic] = useState('')

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
         handleUpload(event.target.files[0]);
      }
   };

   const handleUpload = async (fileData) => {
      setIsLoading(true);
      const { success, error } = await uploadMethod({ [fileKey]: fileData });
      if (success) {
         setIsLoading(false);
         notify({ message: success.message, variant: "success", timeout: 5000 })
         if (fileKey === "passport") setPassportUrl(success.image_url);
         if (fileKey === "first_sitting_result") setFirstSittingResultUrl(success.image_url);
         if (fileKey === "second_sitting_result") setSecondSittingResultUrl(success.image_url);
         setPic(success.image_url);
      }
      if (error) {
         setIsLoading(false);
         notify({ message: 'Document Upload Faild. Try Again', variant: "error", timeout: 5000 });
         console.error('Error uploading file:', error);
      }
   };

   return (
      <div className={cn(`bg-gray-100`, classList)}>
         <FileInputFormField
            name={fileKey as keyof CompleteApplicationFormData}
            id={fileKey}
            register={register}
            error={errors[fileKey as keyof CompleteApplicationFormData] as FieldError | undefined}
            onChange={handleFileChange}
            isLoading={isLoading}
            pictureRef={pic}
            title=""
            label={label}
         />
      </div>
   )
}
