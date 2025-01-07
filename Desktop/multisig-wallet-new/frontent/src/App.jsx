import "./App.css";
import WalletPage from "./pages/WalletPage";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/wallet/:wallet" element={<WalletPage />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
