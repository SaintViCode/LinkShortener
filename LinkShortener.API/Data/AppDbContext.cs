using LinkShortener.API.Models;
using Microsoft.EntityFrameworkCore;

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Link> Links { get; set; }
        public DbSet<Click> Clicks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Link>()
                .HasIndex(l => l.ShortCode)
                .IsUnique();

            modelBuilder.Entity<Link>()
                .HasOne(l => l.User)
                .WithMany(u => u.Links)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Click>()
                .HasOne(c => c.Link)
                .WithMany(l => l.Clicks)
                .HasForeignKey(c => c.LinkId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }