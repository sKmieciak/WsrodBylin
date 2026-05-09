using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlantStore.Api.Migrations
{
    public partial class AddTrackingNumber : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TrackingNumber",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "TrackingNumber", table: "Orders");
        }
    }
}
