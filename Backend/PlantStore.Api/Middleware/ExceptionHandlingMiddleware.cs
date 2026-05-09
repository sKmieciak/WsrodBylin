using PlantStore.Api.Data;
using PlantStore.Api.Models;

namespace PlantStore.Api.Middleware
{
    public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Nieoczekiwany błąd: {Message}", ex.Message);

                try
                {
                    var db = context.RequestServices.GetRequiredService<AppDbContext>();
                    db.AppLogs.Add(new AppLog
                    {
                        Level = "Error",
                        Message = ex.Message,
                        ExceptionType = ex.GetType().Name,
                        StackTrace = ex.StackTrace,
                        RequestPath = context.Request.Path,
                        RequestMethod = context.Request.Method
                    });
                    await db.SaveChangesAsync();
                }
                catch { /* nie blokuj odpowiedzi jeśli zapis logu się nie udał */ }

                context.Response.StatusCode = 500;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new { error = "Wystąpił błąd serwera." });
            }
        }
    }
}
