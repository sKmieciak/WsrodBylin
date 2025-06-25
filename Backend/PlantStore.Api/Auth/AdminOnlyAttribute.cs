using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace PlantStore.Api.Auth
{
    public class AdminOnlyAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;
            var isAdminClaim = user.FindFirst("IsAdmin")?.Value;

            if (string.IsNullOrEmpty(isAdminClaim) || isAdminClaim != "True")
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
