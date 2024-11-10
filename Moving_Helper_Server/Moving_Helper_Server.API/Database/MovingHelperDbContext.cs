using Microsoft.EntityFrameworkCore;
using Moving_Helper_Server.SharedLibrary.Features.ItemFeature;
using Moving_Helper_Server.SharedLibrary.Features.BoxFeature;
using Moving_Helper_Server.SharedLibrary.Features.LocationFeature;
using Moving_Helper_Server.SharedLibrary.Features.PictureFeature;

namespace Moving_Helper_Server.API.Database;

/// <summary>
/// This defines a "database context" (DbContext), which is a software representation of the database. 
/// The DbContext manages entities and relationships between them and provides methods for querying and 
/// saving data to the database. In the context of ASP.NET Core, the DbContext is typically registered as 
/// a scoped service in the dependency injection (DI) system, which means a new instance of the DbContext 
/// is created for each HTTP request.
/// 
/// Each HTTP request that requires database interaction receives a fresh instance of the DbContext. 
/// This instance is used for handling that request and is disposed of once the request is completed.
/// The DbContext is responsible for tracking changes to entities, querying data, and handling concurrency 
/// in a safe manner when used asynchronously.
/// </summary>
/// <param name="dbOptions">Options for configuring the DbContext, such as the connection string, 
/// database provider, and other behavior settings.</param>
public class MovingHelperDbContext(
    DbContextOptions<MovingHelperDbContext> dbOptions) : DbContext(dbOptions)
{
    public DbSet<Item>     Items     => Set<Item>();
    public DbSet<Box>      Boxes     => Set<Box>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Picture>  Pictures  => Set<Picture>();

    /// <summary>
    /// Overriding this method is one way to seed the database with some static items, which makes testing much easier.
    /// If the migrations do not match on startup (or the db is missing) this will run.
    /// </summary>
    /// <param name="modelBuilder"></param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Item Relationships
        modelBuilder.Entity<Item>()
            .HasOne(i => i.Box)
            .WithMany()
            .HasForeignKey(i => i.BoxId)
            .IsRequired();

        modelBuilder.Entity<Item>()
            .HasOne(i => i.Picture)
            .WithMany()
            .HasForeignKey(i => i.PictureId)
            .OnDelete(DeleteBehavior.Restrict);
            
        // Box Relationships
        modelBuilder.Entity<Box>()
            .HasOne(b => b.Location)
            .WithMany()
            .HasForeignKey(b => b.LocationId)
            .IsRequired();

        modelBuilder.Entity<Box>()
            .HasOne(b => b.MoveFrom)
            .WithMany()
            .HasForeignKey(b => b.MoveFromId);

        modelBuilder.Entity<Box>()
            .HasOne(b => b.MoveTo)
            .WithMany()
            .HasForeignKey(b => b.MoveToId);
        
        modelBuilder.Entity<Box>()
            .HasOne(b => b.Picture)
            .WithMany()
            .HasForeignKey(b => b.PictureId)
            .OnDelete(DeleteBehavior.Restrict);
        
        // Location Relationships
        modelBuilder.Entity<Location>()
            .HasOne(l => l.Picture)
            .WithMany()
            .HasForeignKey(l => l.PictureId)
            .OnDelete(DeleteBehavior.Restrict);
        
        // SEED DATA
        
        modelBuilder.Entity<Picture>()
            .HasData();
        
        modelBuilder.Entity<Location>()
            .HasData();
        
        modelBuilder.Entity<Box>()
            .HasData();
        
        modelBuilder.Entity<Item>()
            .HasData();
    }
}