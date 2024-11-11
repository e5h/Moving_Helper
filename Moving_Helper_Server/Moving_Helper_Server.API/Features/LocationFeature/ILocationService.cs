using Moving_Helper_Server.SharedLibrary.Features.LocationFeature;

namespace Moving_Helper_Server.API.Features.LocationFeature;

public interface ILocationService
{
    Task<List<LocationInfoDto>>     GetAllLocationInfoAsync();
    Task<List<LocationDetailsDto>>  GetAllLocationDetailsAsync();
    Task<LocationInfoDto?>          GetLocationInfoAsync(int id);
    Task<LocationDetailsDto?>       GetLocationDetailsAsync(int id);
    Task<List<LocationDetailsDto>?> GetLocationDetailsMatchingStringAsync(string searchString);
    Task<List<int>?>                GetLocationAllBoxIdsAsync(int id);
    Task<List<int>?>                GetLocationAllItemIdsAsync(int id);
    Task<LocationInfoDto>           CreateLocationAsync(LocationCreateDto createDto);
    Task<bool>                      DeleteLocationAsync(int id);
}