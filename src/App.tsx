import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Grades from "./components/dashboard/pages/grades";
import Schedule from "./components/dashboard/pages/schedule";
import NotFound from "./components/dashboard/pages/notFound";
import { Settings } from "lucide-react";
import Help from "./components/dashboard/pages/help";
import Dashboard from "./components/dashboard/pages/dashBoard";
import { DashboardLayout } from "./components/dashboard/layout/dashboard-layout";
import Courses from "./components/dashboard/pages/cources/courses";
import { SchoolLayout } from "./components/website/components/layout/school-layout";
import { Home } from "./components/website/pages/home";
import SignUpPage from "./global/signup";
import SignInPage from "./global/signin";
import StudentForm from "./components/dashboard/pages/students/studentForm";
import Students from "./components/dashboard/pages/students/students";

const router = createBrowserRouter([
  {
    path: "/auth",
    children: [
      { path: "signup", element: <SignUpPage /> },
      { path: "signin", element: <SignInPage /> },
    ],
  },
  {
    path: "/",
    element: <SchoolLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "students", element: <Students /> },
      { path: "courses", element: <Courses /> },
      { path: "grades", element: <Grades /> },
      { path: "student/create", element: <StudentForm /> },
      { path: "student/:type/:id", element: <StudentForm /> },
      { path: "schedule", element: <Schedule /> },
      { path: "settings", element: <Settings /> },
      { path: "help", element: <Help /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
