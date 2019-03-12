const fs = require('fs')
const path = require('path')
const workspacePath = './platforms/tizen'
const configFilePath = workspacePath + path.sep + 'config.xml'

function getConfigXML () {
  let data = null

  if (fs.existsSync(configFilePath)) {
    data = fs.readFileSync(configFilePath, 'utf-8')

    return data
  }

  console.log('Project appears to have no Tizen config.', configFilePath)

  return null
}

function getWidgetTag () {
  const configXML = getConfigXML()

  if (!configXML) {
        // No config XML present, so nothing to do here
    return null
  }

    // Since there are multiple matches of a "version" attribute within the config.xml, we need to be more specific
  const widgetRegex = /\<widget(.*?)\>/
  const match = configXML.match(widgetRegex)

  if (!match) {
        // No widget tag found
    return null
  }

  return match[0]
}

function getPackageVersion () {
  const widgetTag = getWidgetTag()

  if (!widgetTag) {
        // Something is wrong
    return null
  }

  const match = widgetTag.match(/ version="[0-9].[0-9].[0-9]"/)

  if (!match) {
        // No (valid) version attribute found
    return null
  }

    // Finally return the middle part of the match, which is the version
  return match[0].split('"')[1]
}

function updatePackageVersion () {
  const configXML = getConfigXML()

  if (!configXML) {
        // No config XML present, so nothing to do here
    return false
  }

  const widgetTag = getWidgetTag()

    // Now look for the version attribute and replace the value with the correct version
  const newWidgetTag = widgetTag.replace(/ version="[0-9].[0-9].[0-9]"/, ' version="' + process.env.npm_package_version + '"')

  const updatedConfigXML = configXML.replace(widgetTag, newWidgetTag)

  fs.writeFileSync(configFilePath, updatedConfigXML, 'utf-8')

  return true
}

module.exports = {
  getConfigXML,
  getWidgetTag,
  getPackageVersion,
  updatePackageVersion
}
