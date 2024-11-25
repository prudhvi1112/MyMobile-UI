import { useState } from "react";
import { Button, TextField, Typography, Box, Container } from "@mui/material";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const SigninForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    userPassword: "",
  });

  const [errors, setErrors] = useState({
    userId: null,
    userPassword: null,
    serverError: null,
  });

  const validate = () => {
    let tempErrors = {
      userId: null,
      userPassword: null,
      serverError: null,
    };
    let isValid = true;

    if (!formData.userId) {
      tempErrors.userId = "Username is required";
      isValid = false;
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(formData.userId)) {
      tempErrors.userId = "Username must contain both letters and numbers";
      isValid = false;
    }

    if (!formData.userPassword) {
      tempErrors.userPassword = "Password is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: null,
      serverError: null,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        const requestData = {
          userId: formData.userId,
          userPassword: formData.userPassword,
        };
        const response = await axios({
          method: "post",
          url: "http://192.168.0.124:9998/user/login",
          data: requestData,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = response.data;
        login(data);

        if (data.userRole === "VENDOR") {
          navigate("/vendor/products");
        } else {
          navigate("/customer/products");
        }

        console.log("Login successful:", data);
      } catch (error) {
        console.error("Login error:", error);

        if (error.response && error.response.data) {
          const errorData = error.response.data;
          console.log("Error data:", errorData);

          setErrors((prev) => ({
            ...prev,
            ...errorData,
            serverError: null,
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            serverError: "Network error. Please check your connection.",
          }));
        }
      }
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 400, mx: "auto", p: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            textAlign: "center",
            mb: 4,
            fontFamily: "monospace",
            letterSpacing: "-1px",
          }}
        >
          Login into MyMobile
        </Typography>

        {errors.serverError && (
          <Typography
            color="error"
            sx={{
              textAlign: "center",
              mb: 2,
              fontFamily: "monospace",
            }}
          >
            {errors.serverError}
          </Typography>
        )}

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Customer/Vendor ID"
            variant="outlined"
            name="userId"
            value={formData.userId}
            onChange={(e) => {
              const value = e.target.value
                .replace(/[^A-Z0-9]/gi, "")
                .toUpperCase();

              setFormData((prev) => ({
                ...prev,
                userId: value,
              }));
              setErrors((prev) => ({
                ...prev,
                userId: null,
                serverError: null,
              }));
            }}
            error={Boolean(errors.userId)}
            helperText={errors.userId}
            margin="normal"
            InputProps={{
              sx: {
                fontFamily: "monospace",
                "&:focus": {
                  borderColor: "black",
                },
              },
            }}
            InputLabelProps={{
              sx: { fontFamily: "monospace" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black",
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            name="userPassword"
            value={formData.userPassword}
            onChange={handleChange}
            error={Boolean(errors.userPassword)}
            helperText={errors.userPassword}
            margin="normal"
            InputProps={{
              sx: {
                fontFamily: "monospace",
                "&:focus": {
                  borderColor: "black",
                },
              },
            }}
            InputLabelProps={{
              sx: { fontFamily: "monospace" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black",
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            sx={{
              mt: 3,
              backgroundColor: "black",
              fontFamily: "monospace",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "white",
                color: "black",
                border: "1px solid black",
              },
            }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};
