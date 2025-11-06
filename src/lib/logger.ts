import chalk from "chalk";
import { format } from "date-fns";
import type { TransformableInfo } from "logform";
import winston from "winston";

// --- HTTP Status Constants ---
const STATUS_OK = 200;
const STATUS_REDIRECT = 300;
const STATUS_CLIENT_ERROR = 400;
const STATUS_SERVER_ERROR = 500;

// --- Regexes ---
const RE_HTTP_STATUS = /\b(\d{3})\b/g;
const RE_METHOD = /\b(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)\b/g;
const RE_IP = /\b(\d{1,3}(?:\.\d{1,3}){3})\b/g;
const RE_PATH = /(\/[\w\-./]+)/g;

// --- Core Winston/Logform Fields to Exclude from Generic Metadata ---
// This list contains fields that are either standard to Winston/Logform,
// or are explicitly handled (and sometimes extracted) in the inline/prefix logic.
const CORE_WINSTON_PROPERTIES = [
  // Core logform/Winston fields
  "level",
  "timestamp",
  "message",
  "stack",
  "service",

  // Fields explicitly handled in inline/prefix logic
  "reqId",
  "id",
  "traceId",
  "type",
  "name",
  "statusCode",
  "status",
  "userId",
  "session",
  "ip",
  "timeSpentMs",
  "value",
  "cache",
  "RID",
  "metadata", // metadata itself should be excluded
];

// --- Helper Functions ---

/**
 * Returns the base chalk color function for a given log level (without bolding).
 */
const getChalkColorForLevel = (level: string) => {
  switch (level) {
    case "error":
    case "fatal":
      return chalk.red;
    case "warn":
      return chalk.yellow;
    case "info":
      return chalk.green;
    case "http":
      return chalk.magenta;
    case "debug":
      return chalk.cyan;
    case "verbose":
      return chalk.blue;
    case "silly":
      return chalk.gray;
    default:
      return chalk.white;
  }
};

/**
 * Helper to ensure the level label (e.g., INFO, WARN) is always 4 characters wide for alignment.
 */
const padLabel = (label: string): string => {
  const upperLabel = label.toUpperCase();
  if (upperLabel === "ERROR" || upperLabel === "FATAL") return "ERRR";
  if (upperLabel === "DEBUG") return "DBUG";
  return upperLabel.trim().padStart(4, " ").slice(0, 4);
};

/**
 * Applies pino-pretty-compact level coloring logic for the Level Label and wraps in brackets.
 */
const colorizeLevelLabel = (level: string): string => {
  const colorFn = getChalkColorForLevel(level);
  const paddedLabel = padLabel(level);
  return colorFn(`[${paddedLabel}]`);
};

const colorizeHTTPStatuses = (msg: string): string =>
  msg.replace(RE_HTTP_STATUS, (_, code: string) => {
    const status = Number.parseInt(code, 10);
    if (status >= STATUS_SERVER_ERROR) return chalk.red(code);
    if (status >= STATUS_CLIENT_ERROR) return chalk.yellow(code);
    if (status >= STATUS_REDIRECT) return chalk.cyan(code);
    if (status >= STATUS_OK) return chalk.green(code);
    return code;
  });

const colorizeMethod = (msg: string) =>
  msg.replace(RE_METHOD, (m) => chalk.yellow(m));
const colorizeIP = (msg: string) => msg.replace(RE_IP, (m) => chalk.blue(m));

/**
 * Colorizes request paths: green for non-errors.
 */
const colorizePath = (msg: string, level: string): string =>
  msg.replace(RE_PATH, (m) => chalk.green(m));

/**
 * Conditional Highlighting for timeSpentMs (Performance)
 */
const colorizeTimeSpent = (v: number): string => {
  if (v < 100) return chalk.green(`${v}ms`); // Fast
  if (v < 500) return chalk.yellow(`${v}ms`); // Medium
  return chalk.red(`${v}ms`); // Slow
};

// --- Pretty format ---
interface PrettyInfo extends TransformableInfo {
  stack?: string;
  metadata?: Record<string, any>;
}

