namespace PlantStore.Api.Services
{
    public interface IPushService
    {
        Task SendToAllAsync(string title, string body, string? url = null);
        string GetPublicKey();
    }
}
