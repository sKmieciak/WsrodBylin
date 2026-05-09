using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlantStore.Api.Migrations
{
    public partial class AddPaczkomatPoint : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PaczkomatPoint",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "PaczkomatPoint", table: "Orders");
        }
    }
}
