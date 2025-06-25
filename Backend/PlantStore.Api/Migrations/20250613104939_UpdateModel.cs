using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PlantStore.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Byliny" },
                    { 2, "Trawy ozdobne" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "CategoryId", "Description", "ImageUrl", "InStock", "Name", "Price" },
                values: new object[,]
                {
                    { 1, 1, "Odmiana deserowa, doskonała na przetwory.", "/images/sliwa.jpg", 50, "Śliwa Węgierka", 19.99m },
                    { 2, 1, "Duże, słodkie jabłka o czerwonej skórce.", "/images/jablon.jpg", 40, "Jabłoń Ligol", 24.99m },
                    { 3, 1, "Długo przechowująca się odmiana gruszy.", "/images/grusza.jpg", 35, "Grusza Konferencja", 22.50m },
                    { 4, 1, "Wczesna odmiana o dużych, ciemnoczerwonych owocach.", "/images/czeresnia.jpg", 20, "Czereśnia Burlat", 27.00m },
                    { 5, 1, "Soczysta i bardzo słodka odmiana.", "/images/brzoskwinia.jpg", 30, "Brzoskwinia Harnaś", 18.75m },
                    { 6, 1, "Wczesna odmiana moreli, idealna do sadów.", "/images/morela.jpg", 25, "Morela Early Orange", 20.00m },
                    { 7, 1, "Popularna krzewinka o kwaśnych owocach.", "/images/porzeczka.jpg", 60, "Porzeczka Czerwona", 12.99m },
                    { 8, 1, "Odmiana jesienna, plenna.", "/images/malina.jpg", 70, "Malina Polana", 9.99m },
                    { 9, 2, "Wysoka zawartość antyoksydantów.", "/images/borowka.jpg", 45, "Borówka Amerykańska", 29.99m },
                    { 10, 2, "Nadaje się do produkcji czerwonego wina.", "/images/winorosl.jpg", 15, "Winorośl Regent", 32.50m }
                });
        }
    }
}
