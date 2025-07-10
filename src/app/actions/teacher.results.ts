import { remoteApiUrl } from "@/config";
import { apiCallerBeta } from "@/lib/apiCaller";
import { ObjectType } from "@/types/generic.types";

<<<<<<< HEAD





interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}


// result system
export const fetchStudentsResults = async (access_token: string) => {
    const response = (await apiCallerBeta({
        url: `${remoteApiUrl}/teacher/students-results`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    }))
    if (response.error) {
        throw new Error(response.error.toString() || "Failed to fetch students results");
    }
    console.log('response.success', response.success)
    return response.success;
}
export const fetchTeacherCourses = async (access_token: string) => {
    const res = await fetch(`${remoteApiUrl}/courses`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch students");
    }
    const result = await res.json();
    return result.data;
};

export const fetchStudentScores = async (courseId: string | number, access_token: string) => {
    const response = (await apiCallerBeta({
        url: `${remoteApiUrl}/teacher/course/course-gradings/${courseId}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    }))
    if (response.error) {
        throw new Error(response.error.toString() || "Failed to fetch students");
    }
    if (typeof response.success === "object" && response.success !== null && "data" in response.success) {
        return (response.success as { data }).data;
    }
    return response.success;
};

export const    ExportScores = async (courseId: string | number, access_token: string) => {
    const res = await fetch(`${remoteApiUrl}/admin/course/process-gradings/${courseId}`, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch students");
    }
    const result = await res.json();
    return result.data;
}
=======
// interface ApiResponse<T> {
//   success: boolean;
//   data?: T;
//   error?: string;
// }

type StudentResult = {
  id: number;
  user_id: number;
  course_id: number;
  course_code: string;
  course_title: string;
  credit_load: number;
  quality_point: string;
  session: string;
  score: string;
  grade: string;
  user_info: {
    id: number;
    first_name: string;
    last_name: string;
    reg_number: string;
    program: string;
    level: string;
    department_id: string;
    academic_session: string;
    academic_semester: string;
  };
};

export const fetchStudentsResults = async (
  access_token: string,
  semester: string,
  session: string
): Promise<StudentResult[]> => {
  try {
    // Validate access token first and check if it is a string
    if (!access_token || typeof access_token !== "string") {
      throw new Error("Invalid access token");
    }

    const baseUrl = `${remoteApiUrl}/account/result/get-user-result`;
    const params = new URLSearchParams({
      semester,
      session,
    });

    const url = `${baseUrl}?${params.toString()}`;
    console.log("API Request:", { url, method: "GET" });

    const response = await apiCallerBeta({
      url,
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("API Response:", response);

    // Handle authentication errors specifically
    if (
      response.error &&
      typeof response.error === "object" &&
      "message" in response.error &&
      (response.error as { message?: string }).message === "Unauthenticated"
    ) {
      throw new Error("Session expired - please login again");
    }

    if (response.error) {
      throw new Error("Failed to fetch student results");
    }

    if (!Array.isArray(response.success)) {
      throw new Error("Invalid response format - expected array");
    }

    return response.success as StudentResult[];
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch student results"
    );
  }
};
>>>>>>> 41291f51f848262be36c47caf5b11d9c2262721e
