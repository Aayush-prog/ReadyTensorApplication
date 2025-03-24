import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { BrowserRouter } from "react-router-dom";
import Nav from "../Nav";
import { AuthProvider, AuthContext } from "../AuthContext";
import axios from "axios";
import { unmountComponentAtNode } from "react-dom";

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});
vi.mock("axios");

let container = null; //container variable
const renderWithContext = (ui) => {
  container = document.createElement("div");
  document.body.appendChild(container);
  return render(ui, { container });
};

describe("Nav Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  it("should render all elements correctly when user is not logged in", async () => {
    axios.get.mockResolvedValue({ data: { data: { image: "test.jpg" } } });
    renderWithContext(
      <AuthProvider>
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      </AuthProvider>
    );
    const logo = screen.getByRole("img", { name: "DevX Logo" });
    expect(logo).toBeInTheDocument();
    expect(screen.getByTestId("desktopHome")).toBeInTheDocument();
    expect(screen.getByTestId("desktopFindTalent")).toBeInTheDocument();
    expect(screen.getByTestId("desktopFindWork")).toBeInTheDocument();
    expect(screen.getByTestId("desktopWhyDevX")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(screen.getByTestId("desktopLogin")).toBeInTheDocument();
    expect(screen.getByTestId("desktopSignUp")).toBeInTheDocument();
  });

  it("should render profile picture and logout button when logged in", async () => {
    // Set the values in localStorage to simulate a logged-in user
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "authToken") return "mocked-token";
      if (key === "role") return "user";
      if (key === "id") return "123";
      return null;
    });
    axios.get.mockResolvedValue({ data: { data: { image: "test.jpg" } } });
    renderWithContext(
      <AuthProvider>
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByTestId("desktopProfile")).toBeInTheDocument();
    expect(screen.getByTestId("desktopLogout")).toBeInTheDocument();
  });
});
