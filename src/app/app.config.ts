import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/**
 * Global application settings.
 * Use this object to define constants like timeouts, delays, or other shared values.
 */
export const AppSettings = {
  /** Delay in milliseconds before the preloader completes (used in AppComponent). */
  loaderDelayMs: 1000,
};

/**
 * Factory function to create a custom translation loader.
 * Loads translation files from the assets/i18n/ folder using HTTP.
 *
 * @param http - Angular's HttpClient used to fetch the translation files
 * @returns A TranslateHttpLoader configured for i18n file paths
 */
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

/**
 * Angular application configuration for standalone mode.
 * Registers routing, HTTP, and i18n providers using importProvidersFrom.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * Registers Angular routes using the provided route configuration.
     */
    provideRouter(routes),

    /**
     * Imports and configures HttpClient and ngx-translate with a custom translation loader.
     * Translation files are expected under /assets/i18n/*.json.
     */
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        defaultLanguage: 'de',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        }
      })
    )
  ]
};
