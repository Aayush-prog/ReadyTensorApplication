import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { BrowserRouter, useNavigate } from "react-router-dom";
import SignUp from "../loggedOut/SignUp";
import { AuthContext } from "../AuthContext";

// Mock `useNavigate` from React Router
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("SignUp Component", () => {
  const mockAuthProvider = ({ children }) => (
    <AuthContext.Provider
      value={{
        authToken: null,
        role: null,
        logout: vi.fn(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );

  it("navigates to '/client' when the client card is clicked", () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(
      <mockAuthProvider>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </mockAuthProvider>
    );

    const clientCard = screen.getByText("I'm a client hiring for a project.");
    fireEvent.click(clientCard);

    expect(mockNavigate).toHaveBeenCalledWith("/client");
  });

  it("navigates to '/talent' when the talent card is clicked", () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(
      <mockAuthProvider>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </mockAuthProvider>
    );

    const talentCard = screen.getByTestId("talent-card");
    fireEvent.click(talentCard);

    expect(mockNavigate).toHaveBeenCalledWith("/talent");
  });

  it("renders all elements correctly", () => {
    render(
      <mockAuthProvider>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </mockAuthProvider>
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Join as a client or a talent");

    const loginLink = screen.getByText("Login");
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest("a")).toHaveAttribute("href", "/login");

    expect(
      screen.getByText("I'm a client hiring for a project.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("I'm a talent looking for ideas.")
    ).toBeInTheDocument();
  });
});
