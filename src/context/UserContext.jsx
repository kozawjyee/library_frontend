import { createContext, useState } from "react";
import PropTypes from "prop-types";
export const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const defaultValue = { user, setUser };
  return (
    <UserContext.Provider value={defaultValue}>{children}</UserContext.Provider>
  );
}

export default UserProvider;

UserProvider.propTypes = {
  children: PropTypes.node,
};
