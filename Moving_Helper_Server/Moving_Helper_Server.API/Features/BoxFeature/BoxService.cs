using Moving_Helper_Server.API.Database;
using Moving_Helper_Server.SharedLibrary.Features.BoxFeature;

namespace Moving_Helper_Server.API.Features.BoxFeature;

public class BoxService(MovingHelperDbContext dbContext) : IBoxService
{
    public async Task<List<BoxInfoDto>> GetAllBoxInfoAsync()
    {
        
    }

    public async Task<List<BoxDetailsDto>> GetAllBoxDetailsAsync()
    {
        
    }

    public async Task<BoxInfoDto?> GetBoxInfoAsync(int id)
    {
        
    }

    public async Task<BoxDetailsDto?> GetBoxDetailsAsync(int id)
    {
        
    }

    public async Task<BoxDetailsDto?> GetBoxDetailsMatchingStringAsync(string searchString)
    {
        
    }

    public async Task<List<int>?> GetBoxAllItemIdsAsync(int id)
    {
        
    }

    public async Task<BoxInfoDto> CreateBoxAsync(BoxCreateDto createDto)
    {
        
    }

    public async Task<BoxInfoDto?> MoveBoxLocationAsync(int id, int newLocationId)
    {
        
    }

    public async Task<bool> DeleteBoxAsync(int id)
    {
        
    }
}