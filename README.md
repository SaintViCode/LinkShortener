# 🔗 LinkShortener

A full-stack URL shortening service with real-time analytics, built with ASP.NET Core and React.

## Features

- Shorten any URL and get a shareable short link instantly
- Optional user authentication — create an account to track your links
- Click analytics per link: total clicks, breakdown by date and device type
- JWT-based authentication with secure password hashing
- Auto-redirect with background click tracking

## Tech Stack

**Backend**
- ASP.NET Core 10 Web API
- Entity Framework Core 10
- SQL Server
- JWT Authentication
- BCrypt password hashing
- Swashbuckle (Swagger UI)

**Frontend** *(in progress)*
- React
- Tailwind CSS

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- SQL Server (local or remote)
- Node.js 18+ *(for the frontend)*

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/SaintViCode/LinkShortener.git
   cd LinkShortener
   ```

2. Update the connection string in `appsettings.json`:
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
  ]
}
```

## Project Structure

```
LinkShortener/
└── LinkShortener.API/
    ├── Controllers/        # API controllers
    ├── Data/               # DbContext
    ├── DTOs/               # Data transfer objects
    ├── Helpers/            # JWT helper
    ├── Models/             # Entity models
    └── Services/           # Business logic (in progress)
```

## Roadmap

- [ ] React frontend with dashboard
- [ ] Link expiration support
- [ ] Country-based analytics via IP geolocation
- [ ] Custom short codes
- [ ] QR code generation per link

## License

MIT