import {
  Configuration,
  DefaultConfig,
  ConfigurationParameters,
} from "@minemarket/cdk-ts-fetch";

const basePath = "api.minemarket.xyz";

export function setAuthAccessToken(accessToken: string) {
  const params: ConfigurationParameters = {
    apiKey: undefined,
    username: undefined,
    password: undefined,
    accessToken: accessToken,
    basePath: basePath, // This is used to know what domain to query to
  };

  const config = new Configuration(params);

  // Assign auth configuration to the api (feeds the info to later requests)
  DefaultConfig.config = config;
}

export function setAuthApiKey(apiKey: string) {
  const params: ConfigurationParameters = {
    apiKey: apiKey,
    username: undefined,
    password: undefined,
    accessToken: undefined,
    basePath: basePath, // This is used to know what domain to query to
  };

  const config = new Configuration(params);

  // Assign auth configuration to the api
  DefaultConfig.config = config;
}
