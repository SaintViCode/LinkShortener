using LinkShortener.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

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

            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            var country = await GetCountryFromIp(ip);

            var click = new Click
            {
                LinkId = link.Id,
                ClickedAt = DateTime.UtcNow,
                DeviceType = GetDeviceType(Request.Headers["User-Agent"].ToString()),
                Referrer = Request.Headers["Referer"].ToString(),
                Country = country
            };

            _context.Clicks.Add(click);
            await _context.SaveChangesAsync();

            return Redirect(link.OriginalUrl);
        }

        private static async Task<string> GetCountryFromIp(string? ip)
        {
            if (string.IsNullOrEmpty(ip) || ip == "::1" || ip == "127.0.0.1")
                return "Local";

            try
            {
                using var http = new HttpClient();
                var response = await http.GetFromJsonAsync<JsonElement>($"http://ip-api.com/json/{ip}");
                if (response.GetProperty("status").GetString() == "success")
                    return response.GetProperty("country").GetString() ?? "Unknown";
            }
            catch
            {
                return "Unknown";
            }

            return "Unknown";
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