import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Box,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addProductToCartAPI } from "../../redux/cartSlice";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(0); // Initial quantity is set to 0

  const handleAddToCart = (product, itemQuantity) => {
    if (itemQuantity > 0) {
      dispatch(addProductToCartAPI({ product, itemQuantity }))
        .unwrap()
        
    } 
  };

  // Increase quantity
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1); // Increment quantity
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1); // Decrement quantity
    }
  };

  // Format price to handle different numeric formats
  const formattedPrice =
    typeof product.price === "number"
      ? product.price.toLocaleString("en-US", {
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
      {/* Product Image */}
      <CardMedia
        component="img"
        src={
          product.imageOfProduct
            ? `data:image/jpeg;base64,${product.imageOfProduct}`
            : "https://via.placeholder.com/200/000000/FFFFFF?text=No+Image"
        }
        alt={product.model}
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
          {String(product.brand || "Unknown Brand")}
        </Typography>

        {/* Model Name */}
        <Typography variant="subtitle1" gutterBottom>
          {String(product.model || "Unknown Model")}
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
          {String(product.description || "No description available")}
        </Typography>

        <Divider sx={{ marginY: 1 }} />

        {/* Additional Information */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Color:</strong> {String(product.color || "N/A")}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Quantity Available:</strong>{" "}
          {product.quantity > 0 ? product.quantity : "Out of Stock"}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Features:</strong> {String(product.features || "N/A")}
        </Typography>

        <Divider sx={{ marginY: 2 }} />

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

        {/* Quantity Control */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            onClick={decreaseQuantity}
            disabled={quantity <= 0}
            sx={{ backgroundColor: "grey.300", padding: "6px" }}
          >
            <RemoveIcon />
          </IconButton>
          <TextField
            value={quantity}
            name="quantity"
            onChange={(e) =>
              setQuantity(Math.max(0, parseInt(e.target.value) || 0))
            } // Ensures the value is a valid number
            type="number"
            sx={{ width: "60px", textAlign: "center" }}
          />
          <IconButton
            onClick={increaseQuantity}
            sx={{ backgroundColor: "grey.300", padding: "6px" }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Add to Cart Button */}
        <Button
          variant="contained"
          onClick={() => handleAddToCart(product, quantity)} // Use the updated quantity
          fullWidth
          sx={{
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            padding: "10px 0",
          }}
          disabled={product.quantity === 0} // Disable button if quantity is 0
        >
          {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
