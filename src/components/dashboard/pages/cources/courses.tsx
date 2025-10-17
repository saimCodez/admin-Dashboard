import { DataTable } from "../../common/data-table";
import { useEffect, useState } from "react";
import { getCourses } from "@/lib/firebase/actions/course";
import { IconDotsVertical, IconEdit } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CourseType } from "@/types/courses";
import DeleteCourseDialog from "./deleteCourse-dialog";
import { CourseForm } from "./courseForm";
import { useStudents } from "@/context/StudentsContext";

const Courses = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [open, setOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<CourseType | null>(null);

  const getCoursesData = async () => {
    const data = await getCourses();
    setCourses(data?.data || []);
    return data;
  };

  useEffect(() => {
    getCoursesData();
  }, [open]);

  const editCourseHandler = (course: CourseType) => {
    setCurrentCourse(course);
    setOpen(true);
  };

  console.log(courses, "COURSES COMPONENT");

  const courseColumns: ColumnDef<CourseType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "courseName",
      header: "Course Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("courseName")}</div>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <Badge
          className="bg-purple-100 border border-purple-200"
          variant="outline"
        >
          {row.getValue("duration")}
        </Badge>
      ),
    },
    {
      accessorKey: "students",
      header: "Students",
      cell: ({ row }) => {
        const students = row.getValue("students") as any[] | undefined;
        return (
          <div className="text-muted-foreground">
            {students?.length || 0} enrolled
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const course = row.original;
        const courseId = course.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <IconDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(course.id.toString())
                }
              >
                Copy course ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => editCourseHandler(course)}
              >
                <IconEdit className="mr-2 h-4 w-4" />
                Edit course
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <DeleteCourseDialog courseId={courseId} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const { loading, error } = useStudents();

  if (loading) return <p className="text-center py-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  return (
    <div className="container mx-auto py-6">
      <DataTable
        columns={courseColumns as any}
        data={courses}
        title="Courses"
        addButton={
          <CourseForm course={currentCourse} open={open} setOpen={setOpen} />
        }
        enableColumnVisibility
        enablePagination
        enableSorting
        enableRowSelection
      />
    </div>
  );
};

export default Courses;
