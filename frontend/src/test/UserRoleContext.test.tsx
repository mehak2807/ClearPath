import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserRoleProvider, useUserRole } from "../context/UserRoleContext";
import { ReactNode } from "react";

// Helper component to test the context
const TestComponent = () => {
  const { userRole, setUserRole, clearUserRole } = useUserRole();

  return (
    <div>
      <div data-testid="current-role">{userRole || "none"}</div>
      <button onClick={() => setUserRole("actor")}>Set Actor</button>
      <button onClick={() => setUserRole("company")}>Set Company</button>
      <button onClick={() => clearUserRole()}>Clear Role</button>
    </div>
  );
};

const renderWithProvider = (children: ReactNode) => {
  return render(<UserRoleProvider>{children}</UserRoleProvider>);
};

describe("UserRoleContext", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("should initialize with null role", () => {
    renderWithProvider(<TestComponent />);
    expect(screen.getByTestId("current-role")).toHaveTextContent("none");
  });

  it("should set actor role", () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByText("Set Actor"));
    expect(screen.getByTestId("current-role")).toHaveTextContent("actor");
  });

  it("should set company role", () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByText("Set Company"));
    expect(screen.getByTestId("current-role")).toHaveTextContent("company");
  });

  it("should clear role", () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByText("Set Actor"));
    expect(screen.getByTestId("current-role")).toHaveTextContent("actor");
    fireEvent.click(screen.getByText("Clear Role"));
    expect(screen.getByTestId("current-role")).toHaveTextContent("none");
  });

  it("should persist role to localStorage", () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByText("Set Company"));
    expect(localStorage.getItem("clearpath-user-role")).toBe("company");
  });

  it("should load role from localStorage", () => {
    localStorage.setItem("clearpath-user-role", "actor");
    renderWithProvider(<TestComponent />);
    expect(screen.getByTestId("current-role")).toHaveTextContent("actor");
  });

  it("should remove from localStorage when cleared", () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByText("Set Actor"));
    expect(localStorage.getItem("clearpath-user-role")).toBe("actor");
    fireEvent.click(screen.getByText("Clear Role"));
    expect(localStorage.getItem("clearpath-user-role")).toBeNull();
  });
});
