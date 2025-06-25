﻿namespace PlantStore.Api.Dtos
{
    public class UserAddressDto
    {
        public int Id { get; set; }
        public string Label { get; set; } = string.Empty;
        public string Street { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }
}
