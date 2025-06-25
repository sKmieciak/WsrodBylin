﻿namespace PlantStore.Api.Dtos
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public int InStock { get; set; }
        public string? CategoryName { get; set; } // jeśli chcesz wyświetlać kategorię
    }
}
