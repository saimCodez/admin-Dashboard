export type CourseType = {
  id: string;
  courseName: string;
  duration: string;
  instructor: string;
  status: boolean;
  students: string[]; // or StudentType[]
};
