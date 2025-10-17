"use client";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useFirebase } from "@/context/firebase";
import { Check, ChevronDown, BookOpen, Clock } from "lucide-react";
import type { CourseType } from "@/types/courses";

// ✅ Zod Schema
const courseSchema = z.object({
  courseName: z.string().min(2, "Course name must be at least 2 characters"),
  duration: z.string().min(1, "Please select a duration"),
});

type CourseFormData = z.infer<typeof courseSchema>;

const durationOptions = [
  { value: "2 Months", label: "2 Months" },
  { value: "3 Months", label: "3 Months" },
  { value: "6 Months", label: "6 Months" },
  { value: "9 Months", label: "9 Months" },
  { value: "1 Year", label: "1 Year" },
  { value: "1.5 Years", label: "1.5 Years" },
  { value: "2 Years", label: "2 Years" },
];

export function CourseForm({
  open,
  setOpen,
  course,
}: {
  course: CourseType | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const firebase = useFirebase();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ FIXED: Use course prop to determine edit mode
  const isEditMode = Boolean(course);

  // ✅ FIXED: Proper form initialization
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseName: "",
      duration: "",
    },
  });

  const selectedDuration = form.watch("duration");

  // ✅ Handle form submission
  const onSubmit = async (data: CourseFormData) => {
    try {
      setLoading(true);

      const courseId = course?.id || uuidv4();
      const courseData = {
        id: courseId,
        ...data,
        ...(isEditMode && {
          updatedAt: new Date().toISOString(),
          // ✅ Preserve existing createdAt for edits
          createdAt: new Date().toISOString(),
        }),
        ...(!isEditMode && {
          createdAt: new Date().toISOString(),
        }),
      };

      await firebase?.putData(`courses/${courseId}`, courseData);

      toast.success(
        isEditMode
          ? "Course updated successfully!"
          : "Course added successfully!"
      );

      // ✅ Reset form and close dialog
      form.reset({
        courseName: "",
        duration: "",
      });
      setOpen(false);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("❌ Error saving course:", error);
      toast.error(`Failed to ${isEditMode ? "update" : "add"} course`);
    } finally {
      setLoading(false);
    }
  };

  const handleDurationSelect = (duration: string) => {
    form.setValue("duration", duration, { shouldValidate: true });
    setIsDropdownOpen(false);
  };

  // ✅ FIXED: Reset form when dialog opens/closes or course changes
  useEffect(() => {
    if (open) {
      if (course && isEditMode) {
        // Edit mode: Pre-fill with course data
        form.reset({
          courseName: course.courseName || "",
          duration: course.duration || "",
        });
      } else {
        // Add mode: Reset to empty form
        form.reset({
          courseName: "",
          duration: "",
        });
      }
    }
  }, [open, course, isEditMode, form]);

  const getSelectedDurationLabel = () => {
    return (
      durationOptions.find((option) => option.value === selectedDuration)
        ?.label || "Select Duration"
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-2.5 rounded-xl font-semibold">
          <BookOpen className="w-4 h-4 mr-2" />
          {isEditMode ? "Edit Course" : "Add Course"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[525px] p-0 rounded-2xl  border-0 shadow-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    {isEditMode ? "Edit Course" : "Add New Course"}
                  </DialogTitle>
                  <DialogDescription className="text-blue-100 mt-1">
                    {isEditMode
                      ? "Update the course details below."
                      : "Fill in the course details below and click save."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Form Content */}
            <div className="p-6 bg-white space-y-6">
              {/* Course Name Field */}
              <FormField
                control={form.control}
                name="courseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                      Course Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="e.g. Full Stack Web Development"
                          {...field}
                          className="pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-gray-50/50 transition-all duration-200"
                        />
                        <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration Dropdown Field */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-purple-500" />
                      Duration
                    </FormLabel>
                    <FormControl>
                      <div className="relative" ref={dropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className={`w-full pl-10 pr-10 py-3 rounded-xl border-2 text-left transition-all duration-200 ${
                            form.formState.errors.duration
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          } focus:ring-2 focus:ring-blue-200 bg-gray-50/50 hover:bg-gray-50`}
                        >
                          <span
                            className={
                              !field.value ? "text-gray-400" : "text-gray-900"
                            }
                          >
                            {getSelectedDurationLabel()}
                          </span>
                          <ChevronDown
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform duration-200 ${
                              isDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95">
                            <div className="max-h-60 overflow-y-auto py-1">
                              {durationOptions.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() =>
                                    handleDurationSelect(option.value)
                                  }
                                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 flex items-center justify-between ${
                                    field.value === option.value
                                      ? "bg-blue-50 text-blue-600"
                                      : "text-gray-700"
                                  }`}
                                >
                                  <span className="font-medium">
                                    {option.label}
                                  </span>
                                  {field.value === option.value && (
                                    <Check className="w-4 h-4 text-blue-600" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <DialogFooter className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-end space-x-3 w-full">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      // ✅ Reset form when cancel is clicked
                      form.reset({
                        courseName: "",
                        duration: "",
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2.5 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {isEditMode ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    <>{isEditMode ? "Update Course" : "Save Course"}</>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
