public class CreatePromotionDto
{
    public string Name { get; set; } = "";
    public decimal DiscountPercentage { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<int> ProductIds { get; set; } = new(); // ✅
}
