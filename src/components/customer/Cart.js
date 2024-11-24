import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItem,
  clearCart,
} from "../../redux/cartSlice";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const { items, totalQuantity, totalPrice } = useSelector(
    (state) => state.cart
  );
  console.log("products", items);

  const handleIncreaseQuantity = (item) => {
    dispatch(
      updateCartItem({ id: item.productId, quantity: item.quantity + 1 })
    );
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateCartItem({ id: item.productId, quantity: item.quantity - 1 })
      );
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    const cartRequest = {
      userId: userData?.userId,
      userRole: "CUSTOMER",
      products: items,
    };
    //api call to post cart request

    dispatch(clearCart());
    navigate("/");
  };

  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  return (
    <Box sx={{ padding: 2, minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom align="center" color="black">
        Your Cart
      </Typography>
      {items.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "70vh",
            textAlign: "center",
            color: "black",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              marginBottom: 2,
            }}
          >
            Your Cart is Empty
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ marginBottom: 3 }}
          >
            Looks like you haven't added anything to your cart yet. Start
            shopping now!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
            sx={{
              paddingX: 4,
              paddingY: 1.5,
              fontSize: "1rem",
            }}
          >
            Go to Products
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {items.map((item) => (
                <Grid item xs={12} sm={6} key={item.productId}>
                  <Card
                    variant="outlined"
                    sx={{
                      padding: 2,
                      backgroundColor: "white",
                      color: "black",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.imageOfProduct}
                      alt={item.model}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom color="black">
                        {item.model}
                      </Typography>
                      <Typography variant="body1" color="text.primary">
                        Price: ₹{item.price}
                      </Typography>
                      <Typography variant="body1" color="text.primary">
                        Quantity: {item.quantity}
                      </Typography>
                    </CardContent>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => handleDecreaseQuantity(item)}
                        sx={{
                          margin: 1,
                          color: "black",
                          borderColor: "black",
                        }}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <Typography
                        variant="body1"
                        sx={{ marginTop: 1, color: "black" }}
                      >
                        {item.quantity}
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => handleIncreaseQuantity(item)}
                        sx={{
                          margin: 1,
                          color: "black",
                          borderColor: "black",
                        }}
                      >
                        +
                      </Button>
                    </Box>

                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleRemoveItem(item.productId)}
                      sx={{
                        marginTop: 2,
                        width: "100%",
                        padding: 1,
                        background: "black",
                        color: "white",
                        borderColor: "black",
                      }}
                    >
                      <Delete sx={{ marginRight: 8 }} /> Remove Item
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4} gap={3}>
            <Card
              variant="outlined"
              sx={{ padding: 2, backgroundColor: "white", color: "black" }}
            >
              <Typography
                variant="h6"
                gutterBottom
                align="center"
                color="primary"
              >
                Cart Bill
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell>{item.model}</TableCell>
                        <TableCell align="right">
                          ₹{formatPrice(item.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ marginY: 2 }} />

              <Box
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  padding: 2,
                  borderRadius: 2,
                  textAlign: "center",
                  marginTop: 2,
                }}
              >
                <Typography variant="h5">
                  Total Price: ₹{formatPrice(totalPrice)}
                </Typography>
              </Box>

              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => dispatch(clearCart())}
                  sx={{ paddingX: 4 }}
                >
                  Clear Cart
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCheckout}
                  sx={{ paddingX: 4 }}
                >
                  Checkout
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Cart;