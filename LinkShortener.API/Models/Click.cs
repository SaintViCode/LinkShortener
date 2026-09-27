namespace LinkShortener.API.Models
{
    public class Click
    {
        public int Id { get; set; }
        public int LinkId { get; set; }
        public DateTime ClickedAt { get; set; } = DateTime.UtcNow;
        public string? Country { get; set; }
        public string? DeviceType { get; set; }
        public string? Referrer { get; set; }
        public Link Link { get; set; } = null!;
    }
}
