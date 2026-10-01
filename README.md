# 🔗 LinkShortener

A full-stack URL shortening service with real-time analytics, built with ASP.NET Core 10 and React.

![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-10.0-512BD4?style=flat&logo=dotnet)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?style=flat&logo=microsoftsqlserver)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat&logo=tailwindcss)

## Features

- 🔗 Shorten any URL instantly — no account required
- 👤 Optional authentication to manage and track your links
- 📊 Click analytics per link: total clicks, by date, by device and by country
- 🌍 Country detection via IP geolocation
- 📅 Link expiration — set an optional expiry date per link
- 📱 QR code generation for every link
- 🔒 JWT-based authentication with secure BCrypt password hashing

## Screenshots

> Dashboard, analytics, and QR code modal coming soon.

## Tech Stack

**Backend**
- ASP.NET Core 10 Web API
- Entity Framework Core 10
- SQL Server
- JWT Authentication
- BCrypt.Net password hashing
- Swashbuckle (Swagger UI)
- ip-api.com for IP geolocation

**Frontend**
- React 18
- Tailwind CSS
- React Router v6
- Recharts (line, bar and pie charts)
- qrcode.react
- Axios

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- SQL Server (local or remote)
- Node.js 18+

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/SaintViCode/LinkShortener.git
   cd LinkShortener
   ```

2. Update `appsettings.json` with your connection string:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=LinkShortener;Trusted_Connection=True;TrustServerCertificate=True;"
   }
   ```

3. Set your JWT secret in `appsettings.json`:
   ```json
   "Jwt": {
     "Key": "YOUR-SECRET-KEY-HERE",
     "Issuer": "LinkShortener",
     "Audience": "LinkShortener"
   }
   ```

4. Apply database migrations:
   ```bash
   cd LinkShortener.API
   dotnet ef database update
   ```

5. Run the API:
   ```bash
   dotnet run
   ```

6. Open Swagger UI at `https://localhost:{port}/swagger`

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd link-shortener-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API base URL in `src/api/axios.js` if your port differs:
   ```js
   baseURL: 'https://localhost:7206/api'
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173`

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT token | No |

### Links
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/links` | Create a shortened URL | Optional |
| GET | `/api/links` | Get all links for current user | Yes |
| GET | `/api/links/{id}/analytics` | Get click analytics for a link | Yes |

### Redirect
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{code}` | Redirect to original URL and track click |

## Analytics Response Example

```json
{
  "totalClicks": 42,
  "clicksByDate": [
    { "date": "2026-09-27", "clicks": 15 },
    { "date": "2026-09-28", "clicks": 27 }
  ],
  "clicksByDevice": [
    { "deviceType": "Desktop", "clicks": 30 },
    { "deviceType": "Mobile", "clicks": 12 }
  ],
  "clicksByCountry": [
    { "country": "Costa Rica", "clicks": 25 },
    { "country": "United States", "clicks": 17 }
  ]
}
```

## Project Structure

```
LinkShortener/
└── LinkShortener.API/
│   ├── Controllers/        # Auth, Links and Redirect controllers
│   ├── Data/               # AppDbContext
│   ├── DTOs/               # Request and response models
│   ├── Helpers/            # JWT token generator
│   ├── Models/             # User, Link, Click entities
│   └── Services/           # Business logic
└── link-shortener-client/
    ├── src/
    │   ├── api/            # Axios instance
    │   ├── context/        # Auth context
    │   ├── pages/          # Home, Login, Register, Dashboard, Analytics
    │   └── components/     # Shared components
```

## Roadmap

- [ ] Custom short codes
- [ ] Real-time click counter with SignalR
- [ ] Link preview with Open Graph metadata
- [ ] Bulk link import via CSV
- [ ] Deploy to Azure

## License

MIT