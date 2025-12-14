# Agentic IDE

An AI-powered platform that automatically provisions cloud-based development environments with starter code. Describe your project idea, and get a fully configured VS Code IDE in the cloud with a single-file starter code ready to go.

## 🚀 Features

- **AI-Powered Setup**: Describe your project in plain English, and AI generates starter code and sets up your development environment
- **Single-File Starter**: Get a ready-to-run starter file in your preferred stack (Python, Node.js, Go, C++, Java, and more)
- **Cloud-Based IDE**: Access VS Code in your browser instantly—no local setup or configuration required
- **Project Dashboard**: Manage all your IDE environments from one place, track projects, and access them anytime
- **User Authentication**: Secure email/password authentication with JWT tokens
- **Project History**: Track all your projects with status monitoring (provisioning, active, terminated)

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Infrastructure & Orchestration
- **Kestra** - Workflow orchestration platform
- **AWS EC2** - Cloud infrastructure provisioning
- **Cerebras AI** - LLM API for code generation
- **Caddy** - Reverse proxy for HTTPS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm/bun
- **PostgreSQL** database
- **Kestra** instance (for workflow orchestration)
- **AWS Account** with EC2 access
- **Cerebras AI API Key** (or compatible LLM API)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Night3y3/temp-ide.git
   cd temp-ide
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/agentic_ide"

   # Authentication
   JWT_SECRET="your-secret-key-change-in-production"

   # Kestra Configuration
   KESTRA_URL="http://localhost:8080"
   KESTRA_USERNAME="your-kestra-username"
   KESTRA_PASSWORD="your-kestra-password"

   # AWS Configuration
   AWS_ACCESS_KEY="your-aws-access-key"
   AWS_SECRET_KEY="your-aws-secret-key"
   AWS_AMI_ID="ami-xxxxxxxxx"
   AWS_SECURITY_GROUP_ID="sg-xxxxxxxxx"

   # AI API
   CEREBRAS_API_KEY="your-cerebras-api-key"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev
   ```

5. **Configure Kestra workflows**
   
   Upload the workflow files from `yml-scripts/` to your Kestra instance:
   - `spin-up.yaml` - Provisions new IDE environments
   - `terminate-instance.yml` - Terminates environments

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
temp-ide/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── projects/        # Project management endpoints
│   │   └── plan/            # AI planning endpoint
│   ├── dashboard/            # Dashboard pages
│   └── page.tsx             # Landing page
├── components/               # React components
│   ├── auth/                # Authentication components
│   ├── dashboard/            # Dashboard components
│   ├── ide/                 # IDE-related components
│   ├── landing/             # Landing page components
│   └── ui/                  # Reusable UI components
├── lib/                      # Utility libraries
│   ├── auth.ts              # Authentication utilities
│   ├── prisma.ts            # Prisma client
│   └── utils.ts             # General utilities
├── actions/                  # Server actions
│   ├── kestra.ts            # Kestra integration
│   └── syncStatus.ts        # Status synchronization
├── prisma/                   # Database schema and migrations
│   └── schema.prisma        # Prisma schema
├── yml-scripts/              # Kestra workflow definitions
│   ├── spin-up.yaml         # Provision workflow
│   └── terminate-instance.yml # Termination workflow
└── public/                   # Static assets
```

## 🔄 Workflow

1. **User Registration/Login**: Create account or login
2. **Project Description**: User describes their project idea
3. **AI Analysis**: AI analyzes the description and asks clarifying questions
4. **Provisioning**: System provisions EC2 instance with VS Code
5. **Code Generation**: AI generates starter code file
6. **IDE Access**: User receives URL to access their IDE
7. **Project Management**: User can manage projects from dashboard

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `KESTRA_URL` | Kestra instance URL | Yes |
| `KESTRA_USERNAME` | Kestra authentication username | Yes |
| `KESTRA_PASSWORD` | Kestra authentication password | Yes |
| `AWS_ACCESS_KEY` | AWS access key ID | Yes |
| `AWS_SECRET_KEY` | AWS secret access key | Yes |
| `AWS_AMI_ID` | AWS AMI ID for EC2 instances | Yes |
| `AWS_SECURITY_GROUP_ID` | AWS security group ID | Yes |
| `CEREBRAS_API_KEY` | Cerebras AI API key | Yes |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Kestra Documentation](https://kestra.io/docs)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)

---

Built with ❤️ using Next.js, Prisma, and Kestra by @Night3y3
