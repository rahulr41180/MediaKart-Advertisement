
import { useState, useEffect } from "react";
import './App.css';
import { FooterComponent } from "./Components/FooterComponent";
import { AdvertisementComponent } from "./Components/AdvertisementComponent";
import { MainuComponent } from "./Components/MainuComponent";

function App() {

  return (
    <>
      <MainuComponent />

      <AdvertisementComponent />
      <FooterComponent />
    </>
  );
}

export default App;
