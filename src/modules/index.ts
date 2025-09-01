/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicModule, Module, Provider } from '@nestjs/common'
import { CONFIG, Config } from '../providers'
import { APP_GUARD } from '@nestjs/core'
import { JwtGuard, PoliciesGuard, RolesGuard } from '../guards'

@Module({})
export class CoreModule {
  static forRoot(config: Config): DynamicModule {
    const configProvider: Provider = {
      provide: CONFIG,
      useValue: config,
    }

    return {
      module: CoreModule,
      providers: [
        configProvider,
        {
          provide: APP_GUARD,
          useClass: JwtGuard,
        },
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
        },
        {
          provide: APP_GUARD,
          useClass: PoliciesGuard,
        },
      ],
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
      providers: [
        configProvider,
        {
          provide: APP_GUARD,
          useClass: JwtGuard,
        },
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
        },
        {
          provide: APP_GUARD,
          useClass: PoliciesGuard,
        },
      ],
    }
  }
}
