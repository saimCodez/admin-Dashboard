import { useStudents } from "@/context/StudentsContext";
import { studentColumns } from "./student-columns";
import { DataTable } from "../../common/data-table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Students = () => {
  const { students, loading, error } = useStudents();

  if (loading) return <p className="text-center py-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;


  // const updateData  = students.map((student)=>({
  //   ...student,
  //   courses:
  // }))

  return (
    <div className="container mx-auto py-6">
      <DataTable
        columns={studentColumns as any}
        data={students}
        title="Students"
        addButton={
          <Link to={"/dashboard/student/create"}>
            <Button>Add Student</Button>
          </Link>
        }
        enableColumnVisibility
        enablePagination
        enableSorting
        enableRowSelection
      />
    </div>
  );
};

export default Students;
