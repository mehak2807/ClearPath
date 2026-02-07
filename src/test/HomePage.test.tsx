import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
  },
}));

describe("HomePage", () => {
  const renderHomePage = () => {
    return render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  };

  it("should render the welcome title", () => {
    renderHomePage();
    expect(screen.getByText("Welcome to ClearPath")).toBeInTheDocument();
  });

  it("should render the subtitle", () => {
    renderHomePage();
    expect(
      screen.getByText("Select your role to access the supply chain transparency platform")
    ).toBeInTheDocument();
  });

  it("should render all three role cards", () => {
    renderHomePage();
    expect(screen.getByText("Consumer")).toBeInTheDocument();
    expect(screen.getByText("Verified Actor")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
  });

  it("should render card descriptions", () => {
    renderHomePage();
    expect(
      screen.getByText(/Scan QR codes to verify product authenticity/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Manage verified identities and track supply chain/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Access ERP integration, inventory management/)
    ).toBeInTheDocument();
  });
});
