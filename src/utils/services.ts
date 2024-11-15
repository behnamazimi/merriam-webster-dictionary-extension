import { ERRORS, publicApiDetails } from "../constants/constants";
import { sendGlobalMessage } from "./messaging";
import { GlobalActionTypes, LookupResultType, OptionsType } from "../types";

class Services {
  private static instance: Services;
  API_KEY = "";
  API_TYPE = "";

  setAuth(key: string, type: OptionsType["apiType"]) {
    this.API_KEY = key;
    this.API_TYPE = type;
  }

  getApiEndpoint(search: string, category: string, apiKey: string) {
    const url = new URL(`https://www.dictionaryapi.com/api/v3/references/${category}/json/${search}`);
    url.searchParams.append("key", apiKey);
    return url.href;
  }

  isUsingPublicKey() {
    return this.API_KEY === publicApiDetails.key;
  }

  async canUsePublicApiDetails() {
    const usageCount = await sendGlobalMessage({ action: GlobalActionTypes.GET_PUBLIC_API_USAGE });
    return +usageCount < publicApiDetails.usageLimitPerInstall;
  }

  async fetchData(search: string): Promise<LookupResultType | string[]> {
    if (!search) {
      return Promise.reject(new Error(ERRORS.EMPTY_SEARCH));
    }

    const endpoint = this.getApiEndpoint(search, this.API_TYPE, this.API_KEY);

    try {
      if (this.isUsingPublicKey() && !(await this.canUsePublicApiDetails())) {
        throw new Error(ERRORS.PERSONAL_KEY_NEEDED);
      }

      // Increment API usage if public key is being used
      if (this.isUsingPublicKey()) {
        await sendGlobalMessage({ action: GlobalActionTypes.COUNT_UP_PUBLIC_API_USAGE });
      }

      const response = await fetch(endpoint);
      const textResponse = await response.text();

      // Check for common API error responses in the text
      if (textResponse.includes("Invalid API key")) {
        throw new Error(ERRORS.INVALID_API_KEY);
      }
      else if (textResponse.includes("Failed to fetch")) {
        throw new Error(ERRORS.FAILED_TO_FETCH);
      }
      else if (textResponse.includes("[]")) {
        throw new Error(ERRORS.NO_RESULT);
      }

      return this.parseResultData(JSON.parse(textResponse));
    }
    catch (error) {
      // Error is thrown directly so no need to resolve or reject explicitly
      return Promise.reject(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseResultData(rawData: any): LookupResultType {
    const parsedData: LookupResultType = [];

    if (typeof rawData[0] === "string") {
      return rawData;
    }

    for (const res of rawData) {
      const id = res.meta.id;
      const pron = res.hwi.prs?.[0].mw;

      // add other type of definition to shortdef
      // (like being past or being past particular)
      if (res.cxs) {
        res.shortdef.unshift(res.cxs[0].cxl + " " + res.cxs[0].cxtis[0].cxt);
      }
      parsedData.push({
        id,
        type: res.fl,
        shortDef: res.shortdef,
        synonyms: res.meta.syns?.[0],
        pron,
        sound: this.generateSoundSrc(res),
        examples: this.getExamples(res)
      });
    }

    return parsedData;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateSoundSrc(res: any) {
    // if audio begins with "bix", the subdirectory should be "bix",
    // if audio begins with "gg", the subdirectory should be "gg",
    // if audio begins with a number or punctuation (eg, "_"), the subdirectory should be "number",
    // otherwise, the subdirectory is equal to the first letter of audio.
    const pron = res.hwi.prs?.[0];
    const audio = pron?.sound?.audio;
    let audioSubDir = "";
    const subDirRegEx = /^(bix|gg|[a-zA-Z]|\d+)(.*)$/g;
    if (audio && audio.matchAll(subDirRegEx)) {
      const matchRes = audio.matchAll(subDirRegEx);
      audioSubDir = [...matchRes][0]?.[1];
      if (!isNaN(audioSubDir as unknown as number)) {
        audioSubDir = "number";
      }
    }
    return pron?.sound ? `https://media.merriam-webster.com/audio/prons/en/us/mp3/${audioSubDir}/${audio}.mp3` : null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getExamples(res: any) {
    const expRegex = /"t":"([^"]*)"/gm;
    const matches = JSON.stringify(res).matchAll(expRegex);
    const examples = [];
    if (matches) {
      for (const [, t] of matches) {
        examples.push(t);
      }
    }
    return examples;
  }

  static getInstance() {
    if (!Services.instance) {
      Services.instance = new Services();
      return Services.instance;
    }
    return Services.instance;
  }
}

export const services = Services.getInstance();
