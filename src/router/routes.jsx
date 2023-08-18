import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Books = lazy(() => import("../pages/Books"));
const Borrowedbooks = lazy(() => import("../pages/BorrowedBooks"));
const Users = lazy(() => import("../pages/Users"));
const Profile = lazy(() => import("../pages/Profile"));
const Login = lazy(() => import("../pages/Auth/Login"));
const Register = lazy(() => import("../pages/Auth/Register"));
const AdminLogin = lazy(() => import("../pages/Auth/AdminLogin"));
const BookDetail = lazy(() => import("../pages/Books/BookDetail"));
const AddBook = lazy(() => import("../pages/Books/AddBook"));

export const routeList = [
  {
    id: 1,
    path: "",
    name: "Dashboard",
    element: <Dashboard />,
  },
  {
    id: 2,
    path: "books",
    name: "Books",
    element: <Books />,
  },
  {
    id: 3,
    path: "borrowedbooks",
    name: "Borrowed Books",
    element: <Borrowedbooks />,
  },
  {
    id: 4,
    path: "users",
    name: "Users",
    element: <Users />,
  },
  {
    id: 5,
    path: "profile",
    name: "Profile",
    element: <Profile />,
  },
  {
    id: 6,
    path: "books/details/:id",
    name: "Books",
    element: <BookDetail />,
  },
  {
    id: 6,
    path: "books/add",
    name: "Books",
    element: <AddBook />,
  },
];

export const authRoutes = [
  {
    id: 1,
    path: "",
    name: "Login",
    element: <Login />,
  },
  {
    id: 2,
    path: "register",
    name: "Register",
    element: <Register />,
  },
  {
    id: 3,
    path: "adminlogin",
    name: "Admin Login",
    element: <AdminLogin />,
  },
];
