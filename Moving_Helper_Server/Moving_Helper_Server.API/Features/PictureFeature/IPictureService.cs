using Moving_Helper_Server.SharedLibrary.Features.PictureFeature;

namespace Moving_Helper_Server.API.Features.PictureFeature;

public interface IPictureService
{
    Task<List<PictureInfoDto>> GetAllPictureInfoAsync();
    Task<PictureInfoDto?>      GetPictureInfoAsync(int id);
    Task<PictureInfoDto>       CreatePictureAsync(PictureCreateDto createDto);
    Task<bool>                 DeletePictureAsync(int id);
    Task<PictureDownloadDto?>  DownloadPictureAsync(int id);
    Task<PictureInfoDto?>      UploadPictureAsync(PictureUploadDto uploadDto);
}