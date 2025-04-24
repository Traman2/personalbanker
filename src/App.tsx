import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SignupForm } from "./pages/Signup";
import { LoginForm } from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { JSX } from "react";
import Security from "@/pages/Security.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import Settings from "@/pages/Settings.tsx";
import TransactionForm from "@/pages/Transact.tsx";
import ToasterLayout from "@/components/Layout.tsx";
import BankAccountCreation from "@/pages/BankAccountCreation.tsx";
import DeleteAccount from "@/pages/DeactivateAccount.tsx";
import TransactionPage from "@/pages/AccountSummary.tsx";
import AiTransactionPage from "@/pages/AIReceipt.tsx";
import Stocks from "@/pages/Stocks.tsx"

function App() {
  return (
    <ToasterLayout>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm />} />
              <Route path="/stocks" element={<Stocks/>}/>
            <Route
              path="/security"
              element={
                <PrivateRoute>
                  <Security />
                </PrivateRoute>
              }
            />
            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <TransactionPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route
              path="/transact"
              element={
                <PrivateRoute>
                  <TransactionForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/creation"
              element={
                <PrivateRoute>
                  <BankAccountCreation />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/deleteAccount"
              element={
                <PrivateRoute>
                  <DeleteAccount />
                </PrivateRoute>
              }
            />

              <Route
                path="/ai"
                element={
                  <PrivateRoute>
                      <AiTransactionPage/>
                  </PrivateRoute>
                }
              />
          </Routes>
        </Router>
      </ThemeProvider>
    </ToasterLayout>
  );
}

// Protect dashboard route
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default App;
