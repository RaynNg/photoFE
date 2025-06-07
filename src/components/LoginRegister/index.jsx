import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import models from "../../modelData/models";
import { useAuth } from "../../context/AuthContext";

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    loginName: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    loginName: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    location: "",
    description: "",
    occupation: "",
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!loginForm.loginName.trim() || !loginForm.password.trim()) {
      setLoginError("Please enter both login name and password");
      return;
    }

    try {
      const res = await models.login(loginForm.loginName, loginForm.password);

      if (res && res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: res._id,
            first_name: res.first_name,
            last_name: res.last_name,
          })
        );

        await login(res._id);
        navigate(`/users/${res._id}`);
      } else {
        setLoginError(res.error || "Invalid credentials");
      }
    } catch (error) {
      setLoginError("Login failed: " + (error.message || error.toString()));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }

    if (
      !registerForm.loginName ||
      !registerForm.password ||
      !registerForm.firstName ||
      !registerForm.lastName
    ) {
      setRegisterError(
        "Login name, password, first name, and last name are required"
      );
      return;
    }

    try {
      const res = await models.register({
        login_name: registerForm.loginName,
        password: registerForm.password,
        first_name: registerForm.firstName,
        last_name: registerForm.lastName,
        location: registerForm.location,
        description: registerForm.description,
        occupation: registerForm.occupation,
      });

      console.log(res);
      if (res) {
        setRegisterSuccess("Registration successful! You can now log in.");
        setRegisterForm({
          loginName: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          location: "",
          description: "",
          occupation: "",
        });
        setTimeout(() => {
          setIsLogin(true);
          setRegisterSuccess("");
        }, 2000);
      } else {
        setRegisterError("Login name already exists");
      }
    } catch (error) {
      setRegisterError(
        "Registration failed: " + (error.message || error.toString())
      );
    }
  };

  const handleLoginChange = (field) => (e) => {
    setLoginForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleRegisterChange = (field) => (e) => {
    setRegisterForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      p={2}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: "100%" }}>
        <Box mb={3}>
          <Typography variant="h5" component="h1" gutterBottom>
            {isLogin ? "Login" : "Register"}
          </Typography>
          <Button
            onClick={() => {
              setIsLogin(!isLogin);
              setLoginError("");
              setRegisterError("");
              setRegisterSuccess("");
            }}
            sx={{ mt: 1 }}
          >
            {isLogin ? "Need to register?" : "Already have an account?"}
          </Button>
        </Box>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit}>
            {loginError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {loginError}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Login Name"
              variant="outlined"
              value={loginForm.loginName}
              onChange={handleLoginChange("loginName")}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={loginForm.password}
              onChange={handleLoginChange("password")}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            {registerError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {registerError}
              </Alert>
            )}
            {registerSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {registerSuccess}
              </Alert>
            )}

            <TextField
              fullWidth
              required
              label="Login Name"
              variant="outlined"
              value={registerForm.loginName}
              onChange={handleRegisterChange("loginName")}
              margin="normal"
            />
            <TextField
              fullWidth
              required
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={registerForm.password}
              onChange={handleRegisterChange("password")}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              required
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              value={registerForm.confirmPassword}
              onChange={handleRegisterChange("confirmPassword")}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              required
              label="First Name"
              variant="outlined"
              value={registerForm.firstName}
              onChange={handleRegisterChange("firstName")}
              margin="normal"
            />
            <TextField
              fullWidth
              required
              label="Last Name"
              variant="outlined"
              value={registerForm.lastName}
              onChange={handleRegisterChange("lastName")}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              value={registerForm.location}
              onChange={handleRegisterChange("location")}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Occupation"
              variant="outlined"
              value={registerForm.occupation}
              onChange={handleRegisterChange("occupation")}
              margin="normal"
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              variant="outlined"
              value={registerForm.description}
              onChange={handleRegisterChange("description")}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Register Me
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
}

export default LoginRegister;
