import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { config } from "@/config/config.js";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </WagmiProvider>,
);
