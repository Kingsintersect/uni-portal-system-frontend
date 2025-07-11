"use client";
import Search from '@/components/ui/inputs/Search';
import { baseUrl } from '@/config';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable } from '@/components/ui/datatable/DataTable';
import { StudentsPaymentTable } from './StudentPaymentsTable';
import { filterData } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { GetStudentPaymentHistory } from '@/app/actions/student';

type Payment = {
  id: string;
  type: 'tuition' | 'acceptance';
  status: 'paid' | 'pending' | 'failed';
  session: string;
  amount: string;
  date: string;
  reference: string;
};

export const dynamic = "force-dynamic";

const StudentsPaymentPage = () => {
  const [filter, setFilter] = useState("ALL");
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { access_token } = useAuth();
  const basePath = `${baseUrl}/dashboard/student/history/student-payments`;

  // Function to calculate academic session based on payment date
  const getAcademicSession = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-indexed
    
    // If payment is between January and August, it's for the previous session
    if (month >= 1 && month <= 8) {
      return `${year - 1}/${year}`;
    }
    // Otherwise it's for the current session
    return `${year}/${year + 1}`;
  };

  // Transform API data to match table structure
  const transformPaymentData = (apiData: any[]): Payment[] => {
    return apiData.map(payment => ({
      id: payment.id.toString(),
      type: payment.payment_type.includes('Tuition') ? 'tuition' : 'acceptance',
      status: payment.status.toLowerCase() as 'paid' | 'pending' | 'failed',
      session: getAcademicSession(payment.created_at),
      amount: payment.amount.toString(),
      date: payment.created_at,
      reference: payment.reference,
    }));
  };

  const fetchPaymentHistory = async (access_token: string) => {
    setLoading(true);
    setError(null);

    try {
      const { success, error } = await GetStudentPaymentHistory(access_token);
      if (success) {
        const sortedData = success.data.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setPaymentHistory(sortedData);
      } else if (error) {
        setError(error.message || "Failed to fetch payment history");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (access_token) {
      fetchPaymentHistory(access_token).catch(console.error);
    }
  }, [access_token]);

  const filteredData = useMemo(() => {
    const transformedData = transformPaymentData(paymentHistory);
    return filterData(
      transformedData,
      "type",
      filter,
      ["session", "reference", "type"],
      searchQuery
    );
  }, [filter, searchQuery, paymentHistory]);

  return (
    <Card className="mt-7 p-10">
      <header className="w-full flex items-center justify-between text-site-a font-bold">
        <h5 className="text-2xl font-bold tracking-tight text-[#23628d] dark:text-white mb-7">
          Payment History
        </h5>
      </header>
      <div className="font-normal text-gray-700 dark:text-gray-400 space-y-10 mb-7">
        <div className="grid sm:grid-cols-2 gap-3 md:gap-10">
          <div className="search">
            <Search
              name={'search'}
              placeholder='Search by session or reference...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-3 rounded w-full"
            />
          </div>
          <div className="search flex justify-end gap-5">
            <Select
              onValueChange={(value: string) => setFilter(value)}
              defaultValue={filter}
            >
              <SelectTrigger className='w-[280px]'>
                <SelectValue placeholder="Filter payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Payments</SelectItem>
                <SelectItem value="tuition">Tuition Fee</SelectItem>
                <SelectItem value="acceptance">Application Fee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1">
          <DataTable 
            columns={StudentsPaymentTable} 
            data={filteredData} 
            isLoading={loading}
            // noDataMessage={error || "No payment records found"}
          />
        </div>
      </div>
    </Card>
  )
}

export default StudentsPaymentPage;