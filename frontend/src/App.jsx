// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Box, Container } from "@mui/material";
import Home from "./pages/Home";
import Stats from "./pages/Stats";

const App = () => (
  <Router>
    <AppBar position='static'>
      <Container maxWidth='md'>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button color='inherit' component={Link} to='/'>
              Home
            </Button>
            <Button color='inherit' component={Link} to='/stats'>
              Stats
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/stats' element={<Stats />} />
    </Routes>
  </Router>
);

export default App;
