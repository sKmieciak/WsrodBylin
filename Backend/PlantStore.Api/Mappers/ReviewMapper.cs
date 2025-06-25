using PlantStore.Api.DTOs;
using PlantStore.Api.Models;

namespace PlantStore.Api.Mappers
{
    public static class ReviewMapper
    {
        public static ReviewResponseDto ToDto(this Review review) => new()
        {
            Id = review.Id,
            AuthorName = review.AuthorName,
            Content = review.Content,
            Rating = review.Rating,
            CreatedAt = review.CreatedAt,
            Email = review.Email
        };

        public static Review ToEntity(this ReviewDto dto, int productId) => new()
        {
            AuthorName = dto.AuthorName,
            Content = dto.Content,
            Rating = dto.Rating,
            ProductId = productId,
            CreatedAt = DateTime.UtcNow,
            Email = dto.Email
        };
    }
}
