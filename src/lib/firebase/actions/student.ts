import { database } from "@/context/firebase";
import type { StudentType } from "@/types/student";
import { onValue, ref } from "firebase/database";

 // Simple function to get student by ID from Firebase
export  const getStudentById = async (id: string): Promise<StudentType | null> => {
    try {
      const studentRef = ref(database, `students/${id}`);

      const snapshot = await new Promise((resolve, reject) => {
        onValue(studentRef, resolve, reject);
      });

      const data = (snapshot as any).val();
      return data ? ({ id, ...data } as StudentType) : null;
    } catch (error) {
      console.error("Error fetching student:", error);
      return null;
    }
  };