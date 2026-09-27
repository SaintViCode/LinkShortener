using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LinkShortener.API.Models;

namespace LinkShortener.API.Controllers
{
    [ApiController]
    public class RedirectController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RedirectController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{code}")]
        public async Task<IActionResult> RedirectToUrl(string code)
        {
            var link = await _context.Links
                .FirstOrDefaultAsync(l => l.ShortCode == code);

            if (link == null)
                return NotFound("Link not found.");

            if (link.ExpiresAt.HasValue && link.ExpiresAt < DateTime.UtcNow)
                return BadRequest("Link has expired.");

            var click = new Click
            {
                LinkId = link.Id,
                ClickedAt = DateTime.UtcNow,
                DeviceType = GetDeviceType(Request.Headers["User-Agent"].ToString()),
                Referrer = Request.Headers["Referer"].ToString()
            };

            _context.Clicks.Add(click);
            await _context.SaveChangesAsync();

            return Redirect(link.OriginalUrl);
        }

        private static string GetDeviceType(string userAgent)
        {
            if (string.IsNullOrEmpty(userAgent)) return "Unknown";
            if (userAgent.Contains("Mobile", StringComparison.OrdinalIgnoreCase)) return "Mobile";
            if (userAgent.Contains("Tablet", StringComparison.OrdinalIgnoreCase)) return "Tablet";
            return "Desktop";
        }
    }
}