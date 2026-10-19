import { Module } from '@nestjs/common';
export declare const ObserveModule: {
    new (httpAdapterHost: Module, asyncLocalStorage: import("async_hooks").AsyncLocalStorage<Map<string, any>>, options: import("@nestjs/observe/dist/index.js", { with: { "resolution-mode": "import" } }).ObserveModuleOptionsWithDefaults): {
        readonly logger: Module;
        readonly httpAdapterHost: Module;
        readonly asyncLocalStorage: import("async_hooks").AsyncLocalStorage<Map<string, any>>;
        readonly options: import("@nestjs/observe/dist/index.js", { with: { "resolution-mode": "import" } }).ObserveModuleOptionsWithDefaults;
    };
    forRoot(observeOpts: import("@nestjs/observe/dist/index.js", { with: { "resolution-mode": "import" } }).ObserveOptions): Module;
    forRootAsync(options: import("@nestjs/observe/dist/index.js", { with: { "resolution-mode": "import" } }).ObserveModuleAsyncOptions): Module;
    createAsyncProviders(asyncOptions: import("@nestjs/observe/dist/index.js", { with: { "resolution-mode": "import" } }).ObserveModuleAsyncOptions): Module[];
    createAsyncOptionsProvider(asyncOptions: import("@nestjs/observe/dist/index.js", { with: { "resolution-mode": "import" } }).ObserveModuleAsyncOptions): Module;
}, ObserveInstrument: NestApplicationOptions;
export declare class AppModule {
}
