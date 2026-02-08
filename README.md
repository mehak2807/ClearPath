# 🚀 ClearPath: Digital Product Passport & Traceability System

ClearPath is a next-generation supply chain transparency platform that creates a **Digital Product Passport** for every item. By integrating cryptographic signatures with a "Zero Trust" backend, we ensure that a product's journey—from origin to retail—is 100% verified, immutable, and tamper-proof.

---

## 🏗 System Architecture

### 1. The Trust Engine (Backend)
Our backend doesn't just store data; it validates the **integrity** of every actor and event.
* **Zero Trust Onboarding:** Actors are verified via **Phone OTP** and **ID Document verification** before they can interact with the system.
* **Cryptographic Identity:** Upon verification, each actor is issued a unique **Public-Private Key pair**. This acts as their permanent "Digital Seal."
* **Data Integrity (SHA-256):** Every event (Harvest, Transport, Quality Check) is hashed into a unique digital fingerprint. If even one letter of the data is changed, the hash breaks, alerting the system of tampering.
* **Non-Repudiation:** Actors sign data using **ECDSA signatures**. Because only they hold their private key, they cannot later deny their involvement in a specific batch update.
* **Immutable Ledger:** We use an append-only logic where records can never be deleted, providing a "single source of truth" for regulators and brands.

### 2. The Experience Portals (Frontend)
* **Company Dashboard:** A command center for brands to monitor real-time batch movements, active stakeholders, and system-wide security alerts.
* **Actor Portal (ERP Bridge):** A "Digital Twin" interface that simulates how existing systems (like SAP or Oracle) securely bridge data into our verified ledger.
* **Consumer QR Interface:** A mobile-optimized **12-node journey timeline** that reveals the verified story of the product to the end-user.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Lucide-React, Chart.js |
| **Backend** | Node.js, Express.js, MongoDB |
| **Security** | SHA-256 Hashing, ECDSA Digital Signatures, JWT Auth |

---

## 🚀 Installation & Setup

### 1. Backend Setup
The backend handles the database and cryptographic logic. Configure this first.

```bash
# 1. Enter the directory
cd backend

# 2. Install dependencies
npm install

# 3. Setup Environment Variables
# Create a .env file in the /backend folder:
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_hash

# 4. Launch
npm start

### 2. Frontend Interface Configuration
The frontend serves as the multi-role gateway for Administrators, Supply Chain Actors, and Consumers. It is designed for high performance and real-time data visualization.

* **Step 1: Navigate to the frontend directory**
    ```bash
    cd ../frontend
    ```
* **Step 2: Install UI dependencies**
    *Includes Tailwind CSS for styling, Lucide-React for iconography, and Chart.js for live analytics.*
    ```bash
    npm install
    ```
* **Step 3: Launch the development environment**
    ```bash
    npm run dev
    ```
* **Step 4: Build for production** (Optional)
    ```bash
    npm run build
    ```

---

## 🛡 Security & Verification Workflow

ClearPath is built on a **Zero-Trust Framework**, ensuring that every data point is cryptographically sealed and every actor is held accountable through non-repudiable digital signatures.



### Phase 1: Identity Onboarding (Human-to-Digital Link)
* **Identity Verification:** To prevent unauthorized entries, Actors must complete a **Phone-based OTP verification** and upload an **Identity Document**. This establishes a verified human link to every digital action in the system.
* **Cryptographic Identity:** Upon successful onboarding, the system generates a unique **ECC (Elliptic Curve Cryptography) Key Pair**. The Private Key remains encrypted on the actor's local environment, acting as their unique "Digital Seal" for all future ledger entries.

### Phase 2: Data Sealing (The Integrity Bridge)
* **Data Normalization:** Raw inputs from supply chain events (e.g., Harvesting, Quality Sorting, Global Logistics) are converted into a standardized, machine-readable JSON format.
* **SHA-256 Hashing:** The system processes this data through a hashing algorithm to create a 256-bit unique digital fingerprint. Any minor alteration in the original data—even a single character—will result in a completely different hash, making the system instantly tamper-evident.
* **Digital Signing:** The Actor uses their Private Key to sign the hash. This creates a digital signature that is mathematically linked to both the data and the specific actor, ensuring **Non-repudiation** (the actor cannot later deny the entry).

### Phase 3: Consumer Verification (Zero-Trust Logic)
* **Real-time Audit:** When a consumer scans a product QR code, the system performs a live cryptographic audit instead of simply fetching static database text.
* **Signature Validation:** The backend re-verifies the digital signature against the Actor’s stored Public Key. Only after confirming the **"Proof of Origin"** and validating the entire signature chain does the system grant trust and display the verified product timeline to the user.
