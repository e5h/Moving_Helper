using Moving_Helper_Server.SharedLibrary.Features.BoxFeature;

namespace Moving_Helper_Server.API.Features.BoxFeature;

public static class BoxEndpoints
{
    public const string BOX_ENDPOINT_HANDLE = "/api/v1/boxes";
    public const string BOX_GET_ALL_INFO    = "GetAllBoxInfo";
    public const string BOX_GET_ALL_DETAILS = "GetAllBoxDetails";
    public const string BOX_GET_INFO        = "GetBoxInfo";
    public const string BOX_GET_DETAILS     = "GetBoxDetails";
    public const string BOX_SEARCH_DETAILS  = "SearchBoxDetails";
    public const string BOX_GET_ITEM_IDS    = "GetBoxItemIds";
    public const string BOX_CREATE          = "CreateBox";
    public const string BOX_MOVE_LOCATION   = "MoveBoxLocation";
    public const string BOX_DELETE          = "DeleteBox";

    /// <summary>
    /// Maps all endpoints specified in the box service interface.
    /// </summary>
    /// <param name="app">The built web application object.</param>
    /// <returns>The route group with all endpoints.</returns>
    public static RouteGroupBuilder MapBoxEndpoints(this WebApplication app)
    {
        var routeGroup = app.MapGroup(BOX_ENDPOINT_HANDLE);

        // GET - get information DTOs for all boxes in the database.
        routeGroup.MapGet("/info", async (IBoxService boxService) =>
        {
            var allBoxInfo = await boxService.GetAllBoxInfoAsync();
            
            return Results.Ok(allBoxInfo);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(BOX_GET_ALL_INFO);
        
        // GET - get detail DTOs for all boxes in the database.
        routeGroup.MapGet("/details", async (IBoxService boxService) =>
        {
            var allBoxDetails = await boxService.GetAllBoxDetailsAsync();
            
            return Results.Ok(allBoxDetails);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(BOX_GET_ALL_DETAILS);
        
        // GET - get an information DTO for the specified box.
        routeGroup.MapGet("/info/{id}", async (IBoxService boxService, int id) =>
        {
            var locationInfo = await boxService.GetBoxInfoAsync(id);

            if (locationInfo == null)
            {
                return Results.NotFound();
            }
            
            return Results.Ok(locationInfo);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(BOX_GET_INFO);
        
        // GET - get a details DTO for the specified box.
        routeGroup.MapGet("/details/{id}", async (IBoxService boxService, int id) =>
        {
            var locationDetails = await boxService.GetBoxDetailsAsync(id);

            if (locationDetails == null)
            {
                return Results.NotFound();
            }
            
            return Results.Ok(locationDetails);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(BOX_GET_DETAILS);
        
        // GET - get detail DTOs for all boxes matching the specified search term.
        routeGroup.MapGet("/search", async (IBoxService boxService, string searchTerm) =>
        {
            var matchingBoxDetails = await boxService.GetBoxDetailsMatchingStringAsync(searchTerm);

            if (matchingBoxDetails == null)
            {
                return Results.NotFound();
            }
            
            return Results.Ok(matchingBoxDetails);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(BOX_SEARCH_DETAILS);
        
        // GET - get all item IDs contained inside the specified box.
        routeGroup.MapGet("/itemids/{id}", async (IBoxService boxService, int id) =>
        {
            var allItemIds = await boxService.GetBoxAllItemIdsAsync(id);

            if (allItemIds == null || allItemIds.Count == 0)
            {
                return Results.NotFound();
            }
            
            return Results.Ok(allItemIds);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(BOX_GET_ITEM_IDS);

        // POST - create a new box.
        routeGroup.MapPost("/create", async (IBoxService boxService, BoxCreateDto createDto) =>
        {
            var locationInfo = await boxService.CreateBoxAsync(createDto);
            
            return Results.CreatedAtRoute(BOX_GET_INFO, new { id = locationInfo.Id }, locationInfo);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(BOX_CREATE);

        // PUT - move a box to a new (existing) location.
        routeGroup.MapPut("/move", async (IBoxService boxService, BoxMoveDto moveDto) =>
        {
            var movedBoxInfo = await boxService.MoveBoxLocationAsync(moveDto);

            if (movedBoxInfo == null)
            {
                return Results.NotFound();
            }
            
            return Results.Ok(movedBoxInfo);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(BOX_MOVE_LOCATION);
        
        // DELETE - delete the specified box.
        routeGroup.MapDelete("/delete/{id}", async (IBoxService boxService, int id) =>
        {
            var locationDeleted = await boxService.DeleteBoxAsync(id);
            
            return locationDeleted ? Results.NoContent() : Results.NotFound();
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(BOX_DELETE);

        return routeGroup;
    }
}