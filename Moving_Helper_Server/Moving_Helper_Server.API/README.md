# Setting Up New API Project

### Nuget / Packages

1. Microsoft.EntityFrameworkCore
2. Microsoft.EntityFrameworkCore.Design
3. Microsoft.EntityFrameworkCore.Sqlite (or database of choice)
4. Microsoft.AspNetCore.OpenApi
5. Swashbuckle.AspNetCore
6. MinimalApis.Extensions
7. Serilog

### Database

Run the following commands
```
dotnet --version
dotnet restore
dotnet tool install --global dotnet-ef
dotnet ef --version
dotnet ef migrations add InitialCreate -o "Database/Migrations"
dotnet ef migrations add InitialMigration -o "Database/Migrations"
dotnet ef database update
```

# API Usage

API description can be accessed via http://localhost:6969/swagger/index.html when the app is running.

## Adding Data

---
### Items

---

TBD

---
### Boxes

---

TBD

---
### Locations

---

TBD

---
### Pictures

---

TBD