import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./AuthContext/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51OQuTDSCy4bFkClo7Tc0i3B7P1veTqKG7jZJ3U39VJKpppei0zu0dvLrpu7Sw8lvSfv7QrRRUOBILgKy1D0UEk9S00FVtfEL2Z"
);

const options = {
  mode: "payment",
  currency: "inr",
  amount: 999,
};

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Elements stripe={stripePromise} options={options}>
          <App />
        </Elements>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
