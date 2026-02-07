import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import { UserRoleProvider } from "../context/UserRoleContext";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { children?: React.ReactNode }) => <p {...props}>{children}</p>,
  },
}));

describe("HomePage", () => {
  const renderHomePage = () => {
    return render(
      <UserRoleProvider>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </UserRoleProvider>
    );
  };

  it("should render the hero title", () => {
    renderHomePage();
    expect(screen.getByText("Transparent Supply Chain Management")).toBeInTheDocument();
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

  it("should render card descriptions and buttons", () => {
    renderHomePage();
    expect(
      screen.getByText(/Scan QR codes to verify product authenticity/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Manage your verified identity and participate/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Access ERP integration, inventory management/)
    ).toBeInTheDocument();
    expect(screen.getByText("Enter as Consumer")).toBeInTheDocument();
    expect(screen.getByText("Enter as Actor")).toBeInTheDocument();
    expect(screen.getByText("Enter as Company")).toBeInTheDocument();
  });
});
