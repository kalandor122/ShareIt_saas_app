# ShareIt - Uber az internethez

ShareIt is a P2P internet sharing platform built with [Wasp](https://wasp.sh), based on the [Open SaaS](https://opensaas.sh) template.

## 🚀 Features

- **Authentication**: Email and Google authentication out of the box.
- **Payments**: Integrated with Stripe for subscription management and payments.
- **Database**: PostgreSQL with Prisma ORM.
- **UI/UX**: Modern UI built with React and Tailwind CSS.
- **Email**: Integrated with SendGrid for transactional emails.

## 🛠 Tech Stack

- **Framework**: [Wasp](https://wasp.sh) (Full-stack framework for React, Node.js, and Prisma)
- **Frontend**: React, Tailwind CSS, Lucide Icons
- **Backend**: Node.js
- **Database**: PostgreSQL (via Prisma)
- **Payments**: Stripe
- **Email**: SendGrid

## 🏁 Getting Started

### Prerequisites

- [Wasp CLI](https://wasp.sh/docs/installation) installed.
- Node.js (v18 or higher) installed.
- Docker (optional, for running the database locally).

### Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd shareit
   ```

2. **Environment Variables**:
   Copy the example environment files and fill in your values:
   ```bash
   cp .env.client.example .env.client
   cp .env.server.example .env.server
   ```

3. **Install dependencies**:
   ```bash
   wasp install
   ```

### Running Locally

1. **Start the database**:
   ```bash
   wasp start db
   ```

2. **Run the application**:
   In a new terminal window:
   ```bash
   wasp start
   ```

3. **Database Migrations**:
   If this is your first time or you've modified `schema.prisma`:
   ```bash
   wasp db migrate-dev
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Wasp](https://wasp.sh)
- Template from [Open SaaS](https://opensaas.sh)
