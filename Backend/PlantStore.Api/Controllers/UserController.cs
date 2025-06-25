using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlantStore.Api.Data;
using PlantStore.Api.Dtos;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.DTOs;
using PlantStore.Api.Mappers;
using Microsoft.AspNetCore.Identity;
using PlantStore.Api.Services;

namespace PlantStore.Api.Controllers
{
    [ApiController]
    [Route("api/user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/user/me
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

            if (user == null) return NotFound();

            var dto = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Phone = user.PhoneNumber,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Street = user.Street,
                HouseNumber = user.HouseNumber,
                PostalCode = user.PostalCode,
                City = user.City,
                Country = user.Country,
                AddressAddon = user.AddressAddon,
                IsCompanyAccount = user.IsCompanyAccount
            };


            return Ok(dto);
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user == null) return NotFound();

            user.UpdateFromDto(dto);

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [Authorize]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto, [FromServices] IPasswordHasher passwordHasher)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user == null) return NotFound();

            if (!passwordHasher.Verify(dto.CurrentPassword, user.PasswordHash))
                return BadRequest("Current password is incorrect.");

            user.PasswordHash = passwordHasher.Hash(dto.NewPassword);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
