using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Auth;
using PlantStore.Api.Data;
using PlantStore.Api.Dtos;
using PlantStore.Api.Mappers;
using PlantStore.Api.Models;

namespace PlantStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] bool? available,
            [FromQuery] int? categoryId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
                query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()));

            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);

            if (available == true)
                query = query.Where(p => p.InStock > 0);

            if (categoryId.HasValue)
                query = query.Where(p => p.CategoryId == categoryId.Value);

            var totalItems = await query.CountAsync();
            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var productDtos = products.Select(ProductMapper.ToDto);

            return Ok(new
            {
                totalItems,
                currentPage = page,
                totalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                items = productDtos
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProductById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            return ProductMapper.ToDto(product);
        }

        [Authorize]
        [AdminOnly]
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] ProductCreateDto dto)
        {
            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null) return BadRequest("Invalid category.");

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                InStock = dto.InStock,
                CategoryId = dto.CategoryId
            };

            for (int i = 0; i < dto.Images.Count; i++)
            {
                var image = dto.Images[i];
                if (image.Length > 0)
                {
                    var fileName = $"{Guid.NewGuid()}_{image.FileName}";
                    var path = Path.Combine(_env.WebRootPath, "images", fileName);

                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    var imageUrl = $"/images/{fileName}";
                    product.Images.Add(new ProductImage { Url = imageUrl });

                    if (i == 0)
                        product.ImageUrl = imageUrl; // ustaw domyślne zdjęcie
                }
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = product.Id }, ProductMapper.ToDto(product));
        }

        [Authorize]
        [AdminOnly]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductUpdateDto dto)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null) return BadRequest("Invalid category.");

            // Usunięcie starych zdjęć z dysku i bazy
            foreach (var image in product.Images)
            {
                var path = Path.Combine(_env.WebRootPath, image.Url.TrimStart('/'));
                if (System.IO.File.Exists(path))
                    System.IO.File.Delete(path);
            }

            _context.ProductImages.RemoveRange(product.Images);
            product.Images.Clear();

            // Dodanie nowych zdjęć
            for (int i = 0; i < dto.Images.Count; i++)
            {
                var image = dto.Images[i];
                if (image.Length > 0)
                {
                    var fileName = $"{Guid.NewGuid()}_{image.FileName}";
                    var path = Path.Combine(_env.WebRootPath, "images", fileName);

                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    var imageUrl = $"/images/{fileName}";
                    product.Images.Add(new ProductImage { Url = imageUrl });

                    if (i == 0)
                        product.ImageUrl = imageUrl; // zaktualizuj domyślne zdjęcie
                }
            }

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.InStock = dto.InStock;
            product.CategoryId = dto.CategoryId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [AdminOnly]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            foreach (var image in product.Images)
            {
                var path = Path.Combine(_env.WebRootPath, image.Url.TrimStart('/'));
                if (System.IO.File.Exists(path))
                    System.IO.File.Delete(path);
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
