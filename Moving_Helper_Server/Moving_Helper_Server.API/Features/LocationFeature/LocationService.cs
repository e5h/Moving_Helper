using Moving_Helper_Server.API.Database;
using Moving_Helper_Server.SharedLibrary.Features.LocationFeature;

namespace Moving_Helper_Server.API.Features.LocationFeature;

public class LocationService(MovingHelperDbContext dbContext) : ILocationService
{
    public async Task<List<LocationInfoDto>> GetAllLocationInfoAsync()
    {
        
    }

    public async Task<List<LocationDetailsDto>> GetAllLocationDetailsAsync()
    {
        
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