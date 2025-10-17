import { ref, remove } from "firebase/database";
import { database } from "@/context/firebase";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { IconTrash } from "@tabler/icons-react";
import type { DeleteStudentDialogProps } from "@/types";

const DeleteStudentDialog = ({ studentId }: DeleteStudentDialogProps) => {
  const handleDelete = async () => {
    try {
      if (!studentId) {
        toast.error("No student ID provided.");
        return;
      }
      // 🗑️ Delete the student from Firebase
      await remove(ref(database, `students/${studentId}`));
      // ✅ Show success toast
      toast.success("Student deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting student:", error);
      toast.error("Failed to delete student. Please try again.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="text-red-500 cursor-pointer flex">
        <IconTrash className="mr-2 h-4 w-4" />
        Delete student
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            student and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* ✅ Deletes immediately and shows toast */}
          <AlertDialogAction onClick={handleDelete}>Yes</AlertDialogAction>
          <AlertDialogCancel>No</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStudentDialog;
