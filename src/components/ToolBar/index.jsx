import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../TopBar";
import { Box, Toolbar } from "@mui/material";
import "./styles.css";

const Layout = () => {
  return (
    <>
      <TopBar />
      <Toolbar />
      <Box className="layout-box">
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
