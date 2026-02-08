import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BatchTable from "../components/dashboard/BatchTable";
import { Batch } from "../data/mockData";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
    tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement> & { children?: React.ReactNode }) => <tr {...props}>{children}</tr>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock QRCodeModal component
vi.mock("../components/dashboard/QRCodeModal", () => ({
  default: ({ batch, onClose }: { batch: Batch | null; onClose: () => void }) => {
    if (!batch) return null;
    return (
      <div data-testid="qr-modal">
        <button onClick={onClose}>Close</button>
        <div>Batch ID: {batch.id}</div>
      </div>
    );
  },
}));

// Mock the useToast hook
vi.mock("../hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe("BatchTable", () => {
  const mockBatches: Batch[] = [
    {
      id: "BATCH-001",
      productName: "Organic Coffee",
      status: "Verified",
      createdAt: "2024-01-15",
      lastUpdated: "2024-01-20",
      origin: "Farm A",
      journey: [],
    },
    {
      id: "BATCH-002",
      productName: "Green Tea",
      status: "In-Transit",
      createdAt: "2024-01-16",
      lastUpdated: "2024-01-21",
      origin: "Farm B",
      journey: [],
    },
    {
      id: "BATCH-003",
      productName: "Spices",
      status: "Harvested",
      createdAt: "2024-01-17",
      lastUpdated: "2024-01-22",
      origin: "Farm C",
      journey: [],
    },
  ];

  const mockOnViewBatch = vi.fn();

  it("should render all batches in the table", () => {
    render(<BatchTable batches={mockBatches} onViewBatch={mockOnViewBatch} />);
    
    expect(screen.getByText("#BATCH-001")).toBeInTheDocument();
    expect(screen.getByText("#BATCH-002")).toBeInTheDocument();
    expect(screen.getByText("#BATCH-003")).toBeInTheDocument();
  });

  it("should display QR code images for all batches regardless of status", () => {
    render(<BatchTable batches={mockBatches} onViewBatch={mockOnViewBatch} />);
    
    // Get all QR code images
    const qrImages = screen.getAllByAltText("QR Code");
    
    // Should have exactly 3 QR code images (one for each batch)
    expect(qrImages).toHaveLength(3);
    
    // All should be img elements
    qrImages.forEach((img) => {
      expect(img.tagName).toBe("IMG");
      expect(img).toHaveAttribute("title", "Click to view full QR Code");
    });
  });

  it("should display QR code for non-verified batches", () => {
    render(<BatchTable batches={mockBatches} onViewBatch={mockOnViewBatch} />);
    
    // Check that batches with "In-Transit" and "Harvested" status also have QR codes
    const qrImages = screen.getAllByAltText("QR Code");
    expect(qrImages.length).toBe(mockBatches.length);
  });

  it("should open QR modal when clicking on QR code image", () => {
    render(<BatchTable batches={mockBatches} onViewBatch={mockOnViewBatch} />);
    
    const qrImages = screen.getAllByAltText("QR Code");
    
    // Click the first QR code image
    fireEvent.click(qrImages[0]);
    
    // Modal should be visible
    expect(screen.getByTestId("qr-modal")).toBeInTheDocument();
    expect(screen.getByText("Batch ID: BATCH-001")).toBeInTheDocument();
  });

  it("should display correct batch information in table", () => {
    render(<BatchTable batches={mockBatches} onViewBatch={mockOnViewBatch} />);
    
    expect(screen.getByText("Organic Coffee")).toBeInTheDocument();
    expect(screen.getByText("Green Tea")).toBeInTheDocument();
    expect(screen.getByText("Spices")).toBeInTheDocument();
    
    expect(screen.getByText("Farm A")).toBeInTheDocument();
    expect(screen.getByText("Farm B")).toBeInTheDocument();
    expect(screen.getByText("Farm C")).toBeInTheDocument();
  });
});
