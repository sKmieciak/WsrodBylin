namespace PlantStore.Api.Dtos
{
    public class CreateOrderDto
    {
        public List<CreateOrderItemDto> Items { get; set; } = new();
        public string Courier { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
    }

    public class CreateOrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
