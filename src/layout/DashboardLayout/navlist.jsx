import DashboardIcon from "@mui/icons-material/Dashboard";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

const color = "white";

export const userNavs = [
  {
    id: 1,
    path: "books",
    name: "Books",
    icon: <AutoStoriesIcon sx={{ color: color }} />,
  },
];

export const adminNavList = [
  {
    id: 1,
    path: "",
    name: "Dashboard",
    icon: <DashboardIcon sx={{ color: color }} />,
  },
  {
    id: 2,
    path: "books",
    name: "Books",
    icon: <AutoStoriesIcon sx={{ color: color }} />,
  },
  {
    id: 3,
    path: "borrowedbooks",
    name: "Borrowed Books",
    icon: <LibraryBooksIcon sx={{ color: color }} />,
  },
  {
    id: 4,
    path: "users",
    name: "Users",
    icon: <PeopleIcon sx={{ color: color }} />,
  },
];
