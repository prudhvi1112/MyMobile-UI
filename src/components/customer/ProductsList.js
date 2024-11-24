import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../customer/ProductCard";
import { Box, Grid, Typography, Badge, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { faker } from "@faker-js/faker";

// Generate dummy products
const sampleBase64Image =
  "/9j/4AAQSkZJRgABAQEASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAPKADAAQAAAABAAAAPAAAAP/bAEMABQUFBQUFBQYGBQgIBwgICwoJCQoLEQwNDA0MERoQExAQExAaFxsWFRYbFykgHBwgKS8nJSctNzU2NVFRdX6Fer7/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/2gAMAwEAAhEDEQA/APOiSTk9TRRRXOSFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf/9k=";

const dummyProducts = Array.from({ length: 50 }, (_, index) => ({
  productId: `PRD${String(index + 1).padStart(4, "0")}`,
  model: faker.commerce.productName(),
  brand: faker.company.name(),
  description: faker.commerce.productDescription(),
  price: faker.number.int({ min: 1000, max: 100000 }),
  quantity: faker.number.int({ min: 0, max: 100 }),
  color: faker.color.human(),
  productFeatures: Array.from(
    { length: faker.number.int({ min: 3, max: 7 }) },
    () => faker.commerce.productAdjective()
  ).join(", "),
  imageOfProduct: sampleBase64Image,
}));

const ProductsList = () => {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const navigate = useNavigate();
  const [products] = useState(dummyProducts);

  const handleCartClick = () => {
    navigate("/customer/cart");
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
          backgroundColor: "black",
          padding: 2,
          borderRadius: 2,
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

      <Grid container spacing={2} justifyContent="center">
        {products.length === 0 ? (
          <Typography
            variant="h6"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            No products available.
          </Typography>
        ) : (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.productId}>
              <ProductCard product={product} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default ProductsList;
