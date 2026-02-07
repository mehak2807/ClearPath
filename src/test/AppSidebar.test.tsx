import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AppSidebar from "../components/layout/AppSidebar";
import { UserRoleProvider } from "../context/UserRoleContext";
import { ReactNode } from "react";

const renderWithProviders = (children: ReactNode, initialRole: string | null = null) => {
  if (initialRole) {
    localStorage.setItem("clearpath-user-role", initialRole);
  }
  return render(
    <BrowserRouter>
      <UserRoleProvider>{children}</UserRoleProvider>
    </BrowserRouter>
  );
};

describe("AppSidebar Navigation Filtering", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should show correct navigation items for company role", () => {
    renderWithProviders(<AppSidebar />, "company");
    
    // Company role should see these items
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Inventory")).toBeInTheDocument();
    expect(screen.getByText("Verified Actors")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    
    // Company role should NOT see these items
    expect(screen.queryByText("ERP Connect")).not.toBeInTheDocument();
    expect(screen.queryByText("QR Verify")).not.toBeInTheDocument();
  });

  it("should show ERP Connect for actor role", () => {
    renderWithProviders(<AppSidebar />, "actor");
    
    // Actor role should see My Companies, ERP Connect and Settings
    expect(screen.getByText("My Companies")).toBeInTheDocument();
    expect(screen.getByText("ERP Connect")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    
    // Actor role should NOT see company-specific items
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Inventory")).not.toBeInTheDocument();
    expect(screen.queryByText("Verified Actors")).not.toBeInTheDocument();
    expect(screen.queryByText("QR Verify")).not.toBeInTheDocument();
  });

  it("should show QR Verify for consumer role", () => {
    renderWithProviders(<AppSidebar />, "consumer");
    
    // Consumer role should only see QR Verify
    expect(screen.getByText("QR Verify")).toBeInTheDocument();
    
    // Consumer role should NOT see other items
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Inventory")).not.toBeInTheDocument();
    expect(screen.queryByText("Verified Actors")).not.toBeInTheDocument();
    expect(screen.queryByText("ERP Connect")).not.toBeInTheDocument();
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });
});
