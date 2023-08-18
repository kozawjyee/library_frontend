import "./App.css";
import ErrorProvider from "./context/ErrorContext";
import UserProvider from "./context/UserContext";
import Router from "./router/Router";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  return (
    <ErrorProvider>
      <UserProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Router />
        </LocalizationProvider>
      </UserProvider>
    </ErrorProvider>
  );
}

export default App;
