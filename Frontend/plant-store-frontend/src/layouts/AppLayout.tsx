// src/layouts/AppLayout.tsx
import { Outlet } from "react-router-dom";
import { CategoryProvider } from "../context/CategoryContext";
import { Navbar } from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";
import { Container } from "../components/Container/Container";
import { CategoryBarWrapper } from "../components/CategoryBar/CategoryBarWrapper";

export default function AppLayout() {
  return (
    <CategoryProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <CategoryBarWrapper />
        <Container>
          <Outlet />
        </Container>
        <Footer />
      </div>
    </CategoryProvider>
  );
}
