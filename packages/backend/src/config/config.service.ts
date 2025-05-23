import { Provider, Injectable, Logger } from "@nestjs/common";
import {
  ConfigService as NestConfigService,
  NoInferType,
} from "@nestjs/config";

export type ConfigServiceType = {
  get<T>(propertyPath: string, defaultValue?: NoInferType<T>): T;
};

@Injectable()
class DefaultConfigService implements ConfigServiceType {
  private readonly logger = new Logger(DefaultConfigService.name);

  constructor(private defaultConfigService: NestConfigService) {
    this.logger.debug(`Init DefaultConfigService`);
  }

  get<T>(propertyPath: string, defaultValue?: NoInferType<T>): T | undefined {
    return this.defaultConfigService.get(propertyPath, defaultValue);
  }
}

export const ConfigService: Provider = {
  provide: "CONFIG",
  useClass: DefaultConfigService,
};
