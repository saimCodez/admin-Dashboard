import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { studentFormSchema } from "@/lib/validations";
import { useFirebase } from "@/context/firebase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useParams } from "react-router-dom";
import { type StudentType } from "@/types/student";
import type z from "zod";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormSkeleton } from "@/lib/skeleton/skeleton";
import { getStudentById } from "@/lib/firebase/actions/student";
import { getCourses } from "@/lib/firebase/actions/course";

type Params = { id: string; type: string };

const StudentForm = () => {
  const params = useParams();
  console.log(params, "PARAMS");
  const firebase = useFirebase();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();
  const { id, type } = params as Params;
  const isEditMode = type === "edit";

  const [studentData, setStudentData] = useState<StudentType | null>(null);

  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await getCourses()
      if (!response.error) {
        setCourses(response.data || []);
      }
      console.log(response.data, "Cource data mil gaya");
    };
    fetchCourses();
  }, []);


  useEffect(() => {
    const getStudent = async () => {
      try {
        setDataLoading(true);
        if (isEditMode && id) {
          const studentById = await getStudentById(id);
          console.log(studentById, "STUDENT, ID");
          if (studentById) {
            setStudentData(studentById as StudentType);
          }
        } else {
          setDataLoading(false);
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        toast.error("❌ Failed to load student data");
      } finally {
        setDataLoading(false);
      }
    };
    getStudent();
  }, [id, isEditMode]);

  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: undefined,
      email: "",
      enrollmentDate: undefined,
      phoneNumber: "",
      gender: "male",
      grade: "junior",
      address: {
        city: "",
        country: "pakistan",
        postalCode: "",
        state: "",
        street: "",
      },
      status: true,
      courseId:""
    },
  });

  useEffect(() => {
    if (studentData && isEditMode) {
      form.reset({
        firstName: studentData.firstName || "",
        lastName: studentData.lastName || "",
        dateOfBirth: studentData.dateOfBirth
          ? new Date(studentData.dateOfBirth as any)
          : undefined,
        email: studentData.email || "",
        enrollmentDate: studentData.enrollmentDate
          ? new Date(studentData.enrollmentDate as any)
          : undefined,
        phoneNumber: studentData.phoneNumber || "",
        gender: studentData.gender || "male",
        grade: studentData.grade || "junior",
        address: {
          city: studentData.address?.city || "",
          country: studentData.address?.country || "pakistan",
          postalCode: studentData.address?.postalCode || "",
          state: studentData.address?.state || "",
          street: studentData.address?.street || "",
        },
        status: studentData.status ?? true,
      });
    }
  }, [studentData, form, isEditMode]);

  async function onSubmit(values: z.infer<typeof studentFormSchema>) {
    try {

      const course =  courses.find((course)=> course.id == values.courseId)
      console.log(course,"Course by selected");
      setLoading(true);

      // Determine if we're creating or updating
      const isEdit = isEditMode && id;

      // Use existing ID for edit mode, generate new one for create mode
      const studentId = isEdit ? id : uuidv4();

      // Prepare the data with proper date formatting
      const studentDataToSave = {
        ...values,
        dateOfBirth: values.dateOfBirth?.toISOString(),
        enrollmentDate: values.enrollmentDate?.toISOString(),
        id: studentId,
        course:course
      };

      // Use the appropriate path
      const path = `students/${studentId}`;

      const result = await firebase?.putData(path, studentDataToSave);

      console.log(result,"RESULT");

      if (isEdit) {
        toast.success(" Student has been updated successfully!");
      } else {
        toast.success(" Student has been created successfully!");
      }

      console.log("Firebase data saved:", studentDataToSave);
      navigate("/dashboard/students");
    } catch (error) {
      console.error("Error saving student:", error);
      if (isEditMode) {
        toast.error("❌ Failed to update student");
      } else {
        toast.error("❌ Failed to create student");
      }
    } finally {
      setLoading(false);
    }
  }

  if (dataLoading) {
    return <FormSkeleton />;
  }

  return (
    <div className="min-h-screen p-6 rounded-lg">
      <div className="max-w-2xl mx-auto rounded-xl p-6 md:p-8 border">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          {isEditMode ? "Edit Student" : "Student Registration"}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Please fill in all the required information
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      First Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        {...field}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Last Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        {...field}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Email Address *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john.doe@example.com"
                      type="email"
                      {...field}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Phone Number *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(123) 456-7890"
                      {...field}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-700">
                      Date of Birth *
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Enrollment Date */}
              <FormField
                control={form.control}
                name="enrollmentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-700">
                      Enrollment Date *
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("2000-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gender & Grade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem defaultValue={studentData?.grade}>
                    <FormLabel className="text-gray-700">Gender *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 focus:ring-purple-500  w-auto">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Course */}
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Course *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 focus:ring-purple-500 w-auto">
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses?.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.courseName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Grade */}
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Grade/Year *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={studentData?.grade}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 !text-black focus:ring-purple-500  w-auto">
                          {field.value || studentData?.grade || (
                            <SelectValue placeholder={"Select grade"} />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="freshman">Freshman</SelectItem>
                        <SelectItem value="sophomore">Sophomore</SelectItem>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-medium text-gray-800">
                Address Information
              </h3>

              {/* Street */}
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Street Address *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St"
                        {...field}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* City */}
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">City *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New York"
                          {...field}
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* State */}
                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        State/Province *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="NY"
                          {...field}
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Postal */}
                <FormField
                  control={form.control}
                  name="address.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Postal Code *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10001"
                          {...field}
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Country */}
              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Country *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 focus:ring-purple-500 md:w-full w-auto">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="australia">Australia</SelectItem>
                        <SelectItem value="pakistan">Pakistan</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status Checkbox */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(val) => field.onChange(val === true)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription>
                      Check if the student is currently active
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="w-fit bg-purple-500 hover:bg-purple-600 py-3 text-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span>{isEditMode ? "Updating..." : "Creating..."}</span>
                  </>
                ) : isEditMode ? (
                  "Update Student"
                ) : (
                  "Create Student"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default StudentForm;
