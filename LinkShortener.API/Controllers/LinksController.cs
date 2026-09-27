using LinkShortener.API.DTOs;
using LinkShortener.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LinkShortener.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LinksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LinksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateLink(CreateLinkDto dto)
        {
            int? userId = null;

            if (User.Identity?.IsAuthenticated == true)
                userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var shortCode = GenerateShortCode();

            var link = new Link
            {
                UserId = userId,
                OriginalUrl = dto.OriginalUrl,
                ShortCode = shortCode,
                ExpiresAt = dto.ExpiresAt
            };

            _context.Links.Add(link);
            await _context.SaveChangesAsync();

            return Ok(MapToDto(link, Request));
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMyLinks()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var links = await _context.Links
                .Where(l => l.UserId == userId)
                .Include(l => l.Clicks)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();

            return Ok(links.Select(l => MapToDto(l, Request)));
        }

        private static string GenerateShortCode()
        {
            return Guid.NewGuid().ToString("N")[..7];
        }

        private static LinkResponseDto MapToDto(Link link, HttpRequest request)
        {
            var baseUrl = $"{request.Scheme}://{request.Host}";
            return new LinkResponseDto
            {
                Id = link.Id,
                OriginalUrl = link.OriginalUrl,
                ShortCode = link.ShortCode,
                ShortUrl = $"{baseUrl}/{link.ShortCode}",
                CreatedAt = link.CreatedAt,
                ExpiresAt = link.ExpiresAt,
                TotalClicks = link.Clicks?.Count ?? 0
            };
        }

        [HttpGet("{id}/analytics")]
        [Authorize]
        public async Task<IActionResult> GetAnalytics(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var link = await _context.Links
                .Include(l => l.Clicks)
                .FirstOrDefaultAsync(l => l.Id == id && l.UserId == userId);

            if (link == null)
                return NotFound("Link not found.");

            var analytics = new AnalyticsDto
            {
                TotalClicks = link.Clicks.Count,
                ClicksByDate = link.Clicks
                    .GroupBy(c => c.ClickedAt.Date)
                    .Select(g => new ClicksByDateDto
                    {
                        Date = g.Key.ToString("yyyy-MM-dd"),
                        Clicks = g.Count()
                    })
                    .OrderBy(x => x.Date)
                    .ToList(),
                ClicksByDevice = link.Clicks
                    .GroupBy(c => c.DeviceType ?? "Unknown")
                    .Select(g => new ClicksByDeviceDto
                    {
                        DeviceType = g.Key,
                        Clicks = g.Count()
                    })
                    .ToList()
            };

            return Ok(analytics);
        }
    }
}