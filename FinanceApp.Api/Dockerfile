FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["FinanceApp.Api/FinanceApp.Api.csproj", "FinanceApp.Api/"]
RUN dotnet restore "FinanceApp.Api/FinanceApp.Api.csproj"

COPY . .
WORKDIR "/src/FinanceApp.Api"
RUN dotnet publish "FinanceApp.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 5000
ENV ASPNETCORE_HTTP_PORTS=5000
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "FinanceApp.Api.dll"]