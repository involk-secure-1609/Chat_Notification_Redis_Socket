import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
export const rateLimiterUsingThirdParty: RateLimitRequestHandler = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 100,
  message: "You have exceeded the 100 requests in 24 hrs limit!",
  standardHeaders: true,
  legacyHeaders: false,
});

/*
In the code snippet above, we imported the npm package into the project. 
Using the package, we create a middleware that enforces rate limiting based on 
the options we have passed in, including the following:

windowMs, the window size (24 hours in our case) in milliseconds
max, which represents the number of allowed requests per window per user
message, which specifies the response message users get when they have exceeded the allowed limit
standardHeaders, which specifies whether the appropriate headers should be added to the response

this package identifies users by their IP addresses using req.ip by default.


  */
