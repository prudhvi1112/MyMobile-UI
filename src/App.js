import "./App.css";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import { Box, Typography } from "@mui/material";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box className="App">
        <Typography sx={{ color: "primary.main", textAlign: "center" }}>
          Welcome to My Mobile
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
