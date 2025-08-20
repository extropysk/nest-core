/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { JwtGuard, RolesGuard } from '../guards'
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
      providers: [configProvider, JwtGuard, RolesGuard],
      exports: [configProvider, JwtGuard, RolesGuard],
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
      providers: [configProvider, JwtGuard, RolesGuard],
      exports: [configProvider, JwtGuard, RolesGuard],
    }
  }
}
