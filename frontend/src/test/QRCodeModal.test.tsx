import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import QRCodeModal from "../components/dashboard/QRCodeModal";
import { Batch } from "../data/mockData";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock qrcode.react to simplify testing
vi.mock("qrcode.react", () => ({
  QRCodeSVG: ({ value }: { value: string }) => (
    <div data-testid="qr-code" data-value={value}>
      QR Code
    </div>
  ),
}));

describe("QRCodeModal", () => {
  const mockBatch: Batch = {
    id: "BATCH-001",
    productName: "Organic Coffee",
    status: "Verified",
    createdAt: "2024-01-15",
    lastUpdated: "2024-01-20",
    origin: "Farm A",
    journey: [],
  };

  const mockOnClose = vi.fn();

  it("should generate correct verification URL with new base URL", () => {
    render(<QRCodeModal batch={mockBatch} onClose={mockOnClose} />);
    
    const qrCode = screen.getByTestId("qr-code");
    const qrValue = qrCode.getAttribute("data-value");
    
    // Verify the URL uses the new base URL (homepage only, no batch ID)
    expect(qrValue).toBe("https://qr-ruddy-chi.vercel.app");
  });

  it("should display batch information correctly", () => {
    render(<QRCodeModal batch={mockBatch} onClose={mockOnClose} />);
    
    expect(screen.getByText("#BATCH-001")).toBeInTheDocument();
    expect(screen.getByText("Organic Coffee")).toBeInTheDocument();
  });

  it("should display the verification URL in the modal", () => {
    render(<QRCodeModal batch={mockBatch} onClose={mockOnClose} />);
    
    expect(screen.getByText("https://qr-ruddy-chi.vercel.app")).toBeInTheDocument();
  });

  it("should not render when batch is null", () => {
    const { container } = render(<QRCodeModal batch={null} onClose={mockOnClose} />);
    
    expect(container.firstChild).toBeNull();
  });

  it("should generate verification URL with different batch IDs", () => {
    const batch2: Batch = {
      ...mockBatch,
      id: "BATCH-999",
    };

    const { rerender } = render(<QRCodeModal batch={batch2} onClose={mockOnClose} />);
    
    let qrCode = screen.getByTestId("qr-code");
    // All batches now use the same homepage URL
    expect(qrCode.getAttribute("data-value")).toBe("https://qr-ruddy-chi.vercel.app");

    const batch3: Batch = {
      ...mockBatch,
      id: "BATCH-ABC123",
    };

    rerender(<QRCodeModal batch={batch3} onClose={mockOnClose} />);
    
    qrCode = screen.getByTestId("qr-code");
    // All batches now use the same homepage URL
    expect(qrCode.getAttribute("data-value")).toBe("https://qr-ruddy-chi.vercel.app");
  });
});
