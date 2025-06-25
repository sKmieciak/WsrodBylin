public class UserDto
{
    public int Id { get; set; }
    public string Email { get; set; } = "";
    public string? Phone { get; set; }

    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";

    public string? Street { get; set; }
    public string? HouseNumber { get; set; }
    public string? PostalCode { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? AddressAddon { get; set; }

    public bool IsCompanyAccount { get; set; }
}
