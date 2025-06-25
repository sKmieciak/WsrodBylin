namespace PlantStore.Api.DTOs
{
    public class CreateStripeSessionDto
    {
        public List<StripeLineItemDto> Items { get; set; } = new();
    }

    public class StripeLineItemDto
    {
        public string ProductName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }

}
