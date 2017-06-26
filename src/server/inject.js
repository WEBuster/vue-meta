import getMetaInfo from '../shared/getMetaInfo'
import generateServerInjector from './generateServerInjector'

export default function _inject (options = {}) {
  /**
   * Converts the state of the meta info object such that each item
   * can be compiled to a tag string on the server
   *
   * @this {Object} - Vue instance - ideally the root component
   * @return {Object} - server meta info with `toString` methods
   */
  return function inject () {
    // get meta info with sensible defaults
    const originalInfo = getMetaInfo(options)(this.$root)
    const info = {}

    // generate server injectors
    for (let key in info) {
      if (info.hasOwnProperty(key) && key !== 'titleTemplate' && key !== 'titleChunk') {
        info[key] = generateServerInjector(options)(key, info[key])
      }
    }

    info.seo = getSEOInfo(originalInfo)

    return info
  }
}

function getSEOInfo (info) {
  return {
    title: info.title || '',
    description: getMetaTagContent('description', info) || '',
    origin: info
  }
}

function getMetaTagContent (name, info) {
  const tag = (info.meta || []).filter(item => item.name === name)[0]
  return (tag || {}).content
}
