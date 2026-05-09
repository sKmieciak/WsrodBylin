using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Models;

namespace PlantStore.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products => Set<Product>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<CartItem> CartItems => Set<CartItem>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<UserAddress> UserAddresses => Set<UserAddress>();
        public DbSet<Promotion> Promotions => Set<Promotion>();
        public DbSet<ProductImage> ProductImages => Set<ProductImage>();
        public DbSet<AppLog> AppLogs => Set<AppLog>();
        public DbSet<Setting> Settings => Set<Setting>();
        public DbSet<PushSubscription> PushSubscriptions => Set<PushSubscription>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<OrderItem>()
                .Property(o => o.PriceAtPurchase)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Promotion>()
                .Property(p => p.DiscountPercentage)
                .HasPrecision(5, 2);

            modelBuilder.Entity<Order>()
                .Property(o => o.DeliveryCost)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Setting>()
                .HasKey(s => s.Key);
        }


    }
}
