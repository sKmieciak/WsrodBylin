import { CategoryProvider } from "./context/CategoryContext";
import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer/Footer";
import { Container } from "./components/Container/Container";
import { AppRoutes } from "./routes/AppRoutes";
import { CategoryBarWrapper } from "./components/CategoryBar/CategoryBarWrapper";
import "./index.css";

function App() {
  return (
    <CategoryProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <CategoryBarWrapper />
        <Container>
          <AppRoutes />
        </Container>
        <Footer />
      </div>
    </CategoryProvider>
  );
}

export default App;
