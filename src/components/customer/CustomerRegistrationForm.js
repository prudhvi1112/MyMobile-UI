import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  InputAdornment,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  submitCustomerForm,
  setFormData,
  resetFormData,
} from "../../redux/customerSlice";

const CustomerRegistrationForm = () => {
  const dispatch = useDispatch();
  const { status, error, response } = useSelector((state) => state.customer);
  const formData = useSelector((state) => state.customer);

  const [errors, setErrors] = useState({});
  const [countryCode, setCountryCode] = useState("+91"); // Default to India (+91)

  // List of country codes
  const countryCodes = [
    { code: "+1" },
    { code: "+44" },
    { code: "+91" },
    { code: "+61" },
    // Add more country codes as needed
  ];

  // Validation function for individual fields
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "userId":
        if (!value) error = "User ID cannot be null";
        break;

      case "userName":
        if (!value) error = "Username cannot be null";
        break;

      case "userPassword":
        if (!value) error = "Password cannot be null";
        else if (value.length < 6)
          error = "Password must be at least 6 characters";
        break;

      case "userConfirmPassword":
        if (!value) error = "Confirm Password cannot be null";
        else if (value !== formData.userPassword)
          error = "Passwords do not match";
        break;

      case "userEmail":
        if (!value) error = "Email cannot be null";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email format";
        break;

      case "userNumber":
        if (!value) error = "Phone number cannot be null";
        else if (!/^\d{10}$/.test(value))
          error = "Phone number must be 10 digits";
        break;

      case "userAddress":
        if (!value) error = "Address cannot be null";
        break;

      case "userPincode":
        if (!value) error = "Pincode cannot be null";
        else if (!/^\d{6}$/.test(value)) error = "Pincode must be 6 digits";
        break;

      case "userGstNumber":
        if (!value) error = "GST Number cannot be null";
        break;

      case "userPanNumber":
        if (!value) error = "PAN Number cannot be null";
        break;

      case "userRole":
        if (!value) error = "User Role cannot be null";
        break;

      default:
        break;
    }

    return error;
  };

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch(setFormData({ name, value }));

    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError,
    }));
  };

  // Handle country code change
  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value); // Update country code state
    dispatch(setFormData({ name: "countryCode", value: e.target.value })); // Send to Redux store
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field] || "");
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      dispatch(submitCustomerForm(formData))
        .unwrap()
        .then(() => {
          dispatch(resetFormData());
        });
    }
  };

  const customerFields = [
    { name: "userId", label: "User ID", type: "text" },
    { name: "userName", label: "Username", type: "text" },
    { name: "userPassword", label: "Password", type: "password" },
    {
      name: "userConfirmPassword",
      label: "Confirm Password",
      type: "password",
    },
    { name: "userNumber", label: "Phone Number", type: "text" },
    { name: "userEmail", label: "Email", type: "email" },
    { name: "userAddress", label: "Address", type: "text" },
    { name: "userPincode", label: "Pincode", type: "text" },
    { name: "userGstNumber", label: "GST Number", type: "text" },
    { name: "userPanNumber", label: "PAN Number", type: "text" },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>


      <Box
        sx={{
          flex: 1,
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          fontFamily: "monospace",
          fontSize: "19px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "70%",
            padding: "20px",
            maxHeight: "80%",
            overflowY: "auto",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
            Customer Registration
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {customerFields.map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    label={field.label}
                    type={field.type}
                    name={field.name}
                    fullWidth
                    variant="outlined"
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                    InputProps={
                      field.name === "userName"
                        ? { style: { textTransform: "uppercase" } }
                        : null
                    }
                  />
                </Grid>
              ))}

              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={!!errors.userRole}
                >
                  <InputLabel>User Role</InputLabel>
                  <Select
                    label="User Role"
                    name="userRole"
                    value={formData.userRole || "customer"} // Default to "customer"
                    onChange={handleChange}
                  >
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="vendor">Vendor</MenuItem>
                  </Select>
                  {errors.userRole && (
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ marginTop: "5px" }}
                    >
                      {errors.userRole}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  {status === "loading" ? "Registering..." : "Register"}
                </Button>
              </Grid>
            </Grid>
          </form>

          {status === "failed" && error && (
            <Typography color="error" variant="body2">
              Error: {error}
            </Typography>
          )}

          {status === "succeeded" && response && (
            <Box sx={{ marginTop: "20px" }}>
              <Typography variant="h6" color="success.main">
                Registration Successful!
              </Typography>
              <Typography variant="body1">
                Customer ID: {response.userId}
              </Typography>
              <Typography variant="body1">
                Customer Email: {response.email}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerRegistrationForm;
