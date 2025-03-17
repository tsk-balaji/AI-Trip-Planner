import React, { lazy, Suspense, useState } from "react";
import TripForm from "./pages/main/TripForm";
import ErrorBoundary from "./pages/main/Components/ErrorBoundary";

const TripResult = lazy(() => import("./pages/main/TripResults"));

function App() {
  const [showResults, setShowResults] = useState(false);

  return (
    <ErrorBoundary>
      <>
        {!showResults ? (
          <TripForm onFormSubmit={() => setShowResults(true)} />
        ) : (
          <Suspense fallback={<p>Loading trip results...</p>}>
            <TripResult />
          </Suspense>
        )}
      </>
    </ErrorBoundary>
  );
}

export default App;
