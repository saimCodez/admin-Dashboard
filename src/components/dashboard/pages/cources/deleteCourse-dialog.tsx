import { ref, remove } from "firebase/database";
import { database } from "@/context/firebase";
import { toast } from "sonner";
import type {DeleteCourseDialogProps} from "@/types";
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

const DeleteCourseDialog = ({ courseId }: DeleteCourseDialogProps) => {
  const handleDelete = async () => {
    try {
      if (!courseId) {
        toast.error("No course ID provided.");
        return;
      }
      // 🗑️ Delete the student from Firebase
      await remove(ref(database, `courses/${courseId}`));
      // ✅ Show success toast
      toast.success("Course deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting course:", error);
      toast.error("Failed to delete course. Please try again.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="text-red-500 cursor-pointer flex">
        <IconTrash className="mr-2 h-4 w-4" />
        Delete Course
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            course and remove their data from our servers.
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

export default DeleteCourseDialog;
