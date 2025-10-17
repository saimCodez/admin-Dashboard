import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";

import { FirebaseProvider } from "./context/firebase.tsx";
import { Toaster } from "sonner";
import { StudentsProvider } from "./context/StudentsContext.tsx";
// Import your Publishable Key



createRoot(document.getElementById("root")!).render(
  <StrictMode>
   
      <FirebaseProvider>
        <StudentsProvider>
        <Toaster richColors position="bottom-right" />
        <App />
        </StudentsProvider>
      </FirebaseProvider>
   
  </StrictMode>
);
