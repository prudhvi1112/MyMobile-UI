import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Box,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  // Ensure all displayed values are strings and exist
  const {
    productId = "",
    brand = "",
    description = "",
    price = 0,
    imageOfProduct = "",
    model = "",
  } = product || {};

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  // Format price to handle different numeric formats
  const formattedPrice =
    typeof price === "number"
      ? price.toLocaleString("en-US", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : "₹0";

  return (
    <Card
      sx={{
        maxWidth: 300,
        margin: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        boxShadow: 3,
      }}
    >
      <CardMedia
        component="img"
        image={imageOfProduct || "/placeholder-image.jpg"}
        alt={String(model || "Product Image")}
        sx={{ height: 200, objectFit: "cover" }}
      />

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        {/* Brand Name */}
        <Typography variant="h6" gutterBottom>
          {String(brand || "Unknown Brand")}
        </Typography>

        {/* Model Name */}
        <Typography variant="subtitle1" gutterBottom>
          {String(model || "Unknown Model")}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            marginBottom: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
          }}
        >
          {String(description || "No description available")}
        </Typography>

        {/* Price */}
        <Box
          sx={{
            backgroundColor: "black",
            color: "white",
            display: "inline-block",
            padding: "5px 10px",
            borderRadius: 1,
            marginBottom: 2,
            width: "fit-content",
          }}
        >
          <Typography variant="h6">{formattedPrice}</Typography>
        </Box>

        {/* Add to Cart Button */}
        <Button
          variant="contained"
          onClick={handleAddToCart}
          fullWidth
          sx={{
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            padding: "10px 0",
          }}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
