import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { userNavs, adminNavList } from "./navlist";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { UserContext } from "../../context/UserContext";
import Cookie from "universal-cookie";
import jwtDecode from "jwt-decode";
import { logout } from "../../util/authProvider";

function DashboardLayout() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const cookie = new Cookie();
  const { VITE_ACS_TOKEN } = import.meta.env;
  const [navList, setNavList] = useState([]);
  const navigate = useNavigate();

  const isUserLogin = () => {
    const token = cookie.get(VITE_ACS_TOKEN, { path: "/" });
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.user_role === "librarian") {
        setNavList(adminNavList);
      } else {
        setNavList(userNavs);
      }
      return setUser(decoded);
    }
    return logout(user.user_role);
  };

  useEffect(() => {
    isUserLogin();
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Container
          className="bg-primary"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          maxWidth="xl"
        >
          <IconButton onClick={() => setOpenDrawer(true)}>
            <MenuBookIcon sx={{ color: "white" }} />
          </IconButton>
          <p className="font-semibold">Library Manage System</p>
          <button
            onClick={() => setShowUserDetail((prev) => !prev)}
            className="flex justify-center items-center space-x-2 relative"
          >
            <p>{user && user.username}</p>
            <AccountCircleIcon />
            {showUserDetail && (
              <div className="absolute bg-primary text-white top-[35px] right-0 z-10">
                <List>
                  <ListItem onClick={() => navigate("/profile")}>
                    <ListItemIcon>
                      <PersonIcon sx={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItem>
                  <ListItem onClick={() => logout(user.user_role)}>
                    <ListItemIcon>
                      <LogoutIcon sx={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </List>
              </div>
            )}
          </button>
        </Container>
      </AppBar>
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box
          sx={{ minWidth: 250 }}
          className="h-full bg-primary text-white font-semibold"
        >
          <List>
            {navList.length > 0 &&
              navList.map((nav) => (
                <NavLink to={nav.path} key={nav.id}>
                  <ListItem className="border-b border-white">
                    <ListItemIcon>{nav.icon}</ListItemIcon>
                    <ListItemText primary={nav.name} />
                  </ListItem>
                </NavLink>
              ))}
          </List>
        </Box>
      </Drawer>
      <Outlet />
    </div>
  );
}

export default DashboardLayout;
