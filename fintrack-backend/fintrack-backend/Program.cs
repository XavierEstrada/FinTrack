using fintrack_backend.Data;
using fintrack_backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// ── Base de datos ────────────────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── JWT (Supabase ES256) ─────────────────────────────────────────────────────
// Supabase nuevos proyectos usan ES256 (asimétrico).
// Se usa Authority para que .NET descubra las claves públicas via JWKS automáticamente.
var issuer = builder.Configuration["Supabase:Issuer"]
    ?? throw new InvalidOperationException("Falta Supabase:Issuer en la configuración.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = issuer;   // descarga JWKS desde {issuer}/.well-known/jwks.json
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer   = true,
            ValidIssuer      = issuer,
            ValidateAudience = true,
            ValidAudience    = "authenticated",
            ValidateLifetime = true,
            ClockSkew        = TimeSpan.FromSeconds(30),
        };
    });

builder.Services.AddAuthorization();

// ── CORS ─────────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(
                builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
                ?? ["http://localhost:5173", "http://localhost:5174"])
              .AllowAnyHeader()
              .AllowAnyMethod()));

// ── Servicios ────────────────────────────────────────────────────────────────
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<fintrack_backend.Mappings.MappingProfile>());
builder.Services.AddScoped<TransactionService>();
builder.Services.AddScoped<BudgetService>();
builder.Services.AddScoped<ReportService>();
builder.Services.AddScoped<ProfileService>();
builder.Services.AddScoped<AdminService>();
builder.Services.AddScoped<SavingsGoalService>();
builder.Services.AddHttpClient();

// ── Controllers + OpenAPI ────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// ── Middleware ───────────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.Title = "FinTrack API";
        options.Theme = ScalarTheme.Purple;
    });
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
