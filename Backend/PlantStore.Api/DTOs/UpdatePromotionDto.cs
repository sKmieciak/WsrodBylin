namespace PlantStore.Api.DTOs
{
    public class UpdatePromotionDto
    {
        public int ProductId { get; set; }
        public decimal DiscountPercentage { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