const prettyFormat = winston.format.combine(
  winston.format.errors({ stack: true }),

  winston.format.printf((info: PrettyInfo) => {
    const { level, message, stack, ...rest } = info;
    const gray = chalk.gray;

    // --- Custom Timestamp Generation (using date-fns and capitalization fix) ---
    // Format: [YYYY-MM-DD SUN HH:MM:SS.mmm +/-HH:MM]
    const timestampFormat = "yyyy-MM-dd EEE HH:mm:ss.SSS XXX";

    // 1. Format the date (EEE gives "Sun", "Mon", etc.)
    let formattedDate = format(new Date(), timestampFormat);

    // 2. Find and capitalize the day-of-week abbreviation (e.g., 'Sun' -> 'SUN')
    formattedDate = formattedDate.replace(
      /(\d{4}-\d{2}-\d{2})\s(\w{3})\s(.+)/,
      (match, datePart, dayPart, timePart) =>
        `${datePart} ${dayPart.toUpperCase()} ${timePart}`
    );

    const formattedTimestamp = chalk.gray(`[${formattedDate}]`);
    // -----------------------------------------------------------------

    const newFormattedLevel = colorizeLevelLabel(level);
    // The metadata object captures all remaining fields on the 'info' object.
    const metadata = rest.metadata ?? rest;

    // Explicitly extract the fields needed for the human-readable format
    const reqId = metadata.reqId || metadata.id || metadata.traceId;
    const userId = metadata.userId;
    const session = metadata.session;
    const ip = metadata.ip;
    const timeSpentMs = metadata.timeSpentMs;
    const value = metadata.value;
    const cache = metadata.cache;

    let messageBody =
      typeof message === "string" ? message : JSON.stringify(message);

    // --- START: Request ID Prefix and Arrow Logic ---
    let logPrefix = "";
    let reqPrefix = "";
    let directionalArrow = "";

    const isResponse =
      typeof message === "string" && message.toLowerCase().includes("response");
    const arrowSymbol = isResponse ? chalk.yellow("→") : chalk.yellow("←");

    if (reqId) {
      const paddedReqId = String(reqId).padStart(2, "0");
      reqPrefix = chalk.magenta(`#${paddedReqId}`);
      directionalArrow = arrowSymbol;
    }

    if (level === "error" || level === "fatal") {
      const icon = "×";
      const type = metadata.type || metadata.name || "Error";
      const statusCode = metadata.statusCode || metadata.status || 500;

      const errorColor = chalk.red;

      let statusCodeColorFn;
      if (statusCode >= STATUS_SERVER_ERROR) {
        statusCodeColorFn = chalk.red;
      } else if (statusCode >= STATUS_CLIENT_ERROR) {
        statusCodeColorFn = chalk.yellow;
      } else if (statusCode >= STATUS_REDIRECT) {
        statusCodeColorFn = chalk.cyan;
      } else if (statusCode >= STATUS_OK) {
        statusCodeColorFn = chalk.green;
      } else {
        statusCodeColorFn = chalk.white;
      }

      logPrefix = [
        errorColor(icon),
        errorColor(type),
        statusCodeColorFn(statusCode),
        gray(":"),
      ].join(" ");
    }

    let finalPrefix = "";

    if (reqPrefix) {
      finalPrefix += reqPrefix;
    }

    if (logPrefix) {
      finalPrefix += (finalPrefix ? " " : "") + logPrefix;
    }

    const incomingRequestPattern = /\s*incoming request:\s*/i;
    const responseCompletedPattern = /\s*response completed/i;

    messageBody = messageBody
      .replace(incomingRequestPattern, "")
      .replace(responseCompletedPattern, "")
      .trim();

    let arrowAndSpace = "";
    if (directionalArrow) {
      arrowAndSpace = " " + directionalArrow + " ";
    }

    let requestStr = finalPrefix + arrowAndSpace + messageBody;

    requestStr = requestStr
      .replace(/→/g, chalk.yellow("→"))
      .replace(/←/g, chalk.yellow("←"))
      .replace(/×/g, chalk.red("×"));

    requestStr = requestStr
      .replace(/\bQUERY\b/g, chalk.yellow("QUERY"))
      .replace(/\bFETCH\b/g, chalk.yellow("FETCH"))
      .replace(/\bMUTATE\b/g, chalk.yellow("MUTATE"));

    // --- START: Inline Metadata Logic ---
    let inlineMetaStr = "";

    if (
      userId ||
      session ||
      ip ||
      typeof timeSpentMs === "number" ||
      typeof value !== "undefined" ||
      cache
    ) {
      const humanParts: string[] = [];
      const metaParts: string[] = [];

      if (userId) {
        let userPart = `${gray("•")} ${gray("UID:")} ${chalk.yellow(userId)}`;

        if (ip) {
          userPart += ` ${gray("from")} ${chalk.blue(ip)}`;
        }

        if (session) {
          userPart += ` ${gray("[")}${chalk.cyan(session)}${gray("]")}`;
        }

        humanParts.push(userPart);
      }

      if (metadata.RID) {
        humanParts[0] += ` ${gray("•")} ${gray("RID:")} ${chalk.yellow(metadata.RID)}`;
      }

      let cacheStatusStr = "";
      if (cache) {
        const cacheValueStr = String(cache).toLowerCase();
        let cacheValueColored;

        if (cacheValueStr === "miss") {
          cacheValueColored = chalk.yellow(cacheValueStr);
        } else if (cacheValueStr === "hit") {
          cacheValueColored = chalk.green(cacheValueStr);
        } else {
          cacheValueColored = chalk.green(cacheValueStr);
        }

        cacheStatusStr = `${gray("'s cache")} ${cacheValueColored}`;
      }

      if (humanParts.length > 0) {
        humanParts[0] += cacheStatusStr;
      } else if (cacheStatusStr) {
        humanParts.push(`${gray("•")} ${cacheStatusStr.trim()}`);
      }

      if (typeof value !== "undefined") {
        const valueStr = String(value);
        const valueColored = chalk.green(valueStr);
        metaParts.push(`${gray("with")} ${valueColored}`);
      }

      if (typeof timeSpentMs === "number") {
        metaParts.push(`${gray("in")} ${colorizeTimeSpent(timeSpentMs)}`);
      }

      let fullHumanPart = "";
      if (humanParts.length > 0) {
        fullHumanPart = humanParts[0];
      }

      const metaPartsStr =
        metaParts.length > 0 ? ` ${metaParts.join(" ")}` : "";

      inlineMetaStr = fullHumanPart + metaPartsStr;

      if (inlineMetaStr.length > 0) {
        inlineMetaStr = " " + inlineMetaStr;
      }
    }
    // --- END: Inline Metadata Logic ---

    // Apply content-based coloring
    requestStr = colorizeHTTPStatuses(requestStr);
    requestStr = colorizeMethod(requestStr);
    requestStr = colorizeIP(requestStr);
    requestStr = colorizePath(requestStr, level);

    // Apply level-based coloring to the request string ONLY
    if (level === "error" || level === "fatal") {
      requestStr = chalk.red(requestStr);
    } else if (level === "warn") {
      requestStr = chalk.yellow(requestStr);
    }

    // 4. Handle Generic Metadata
    let metaStr = "";

    if (metadata && Object.keys(metadata).length > 0) {
      metaStr =
        " " +
        Object.entries(metadata)
          .reduce((acc: string[], [k, v]) => {
            // Check if the key is in our exclusion list
            if (CORE_WINSTON_PROPERTIES.includes(k)) {
              return acc; // Skip
            }

            const key = chalk.gray(k);
            let value;

            if (typeof v === "object" && v !== null) {
              value = chalk.green(JSON.stringify(v));
            } else if (typeof v === "number" || typeof v === "boolean") {
              value = chalk.yellow(String(v));
            } else {
              value = chalk.green(String(v));
            }

            acc.push(`${key}=${value}`);
            return acc;
          }, [])
          .join(" ");
    }

    // 5. Handle Stack Trace
    const stackStr = stack ? `\n${chalk.gray(stack)}` : "";

    const finalMsg = requestStr + inlineMetaStr;

    // Final string assembly
    return `${formattedTimestamp} ${chalk.dim("•")} ${newFormattedLevel}${chalk.dim(":")} ${finalMsg}${metaStr}${stackStr}`;
  })
);

// --- Logger ---
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  levels: winston.config.npm.levels,
  format:
    process.env.NODE_ENV === "production"
      ? winston.format.json()
      : prettyFormat,
  defaultMeta: { service: "juanito-app" },
  transports: [new winston.transports.Console()],
});

export default logger;
