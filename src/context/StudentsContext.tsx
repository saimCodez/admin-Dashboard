import React, { createContext, useContext, useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/context/firebase";
import type { StudentsContextType } from "@/types";
import type { StudentType } from "@/types/student";

const StudentsContext = createContext<StudentsContextType | undefined>(
  undefined
);

export const StudentsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const studentsRef = ref(database, "students");

    const unsubscribe = onValue(
      studentsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const studentArray: StudentType[] = Object.entries(data).map(
            ([id, value]: any) => ({
              id,
              ...value,
            })
          );
          setStudents(studentArray);
        } else {
          setStudents([]);
        }
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <StudentsContext.Provider value={{ students, loading, error }}>
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentsContext);
  if (!context) {
    throw new Error("useStudents must be used within a StudentsProvider");
  }
  return context;
};
