using Moving_Helper_Server.API.Database;
using Moving_Helper_Server.SharedLibrary.Features.BoxFeature;
using Microsoft.EntityFrameworkCore;

namespace Moving_Helper_Server.API.Features.BoxFeature;

public class BoxService(MovingHelperDbContext dbContext) : IBoxService
{
    public async Task<List<BoxInfoDto>> GetAllBoxInfoAsync()
    {
        var allBoxInfo = await dbContext.Boxes
            .Select(b => b.ToInfoDto())
            .AsNoTracking()
            .ToListAsync();

        return allBoxInfo;
    }

    public async Task<List<BoxDetailsDto>> GetAllBoxDetailsAsync()
    {
        var allBoxDetails = await dbContext.Boxes
            .Include(b => b.Location)
            .Include(b => b.MoveFrom)
            .Include(b => b.MoveTo)
            .Include(b => b.Picture)
            .Select(b => 
                b.ToDetailsDto(
                    dbContext.Items
                        .Where(i => i.BoxId == b.Id)
                        .Select(i => i.Id)
                        .ToArray())
            )
            .AsNoTracking()
            .ToListAsync();
        
        return allBoxDetails;
    }

    public async Task<BoxInfoDto?> GetBoxInfoAsync(int id)
    {
        var boxInfo = await dbContext.Boxes
            .Where(b => b.Id == id)
            .Select(b => b.ToInfoDto())
            .AsNoTracking()
            .FirstOrDefaultAsync();

        return boxInfo;
    }

    public async Task<BoxDetailsDto?> GetBoxDetailsAsync(int id)
    {
        var boxDetails = await dbContext.Boxes
            .Where(b => b.Id == id)
            .Include(b => b.Location)
            .Include(b => b.MoveFrom)
            .Include(b => b.MoveTo)
            .Include(b => b.Picture)
            .Select(b => 
                b.ToDetailsDto(
                    dbContext.Items
                        .Where(i => i.BoxId == b.Id)
                        .Select(i => i.Id)
                        .ToArray())
            )
            .AsNoTracking()
            .FirstOrDefaultAsync();

        return boxDetails;
    }

    public async Task<List<BoxDetailsDto>?> GetBoxDetailsMatchingStringAsync(string searchString)
    {
        var boxDetails = await dbContext.Boxes
            .Where(b =>
                b.Description.ToLower().Contains(searchString.ToLower()) ||
                b.Label.ToLower().Contains(searchString.ToLower())
            )
            .Include(b => b.Location)
            .Include(b => b.MoveFrom)
            .Include(b => b.MoveTo)
            .Include(b => b.Picture)
            .Select(b => 
                b.ToDetailsDto(
                    dbContext.Items
                        .Where(i => i.BoxId == b.Id)
                        .Select(i => i.Id)
                        .ToArray())
            )
            .AsNoTracking()
            .ToListAsync();

        return boxDetails;
    }

    public async Task<List<int>?> GetBoxAllItemIdsAsync(int id)
    {
        var boxItemIds = await dbContext.Items
            .Where(i => i.BoxId == id)
            .Select(i => i.Id)
            .ToListAsync();

        return boxItemIds;
    }

    public async Task<BoxInfoDto> CreateBoxAsync(BoxCreateDto createDto)
    {
        var boxEntity = createDto.ToEntity();
        
        dbContext.Boxes.Add(boxEntity);
        await dbContext.SaveChangesAsync();
        
        return boxEntity.ToInfoDto();
    }

    public async Task<BoxInfoDto?> MoveBoxLocationAsync(int id, int newLocationId)
    {
        var boxEntity = await dbContext.Boxes.FindAsync(id);

        if (boxEntity == null)
        {
            return null;
        }

        if (!await dbContext.Locations.AnyAsync(l => l.Id == newLocationId))
        {
            throw new ArgumentException("New location is invalid.");
        }

        var moddedBox = boxEntity;
        moddedBox.LocationId = newLocationId;
        
        dbContext.Boxes.Entry(boxEntity).CurrentValues.SetValues(moddedBox);
        await dbContext.SaveChangesAsync();

        return moddedBox.ToInfoDto();
    }

    public async Task<bool> DeleteBoxAsync(int id)
    {
        var rowsAffected = await dbContext.Boxes
            .Where(b => b.Id == id)
            .ExecuteDeleteAsync();

        return rowsAffected > 0;
    }
}