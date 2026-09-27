namespace LinkShortener.API.Models
{
    public class Link
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string OriginalUrl { get; set; } = string.Empty;
        public string ShortCode { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ExpiresAt { get; set; }
        public User? User { get; set; }
        public ICollection<Click> Clicks { get; set; } = new List<Click>();
    }
}
