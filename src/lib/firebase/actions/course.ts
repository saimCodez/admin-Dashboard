import { database } from "@/context/firebase";
import type { CourseType } from "@/types/courses";
import { ref, get } from "firebase/database";

// GET COURSES FUNCTION FROM FIREBASE - PROMISE VERSION
export const getCourses = (): Promise<{ data?: CourseType[]; error?: string }> => {
  return new Promise(async (resolve) => {
    try {
      // GET REFERENCE
      const coursesRef = ref(database, "courses");
      
      // USE get() INSTEAD OF onValue() FOR ONE-TIME READ
      const snapshot = await get(coursesRef);
      const data = snapshot.val();

      console.log(data, "DATA RESPONSE");

      if (data) {
        // CONVERT OBJECT DATA INTO ARRAY
        const coursesArray: CourseType[] = Object.entries(data).map(
          ([id, value]: any) => ({
            id,
            ...value,
          })
        );

        console.log(coursesArray, "COURSES");
        resolve({ data: coursesArray });
      } else {
        resolve({ data: [] });
      }
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      resolve({ error: error.message });
    }
  });
};