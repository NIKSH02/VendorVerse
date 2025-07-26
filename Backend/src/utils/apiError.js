class apiError extends Error {
    constructor(
        statusCode,
         message = 'Internal server error',
         errors =[],
         stack = ''

    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.stack = stack; 
        this.data = null;
        this.message = message; 

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
        
    }
}

module.exports = apiError;