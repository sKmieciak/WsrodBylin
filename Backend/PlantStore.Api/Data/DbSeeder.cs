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
                    LastName = "Plantstore", // lub pusty string ""
                    Email = "admin@plantstore.pl",
                    PhoneNumber = "123456789",
                    IsAdmin = true,
                    IsCompanyAccount = false,

                    Street = "Plantowa",
                    HouseNumber = "1",
                    PostalCode = "00-001",
                    City = "Plantowo",
                    Country = "Polska",
                    AddressAddon = null
                };

                // hasło: test123
                adminUser.PasswordHash = hasher.HashPassword(adminUser, "test123");

                context.Users.Add(adminUser);
            }

            if (!context.Categories.Any())
            {
                var categories = new List<Category>
                {
                    new() { Id = 1, Name = "Byliny" },
                    new() { Id = 2, Name = "Trawy ozdobne" }
                };
                context.Categories.AddRange(categories);
            }

            if (!context.Products.Any())
            {
                var products = new List<Product>
                {
                    new() { Id = 1, Name = "Śliwa Węgierka", Description = "Odmiana deserowa i przetwórcza, bardzo plenna, o fioletowych owocach z żółtym miąższem, łatwo odchodzącym od pestki. Idealna do ciast, powideł oraz na kompot. Odporna na mróz, wymaga stanowiska słonecznego i gleby umiarkowanie wilgotnej.", Price = 19.99m, ImageUrl = "/images/sliwa.jpg", InStock = 50, CategoryId = 1 },

                    new() { Id = 2, Name = "Jabłoń Ligol", Description = "Polska, bardzo popularna odmiana jabłoni o dużych, kulistych owocach. Skórka czerwona z żółtym rumieńcem, miąższ soczysty i słodki. Doskonała do bezpośredniego spożycia i przechowywania przez kilka miesięcy. Kwitnie średnio wcześnie, dobrze plonuje.", Price = 24.99m, ImageUrl = "/images/jablon.jpg", InStock = 40, CategoryId = 1 },

                    new() { Id = 3, Name = "Grusza Konferencja", Description = "Bardzo ceniona odmiana jesienna, charakteryzująca się smukłymi, zielonożółtymi owocami z delikatnym rumieńcem. Miąższ jest delikatny, słodki i soczysty. Doskonała zarówno do spożycia na surowo, jak i na przetwory. Wymaga stanowiska słonecznego i żyznej gleby.", Price = 22.50m, ImageUrl = "/images/grusza.jpg", InStock = 35, CategoryId = 1 },

                    new() { Id = 4, Name = "Czereśnia Burlat", Description = "Wczesna, francuska odmiana o dużych, ciemnoczerwonych, słodkich owocach. Dojrzewa już w czerwcu, idealna do bezpośredniego spożycia. Drzewo rośnie silnie i szybko wchodzi w owocowanie. Zalecane zabezpieczenie przed przymrozkami w okresie kwitnienia.", Price = 27.00m, ImageUrl = "/images/czeresnia.jpg", InStock = 20, CategoryId = 1 },

                    new() { Id = 5, Name = "Brzoskwinia Harnaś", Description = "Soczysta i słodka odmiana o żółtym miąższu, łatwo odchodzącym od pestki. Owoce średniej wielkości, kuliste, dojrzewają w sierpniu. Roślina wymaga stanowiska ciepłego, osłoniętego od wiatru. Odporność na choroby średnia, wymaga oprysków zapobiegawczych.", Price = 18.75m, ImageUrl = "/images/brzoskwinia.jpg", InStock = 30, CategoryId = 1 },

                    new() { Id = 6, Name = "Morela Early Orange", Description = "Wczesna, amerykańska odmiana moreli o dużych, intensywnie pomarańczowych owocach z czerwonym rumieńcem. Miąższ jędrny, bardzo smaczny, aromatyczny. Odporna na choroby kory i drewna. Dojrzewa już w połowie lipca. Dobrze rośnie na stanowiskach ciepłych.", Price = 20.00m, ImageUrl = "/images/morela.jpg", InStock = 25, CategoryId = 1 },

                    new() { Id = 7, Name = "Porzeczka Czerwona", Description = "Odmiana o dużej plenności, rodząca grona błyszczących, czerwonych owoców. Kwaskowate, idealne na przetwory, soki i dżemy. Krzew dorasta do 1,5 m wysokości, nadaje się także do uprawy w donicach. Wymaga stanowiska słonecznego lub lekko zacienionego.", Price = 12.99m, ImageUrl = "/images/porzeczka.jpg", InStock = 60, CategoryId = 1 },

                    new() { Id = 8, Name = "Malina Polana", Description = "Odmiana jesienna, owocująca na pędach jednorocznych. Duże, czerwone, bardzo smaczne owoce idealne do spożycia na świeżo oraz do mrożenia. Roślina odporna na choroby, rośnie dobrze zarówno w gruncie, jak i w tunelach. Do zbioru od sierpnia do przymrozków.", Price = 9.99m, ImageUrl = "/images/malina.jpg", InStock = 70, CategoryId = 1 },

                    new() { Id = 9, Name = "Borówka Amerykańska", Description = "Odmiana o dużych, niebieskich owocach o wysokiej zawartości antyoksydantów. Wymaga gleby kwaśnej, przepuszczalnej oraz regularnego podlewania. Doskonała na surowo, do deserów i mrożenia. Krzewy osiągają ok. 1,5 m, owocują obficie w lipcu i sierpniu.", Price = 29.99m, ImageUrl = "/images/borowka.jpg", InStock = 45, CategoryId = 2 },

                    new() { Id = 10, Name = "Winorośl Regent", Description = "Czerwona odmiana deserowo-winiarska, odporna na choroby grzybowe. Owoce dojrzewają pod koniec września, są słodkie, z ciemnym sokiem. Idealna do ogrodów przydomowych. Wymaga podpór, słonecznego stanowiska i lekkiej, przepuszczalnej gleby.", Price = 32.50m, ImageUrl = "/images/winorosl.jpg", InStock = 15, CategoryId = 2 },
                };

                context.Products.AddRange(products);
            }
            if (!context.Orders.Any())
            {
                var adminUser = context.Users.FirstOrDefault(u => u.Email == "admin@plantstore.pl");
                var product1 = context.Products.FirstOrDefault(p => p.Id == 1);
                var product2 = context.Products.FirstOrDefault(p => p.Id == 2);

                if (adminUser != null && product1 != null && product2 != null)
                {
                    var order = new Order
                    {
                        UserId = adminUser.Id,
                        CreatedAt = DateTime.UtcNow.AddDays(-2),
                        Status = OrderStatus.Pending,
                        Items = new List<OrderItem>
            {
                new OrderItem
                {
                    ProductId = product1.Id,
                    Quantity = 2,
                    PriceAtPurchase = product1.Price
                },
                new OrderItem
                {
                    ProductId = product2.Id,
                    Quantity = 1,
                    PriceAtPurchase = product2.Price
                }
            }
                    };

                    context.Orders.Add(order);
                }
            }
            if (!context.CartItems.Any())
            {
                var adminUser = context.Users.FirstOrDefault(u => u.Email == "admin@plantstore.pl");
                var product3 = context.Products.FirstOrDefault(p => p.Id == 3);

                if (adminUser != null && product3 != null)
                {
                    context.CartItems.Add(new CartItem
                    {
                        UserId = adminUser.Id,
                        ProductId = product3.Id,
                        Quantity = 2
                    });
                }
            }

            context.SaveChanges();
        }
    }
}
