/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { CONFIG, Config } from '../providers'

// required for DI in Auth decorator
@Global()
@Module({})
export class CoreModule {
  static forRoot(config: Config): DynamicModule {
    const configProvider: Provider = {
      provide: CONFIG,
      useValue: config,
    }

    return {
      module: CoreModule,
      providers: [configProvider],
      exports: [configProvider],
    }
  }

  static forRootAsync(options: {
    imports?: any[]
    inject?: any[]
    useFactory: (...args: any[]) => Promise<Config> | Config
  }): DynamicModule {
    const configProvider: Provider = {
      provide: CONFIG,
      inject: options?.inject || [],
      useFactory: options?.useFactory,
    }

    return {
      module: CoreModule,
      imports: options?.imports || [],
      providers: [configProvider],
      exports: [configProvider],
    }
  }
}
