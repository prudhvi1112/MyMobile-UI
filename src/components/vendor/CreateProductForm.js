import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import { ArrowBack, CloudUpload } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ProductForm = () => {
  const navigate = useNavigate();
  const [currentTip, setCurrentTip] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  const [formData, setFormData] = useState({
    productId: "",
    description: "",
    brand: "",
    price: "",
    quantity: "",
    color: "",
    model: "",
    imageOfProduct: null,
    productFeatures: "",
  });

  const [errors, setErrors] = useState({
    productId: null,
    description: null,
    brand: null,
    price: null,
    quantity: null,
    color: null,
    model: null,
    productFeatures: null,
    serverError: null,
  });

  const tips = [
    "Product ID must contain uppercase letters and numbers only",
    "All fields except image are required",
    "Maximum 20 characters for most fields",
    "Color names limited to 15 characters",
    "Detailed description helps customers make decisions",
    "Separate features with commas for better readability",
    "Upload clear, high-quality product images",
    "Double-check all details before submission",
  ];

  useEffect(() => {
    let currentIndex = 0;
    const tip = tips[currentTip];
    const typingInterval = setInterval(() => {
      if (currentIndex <= tip.length) {
        setDisplayedText(tip.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentTip((prev) => (prev + 1) % tips.length);
        }, 3000);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentTip]);

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    // Product ID validation
    if (!formData.productId) {
      tempErrors.productId = "Product ID is required";
      isValid = false;
    } else if (!/^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]+$/.test(formData.productId)) {
      tempErrors.productId =
        "Product ID must contain uppercase letters and numbers only";
      isValid = false;
    }

    // Required field validations
    const requiredFields = [
      "model",
      "brand",
      "price",
      "quantity",
      "color",
      "description",
      "productFeatures",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        tempErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
        isValid = false;
      }
    });

    // Price and Quantity validation
    if (
      formData.price &&
      (!Number(formData.price) || Number(formData.price) <= 0)
    ) {
      tempErrors.price = "Price must be greater than 0";
      isValid = false;
    }
    if (
      formData.quantity &&
      (!Number(formData.quantity) || Number(formData.quantity) <= 0)
    ) {
      tempErrors.quantity = "Quantity must be greater than 0";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let updatedValue = value;

    // Convert productId to uppercase
    if (name === "productId") {
      updatedValue = value.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: null,
      serverError: null,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store the base64 string without the prefix
        const base64String = reader.result.split(",")[1];
        setFormData((prev) => ({
          ...prev,
          imageOfProduct: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        const formDataToSend = {
          ...formData,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
        };

        // Add your API call here
        // For example:
        // await axios.post('/api/products', formDataToSend);

        console.log("Form submitted:", formDataToSend);
        navigate("/vendor/products");
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          serverError: "Failed to add product. Please try again.",
        }));
      }
    }
  };

  // Common TextField props
  const commonTextFieldProps = {
    size: "small",
    inputProps: {
      maxLength: 20,
      style: { fontSize: "0.9rem" },
    },
    sx: {
      "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
          borderColor: "black",
        },
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: "black",
      },
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        p: 3,
        maxWidth: "100%",
        gap: 3,
        overflow: "hidden",
      }}
    >
      {/* Form Section */}
      <Box
        sx={{
          flex: "0 0 70%", // Fixed ratio instead of flexible
          maxWidth: "70%",
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/Vendor/products")}
          sx={{
            mb: 2,
            color: "black",
            "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
            fontFamily: "monospace",
            fontSize: "0.8rem",
          }}
        >
          Back to Products
        </Button>

        <Typography
          variant="h5"
          component="h1"
          sx={{
            mb: 2,
            fontFamily: "monospace",
            letterSpacing: "-0.5px",
            fontSize: "1.2rem",
          }}
        >
          Add New Product
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 2.5,
            height: "fit-content",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  {...commonTextFieldProps}
                  fullWidth
                  label="Product ID"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  error={Boolean(errors.productId)}
                  helperText={errors.productId}
                  inputProps={{
                    ...commonTextFieldProps.inputProps,
                    style: {
                      ...commonTextFieldProps.inputProps.style,
                      textTransform: "uppercase",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...commonTextFieldProps}
                  fullWidth
                  label="Model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  error={Boolean(errors.model)}
                  helperText={errors.model}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...commonTextFieldProps}
                  fullWidth
                  label="Brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  error={Boolean(errors.brand)}
                  helperText={errors.brand}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...commonTextFieldProps}
                  fullWidth
                  label="Color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  error={Boolean(errors.color)}
                  helperText={errors.color}
                  inputProps={{
                    maxLength: 15,
                    style: { fontSize: "0.9rem" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...commonTextFieldProps}
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  error={Boolean(errors.price)}
                  helperText={errors.price}
                  InputProps={{
                    startAdornment: "₹",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...commonTextFieldProps}
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  error={Boolean(errors.quantity)}
                  helperText={errors.quantity}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Description"
                  name="description"
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={handleChange}
                  error={Boolean(errors.description)}
                  helperText={errors.description}
                  sx={commonTextFieldProps.sx}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Product Features"
                  name="productFeatures"
                  multiline
                  rows={2}
                  value={formData.productFeatures}
                  onChange={handleChange}
                  error={Boolean(errors.productFeatures)}
                  helperText={
                    errors.productFeatures ||
                    "Enter features separated by commas"
                  }
                  sx={commonTextFieldProps.sx}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  size="small"
                  sx={{
                    color: "black",
                    borderColor: "black",
                    "&:hover": {
                      borderColor: "black",
                      bgcolor: "rgba(0,0,0,0.1)",
                    },
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                  }}
                >
                  Upload Product Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {formData.imageOfProduct && (
                  <Typography variant="caption" sx={{ ml: 2, color: "green" }}>
                    Image uploaded
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="medium"
                  sx={{
                    bgcolor: "black",
                    fontFamily: "monospace",
                    fontSize: "0.9rem",
                    "&:hover": {
                      bgcolor: "white",
                      color: "black",
                      border: "1px solid black",
                    },
                  }}
                >
                  Add Product
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>

      <Box
        sx={{
          flex: "0 0 27%",
          bgcolor: "black",
          color: "white",
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 1,
          height: "auto",
          position: "sticky",
          top: 3,
        }}
      >
        <img
          src={require("../../assets/mobile-logo-icon-only.png")}
          alt="Logo"
          style={{
            width: "70px",
            height: "70px",
            marginBottom: "1.5rem",
          }}
        />

        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontFamily: "monospace",
            textAlign: "center",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Product Guidelines
        </Typography>

        <Card
          sx={{
            bgcolor: "rgba(255,255,255,0.1)",
            color: "white",
            minHeight: "80px",
            width: "100%",
            mb: 2,
            mt: 3,
          }}
        >
          <CardContent sx={{ py: 3.5, px: 2 }}>
            <Typography
              sx={{
                fontFamily: "monospace",
                minHeight: "70px",
                display: "flex",
                alignItems: "center",
                fontSize: "0.85rem",
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {displayedText}
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mt: "auto" }}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "monospace",
              textAlign: "center",
              opacity: 0.7,
              fontSize: "0.7rem",
            }}
          >
            Need help? Contact support
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductForm;
