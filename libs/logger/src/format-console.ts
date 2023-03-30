import { Logform, format } from 'winston';
import { blue, cyan, green, red, yellow, grey, magenta } from '@colors/colors/safe';

type TColorFunction = (str: string) => string;

export function formatConsole(appName: string): Logform.Format {
  return format.printf(({ level, message, timestamp, context, trace }): string => {
    const color = setColor(level);

    const fApp = `${color(`[ ${appName.toUpperCase()} ]`)}`;
    const fLevel = `${color(level.charAt(0).toUpperCase() + level.slice(1))}`;
    const fTime = `${timestamp ? grey(new Date(timestamp).toLocaleString()) : ''}`;
    const fContext = `${context ? magenta('[' + context + ']') : ''}`;
    const fMessage = `${color(message.trimEnd())}`;
    const fTrace = `${trace ? '\n' + trace : ''}`;

    return `${fApp} ${fLevel} ${fTime} ${fContext} ${fMessage} ${fTrace}`;
  });
}

function setColor(level: string): TColorFunction {
  switch (level) {
    case 'info':
      return green;
    case 'warn':
      return yellow;
    case 'error':
      return red;
    case 'debug':
      return blue;
    case 'verbose':
      return cyan;
    default:
      return green;
  }
}
