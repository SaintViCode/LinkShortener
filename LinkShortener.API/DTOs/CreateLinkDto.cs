namespace LinkShortener.API.DTOs
{
    public class CreateLinkDto
    {
        public string OriginalUrl { get; set; } = string.Empty;
        public DateTime? ExpiresAt { get; set; }
    }
}
