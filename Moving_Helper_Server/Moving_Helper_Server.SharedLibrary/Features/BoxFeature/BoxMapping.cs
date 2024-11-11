namespace Moving_Helper_Server.SharedLibrary.Features.BoxFeature;

public static class BoxMapping
{
    public static Box ToEntity(this BoxCreateDto createDto)
    {
        return new Box
        {
            Label = createDto.Label,
            Description = createDto.Description,
            LocationId = createDto.LocationId
        };
    }

    public static Box ToEntity(this BoxInfoDto infoDto)
    {
        return new Box
        {
            Id = infoDto.Id,
            Label = infoDto.Label,
            Description = infoDto.Description,
            LocationId = infoDto.LocationId,
            MoveFromId = infoDto.MoveFromId,
            MoveToId = infoDto.MoveToId,
            PictureId = infoDto.PictureId
        };
    }

    public static BoxInfoDto ToInfoDto(this Box boxEntity)
    {
        return new BoxInfoDto
        (
            boxEntity.Id,
            boxEntity.Label,
            boxEntity.Description,
            boxEntity.LocationId,
            boxEntity.MoveFromId,
            boxEntity.MoveToId,
            boxEntity.PictureId
        );
    }

    public static BoxDetailsDto ToDetailsDto(this Box boxEntity, int[] itemIds)
    {
        return new BoxDetailsDto
        (
            boxEntity.Id,
            boxEntity.Label,
            boxEntity.Description,
            itemIds,
            boxEntity.LocationId,
            boxEntity.Location.Name,
            boxEntity.MoveFromId,
            boxEntity.MoveFrom != null ? boxEntity.MoveFrom.Name : "No source",
            boxEntity.MoveToId,
            boxEntity.MoveTo != null ? boxEntity.MoveTo.Name : "No destination",
            boxEntity.PictureId
        );
    }
}