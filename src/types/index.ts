import type { ReactNode } from "react";
import type { StudentType } from "./student";

export interface FirebaseContextType {
  signupUserWithEmailAndPassword: ( email: string, password: string) => Promise<any>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<any>;
  putData: (key: string, data: object) => Promise<void>;
}

export interface DeleteStudentDialogProps {
  studentId: string;
}
export interface StudentsContextType {
  students: StudentType[];
  loading: boolean;
  error: string | null;
}

export interface DeleteCourseDialogProps {
  courseId: string
}

export interface FirebaseProviderProps {
  children: ReactNode;
}