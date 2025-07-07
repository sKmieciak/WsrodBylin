using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Data;
using PlantStore.Api.Dtos;
using PlantStore.Api.Mappers;
using System.Security.Claims;

namespace PlantStore.Api.Controllers
{
    [ApiController]
    [Route("api/user/addresses")]
    [Authorize]
    public class UserAddressController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserAddressController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetUserId();
            var addresses = await _context.UserAddresses
                .Where(a => a.UserId == userId)
                .Select(a => a.ToDto())
                .ToListAsync();

            return Ok(addresses);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateUserAddressDto dto)
        {
            var userId = GetUserId();
            var address = dto.ToEntity(userId);

            _context.UserAddresses.Add(address);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = address.Id }, address.ToDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var address = await _context.UserAddresses.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
            if (address == null) return NotFound();

            _context.UserAddresses.Remove(address);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
