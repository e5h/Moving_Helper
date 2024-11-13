using Moving_Helper_Server.API.Database;
using Moving_Helper_Server.SharedLibrary.Features.ItemFeature;
using Microsoft.EntityFrameworkCore;

namespace Moving_Helper_Server.API.Features.ItemFeature;

public class ItemService(MovingHelperDbContext dbContext) : IItemService
{
    public async Task<List<ItemInfoDto>> GetAllItemInfoAsync()
    {
        var allItemInfo = await dbContext.Items
            .Select(i => i.ToInfoDto())
            .AsNoTracking()
            .ToListAsync();

        return allItemInfo;
    }

    public async Task<List<ItemDetailsDto>> GetAllItemDetailsAsync()
    {
        var allItemDetails = await dbContext.Items
            .Include(i => i.Box)
            .ThenInclude(b => b.Location)
            .Include(i => i.Box)
            .ThenInclude(b => b.MoveFrom)
            .Include(i => i.Box)
            .ThenInclude(b => b.MoveTo)
            .Include(i => i.Box)
            .ThenInclude(b => b.Picture)
            .Select(i => i.ToDetailsDto())
            .AsNoTracking()
            .ToListAsync();
        
        return allItemDetails;
    }

    public async Task<ItemInfoDto?> GetItemInfoAsync(int id)
    {
        var itemInfo = await dbContext.Items
            .Where(i => i.Id == id)
            .Select(i => i.ToInfoDto())
            .AsNoTracking()
            .FirstOrDefaultAsync();

        return itemInfo;
    }

    public async Task<ItemDetailsDto?> GetItemDetailsAsync(int id)
    {
        var itemDetails = await dbContext.Items
            .Where(i => i.Id == id)
            .Include(i => i.Box)
            .ThenInclude(b => b.Location)
            .Include(i => i.Box)
            .ThenInclude(b => b.MoveFrom)
            .Include(i => i.Box)
            .ThenInclude(b => b.MoveTo)
            .Include(i => i.Box)
            .ThenInclude(b => b.Picture)
            .Select(i => i.ToDetailsDto())
            .AsNoTracking()
            .FirstOrDefaultAsync();
        
        return itemDetails;
    }

    public async Task<List<ItemDetailsDto>?> GetItemDetailsMatchingStringAsync(string searchString)
    {
        var itemDetails = await dbContext.Items
            .Where(i =>
                i.Name.ToLower().Contains(searchString.ToLower()) ||
                i.Description.ToLower().Contains(searchString.ToLower())
            )
            .Include(i => i.Box)
            .ThenInclude(b => b.Location)
            .Include(i => i.Box)
            .ThenInclude(b => b.MoveFrom)
            .Include(i => i.Box)
            .ThenInclude(b => b.MoveTo)
            .Include(i => i.Box)
            .ThenInclude(b => b.Picture)
            .Select(i => i.ToDetailsDto())
            .AsNoTracking()
            .ToListAsync();
        
        return itemDetails;
    }

    public async Task<ItemInfoDto> CreateItemAsync(ItemCreateDto createDto)
    {
        var itemEntity = createDto.ToEntity();
        
        dbContext.Items.Add(itemEntity);
        await dbContext.SaveChangesAsync();
        
        return itemEntity.ToInfoDto();
    }

    public async Task<ItemInfoDto?> MoveItemBoxAsync(ItemMoveDto moveDto)
    {
        var itemEntity = await dbContext.Items.FindAsync(moveDto.ItemId);

        if (itemEntity == null)
        {
            return null;
        }

        if (!await dbContext.Boxes.AnyAsync(b => b.Id == moveDto.NewBoxId))
        {
            throw new ArgumentException("New box is invalid");
        }

        var moddedItem = itemEntity;
        moddedItem.BoxId = moveDto.NewBoxId;

        dbContext.Items.Entry(itemEntity).CurrentValues.SetValues(moddedItem);
        await dbContext.SaveChangesAsync();
        
        return moddedItem.ToInfoDto();
    }

    public async Task<bool> DeleteItemAsync(int id)
    {
        var rowsAffected = await dbContext.Items
            .Where(i => i.Id == id)
            .ExecuteDeleteAsync();

        return rowsAffected > 0;
    }
}