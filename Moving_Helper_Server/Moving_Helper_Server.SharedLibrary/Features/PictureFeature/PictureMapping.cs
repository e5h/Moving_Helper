namespace Moving_Helper_Server.SharedLibrary.Features.PictureFeature;

public static class PictureMapping
{
    public static Picture ToEntity(this PictureCreateDto createDto)
    {
        return new Picture
        {
            FileName        = createDto.FileName,
            Description = createDto.Description
        };
    }

    public static Picture ToEntity(this PictureInfoDto infoDto)
    {
        return new Picture
        {
            Id          = infoDto.Id,
            FileName        = infoDto.FileName,
            Description = infoDto.Description
        };
    }

    public static PictureInfoDto ToInfoDto(this Picture pictureEntity)
    {
        return new PictureInfoDto
        (
            pictureEntity.Id,
            pictureEntity.FileName,
            pictureEntity.Description
        );
    }
    
    public static PictureDetailsDto ToDetailsDto(this Picture pictureEntity)
    {
        return new PictureDetailsDto
        (
            pictureEntity.Id,
            pictureEntity.FileName,
            pictureEntity.Description
        );
    }
}