import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../customer/ProductCard";
import { fetchProducts } from "../../redux/productSlice";
import {
  Box,
  Grid,
  Typography,
  Badge,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

const ProductsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { products, status, error } = useSelector((state) => state.products);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  const [priceRange, setPriceRange] = useState({ min: 1000, max: 1000000 });
  const [selectedBrand, setSelectedBrand] = useState("");

  useEffect(() => {
    // Fetch products on mount
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCartClick = () => {
    navigate("/customer/cart");
  };

  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: value ? Math.max(0, parseInt(value, 10)) : "",
    }));
  };

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  // Unique brands for dropdown
  const uniqueBrands = [...new Set(products.map((product) => product.brand))];

  // Filtered products
  const filteredProducts = products.filter(
    (product) =>
      product.price >= (priceRange.min || 0) &&
      product.price <= (priceRange.max || Infinity) &&
      (selectedBrand === "" || product.brand === selectedBrand)
  );

  return (
    <Box sx={{ display: "flex", padding: 2 }}>
      {/* Sidebar Filters */}
      <Box
        sx={{
          width: "20%",
          marginRight: 3,
          padding: 2,
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          position: "sticky",
          top: "10%",
          alignSelf: "start",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>

        {/* Price Range Filter */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography gutterBottom>Price Range</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Min Price"
              name="min"
              type="number"
              value={priceRange.min}
              onChange={handlePriceChange}
              variant="outlined"
              size="small"
              fullWidth
            />
            <TextField
              label="Max Price"
              name="max"
              type="number"
              value={priceRange.max}
              onChange={handlePriceChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Box>
          {priceRange.min > priceRange.max && (
            <Typography variant="caption" color="error">
              Min price cannot exceed Max price.
            </Typography>
          )}
        </Box>

        {/* Brand Selector */}
        <Box sx={{ marginBottom: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Brand</InputLabel>
            <Select
              value={selectedBrand}
              onChange={handleBrandChange}
              displayEmpty
            >
              <MenuItem value="">
                
              </MenuItem>
              {uniqueBrands.map((brand, index) => (
                <MenuItem key={index} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Products Section */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Header with sticky cart icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
            backgroundColor: "black",
            padding: 2,
            borderRadius: 2,
            position: "sticky",
            top: "10%",
            zIndex: 10,
          }}
        >
          <Typography variant="h4" sx={{ color: "white" }}>
            Products
          </Typography>

          <IconButton onClick={handleCartClick}>
            <Badge
              badgeContent={totalQuantity}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "white",
                  color: "black",
                  fontSize: "0.75rem",
                  padding: "5px",
                  minWidth: "24px",
                  height: "24px",
                  borderRadius: "50%",
                },
              }}
            >
              <ShoppingCartIcon style={{ color: "white" }} />
            </Badge>
          </IconButton>
        </Box>

        {/* Products Grid */}
        {status === "loading" ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : status === "failed" ? (
          <Typography
            variant="h6"
            color="error"
            align="center"
            sx={{ mt: 4 }}
          >
            Error: {error}
          </Typography>
        ) : filteredProducts.length === 0 ? (
          <Typography
            variant="h6"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            No products match the applied filters.
          </Typography>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.productId}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ProductsList;
