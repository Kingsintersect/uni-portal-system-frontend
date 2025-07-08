'use client';

import React, { useEffect, useState } from 'react';
import { GetTotalCoursesList, GetTotalStudentList } from '@/app/actions/teacher';
import { TeacherSectionCards } from '@/components/teacher-section-cards';
import { BarChartMultitple } from '@/components/ui/bar-chart-multiple';
import { ChartAreaInteractive } from '@/components/ui/chart-area-interactive';

interface Props {
  accessToken: string;
}

const TeacherDashboardClient = ({ accessToken }: Props) => {
  const [studentStat, setStudentStat] = useState({
    totalEnrolledCourses: 0,
    totalEnrolledStudents: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [students, courses] = await Promise.all([
          GetTotalStudentList(accessToken),
          GetTotalCoursesList(accessToken),
        ]);

        setStudentStat({
          totalEnrolledCourses: courses?.success?.data?.length ?? 0,
          totalEnrolledStudents: students?.success?.data?.length ?? 0,
        });
      } catch (error) {
        console.error("Error fetching teacher stats:", error);
      }
    }

    fetchStats();
  }, [accessToken]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <TeacherSectionCards studentStat={studentStat} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="col-span-1">
              <BarChartMultitple />
            </div>
            <div className="col-span-2">
              <ChartAreaInteractive />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardClient;
