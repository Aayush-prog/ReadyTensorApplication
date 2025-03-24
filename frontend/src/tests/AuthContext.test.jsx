import { render, screen } from "@testing-library/react";
import { AuthProvider, AuthContext } from "../AuthContext";
import { useContext } from "react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import React from "react";
import { BrowserRouter } from "react-router-dom";

const TestComponent = () => {
  const auth = useContext(AuthContext);
  return (
    <div>
      <p data-testid="authToken">{auth?.authToken}</p>
      <p data-testid="role">{auth?.role}</p>
      <p data-testid="id">{auth?.id}</p>
    </div>
  );
};

describe("AuthProvider Component", () => {
  it("should render children and context values properly", () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <TestComponent />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByTestId("authToken")).toHaveTextContent("");
    expect(screen.getByTestId("role")).toHaveTextContent("");
    expect(screen.getByTestId("id")).toHaveTextContent("");
  });
});
