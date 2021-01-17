import util from 'util';
import { strip } from 'colors/safe';
import { Format, format } from 'logform';

export interface PrettyConsoleOptions {
  enableFilenamePadding: boolean;
  filenameMaxLength?: number;
}

export class PrettyConsoleFormatFactory {
  static readonly PWD =
    process.env.PWD === undefined ? null : process.env.PWD.endsWith('/') ? process.env.PWD : process.env.PWD + '/';
  static readonly TIMESTAMP = format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZ' });
  static readonly SPLAT = format.splat();
  static readonly COLORIZE = format.colorize();

  readonly levelColumnWidth: number;

  constructor(
    levels: { [k: string]: number },
    private readonly options: PrettyConsoleOptions = {
      enableFilenamePadding: true,
      filenameMaxLength: 30,
    }
  ) {
    this.levelColumnWidth = Object.keys(levels).reduce((maxLen, level) => Math.max(maxLen, level.length), 0);
  }

  create(module?: NodeModule): Format {
    const filename = module !== undefined ? `${this.slimFilename(module.filename)} : ` : '';

    const printf = format.printf((info) => {
      const { timestamp, level, message, stack, ...rest } = info;

      const meta =
        Object.entries(rest).length > 0
          ? `\n` +
            util
              .inspect([Object.fromEntries(Object.entries(rest))], { breakLength: 0, depth: Infinity, colors: true })
              .slice(2, -2)
          : '';

      const paddedLevel = this.padLevel(level);
      return info.stack
        ? `${timestamp}  ${paddedLevel} --- ${filename}${message ?? ''}\n${stack}${meta}`
        : `${timestamp}  ${paddedLevel} --- ${filename}${message ?? ''}${meta}`;
    });

    return format.combine(
      PrettyConsoleFormatFactory.TIMESTAMP,
      PrettyConsoleFormatFactory.SPLAT,
      PrettyConsoleFormatFactory.COLORIZE,
      printf
    );
  }

  private padLevel(coloredLevel: string): string {
    const len = strip(coloredLevel).length;
    return len < this.levelColumnWidth
      ? coloredLevel.padEnd(coloredLevel.length + this.levelColumnWidth - len)
      : coloredLevel;
  }

  private slimFilename(filename: string): string {
    const relative =
      PrettyConsoleFormatFactory.PWD === null || !filename.startsWith(PrettyConsoleFormatFactory.PWD)
        ? filename
        : filename.substring(PrettyConsoleFormatFactory.PWD.length, filename.length);

    if (this.options.filenameMaxLength !== undefined) {
      const len = relative.length;

      if (len > this.options.filenameMaxLength) {
        return relative.substr(len - this.options.filenameMaxLength, this.options.filenameMaxLength);
      }

      if (this.options.enableFilenamePadding) {
        return relative.padEnd(this.options.filenameMaxLength);
      }
    }

    return relative;
  }
}
