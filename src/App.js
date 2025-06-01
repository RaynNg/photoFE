import './App.css';

import React, {useState, useEffect} from "react";
import { Grid, Typography, Paper, Button } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import SinglePhotoViewer from './components/UserPhotos/SinglePhotoViewer';

const NavigateButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant='contained'
      color='primary'
      onClick={() => navigate('/users')}
      style={{ position: "absolute", bottom: "30px", left: "30px" }}
    >
      Show User List
    </Button>
  );
};

const App = (props) => {
  const [advancedFeatures, setAdvancedFeatures] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedValue = localStorage.getItem("advancedFeatures");
      setAdvancedFeatures(storedValue === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  
  return (
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar />
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item xs={12}>
              <NavigateButton />
            </Grid>
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                <UserList />
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  <Route
                    path="/users/:userId"
                    element = {<UserDetail />}
                  />
                  <Route
                    path="/photos/:userId"
                    element = {<UserPhotos />}
                  />
                  <Route
                    path="/photos/:userId/:photoId"
                    element={<SinglePhotoViewer />}
                  />
                  <Route path="/users" element={<UserList />} />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
  );
}

export default App;
