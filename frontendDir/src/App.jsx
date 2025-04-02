import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Corrected import
import TripForm from "./pages/main/TripForm";
import ErrorBoundary from "./pages/main/Components/ErrorBoundary";
import Login from "./pages/main/Components/Login";
import Register from "./pages/main/Components/Register";
import ActivateAccount from "./pages/main/Components/ActivateAccount";
import ForgotPassword from "./pages/main/Components/ForgotPassword";
import ProtectedRoute from "./pages/main/Components/ProtectedRoute";
import ResetPassword from "./pages/main/Components/ResetPassword";

const TripResult = lazy(() => import("./pages/main/TripResults"));

function App() {
  return (
    <Router>
      {" "}
      {/* Added Router here, wrapping the whole structure */}
      <ErrorBoundary>
        <Suspense fallback={<p>Loading...</p>}>
          {" "}
          {/* Added Suspense here, wrapping all lazy-loaded components */}
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/activate-account/:token"
              element={<ActivateAccount />}
            />
            <Route
              path="/generate-trip"
              element={
                <ProtectedRoute>
                  <TripForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trip-result"
              element={
                <ProtectedRoute>
                  <TripResult /> {/* Used the lazy-loaded component */}
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
