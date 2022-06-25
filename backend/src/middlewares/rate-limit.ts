import MonkeyError from "../utils/error";
import { Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";
import rateLimit, { Options } from "express-rate-limit";

const REQUEST_MULTIPLIER = process.env.MODE === "dev" ? 100 : 1;

const getKey = (req: MonkeyTypes.Request, _res: Response): string => {
  return (req.ctx.decodedToken?.uid ||
    req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.ip ||
    "255.255.255.255") as string;
};

export const customHandler = (
  _req: MonkeyTypes.Request,
  _res: Response,
  _next: NextFunction,
  _options: Options
): void => {
  throw new MonkeyError(429, "Too many attempts, please try again later.");
};

const ONE_HOUR = 1000 * 60 * 60;

// Root Rate Limit
export const rootRateLimiter = rateLimit({
  windowMs: ONE_HOUR,
  max: 2000 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

// Bad Authentication Rate Limiter
const badAuthRateLimiter = new RateLimiterMemory({
  points: 30 * REQUEST_MULTIPLIER,
  duration: 60,
});

export async function badAuthRateLimiterHandler(
  req: MonkeyTypes.Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const key = getKey(req, _res);
    const rateLimitStatus = await badAuthRateLimiter.get(key);

    if (rateLimitStatus?.remainingPoints === 0) {
      throw new MonkeyError(
        429,
        "Too many bad authentication attempts, please try again later."
      );
    }
  } catch (error) {
    return next(error);
  }

  next();
}

export async function incrementBadAuth(
  req: MonkeyTypes.Request,
  res: Response
): Promise<void> {
  try {
    const key = getKey(req, res);
    await badAuthRateLimiter.penalty(key, 1);
  } catch (error) {}
}

// Config Routing
export const configUpdate = rateLimit({
  windowMs: ONE_HOUR,
  max: 500 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const configGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 120 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

// Leaderboards Routing
export const leaderboardsGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 500 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

// New Quotes Routing
export const newQuotesGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 500 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const newQuotesAdd = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const newQuotesAction = rateLimit({
  windowMs: ONE_HOUR,
  max: 500 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

// Quote Ratings Routing
export const quoteRatingsGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 500 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const quoteRatingsSubmit = rateLimit({
  windowMs: ONE_HOUR,
  max: 500 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

// Quote reporting
export const quoteReportSubmit = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 min
  max: 50 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

// Quote favorites
export const quoteFavoriteGet = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 min
  max: 50 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const quoteFavoritePost = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 min
  max: 50 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const quoteFavoriteDelete = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 min
  max: 50 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

// Presets Routing
export const presetsGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const presetsAdd = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const presetsRemove = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const presetsEdit = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

// PSA (Public Service Announcement) Routing
export const psaGet = rateLimit({
  windowMs: 60 * 1000,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

// Results Routing
export const resultsGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const resultsAdd = rateLimit({
  windowMs: ONE_HOUR,
  max: 500 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const resultsTagsUpdate = rateLimit({
  windowMs: ONE_HOUR,
  max: 100 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const resultsDeleteAll = rateLimit({
  windowMs: ONE_HOUR,
  max: 10 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const resultsLeaderboardGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const resultsLeaderboardQualificationGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

// Users Routing
export const userGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userSignup = rateLimit({
  windowMs: 24 * ONE_HOUR, // 1 day
  max: 3 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userDelete = rateLimit({
  windowMs: 24 * ONE_HOUR, // 1 day
  max: 3 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userCheckName = rateLimit({
  windowMs: 60 * 1000,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userUpdateName = rateLimit({
  windowMs: 24 * ONE_HOUR, // 1 day
  max: 3 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userUpdateLBMemory = rateLimit({
  windowMs: 60 * 1000,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userUpdateEmail = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userClearPB = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userCustomFilterAdd = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userCustomFilterRemove = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userTagsGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userTagsRemove = rateLimit({
  windowMs: ONE_HOUR,
  max: 30 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userTagsClearPB = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userTagsEdit = rateLimit({
  windowMs: ONE_HOUR,
  max: 30 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userTagsAdd = rateLimit({
  windowMs: ONE_HOUR,
  max: 30 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userCustomThemeGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 30 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userCustomThemeAdd = rateLimit({
  windowMs: ONE_HOUR,
  max: 30 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userCustomThemeRemove = rateLimit({
  windowMs: ONE_HOUR,
  max: 30 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userCustomThemeEdit = rateLimit({
  windowMs: ONE_HOUR,
  max: 30 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userDiscordLink = rateLimit({
  windowMs: ONE_HOUR,
  max: 15 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const usersTagsEdit = userDiscordLink;

export const userDiscordUnlink = rateLimit({
  windowMs: ONE_HOUR,
  max: 15 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userProfileGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 100 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userProfileUpdate = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

// ApeKeys Routing
export const apeKeysGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 120 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const apeKeysGenerate = rateLimit({
  windowMs: ONE_HOUR,
  max: 15 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const apeKeysUpdate = apeKeysGenerate;

export const apeKeysDelete = apeKeysGenerate;
