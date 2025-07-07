using System.ComponentModel.DataAnnotations;

public class UserRegisterDto
{
    [Required]
    public string FirstName { get; set; } = "";

    [Required]
    public string LastName { get; set; } = "";

    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Required]
    public string Password { get; set; } = "";

    public string? PhoneNumber { get; set; }

    public string? Street { get; set; }
    public string? HouseNumber { get; set; }
    public string? PostalCode { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? AddressAddon { get; set; }

    public bool IsCompanyAccount { get; set; }
}
