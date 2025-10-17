import z from "zod";



export const studentFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  dateOfBirth: z.date({ error: "A date of birth is required." }),
  gender: z.string().min(1, { message: "Please select a gender." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phoneNumber: z.string().min(1, { message: "A phone number is required." }),
  address: z.object({
    street: z.string().min(1, { message: "Street address is required." }),
    city: z.string().min(1, { message: "City is required." }),
    state: z.string().min(1, { message: "State is required." }),
    postalCode: z.string().min(1, { message: "Postal code is required." }),
    country: z.string().min(1, { message: "Country is required." }),
  }),
  enrollmentDate: z.date({ error: "An enrollment date is required." }),
  grade: z.string().min(1, { message: "Please select a grade." }),
  status: z.boolean().default(false).optional(),
  courseId: z.string().min(1, { message: "Please select a course." }), // 👈 new field
});

export const courseSchema = z.object({
  courseName: z.string().min(2, "Course name must be at least 2 characters"),
  duration: z.string().min(1, "Please select a duration"),
});

export const signUpFormSchema = z.object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const signInFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});
