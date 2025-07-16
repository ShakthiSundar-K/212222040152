import React from "react";
import { Container } from "@mui/material";
import URLForm from "../components/URLForm";

const Home = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <URLForm />
    </Container>
  );
};

export default Home;
