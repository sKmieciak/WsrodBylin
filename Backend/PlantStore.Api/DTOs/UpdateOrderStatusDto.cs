using System.ComponentModel.DataAnnotations;
using PlantStore.Api.Models;

namespace PlantStore.Api.Dtos
{
    public class UpdateOrderStatusDto
    {
        [Required]
        public OrderStatus Status { get; set; }
    }

    public class UpdatePaymentStatusDto
    {
        [Required]
        public PaymentStatus PaymentStatus { get; set; }
    }
}
