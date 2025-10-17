"use client";
import { IconDotsVertical, IconEdit } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import DeleteDailog from "./deleteStudent-dailog";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import type { StudentType } from "@/types/student";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const studentColumns: ColumnDef<StudentType>[] = [
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
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("firstName")}</div>
    ),
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("lastName")}</div>
    ),
  },

  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("grade")}</Badge>,
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("gender")}</Badge>
    ),
  },
  {
    accessorKey: "",
    header: "Course",
    cell: ({ row }) => {
      const course = row.original.course;
      console.log(course, "row course");
      return <Badge variant="default">{course?.courseName}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as boolean;
      return (
        <Badge variant={status ? "default" : "destructive"}>
          {status ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "enrollmentDate",
    header: "Enrollment Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("enrollmentDate"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateOfBirth"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("phoneNumber")}</div>
    ),
  },
  {
    id: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {row.original.address.street}, {row.original.address.city},{" "}
        {row.original.address.state} {row.original.address.postalCode}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      const studentId = row.original.id;

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
                navigator.clipboard.writeText(student.id.toString())
              }
            >
              Copy student ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link to={`/dashboard/student/edit/${studentId.toString()}`}>
              <DropdownMenuItem className="cursor-pointer">
                <IconEdit className="mr- h-4 w-4" />
                Edit student
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onSelect={(e) => e.preventDefault()} // This prevents the dropdown from closing
            >
              <DeleteDailog studentId={studentId} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
