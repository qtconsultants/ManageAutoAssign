const typeMapSanitize = (input = '') => {
  switch (input) {
    case 'integer':
      return 'number'
    case 'application/octet-stream':
      return 'OctetStreamResponse'
    case 'application/pdf':
      return 'PDFResponse'
    case 'text/html':
      return 'HTMLResponse'
    default:
      return sanitizeType(input)
  }
}
const sanitizeType = (input = '') => input.replace(/\./g, '').replace(/\//g, '')
const generateTypeDef = ({ sanitizedTypeName, systemTypeName }) => {
  let typeName = sanitizeType(sanitizedTypeName)

  return `type ${typeName} = schemas['${systemTypeName}']`
}

/**
 * @typedef {object} Operations
 * @property {string} url
 * @property {{}} methods
 */

/**
 * decipher supplied definition files
 * @param {{}} options
 * @param {string} options.apiName
 * @param {} options.operations
 * @param {'Manage' | 'Automate'} options.generatorType
 */
function generateAPIClass({ apiName, operations = [], generatorType }) {
  // types holder for generating type aliases
  // type Types = Record<string, string>
  // system name, sanitized name
  const types = {}

  // loop over each defined operation for this module
  const functions = operations.map(({ url, methods }) =>
    Object.keys(methods)
      .map((method) => {
        const { responses, operationId, parameters = [], requestBody } = methods[method]
        const queryParams = parameters.filter(({ in: in_ }) => in_ === 'query')
        const pathParams = parameters.filter(({ in: in_ }) => in_ === 'path')

        // store generated names/types
        const functionParams = [] // args to the class function
        const requestParams = [] // args to this.request
        let bodyParam = {}

        // generally if a post command is defined
        if (requestBody) {
          if (requestBody.content && requestBody.content['application/json']) {
            const schema = requestBody.content['application/json'].schema
            if (schema.type === 'array') {
              if (schema.items) {
                const tempName = schema.items.$ref.split('/').pop()
                bodyParam.type = tempName + '[]'
                bodyParam.name = tempName.charAt(0).toLowerCase() + tempName.slice(1) + 's'
                types[tempName] = tempName
              }
            } else if (schema.$ref) {
              bodyParam.type = schema.$ref.split('/').pop()
              if (requestBody.description) {
                bodyParam.name = requestBody.description
              } else {
                bodyParam.name = schema.$ref.split('.').pop()
              }
              types[bodyParam.type] = bodyParam.type
              // if clause for MonitorAlertSuspensions_PostSuspension
            } else if (!schema.description) {
              bodyParam.type = schema.type
              bodyParam.name = schema.type
            }
          } else if (requestBody.content && requestBody.content['multipart/form-data']) {
            const schema = requestBody.content['multipart/form-data'].schema
            if (schema.$ref) {
              bodyParam.type = schema.$ref.split('/').pop()
              bodyParam.name = bodyParam.type.charAt(0).toLowerCase() + bodyParam.type.slice(1)
              types[bodyParam.type] = bodyParam.type
            }
          } else if (requestBody.$ref) {
            bodyParam.name = requestBody.$ref.split('.').pop()
            bodyParam.type = requestBody.$ref.split('/').pop()
          } else {
            bodyParam.name = requestBody.description
            bodyParam.type = 'object'
          }

          bodyParam.name = sanitizeType(bodyParam.name)
        }

        if (pathParams.length > 0) {
          pathParams.forEach((parameter) => {
            functionParams.push(`${parameter.name}: ${typeMapSanitize(parameter.schema.type)}`)
          })
        }
        requestParams.push(`path: \`${url.replace(/({.*})/g, (_, p1) => `$${p1}`)}\``)
        requestParams.push(`method: '${method}'`)

        if (requestBody) {
          functionParams.push(`${bodyParam.name}: ${typeMapSanitize(bodyParam.type)}`)
          requestParams.push(`data: ${bodyParam.name}`)
        }

        if (queryParams.length > 0) {
          functionParams.push('params: CommonParameters = {}')
          requestParams.push(`params`)
        }
        let returnType
        if (responses[204]) {
          returnType = 'NoContentResponse'
        } else {
          const { description, content } = responses[Object.keys(responses).pop()]

          if (responses['default']) {
            returnType = 'any'
            if (responses['default'].description) {
              returnType = `${returnType}`
            }
          } else if (content) {
            const { schema } = content[Object.keys(content).pop()]

            if (schema.items) {
              if (schema.items.$ref) {
                const tempName = schema.items.$ref.split('/').pop()
                returnType = tempName + '[]'
                types[tempName] = tempName
              } else if (schema.items.additionalProperties?.$ref) {
                const tempName = schema.items.additionalProperties.$ref.split('/').pop()
                returnType = tempName + '[]'
                types[tempName] = tempName
              } else if (schema.type) {
                if (schema.items.type) {
                  returnType = `Array<${schema.items.type}>`
                } else {
                  returnType = schema.type
                }
              }
            } else if (schema.$ref) {
              returnType = schema.$ref.split('/').pop()
              types[returnType] = returnType
            } else {
              returnType = schema.type
            }
          } else {
            returnType = description.split(' ').pop()
          }
        }

        // system name, sanitized name
        // types[returnType] = typeMapSanitize(returnType)
        returnType = typeMapSanitize(returnType)

        if (!returnType) {
          returnType = 'any'
        }

        return `
   ${operationId}(${functionParams.map((param) => param).join(', ')}): Promise<${returnType}> {
    return this.request({
      ${requestParams.map((param) => param).join(', ')}
    })
   }`
      })
      .join('\n'),
  )

  // use true/false map to generate required types for this module
  const typeDefs = Object.keys(
    // sort keys to order imports
    Object.keys(types)
      .sort()
      .reduce((obj, key) => {
        obj[key] = types[key]
        return obj
      }, {}),
  ).map((type) => generateTypeDef({ sanitizedTypeName: types[type], systemTypeName: type }))

  return `/* This file was auto-generated, do not manually edit. */
import ${generatorType} from '../${generatorType}'
import { components } from '../${generatorType}Types'
${
  generatorType === 'Manage'
    ? "import { CommonParameters, CWMOptions } from '../ManageAPI'"
    : "import { CommonParameters, CWAOptions } from '../AutomateAPI'"
}
import { NoContentResponse, OctetStreamResponse, PDFResponse, HTMLResponse } from '../types'
type schemas = components['schemas']
${typeDefs.join('\n')}

/**
 * @internal
 */
export default class ${apiName}API extends ${generatorType} {
  constructor(props: ${generatorType === 'Manage' ? 'CWMOptions' : 'CWAOptions'}) {
    super(props)
  }

  ${functions.join('\n')}
}
  `
}

module.exports = {
  generateAPIClass,
}