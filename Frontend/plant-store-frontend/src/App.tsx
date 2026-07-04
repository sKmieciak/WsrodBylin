import { CategoryProvider } from "./context/CategoryContext";
import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer/Footer";
import { Container } from "./components/Container/Container";
import { AppRoutes } from "./routes/AppRoutes";
import { CategoryBarWrapper } from "./components/CategoryBar/CategoryBarWrapper";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useLocation } from "react-router-dom";
import "./index.css";

const HIDE_NAV_MOBILE = ["/cart", "/checkout"];

function App() {
  const location = useLocation();
  const hideNavOnMobile = HIDE_NAV_MOBILE.some(p => location.pathname.startsWith(p));

  return (
    <ErrorBoundary>
      <CategoryProvider>
        <div className="flex flex-col min-h-screen">
          <div className={hideNavOnMobile ? "hidden sm:block" : ""}>
            <Navbar />
            <CategoryBarWrapper />
          </div>
          <div className="flex-grow">
            <Container>
              <AppRoutes />
            </Container>
          </div>
          <Footer />
        </div>
      </CategoryProvider>
    </ErrorBoundary>
  );
}

export default App;
