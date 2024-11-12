using Moving_Helper_Server.SharedLibrary.Features.ItemFeature;

namespace Moving_Helper_Server.API.Features.ItemFeature;

public static class ItemEndpoints
{
    public const string ITEM_ENDPOINT_HANDLE = "/api/v1/items";
    public const string ITEM_GET_ALL_INFO    = "GetAllItemInfo";
    public const string ITEM_GET_ALL_DETAILS = "GetAllItemDetails";
    public const string ITEM_GET_INFO        = "GetItemInfo";
    public const string ITEM_GET_DETAILS     = "GetItemDetails";
    public const string ITEM_SEARCH_DETAILS  = "SearchItemDetails";
    public const string ITEM_CREATE          = "CreateItem";
    public const string ITEM_MOVE_LOCATION   = "MoveItemLocation";
    public const string ITEM_DELETE          = "DeleteItem";

    /// <summary>
    /// Maps all endpoints specified in the item service interface.
    /// </summary>
    /// <param name="app">The built web application object.</param>
    /// <returns>The route group with all endpoints.</returns>
    public static RouteGroupBuilder MapItemEndpoints(this WebApplication app)
    {
        var routeGroup = app.MapGroup(ITEM_ENDPOINT_HANDLE);

        // GET - get information DTOs for all items in the database.
        routeGroup.MapGet("/info", async (IItemService itemService) =>
        {
            var allItemInfo = await itemService.GetAllItemInfoAsync();
            
            return Results.Ok(allItemInfo);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(ITEM_GET_ALL_INFO);
        
        // GET - get detail DTOs for all items in the database.
        routeGroup.MapGet("/details", async (IItemService itemService) =>
        {
            var allItemDetails = await itemService.GetAllItemDetailsAsync();
            
            return Results.Ok(allItemDetails);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(ITEM_GET_ALL_DETAILS);
        
        // GET - get an information DTO for the specified item.
        routeGroup.MapGet("/info/{id}", async (IItemService itemService, int id) =>
        {
            var locationInfo = await itemService.GetItemInfoAsync(id);

            if (locationInfo == null)
            {
                return Results.NotFound();
            }
            
            return Results.Ok(locationInfo);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(ITEM_GET_INFO);
        
        // GET - get a details DTO for the specified item.
        routeGroup.MapGet("/details/{id}", async (IItemService itemService, int id) =>
        {
            var locationDetails = await itemService.GetItemDetailsAsync(id);

            if (locationDetails == null)
            {
                return Results.NotFound();
            }
            
            return Results.Ok(locationDetails);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(ITEM_GET_DETAILS);
        
        // GET - get detail DTOs for all items matching the specified search term.
        routeGroup.MapGet("/search", async (IItemService itemService, string searchTerm) =>
        {
            var matchingItemDetails = await itemService.GetItemDetailsMatchingStringAsync(searchTerm);

            if (matchingItemDetails == null)
            {
                return Results.NotFound();
            }
            
            return Results.Ok(matchingItemDetails);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(ITEM_SEARCH_DETAILS);

        // POST - create a new item.
        routeGroup.MapPost("/create", async (IItemService itemService, ItemCreateDto createDto) =>
        {
            var locationInfo = await itemService.CreateItemAsync(createDto);
            
            return Results.CreatedAtRoute(ITEM_GET_INFO, new { id = locationInfo.Id }, locationInfo);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(ITEM_CREATE);

        // PUT - move an item to a new (existing) box.
        routeGroup.MapPut("/move", async (IItemService itemService, ItemMoveDto moveDto) =>
        {
            var movedItemInfo = await itemService.MoveItemBoxAsync(moveDto);

            if (movedItemInfo == null)
            {
                return Results.NotFound();
            }
            
            return Results.Ok(movedItemInfo);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(ITEM_MOVE_LOCATION);
        
        // DELETE - delete the specified item.
        routeGroup.MapDelete("/delete/{id}", async (IItemService itemService, int id) =>
        {
            var locationDeleted = await itemService.DeleteItemAsync(id);
            
            return locationDeleted ? Results.NoContent() : Results.NotFound();
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(ITEM_DELETE);

        return routeGroup;
    }
}