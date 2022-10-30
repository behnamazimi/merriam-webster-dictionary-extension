import {ERRORS, globalActions, publicApiDetails} from "./constants";
import {sendGlobalMessage} from "./messaging";

class Services {
  API_KEY = "";
  API_TYPE = "";

  setAuth(key, type) {
    this.API_KEY = key
    this.API_TYPE = type
  }

  getApiEndpoint(search, category, apiKey) {
    const url = new URL(`https://www.dictionaryapi.com/api/v3/references/${category}/json/${search}`)
    url.searchParams.append("key", apiKey)
    return url.href
  }

  isUsingPublicKey() {
    return this.API_KEY === publicApiDetails.key
  }

  canUsePublicApiDetails() {
    return new Promise(resolve => {
      sendGlobalMessage({action: globalActions.GET_PUBLIC_API_USAGE}, (usageCount) => {
        resolve(+usageCount < publicApiDetails.usageLimitPerInstall)
      })
    })
  }

  fetchData(search) {
    if (!search)
      return Promise.reject(new Error(ERRORS.EMPTY_SEARCH))

    const endpoint = this.getApiEndpoint(search, this.API_TYPE, this.API_KEY)
    return new Promise(async (resolve, reject) => {

      if (this.isUsingPublicKey()) {
        if (!(await this.canUsePublicApiDetails())) {
          reject(new Error(ERRORS.PERSONAL_KEY_NEEDED))
          return
        }

        sendGlobalMessage({action: globalActions.COUNT_UP_PUBLIC_API_USAGE})
      }

      fetch(endpoint)
        .then(async response => {
          const textResponse = await response.text()
          if (textResponse.includes("Invalid API key"))
            throw new Error(ERRORS.INVALID_API_KEY)
          else if (textResponse.includes("Failed to fetch"))
            throw new Error(ERRORS.FAILED_TO_FETCH)
          else if (textResponse.includes("[]"))
            throw new Error(ERRORS.NO_RESULT)

          return textResponse
        })
        .then((textResult) => {
          try {
            resolve(this.parseResultData(JSON.parse(textResult)))
          } catch (e) {
            throw e
          }
        })
        .catch(reject)
    })
  }

  parseResultData(rawData) {
    let parsedData = []

    if (typeof rawData[0] === "string") {
      return rawData
    }

    for (let res of rawData) {
      const id = res.meta.id
      const pron = res.hwi.prs?.[0].mw

      // add other type of definition to shortdef
      // (like being past or being past particular)
      if (res.cxs) {
        res.shortdef.unshift(res.cxs[0].cxl + " " + res.cxs[0].cxtis[0].cxt)
      }
      parsedData.push({
        id,
        type: res.fl,
        shortDef: res.shortdef,
        synonyms: res.meta.syns?.[0],
        pron,
        sound: this.generateSoundSrc(res),
        examples: this.getExamples(res),
      })
    }

    return parsedData
  }

  generateSoundSrc(res) {
    // if audio begins with "bix", the subdirectory should be "bix",
    // if audio begins with "gg", the subdirectory should be "gg",
    // if audio begins with a number or punctuation (eg, "_"), the subdirectory should be "number",
    // otherwise, the subdirectory is equal to the first letter of audio.
    const pron = res.hwi.prs?.[0]
    const audio = pron?.sound?.audio
    let audioSubDir = ""
    let subDirRegEx = /^(bix|gg|[a-zA-Z]|\d+)(.*)$/g
    if (audio && audio.matchAll(subDirRegEx)) {
      const matchRes = audio.matchAll(subDirRegEx)
      audioSubDir = [...matchRes][0]?.[1]
      if (!isNaN(audioSubDir)) {
        audioSubDir = "number"
      }
    }
    return pron?.sound ? `https://media.merriam-webster.com/audio/prons/en/us/mp3/${audioSubDir}/${audio}.mp3` : null
  }

  getExamples(res) {
    const expRegex = /"t":"([^"]*)"/gm
    const matches = JSON.stringify(res).matchAll(expRegex)
    let examples = []
    if (matches) {
      for (let [, t] of matches) {
        examples.push(t)
      }
    }
    return examples
  }
}

function ServicesFactory() {

  let instance = null

  const getInstance = () => {
    if (!instance) {
      instance = new Services()
    }

    return instance
  }

  return {
    getInstance
  }
}

export const services = ServicesFactory().getInstance()
