const asyncHandler = fn => async (req, res, next) => {
    try {
        await fn(req, res, next);
    }
    catch(err) {
        // Check if it's our custom apiError with a status code
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || []
        });
    }
}

module.exports = asyncHandler;