using Moving_Helper_Server.SharedLibrary.Features.ItemFeature;

namespace Moving_Helper_Server.API.Features.ItemFeature;

public interface IItemService
{
    Task<List<ItemInfoDto>>     GetAllItemInfoAsync();
    Task<List<ItemDetailsDto>>  GetAllItemDetailsAsync();
    Task<ItemInfoDto?>          GetItemInfoAsync(int id);
    Task<ItemDetailsDto?>       GetItemDetailsAsync(int id);
    Task<List<ItemDetailsDto>?> GetItemDetailsMatchingStringAsync(string searchString);
    Task<ItemInfoDto>           CreateItemAsync(ItemCreateDto createDto);
    Task<ItemInfoDto?>          MoveItemBoxAsync(int id, int newBoxId);
    Task<bool>                  DeleteItemAsync(int id);
}