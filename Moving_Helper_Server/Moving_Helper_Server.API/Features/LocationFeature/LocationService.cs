using Moving_Helper_Server.API.Database;
using Moving_Helper_Server.SharedLibrary.Features.LocationFeature;
using Microsoft.EntityFrameworkCore;

namespace Moving_Helper_Server.API.Features.LocationFeature;

public class LocationService(MovingHelperDbContext dbContext) : ILocationService
{
    public async Task<List<LocationInfoDto>> GetAllLocationInfoAsync()
    {
        var allLocationInfo = await dbContext.Locations
            .Select(l => l.ToInfoDto())
            .AsNoTracking()
            .ToListAsync();
        
        return allLocationInfo;
    }

    public async Task<List<LocationDetailsDto>> GetAllLocationDetailsAsync()
    {
        var allLocationDetails = await dbContext.Locations
            .Include(l => l.Picture)
            .Select(l =>
                l.ToDetailsDto(
                    // Details DTO requires a list of the item IDs. This is a complicated
                    // query to retrieve them all, because there are no collection variables
                    // in the models of this application.
                    dbContext.Boxes
                        .Where(b => b.LocationId == l.Id) // All boxes in location
                        .Join(dbContext.Items,
                            box => box.Id,
                            item => item.BoxId,
                            (box, item) => item.Id) // Join boxes and items based on box ID
                        .ToArray()) // Take the item IDs and put them in an array
            )
            .AsNoTracking()
            .ToListAsync();
        
        return allLocationDetails;
    }

    public async Task<LocationInfoDto?> GetLocationInfoAsync(int id)
    {
        var locationInfo = await dbContext.Locations
            .Where(l => l.Id == id)
            .Select(l => l.ToInfoDto())
            .AsNoTracking()
            .FirstOrDefaultAsync();

        return locationInfo;
    }

    public async Task<LocationDetailsDto?> GetLocationDetailsAsync(int id)
    {
        var locationDetails = await dbContext.Locations
            .Where(l => l.Id == id)
            .Include(l => l.Picture)
            .Select(l =>
                    l.ToDetailsDto(
                        // Details DTO requires a list of the item IDs. This is a complicated
                        // query to retrieve them all, because there are no collection variables
                        // in the models of this application.
                        dbContext.Boxes
                            .Where(b => b.LocationId == l.Id) // All boxes in location
                            .Join(dbContext.Items,
                                box => box.Id,
                                item => item.BoxId,
                                (box, item) => item.Id) // Join boxes and items based on box ID
                            .ToArray())                 // Take the item IDs and put them in an array
            )
            .AsNoTracking()
            .FirstOrDefaultAsync();
        
        return locationDetails;
    }

    public async Task<List<LocationDetailsDto>?> GetLocationDetailsMatchingStringAsync(string searchString)
    {
        var locationDetails = await dbContext.Locations
            .Where(l =>
                l.Description.ToLower().Contains(searchString.ToLower()) ||
                l.Name.ToLower().Contains(searchString.ToLower())
            )
            .Include(l => l.Picture)
            .Select(l =>
                    l.ToDetailsDto(
                        // Details DTO requires a list of the item IDs. This is a complicated
                        // query to retrieve them all, because there are no collection variables
                        // in the models of this application.
                        dbContext.Boxes
                            .Where(b => b.LocationId == l.Id) // All boxes in location
                            .Join(dbContext.Items,
                                box => box.Id,
                                item => item.BoxId,
                                (box, item) => item.Id) // Join boxes and items based on box ID
                            .ToArray())                 // Take the item IDs and put them in an array
            )
            .AsNoTracking()
            .ToListAsync();
        
        return locationDetails;
    }

    public async Task<List<int>?> GetLocationAllBoxIdsAsync(int id)
    {
        var locationBoxIds = await dbContext.Boxes
            .Where(b => b.LocationId == id)
            .Select(b => b.Id)
            .ToListAsync();

        return locationBoxIds;
    }

    public async Task<List<int>?> GetLocationAllItemIdsAsync(int id)
    {
        var locationItemIds = await dbContext.Boxes
            .Where(b => b.LocationId == id) // All boxes in location
            .Join(dbContext.Items,
                box => box.Id,
                item => item.BoxId,
                (box, item) => item.Id)
            .ToListAsync();
        
        return locationItemIds;
    }

    public async Task<LocationInfoDto> CreateLocationAsync(LocationCreateDto createDto)
    {
        var locationEntity = createDto.ToEntity();
        
        dbContext.Locations.Add(locationEntity);
        await dbContext.SaveChangesAsync();
        
        return locationEntity.ToInfoDto();
    }

    public async Task<bool> DeleteLocationAsync(int id)
    {
        var rowsAffected = await dbContext.Locations
            .Where(l => l.Id == id)
            .ExecuteDeleteAsync();

        return rowsAffected > 0;
    }
}