namespace FinanceApp.Api.Common.Exceptions;

public class UnauthorizedException : AppException
{
    public UnauthorizedException(string message = "Invalid credentials or unauthorized access.") 
        : base(message, 401)
    {
    }
}