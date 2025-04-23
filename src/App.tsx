import { BrowserRouter } from "react-router-dom";
import { LoadingSpinnerProvider } from "./modules/core/structure/loading-spinner/providers/LoadingSpinnerProvider";
import { AppRouter } from "./modules/routes/AppRouter";

function App() {
  return (
      <LoadingSpinnerProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </LoadingSpinnerProvider>
  );
}

export default App;