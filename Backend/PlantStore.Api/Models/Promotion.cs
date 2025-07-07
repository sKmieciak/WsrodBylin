using PlantStore.Api.Models;
using System.ComponentModel.DataAnnotations;

public class Promotion
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    [Range(0, 100)]
    public decimal DiscountPercentage { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public bool IsActive => DateTime.UtcNow >= StartDate && DateTime.UtcNow <= EndDate;

    public ICollection<Product> Products { get; set; } = new List<Product>(); // ✅ relacja N:M
}
