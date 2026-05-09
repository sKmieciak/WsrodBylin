using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Data;
using System.Text;

namespace PlantStore.Api.Controllers
{
    [ApiController]
    [Route("sitemap.xml")]
    public class SitemapController : ControllerBase
    {
        private readonly AppDbContext _db;

        public SitemapController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            const string baseUrl = "https://wsrodbylin.pl";

            var staticPages = new[]
            {
                new { url = "/",          priority = "1.0", changefreq = "weekly"  },
                new { url = "/products",  priority = "0.9", changefreq = "daily"   },
                new { url = "/promocje",  priority = "0.7", changefreq = "weekly"  },
                new { url = "/kontakt",   priority = "0.5", changefreq = "monthly" },
                new { url = "/regulamin", priority = "0.3", changefreq = "monthly" },
            };

            var products = await _db.Products
                .AsNoTracking()
                .Select(p => p.Id)
                .ToListAsync();

            var sb = new StringBuilder();
            sb.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            sb.AppendLine("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

            foreach (var page in staticPages)
            {
                sb.AppendLine("  <url>");
                sb.AppendLine($"    <loc>{baseUrl}{page.url}</loc>");
                sb.AppendLine($"    <changefreq>{page.changefreq}</changefreq>");
                sb.AppendLine($"    <priority>{page.priority}</priority>");
                sb.AppendLine("  </url>");
            }

            foreach (var id in products)
            {
                sb.AppendLine("  <url>");
                sb.AppendLine($"    <loc>{baseUrl}/product/{id}</loc>");
                sb.AppendLine("    <changefreq>weekly</changefreq>");
                sb.AppendLine("    <priority>0.8</priority>");
                sb.AppendLine("  </url>");
            }

            sb.AppendLine("</urlset>");

            return Content(sb.ToString(), "application/xml", Encoding.UTF8);
        }
    }
}
