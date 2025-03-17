import React, { lazy, Suspense, useState } from "react";
import TripForm from "./pages/main/TripForm";
import ErrorBoundary from "./pages/main/Components/ErrorBoundary";

const TripResult = lazy(() => import("./pages/main/TripResults"));

// function ErrorBoundary({ children }) {
//   try {
//     return children;
//   } catch (error) {
//     return (
//       (<p>Something went wrong. Please try again.</p>),
//       console.log("Error:", error)
//     );
//   }
// }

function App() {
  const [showResults, setShowResults] = useState(false);

  return (
    <>
      {!showResults ? (
        <TripForm onFormSubmit={() => setShowResults(true)} />
      ) : (
        <ErrorBoundary>
          <Suspense fallback={<p>Loading trip results...</p>}>
            <TripResult />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}

export default App;
