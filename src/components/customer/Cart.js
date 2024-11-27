import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCartAPI,
  fetchCartData,
  removeFromCart,
  updateCartItem,
  removeProductFromCartAPI
} from "../../redux/cartSlice";
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the cart data from the Redux store
  const cartData = useSelector((state) => state.cart.items);
  const loading = useSelector((state) => state.cart.loading); // Assuming loading state is in Redux
  const error = useSelector((state) => state.cart.error); // Assuming error state is in Redux
  const Quantity = useSelector((state) => state.cart.totalQuantity); // Assuming error state is in Redux

  const userId = JSON.parse(localStorage.getItem("user"))?.userId;

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch cart data when the component mounts
  useEffect(() => {
    if (userId) {
      dispatch(fetchCartData(userId));
    }
  }, [dispatch, userId]);

  // Recalculate total price and total quantity when cart data changes
  useEffect(() => {
    let quantity = 0;
    let price = 0;

    cartData.forEach((item) => {
      quantity += item.quantity;
      price += item.quantity * item.price;
    });

    setTotalQuantity(quantity);
    setTotalPrice(price);
  }, [cartData]);

  const handleDecreaseQuantity = async (item) => {
    if (item.quantity > 1) {
      const updatedProduct = {
        ...item,
        quantity: item.quantity - 1,
      };
      try {
        const actionResult = await dispatch(
          addProductToCartAPI({ product: updatedProduct })
        );

        if (addProductToCartAPI.fulfilled.match(actionResult)) {
          dispatch(updateCartItem(updatedProduct));
        } else {
          console.error("Error while updating product quantity:", actionResult.payload);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    } else {
      dispatch(removeFromCart(item.productId));
    }
  };

  const handleIncreaseQuantity = async (item) => {
    const updatedProduct = {
      ...item,
      quantity: item.quantity + 1,
    };
    try {
      const actionResult = await dispatch(
        addProductToCartAPI({ product: updatedProduct })
      );

      if (addProductToCartAPI.fulfilled.match(actionResult)) {
        dispatch(updateCartItem(updatedProduct));
      } else {
        console.error("Error while updating product quantity:", actionResult.payload);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleRemoveProduct = async (item) => {
    try {
      const actionResult = await dispatch(
        removeProductFromCartAPI({ userId, productId: item.productId })
      );

      if (removeProductFromCartAPI.fulfilled.match(actionResult)) {
        dispatch(removeFromCart(item.productId));
      } else {
        console.error("Error while removing product from cart:", actionResult.payload);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleGoToProductsList = () => {
    navigate("/customer/products");
  };

  const CartProducts = () => (
    <Grid container spacing={2} flex={2}>
      {cartData.length > 0 ? (
        cartData.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.productId}>
            <Card>
              <CardMedia
                component="img"
                src={
                  item.imageOfProduct
                    ? `data:image/jpeg;base64,${item.imageOfProduct}`
                    : "https://via.placeholder.com/200/000000/FFFFFF?text=No+Image"
                }
                alt={item.model}
                sx={{ height: 200, objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6">{item.model}</Typography>
                <Typography variant="body2">
                  ₹{new Intl.NumberFormat("en-IN").format(item.price)}
                </Typography>
                <Typography variant="body2">Quantity: {item.quantity}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: 1 }}>
                  
                  <Typography>{Quantity}</Typography>
                 
                </Box>
                <IconButton sx={{ marginTop: 1 }} onClick={() => handleRemoveProduct(item)}>
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center", marginTop: 3 }}>
          Your cart is empty.
          <Button onClick={handleGoToProductsList}>Go To Products</Button>
        </Typography>
      )}
    </Grid>
  );

  const CartSummary = () => (
    <Box flex={1}>
      <Typography variant="h6">Cart Summary</Typography>
      <Box sx={{ marginTop: 2 }}>
        <Typography>Total Items: {totalQuantity}</Typography>
        <Typography>Total Price: ₹{new Intl.NumberFormat("en-IN").format(totalPrice)}</Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
        disabled={totalQuantity === 0}
      >
        Checkout
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        <Button onClick={handleGoToProductsList} variant="contained">Go To Products</Button>
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {cartData.length === 0 && !loading ? (
        <Typography variant="h6" sx={{ textAlign: "center", marginTop: 3 }}>
          Your cart is empty.
          
        </Typography>
      ) : (
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
          <CartProducts />
          <CartSummary />
        </Box>
      )}
    </Container>
  );
};

export default Cart;
