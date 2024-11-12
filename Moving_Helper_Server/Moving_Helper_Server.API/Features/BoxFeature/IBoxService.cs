using Moving_Helper_Server.SharedLibrary.Features.BoxFeature;

namespace Moving_Helper_Server.API.Features.BoxFeature;

public interface IBoxService
{
    Task<List<BoxInfoDto>>     GetAllBoxInfoAsync();
    Task<List<BoxDetailsDto>>  GetAllBoxDetailsAsync();
    Task<BoxInfoDto?>          GetBoxInfoAsync(int id);
    Task<BoxDetailsDto?>       GetBoxDetailsAsync(int id);
    Task<List<BoxDetailsDto>?> GetBoxDetailsMatchingStringAsync(string searchString);
    Task<List<int>?>           GetBoxAllItemIdsAsync(int id);
    Task<BoxInfoDto>           CreateBoxAsync(BoxCreateDto createDto);
    Task<BoxInfoDto?>          MoveBoxLocationAsync(BoxMoveDto moveDto);
    Task<bool>                 DeleteBoxAsync(int id);
}