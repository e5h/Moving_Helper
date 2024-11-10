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
        
    }

    public async Task<LocationDetailsDto?> GetLocationDetailsAsync(int id)
    {
        
    }

    public async Task<LocationDetailsDto?> GetLocationDetailsMatchingStringAsync(string searchString)
    {
        
    }

    public async Task<List<int>?> GetLocationAllBoxIdsAsync(int id)
    {
        
    }

    public async Task<List<int>?> GetLocationAllItemIdsAsync(int id)
    {
        
    }

    public async Task<LocationInfoDto> CreateLocationAsync(LocationCreateDto createDto)
    {
        
    }

    public async Task<bool> DeleteLocationAsync(int id)
    {
        
    }
}