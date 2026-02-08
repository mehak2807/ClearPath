# 🚀 ClearPath: Integrated Supply Chain Traceability & Transparency Platform

[cite_start]ClearPath is a secure, end-to-end supply chain transparency solution designed to create a **Digital Product Passport**[cite: 42, 154]. [cite_start]By leveraging cryptographic verification, we ensure that every stage of a product's journey—from raw material harvesting to retail shelving—is immutable, transparent, and tamper-proof[cite: 60, 141].

---

## 🏗 System Architecture

### 1. Backend: The Trust & Verification Engine
[cite_start]The backend operates on a **Zero Trust Architecture**, ensuring no data is committed to the ledger without multi-factor actor verification[cite: 71, 142].
- [cite_start]**Identity Verification:** Actors are onboarded via **OTP-based phone verification** and **Identity Document upload** to ensure accountability[cite: 54, 205].
- [cite_start]**Cryptographic Foundations:** Upon successful verification, the system generates a unique **Public-Private Key pair** for each actor, serving as their permanent digital seal[cite: 224, 226].
- [cite_start]**Data Integrity (Hashing):** Every supply chain event (e.g., Harvesting, Quality Sorting, Roasting) is processed into a **SHA-256 hash**, creating a unique, irreversible digital fingerprint[cite: 135, 243].
- **Digital Signatures:** Actors "seal" their data using their Private Key via **ECDSA signatures**. [cite_start]This ensures **Non-repudiation**, meaning an actor cannot later deny their involvement in a specific batch update[cite: 136, 244, 245].
- [cite_start]**Immutable Ledger:** The system utilizes an append-only database logic where records can never be deleted or altered, providing a reliable audit trail for regulators[cite: 157, 158, 250].

### 2. Frontend: Multi-Role Experience Portals
- [cite_start]**Brand Admin Dashboard:** A centralized interface for companies to monitor real-time batch movements, active users, and global security status[cite: 260, 270].
- [cite_start]**Actor Portal (ERP Bridge):** A "Digital Twin" simulation showing how legacy ERP systems (SAP/Oracle) securely push data into the ClearPath ledger through a verified gateway[cite: 97, 236].
- [cite_start]**Consumer Mobile Interface:** A mobile-optimized view triggered by QR scans, displaying a **12-node collapsible timeline** of the product's journey from Origin to Retail[cite: 46, 169].

---

## 🛠 Tech Stack
- **Frontend:** React.js, Tailwind CSS (v3), Lucide-React (Icons), Chart.js (Analytics).
- [cite_start]**Backend:** Node.js, Express.js, MongoDB[cite: 278, 281].
- [cite_start]**Security:** SHA-256 Hashing, ECDSA Digital Signatures, JWT Authentication[cite: 232, 236, 243].

---

## 📂 Project Structure
```text
/ClearPath
├── /frontend           # React + Tailwind UI components
│   ├── /src/components  # Dashboard, Actor Portal, and QR Views
│   └── tailwind.config.ts
├── /backend            # Node.js + Express Logic
│   ├── /src/models      # Mongoose schemas for Actors, Products, and Events
│   ├── /src/controllers # Logic for Auth, OTP, and Data Sealing
│   ├── /src/utils       # Hashing and Cryptographic utilities
│   └── server.js        # Main entry point
└── README.md
---

## 🚀 Installation & Setup

Follow these steps to configure the development environment for both the backend and frontend tiers.

### 1. Backend Environment Configuration
The backend serves as the "Trust Engine." It must be configured first to establish database connectivity and cryptographic services.

* **Step 1: Navigate to the backend directory**
    ```bash
    cd backend
    ```
* **Step 2: Install core dependencies**
    ```bash
    npm install
    ```
* **Step 3: Configure Environment Variables**
    Create a `.env` file in the root of the `/backend` folder. This file stores sensitive credentials and is excluded from version control for security:
    ```env
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secure_random_hash_string
    ```
* **Step 4: Launch the server**
    ```bash
    npm start
    ```

### 2. Frontend Interface Configuration
The frontend handles the specialized portals for Administrators, Supply Chain Actors, and Consumers.

* **Step 1: Navigate to the frontend directory**
    ```bash
    cd ../frontend
    ```
* **Step 2: Install frontend packages**
    ```bash
    npm install
    ```
* **Step 3: Launch the development server**
    ```bash
    npm run dev
    ```

---

## 🛡 Security & Verification Workflow

ClearPath implements a rigorous security protocol to ensure that every data point in the supply chain is authenticated, timestamped, and immutable.



### Phase 1: Identity Onboarding (Human-to-Digital Link)
* **Multi-Factor Verification:** To prevent bot entries and ensure accountability, Actors must complete a phone-based **OTP verification** and upload a valid **Identity Document**.
* **Cryptographic Identity:** Upon successful onboarding, the system generates a unique **ECC (Elliptic Curve Cryptography) Public-Private Key pair**. The Private Key remains encrypted on the actor's device, acting as their unique "Digital Seal."

### Phase 2: Data Sealing (The Integrity Bridge)
* **Data Standardization:** Raw inputs from various supply chain events (Harvesting, Processing, Logistics) are normalized into a machine-readable JSON format.
* **SHA-256 Hashing:** The system processes this data through a hashing algorithm to create a 256-bit unique digital fingerprint. Even a single character change in the original data would result in a completely different hash, making the system tamper-evident.
* **Digital Signing:** The Actor uses their Private Key to sign the event hash. This creates a signature cryptographically linked to the specific actor, ensuring **Non-repudiation** (the actor cannot later deny the transaction).

### Phase 3: Consumer Verification (Zero-Trust Logic)
* **Real-time Audit:** When a consumer scans a product QR code, the system performs a live cryptographic audit rather than just fetching static text.
* **Signature Validation:** The backend re-verifies the digital signature against the Actor’s stored Public Key. Only after confirming the "Proof of Origin" does the system grant trust and display the verified product timeline.



---
