using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Data;
using PlantStore.Api.DTOs;
using PlantStore.Api.Mappers;
using PlantStore.Api.Services;

namespace PlantStore.Api.Controllers
{
    [ApiController]
    [Route("api/admin/users")]
    [Authorize(Roles = "Admin")]
    public class AdminUsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAuditService _audit;

        public AdminUsersController(AppDbContext context, IAuditService audit)
        {
            _context = context;
            _audit = audit;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users.Select(u => UserMapper.ToDto(u)));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(UserMapper.ToDto(user));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.UpdateFromDto(dto);
            await _context.SaveChangesAsync();
            await _audit.LogAsync("Edytowano", "Użytkownik", id, user.Email);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            var email = user.Email;
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            await _audit.LogAsync("Usunięto", "Użytkownik", id, email);
            return NoContent();
        }

        //[HttpPut("{id}/admin")]
        //public async Task<IActionResult> ToggleAdminStatus(int id)
        //{
        //    var user = await _context.Users.FindAsync(id);
        //    if (user == null) return NotFound();

        //    user.IsAdmin = !user.IsAdmin;
        //    await _context.SaveChangesAsync();

        //    return Ok(new { user.IsAdmin });
        //}
    }
}
