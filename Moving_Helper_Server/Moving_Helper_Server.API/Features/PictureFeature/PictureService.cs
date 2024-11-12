using Moving_Helper_Server.API.Database;
using Moving_Helper_Server.API.Common;
using Moving_Helper_Server.SharedLibrary.Features.PictureFeature;
using Microsoft.EntityFrameworkCore;

namespace Moving_Helper_Server.API.Features.PictureFeature;

public class PictureService(MovingHelperDbContext dbContext) : IPictureService
{
    public async Task<List<PictureInfoDto>> GetAllPictureInfoAsync()
    {
        var allPictureInfo = await dbContext.Pictures
            .Select(p => p.ToInfoDto())
            .AsNoTracking()
            .ToListAsync();
        
        return allPictureInfo;
    }

    public async Task<PictureInfoDto?> GetPictureInfoAsync(int id)
    {
        var pictureInfo = await dbContext.Pictures
            .Where(p => p.Id == id)
            .Select(p => p.ToInfoDto())
            .AsNoTracking()
            .FirstOrDefaultAsync();

        return pictureInfo;
    }

    public async Task<PictureInfoDto> CreatePictureAsync(PictureCreateDto createDto)
    {
        var pictureEntity = createDto.ToEntity();
        
        dbContext.Pictures.Add(pictureEntity);
        await dbContext.SaveChangesAsync();
        
        return pictureEntity.ToInfoDto();
    }

    public async Task<bool> DeletePictureAsync(int id)
    {
        var rowsAffected = await dbContext.Pictures
            .Where(p => p.Id == id)
            .ExecuteDeleteAsync();

        return rowsAffected > 0;
    }

    public async Task<PictureDownloadDto?> DownloadPictureAsync(int id)
    {
        var pictureInfo = await GetPictureInfoAsync(id);

        if (pictureInfo == null)
        {
            return null;
        }

        var basePath = Constants.PicturesPath();
        var fullPath = Path.Combine(basePath, pictureInfo.FileName);

        if (!File.Exists(fullPath))
        {
            return null;
        }
        
        var data = await File.ReadAllBytesAsync(fullPath);

        return new PictureDownloadDto(pictureInfo, data);
    }

    public async Task<PictureInfoDto?> UploadPictureAsync(PictureUploadDto uploadDto)
    {
        var basePath = Constants.PicturesPath();
        var fullPath = Path.Combine(basePath, uploadDto.CreateDto.FileName);
        
        await File.WriteAllBytesAsync(fullPath, uploadDto.Data);
        
        var pictureInfo = await CreatePictureAsync(uploadDto.CreateDto);

        return pictureInfo;
    }
}