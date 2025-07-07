using Microsoft.AspNetCore.Identity;
using PlantStore.Api.Models;
using PlantStore.Api.Services;

namespace PlantStore.Api.Data
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext context, IPasswordHasher<User> hasher)
        {
            if (!context.Users.Any())
            {
                var adminUser = new User
                {
                    FirstName = "Admin",
                    LastName = "Plantstore",
                    Email = "admin@plantstore.pl",
                    PhoneNumber = "123456789",
                    IsAdmin = true,
                    IsCompanyAccount = false,
                    Street = "Plantowa",
                    HouseNumber = "1",
                    PostalCode = "00-001",
                    City = "Plantowo",
                    Country = "Polska"
                };

                adminUser.PasswordHash = hasher.HashPassword(adminUser, "test123");
                context.Users.Add(adminUser);
                context.SaveChanges(); // potrzebne, żeby dostać Id użytkownika
            }

            if (!context.Categories.Any())
            {
                var category1 = new Category { Name = "Byliny" };
                var category2 = new Category { Name = "Trawy ozdobne" };
                context.Categories.AddRange(category1, category2);
                context.SaveChanges(); // potrzebne, żeby przypisać kategorię do produktów

                var products = new List<Product>
        {
            new() { Name = "Śliwa Węgierka", Description = "...", Price = 19.99m, ImageUrl = "/images/sliwa.jpg", InStock = 50, Category = category1 },
            new() { Name = "Jabłoń Ligol", Description = "...", Price = 24.99m, ImageUrl = "/images/jablon.jpg", InStock = 40, Category = category1 },
            new() { Name = "Grusza Konferencja", Description = "...", Price = 22.50m, ImageUrl = "/images/grusza.jpg", InStock = 35, Category = category1 },
            new() { Name = "Czereśnia Burlat", Description = "...", Price = 27.00m, ImageUrl = "/images/czeresnia.jpg", InStock = 20, Category = category1 },
            new() { Name = "Brzoskwinia Harnaś", Description = "...", Price = 18.75m, ImageUrl = "/images/brzoskwinia.jpg", InStock = 30, Category = category1 },
            new() { Name = "Morela Early Orange", Description = "...", Price = 20.00m, ImageUrl = "/images/morela.jpg", InStock = 25, Category = category1 },
            new() { Name = "Porzeczka Czerwona", Description = "...", Price = 12.99m, ImageUrl = "/images/porzeczka.jpg", InStock = 60, Category = category1 },
            new() { Name = "Malina Polana", Description = "...", Price = 9.99m, ImageUrl = "/images/malina.jpg", InStock = 70, Category = category1 },
            new() { Name = "Borówka Amerykańska", Description = "...", Price = 29.99m, ImageUrl = "/images/borowka.jpg", InStock = 45, Category = category2 },
            new() { Name = "Winorośl Regent", Description = "...", Price = 32.50m, ImageUrl = "/images/winorosl.jpg", InStock = 15, Category = category2 }
        };
                context.Products.AddRange(products);
                context.SaveChanges();
            }

            var admin = context.Users.FirstOrDefault(u => u.Email == "admin@plantstore.pl");
            var product1 = context.Products.FirstOrDefault(p => p.Name.Contains("Śliwa"));
            var product2 = context.Products.FirstOrDefault(p => p.Name.Contains("Jabłoń"));
            var product3 = context.Products.FirstOrDefault(p => p.Name.Contains("Grusza"));

            if (admin != null && product1 != null && product2 != null && !context.Orders.Any())
            {
                var order = new Order
                {
                    UserId = admin.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-2),
                    Status = OrderStatus.Pending,
                    Items = new List<OrderItem>
            {
                new() { ProductId = product1.Id, Quantity = 2, PriceAtPurchase = product1.Price },
                new() { ProductId = product2.Id, Quantity = 1, PriceAtPurchase = product2.Price }
            }
                };
                context.Orders.Add(order);
                context.SaveChanges();
            }

            if (admin != null && product3 != null && !context.CartItems.Any())
            {
                context.CartItems.Add(new CartItem
                {
                    UserId = admin.Id,
                    ProductId = product3.Id,
                    Quantity = 2
                });
                context.SaveChanges();
            }
        }

    }
}
