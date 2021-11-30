import { AlternateExtensionsForFilePlugin, plugins } from '../../pluginManagement/pluginRepository.js';
import { HandledRoute } from '../../routerPlugins/handledRoute.interface.js';
import { logError } from '../../utils/log.js';

export async function contentToHTML(extension: string, fileContent: string, route: HandledRoute) {
  extension = extension.trim().toLowerCase();
  let plugin = plugins.fileHandler[extension];
  if (!plugin) {
    /** find by alternate extensions */
    const t = Object.entries(plugins.fileHandler).find(
      ([name, pl]) => pl[AlternateExtensionsForFilePlugin] && pl[AlternateExtensionsForFilePlugin].includes(extension)
    );
    if (t.length) {
      plugin = t[1];
    } else {
      throw new logError(`unknown filetype ${extension}`);
    }
  }
  return plugin(fileContent, route) as Promise<string>;
}
