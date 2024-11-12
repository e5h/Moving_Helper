using Moving_Helper_Server.SharedLibrary.Common;

namespace Moving_Helper_Server.SharedLibrary.Features.LocationFeature;

public static class LocationMapping
{
    public static Location ToEntity(this LocationCreateDto createDto)
    {
        return new Location
        {
            Name = createDto.Name,
            Description = createDto.Description,
            PictureId = Constants.NO_IMAGE_INDEX
        };
    }

    public static Location ToEntity(this LocationInfoDto infoDto)
    {
        return new Location
        {
            Id = infoDto.Id,
            Name = infoDto.Name,
            Description = infoDto.Description,
            PictureId = infoDto.PictureId
        };
    }

    public static LocationInfoDto ToInfoDto(this Location locationEntity)
    {
        return new LocationInfoDto
        (
            locationEntity.Id,
            locationEntity.Name,
            locationEntity.Description,
            locationEntity.PictureId
        );
    }

    public static LocationDetailsDto ToDetailsDto(this Location locationEntity, int[] boxIds)
    {
        return new LocationDetailsDto
        (
            locationEntity.Id,
            locationEntity.Name,
            locationEntity.Description,
            boxIds.Length,
            boxIds,
            locationEntity.PictureId
        );
    }
}