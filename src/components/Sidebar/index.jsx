import React from "react";
import UserList from "../UserList";
import "./styles.css";

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <aside className="layout-sidebar">
        <UserList showBadges={true} />
      </aside>

      <main className="layout-main">{children}</main>
    </div>
  );
};

export default Layout;
