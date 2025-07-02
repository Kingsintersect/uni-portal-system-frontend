"use client";
import { ensureClient } from '@/lib/ensureClient';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AppState = {
   student: StudentType;
   isAuthenticated: boolean;
   isPageLoading: boolean;
   passportUrl: string | null;
   firstSittingResultUrl: string | null;
   secondSittingResultUrl: string | null;
   // firstSittingGrade: SittingCourse[];
   // secondSittingGrade: SittingCourse[];
   firstSittingGrade: SittingCourse[];
   secondSittingGrade: SittingCourse[];
   examSittingState: boolean;
};

type AppContextType = {
   state: AppState;
   setStudent: (newStudentData: Partial<StudentType>) => void;
   getStudent: () => StudentType;
   removeStudent: () => void;
   setAuthentication: (status: boolean) => void;
   setIsPageLoading: (status: boolean) => void;
   setExamSittingState: (status: boolean) => void;
   setPassportUrl: (passportUrl: string) => void;
   setFirstSittingResultUrl: (firstSittingResultUrl: string) => void;
   setSecondSittingResultUrl: (secondSittingResultUrl: string) => void;
   setFirstSittingGrade: (grades: SittingCourse) => void;
   setSecondSittingGrade: (grades: SittingCourse) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type Props = {
   children: ReactNode;
};

export const AppProvider: React.FC<Props> = ({ children }) => {
   const [isClient, setIsClient] = useState(false);
   const [state, setState] = useState<AppState>({
      student: {
         id: null,
         pictureRef: null,
         last_name: null,
         first_name: null,
         other_name: null,
         username: null,
         faculty_id: null,
         department_id: null,
         nationality: null,
         state: null,
         phone_number: null,
         email: null,
         password: null,
         reference: null,
         amount: null,
         reg_number: null,
         is_applied: 0,
         reason_for_denial: null,
         admission_status: "pending",
         acceptance_fee_payment_status: 0,
         tuition_payment_status: 0,
         application_payment_status: 0,
         created_at: null,
         updated_at: null,
         deleted_at: null,
         role: "STUDENT",
         level: null,
         tuition_amount_paid: 0,
      },
      isPageLoading: false,
      isAuthenticated: false,
      passportUrl: null,
      firstSittingResultUrl: null,
      secondSittingResultUrl: null,
      firstSittingGrade: [],
      secondSittingGrade: [],
      examSittingState: false,
   });

   useEffect(() => {
      try {
         ensureClient();
         setIsClient(true);
      } catch (error) {
         console.error(error);
      }
   }, []);

   // Function to update student
   const setStudent = (newStudentData: Partial<StudentType>) => {
      if (isClient) {
         localStorage.setItem("student", JSON.stringify(newStudentData));
         setState((prevState) => ({
            ...prevState,
            student: { ...prevState.student, ...newStudentData },
         }));
      }
   };
   const getStudent = () => {
      if (isClient) {
         const student = localStorage.getItem("student") || "";
         return JSON.parse(student);
      }
   };
   const removeStudent = () => {
      if (isClient) {
         localStorage.removeItem("student");
      }
   };

   // Function to update authentication status
   const setAuthentication = (status: boolean) => {
      setState((prev) => ({ ...prev, isAuthenticated: status }));
   };

   const setIsPageLoading = (status: boolean) => {
      setState((prev) => ({ ...prev, isAuthenticated: status }));
   };

   const setExamSittingState = (status: boolean) => {
      setState((prev) => ({ ...prev, examSittingState: status }));
   };

   const setPassportUrl = (passportUrl: string) => {
      setState((prev) => ({ ...prev, passportUrl }));
   }

   const setFirstSittingResultUrl = (firstSittingResultUrl: string) => {
      setState((prev) => ({ ...prev, firstSittingResultUrl }))
   }

   const setSecondSittingResultUrl = (secondSittingResultUrl: string) => {
      setState((prev) => ({ ...prev, secondSittingResultUrl }))
   }

   const setFirstSittingGrade = (course: SittingCourse) => {
      setState((prevState) => ({
         ...prevState,
         firstSittingGrade: [...prevState.firstSittingGrade, course],
      }));
   }

   const setSecondSittingGrade = (course: SittingCourse) => {
      setState((prevState) => ({
         ...prevState,
         secondSittingGrade: [...prevState.secondSittingGrade, course],
      }));
   }

   return (
      <AppContext.Provider value={{
         state,
         setStudent,
         getStudent,
         removeStudent,
         setAuthentication,
         setIsPageLoading,
         setExamSittingState,
         setFirstSittingGrade,
         setSecondSittingGrade,
         setPassportUrl,
         setFirstSittingResultUrl,
         setSecondSittingResultUrl,
      }}>
         {children}
      </AppContext.Provider>
   );
};

// Hook to use the AppContext
export const useAppContext = () => {
   const context = useContext(AppContext);
   if (!context) {
      throw new Error('useAppContext must be used within AppProvider');
   }
   return context;
};
