using Moving_Helper_Server.API.Database;
using Moving_Helper_Server.SharedLibrary.Features.ItemFeature;

namespace Moving_Helper_Server.API.Features.ItemFeature;

public class ItemService(MovingHelperDbContext dbContext) : IItemService
{
    public async Task<List<ItemInfoDto>> GetAllItemInfoAsync()
    {
        
    }

    public async Task<List<ItemDetailsDto>> GetAllItemDetailsAsync()
    {
        
    }

    public async Task<ItemInfoDto?> GetItemInfoAsync(int id)
    {
        
    }

    public async Task<ItemDetailsDto?> GetItemDetailsAsync(int id)
    {
        
    }

    public async Task<ItemDetailsDto?> GetItemDetailsMatchingStringAsync(string searchString)
    {
        
    }

    public async Task<ItemInfoDto> CreateItemAsync(ItemCreateDto createDto)
    {
        
    }

    public async Task<ItemInfoDto?> MoveItemBoxAsync(int id, int newBoxId)
    {
        
    }

    public async Task<bool> DeleteItemAsync(int id)
    {
        
    }
}