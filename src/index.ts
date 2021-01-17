import { Format } from 'logform';
import { PrettyConsoleFormatFactory, PrettyConsoleOptions } from './PrettyConsoleFormatFactory';

function prettyConsole(levels: { [k: string]: number }, module?: NodeModule, options?: PrettyConsoleOptions): Format {
  return new PrettyConsoleFormatFactory(levels, options).create(module);
}

export { PrettyConsoleFormatFactory, PrettyConsoleOptions, prettyConsole };
