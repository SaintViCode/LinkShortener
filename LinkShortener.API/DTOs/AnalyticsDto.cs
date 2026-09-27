namespace LinkShortener.API.DTOs
{
    public class AnalyticsDto
    {
        public int TotalClicks { get; set; }
        public List<ClicksByDateDto> ClicksByDate { get; set; } = new();
        public List<ClicksByDeviceDto> ClicksByDevice { get; set; } = new();
    }

    public class ClicksByDateDto
    {
        public string Date { get; set; } = string.Empty;
        public int Clicks { get; set; }
    }

    public class ClicksByDeviceDto
    {
        public string DeviceType { get; set; } = string.Empty;
        public int Clicks { get; set; }
    }
}