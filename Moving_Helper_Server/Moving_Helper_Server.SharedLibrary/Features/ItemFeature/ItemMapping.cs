namespace Moving_Helper_Server.SharedLibrary.Features.ItemFeature;

public static class ItemMapping
{
    public static Item ToEntity(this ItemCreateDto createDto)
    {
        return new Item
        {
            Name = createDto.Name,
            Description = createDto.Description,
            PictureId = createDto.PictureId,
            BoxId = createDto.BoxId
        };
    }

    public static Item ToEntity(this ItemInfoDto infoDto)
    {
        return new Item
        {
            Id   = infoDto.Id,
            Name = infoDto.Name,
            Description = infoDto.Description,
            BoxId = infoDto.BoxId,
            PictureId = infoDto.PictureId
        };
    }

    public static ItemInfoDto ToInfoDto(this Item itemEntity)
    {
        return new ItemInfoDto
        (
            itemEntity.Id,
            itemEntity.Name,
            itemEntity.Description,
            itemEntity.BoxId,
            itemEntity.PictureId
        );
    }

    public static ItemDetailsDto ToDetailsDto(this Item itemEntity)
    {
        return new ItemDetailsDto
        (
            itemEntity.Id,
            itemEntity.Name,
            itemEntity.Description,
            itemEntity.BoxId,
            itemEntity.Box.Label,
            itemEntity.Box.LocationId,
            itemEntity.Box.Location.Name,
            itemEntity.Box.MoveFromId,
            itemEntity.Box.MoveFrom != null ? itemEntity.Box.MoveFrom.Name : "No source",
            itemEntity.Box.MoveToId,
            itemEntity.Box.MoveTo != null ? itemEntity.Box.MoveTo.Name : "No destination",
            itemEntity.PictureId
        );
    }
}