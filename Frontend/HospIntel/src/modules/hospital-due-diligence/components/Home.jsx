import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Typography variant="h3" sx={{ mb: 4 }}>
        Welcome to HospIntel
      </Typography>
      <Stack spacing={2} direction="row">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard")}
        >
          Hospital Due Deligence
        </Button>
      </Stack>
    </Box>
  );
};

export default Home;
