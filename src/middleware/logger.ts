import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const LOG_API_URL = process.env.LOG_API_URL!;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN!;

const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_PACKAGES = [
  'cache', 'controller', 'cron_job', 'db', 'domain', 'handler',
  'repository', 'route', 'service', 'auth', 'config', 'middleware',
  'utils', 'api', 'component', 'hook', 'page', 'state', 'style'
];

export const log = async (
  stack: string,
  level: string,
  pkg: string,
  message: string
): Promise<void> => {
  try {
    if (!VALID_STACKS.includes(stack.toLowerCase())) return;
    if (!VALID_LEVELS.includes(level.toLowerCase())) return;
    if (!VALID_PACKAGES.includes(pkg.toLowerCase())) return;

    await axios.post(
      LOG_API_URL,
      {
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: pkg.toLowerCase(),
        message
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (err) {
    // Fail silently to avoid crashing the app if logging fails
  }
};
