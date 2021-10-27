import dayjs from 'dayjs';
import slugify from 'slugify';

/**
 * Utility to transform a date into a more readable format.  Useful for ISO and
 * UTC date strings that need to be more readable.
 *
 * @param dateString A date string parseable by Date
 * @returns The formatted date string
 */
export function formatDate(dateString: string): string {
  return dayjs(dateString).format('DD MMMM YYYY');
}

/**
 * Utility for formatting a pypi operating systems string. This removes the
 * nested classifiers so that only the OS name is rendered.
 *
 * @param operatingSystem List of operating systems classifiers.
 * @returns The operating system formatted as a comma list.
 */
export function formatOperatingSystem(operatingSystem: string): string {
  // Return last part of OS trove classifier. The nesting on pypi is
  // arbitrary, so you can have a long string like "Operating Systems ::
  // Microsoft :: Windows :: Windows 10", or a short string like "Operating
  // Systems :: OS Independent".
  const parts = operatingSystem.split(' :: ');
  const name = parts[parts.length - 1];

  return name.replace('OS Independent', 'All');
}

/**
 * Wrapper over `sluggify()` with automatic lower-casing and trimming of strings.
 *
 * @param text The text to slugify.
 * @returns The slugified text.
 */
export function slug(text: string): string {
  // Return URL slug: https://github.com/simov/slugify
  return slugify(text, {
    // Return lowercase text.
    lower: true,

    // Trim leading and trailing space characters.
    trim: true,
  });
}
