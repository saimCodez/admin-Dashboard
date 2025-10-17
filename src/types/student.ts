import type { CourseType } from "./courses";

export type StudentType = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  enrollmentDate: string;
  grade: string;
  status: boolean;
  course?: CourseType; // 👈 add this
};


